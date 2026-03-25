"use client";

import { useCallback, useRef, useState } from "react";
import type { TranscriptStatus } from "@/types";

interface UseAudioRecorderOptions {
  language?: string;
  onPartialTranscript?: (text: string) => void;
  onFinalTranscript?: (text: string) => void;
  onError?: (message: string) => void;
}

export function useAudioRecorder({
  language = "en",
  onPartialTranscript,
  onFinalTranscript,
  onError,
}: UseAudioRecorderOptions = {}) {
  const [status, setStatus] = useState<TranscriptStatus>("idle");
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isRecordingRef = useRef(false);

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

  const cleanup = useCallback(() => {
    mediaRecorderRef.current?.stop();
    wsRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    stopAnalyser();
    isRecordingRef.current = false;
    mediaRecorderRef.current = null;
    wsRef.current = null;
    streamRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setStatus("requesting");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      startAnalyser(stream);

      // Fetch short-lived token from our server
      const res = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 401) {
          throw new Error("Please sign in to use voice recording.");
        }
        throw new Error(body.error ?? "Failed to get transcription token");
      }
      const { token } = await res.json();

      setStatus("recording");
      isRecordingRef.current = true;

      // Open AssemblyAI realtime WebSocket using the token
      const ws = new WebSocket(
        `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${encodeURIComponent(token)}`
      );
      wsRef.current = ws;

      ws.onopen = () => {
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";

        const mr = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = mr;

        mr.ondataavailable = (e) => {
          if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = (reader.result as string).split(",")[1];
              ws.send(JSON.stringify({ audio_data: base64 }));
            };
            reader.readAsDataURL(e.data);
          }
        };

        mr.start(250);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.message_type === "PartialTranscript" && msg.text) {
            onPartialTranscript?.(msg.text);
          } else if (msg.message_type === "FinalTranscript" && msg.text) {
            onFinalTranscript?.(msg.text);
          }
        } catch {
          // ignore parse errors
        }
      };

      ws.onerror = () => {
        onError?.("Transcription connection error. Please try again.");
        cleanup();
        setStatus("error");
      };

      ws.onclose = () => {
        if (isRecordingRef.current) {
          setStatus("idle");
          isRecordingRef.current = false;
        }
      };
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.name === "NotAllowedError"
            ? "Microphone permission denied. Please allow microphone access in your browser settings."
            : err.message
          : "Failed to start recording";
      onError?.(msg);
      cleanup();
      setStatus("error");
    }
  }, [language, onPartialTranscript, onFinalTranscript, onError, cleanup]);

  const stopRecording = useCallback(() => {
    cleanup();
    setStatus("idle");
  }, [cleanup]);

  return { status, audioLevel, startRecording, stopRecording };
}
