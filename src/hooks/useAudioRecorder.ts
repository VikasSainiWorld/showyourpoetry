"use client";

import { useCallback, useRef, useState } from "react";
import type { TranscriptStatus } from "@/types";

interface UseAudioRecorderOptions {
  language?: string;
  onFinalTranscript?: (text: string) => void;
  onError?: (message: string) => void;
}

export function useAudioRecorder({
  language = "en",
  onFinalTranscript,
  onError,
}: UseAudioRecorderOptions = {}) {
  const [status, setStatus] = useState<TranscriptStatus>("idle");
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const stopAnalyser = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setAudioLevel(0);
  };

  const startAnalyser = (stream: MediaStream) => {
    try {
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const tick = () => {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setAudioLevel(avg / 128);
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // AudioContext not available — skip visualisation
    }
  };

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    stopAnalyser();
    streamRef.current = null;
    mediaRecorderRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setStatus("requesting");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      startAnalyser(stream);

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const mr = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        releaseStream();
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];

        if (blob.size === 0) {
          onError?.("No audio recorded. Please try again.");
          setStatus("idle");
          return;
        }

        setStatus("processing");

        try {
          const fd = new FormData();
          fd.append("audio", blob, "recording.webm");
          fd.append("language", language);

          const res = await fetch("/api/transcribe", { method: "POST", body: fd });
          const data = await res.json();

          if (!res.ok) {
            if (res.status === 401) throw new Error("Please sign in to use voice recording.");
            throw new Error(data.error ?? "Transcription failed");
          }

          const formatted = (data.text ?? "")
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
            .join("\n");
          onFinalTranscript?.(formatted);
        } catch (err: unknown) {
          onError?.(err instanceof Error ? err.message : "Transcription failed");
        } finally {
          setStatus("idle");
        }
      };

      mr.start(100);
      setStatus("recording");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.name === "NotAllowedError"
            ? "Microphone permission denied. Please allow microphone access in your browser settings."
            : err.message
          : "Failed to start recording";
      onError?.(msg);
      releaseStream();
      setStatus("error");
    }
  }, [language, onFinalTranscript, onError, releaseStream]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
  }, []);

  return { status, audioLevel, startRecording, stopRecording };
}
