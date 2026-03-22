"use client";

import { useState } from "react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { cn } from "@/lib/utils";

interface AudioRecorderProps {
  language?: string;
  onTranscriptFinal: (text: string) => void;
}

export default function AudioRecorder({ language, onTranscriptFinal }: AudioRecorderProps) {
  const [partialText, setPartialText] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { status, audioLevel, startRecording, stopRecording } = useAudioRecorder({
    language,
    onPartialTranscript: setPartialText,
    onFinalTranscript: (text) => {
      setPartialText("");
      onTranscriptFinal(text);
    },
    onError: (msg) => setErrorMsg(msg),
  });

  const isRecording = status === "recording";
  const isRequesting = status === "requesting";

  return (
    <div className="glass rounded-2xl p-6 border border-royal-purple/20">
      <div className="flex flex-col items-center gap-5">
        {/* Status label */}
        <p className="text-xs text-muted uppercase tracking-widest">
          {status === "idle" && "Ready to record"}
          {status === "requesting" && "Requesting microphone…"}
          {status === "recording" && "Listening…"}
          {status === "error" && "Error"}
        </p>

        {/* Mic button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isRequesting}
          className={cn(
            "relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-gold/50",
            isRecording
              ? "bg-red-800/80 border-2 border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.4)]"
              : "bg-violet/20 hover:bg-violet/30 border-2 border-violet/50 hover:border-violet shadow-glow-violet",
            isRequesting && "opacity-50 cursor-not-allowed"
          )}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {/* Pulse ring when recording */}
          {isRecording && (
            <>
              <span className="absolute inset-0 rounded-full animate-ping bg-red-500/20" />
              <span className="absolute inset-[-8px] rounded-full border border-red-500/30 animate-pulse" />
            </>
          )}

          {/* Icon */}
          {isRecording ? (
            <svg className="w-7 h-7 text-red-300" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-violet-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>

        {/* Waveform */}
        {isRecording && (
          <div className="flex items-end justify-center gap-1 h-8">
            {Array.from({ length: 12 }).map((_, i) => {
              const height = Math.max(
                4,
                Math.round(
                  audioLevel * 32 * (0.4 + 0.6 * Math.sin((i / 12) * Math.PI + Date.now() / 300))
                )
              );
              return (
                <div
                  key={i}
                  className="wave-bar w-1.5 rounded-full bg-gold"
                  style={{
                    height: `${height}px`,
                    animationDelay: `${i * 0.06}s`,
                    opacity: 0.6 + audioLevel * 0.4,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Live partial transcript */}
        {isRecording && partialText && (
          <p className="text-sm text-muted italic text-center max-w-sm animate-pulse-glow">
            &ldquo;{partialText}&rdquo;
          </p>
        )}

        {/* Helper text */}
        <p className="text-xs text-muted/60 text-center max-w-xs">
          {isRecording
            ? "Speak clearly · Click stop when done"
            : "Click the microphone to start speaking your poem"}
        </p>

        {/* Error */}
        {errorMsg && (
          <div className="w-full text-center text-xs text-red-400 bg-red-900/20 border border-red-800/30 rounded-lg px-4 py-2">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
