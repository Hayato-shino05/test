"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Cylinder, Cone } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import confetti from "canvas-confetti";

function Flame() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const scale = 1 + Math.sin(t * 12) * 0.1;
    ref.current.scale.set(scale, scale, scale);
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1 + Math.sin(t * 20) * 0.3;
  });
  return (
    <Cone
      ref={ref}
      args={[0.25, 0.4, 8]}
      position={[0, 0.45, 0]}
      rotation={[Math.PI, 0, 0]}
    >
      <meshStandardMaterial color="#ffae42" emissive="#ff8c00" emissiveIntensity={1} />
    </Cone>
  );
}

interface Cake3DProps {
  /** Khi true, ngọn lửa sẽ tự tắt (dùng cho mic-blow) */
  extinguish?: boolean;
}

export default function Cake3D({ extinguish }: Cake3DProps) {
  const [flameOn, setFlameOn] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Trigger confetti + sound when flame is blown out
  // Tắt lửa khi prop extinguish thay đổi
  useEffect(() => {
    if (extinguish) setFlameOn(false);
  }, [extinguish]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (flameOn) return;
    // play sound
    if (!audioRef.current) {
      audioRef.current = new Audio("/audio/blow.mp3");
    }
    audioRef.current?.play().catch(() => {});
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
  }, [flameOn]);

  return (

    <div className="w-full h-[300px] sm:h-[400px]">
      <Canvas camera={{ position: [0, 3, 10], fov: 55 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 2]} />
        {/* Cake tiers */}
        <Cylinder args={[5, 5, 2, 32]} position={[0, 1, 0]}>
          <meshStandardMaterial color="#f9e4b7" />
        </Cylinder>
        <Cylinder args={[3.5, 3.5, 2, 32]} position={[0, 3.2, 0]}>
          <meshStandardMaterial color="#f9e4b7" />
        </Cylinder>
        <Cylinder args={[2, 2, 2, 32]} position={[0, 5.4, 0]}>
          <meshStandardMaterial color="#f9e4b7" />
        </Cylinder>
        {/* Candle */}
        <group
          position={[0, 6.5, 0]}
          onClick={() => setFlameOn((f) => !f)}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          <Cylinder args={[0.1, 0.1, 1.5, 16]} position={[0, 0.75, 0]}>
            <meshStandardMaterial color="#ffffff" />
          </Cylinder>
          {flameOn && <Flame />}
        </group>
        <OrbitControls enablePan={false} enableZoom={false} makeDefault />
      </Canvas>
    </div>
  );
}
