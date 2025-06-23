"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  /** Callback được gọi khi đã thổi tắt nến */
  onExtinguish: () => void;
}

export default function MicBlowCandle({ onExtinguish }: Props) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanup = () => {
    processorRef.current?.disconnect();
    analyserRef.current?.disconnect();
    audioCtxRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setActive(false);
  };

  useEffect(() => {
    if (progress >= 100) {
      cleanup();
      onExtinguish();
    }
  }, [progress]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyserRef.current = analyser;

      const micSource = ctx.createMediaStreamSource(stream);
      micSource.connect(analyser);

      const processor = ctx.createScriptProcessor(2048, 1, 1);
      processorRef.current = processor;
      analyser.connect(processor);
      processor.connect(ctx.destination);

      processor.onaudioprocess = () => {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        let avg = 0;
        for (let i = 0; i < data.length; i++) {
          avg += data[i];
        }
        avg = avg / data.length;

        setProgress((prev) => {
          if (avg > 15) {
            return Math.min(100, prev + avg / 100);
          }
          return Math.max(0, prev - 0.5);
        });
      };

      setActive(true);
    } catch (e) {
      alert("Không thể truy cập microphone. Vui lòng kiểm tra quyền và thử lại.");
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-4 flex flex-col items-center">
      {!active && (
        <button
          onClick={start}
          className="px-4 py-2 bg-pink-500 text-white rounded shadow hover:bg-pink-600"
        >
          Cho phép microphone
        </button>
      )}
      {active && (
        <div className="w-full bg-gray-200 h-4 rounded overflow-hidden mt-3">
          <div
            className="h-full bg-pink-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
