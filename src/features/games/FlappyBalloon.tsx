"use client";
import { useRef, useEffect, useState, useCallback } from "react";

// Kích thước canvas và hằng số vật lý
const WIDTH = 320;
const HEIGHT = 480;
const GRAVITY = 0.5;
const JUMP = -8;
const OBSTACLE_GAP = 120;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_SPEED = 2;

interface Obstacle {
  x: number;
  top: number; // chiều cao phần ống trên (tính từ 0)
}

export default function FlappyBalloon() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>();
  const velocityRef = useRef<number>(0);
  const birdYRef = useRef<number>(HEIGHT / 2);
  const obstaclesRef = useRef<Obstacle[]>([]);

  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return Number(localStorage.getItem("bestScore") || 0);
  });

  const jump = useCallback(() => {
    if (!running) return;
    velocityRef.current = JUMP;
  }, [running]);

  // Khởi tạo hoặc reset trò chơi
  const startGame = useCallback(() => {
    setScore(0);
    obstaclesRef.current = [
      {
        x: WIDTH + 100,
        top: Math.random() * (HEIGHT - OBSTACLE_GAP - 40) + 20,
      },
    ];
    velocityRef.current = 0;
    birdYRef.current = HEIGHT / 2;
    setRunning(true);
  }, []);

  // Vòng lặp game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function addObstacle() {
      const topHeight = Math.random() * (HEIGHT - OBSTACLE_GAP - 40) + 20;
      obstaclesRef.current.push({ x: WIDTH, top: topHeight });
    }

    function gameLoop() {
      // Cập nhật
      velocityRef.current += GRAVITY;
      birdYRef.current += velocityRef.current;

      obstaclesRef.current.forEach((obs) => {
        obs.x -= OBSTACLE_SPEED;
      });

      // Thêm obstacle mới khi obstacle cuối cùng cách canvas một đoạn
      if (
        obstaclesRef.current.length === 0 ||
        obstaclesRef.current[obstaclesRef.current.length - 1].x < WIDTH - 160
      ) {
        addObstacle();
      }

      // Loại bỏ obstacle đã ra khỏi màn
      obstaclesRef.current = obstaclesRef.current.filter((obs) => obs.x + OBSTACLE_WIDTH > 0);

      // Va chạm & tính điểm
      obstaclesRef.current.forEach((obs) => {
        // Tính điểm khi balloon đi qua giữa ống
        if (Math.round(obs.x + OBSTACLE_WIDTH) === 60) {
          setScore((prev) => prev + 1);
        }

        // Kiểm tra va chạm
        if (
          60 + 12 > obs.x &&
          60 - 12 < obs.x + OBSTACLE_WIDTH &&
          (birdYRef.current - 12 < obs.top || birdYRef.current + 12 > obs.top + OBSTACLE_GAP)
        ) {
          setRunning(false);
        }
      });

      // Va chạm đất / trần
      if (birdYRef.current > HEIGHT - 12 || birdYRef.current < 12) {
        setRunning(false);
      }

      // Render
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      // Nền trời
      ctx.fillStyle = "#bae6fd";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Balloon
      ctx.fillStyle = "#f87171";
      ctx.beginPath();
      ctx.arc(60, birdYRef.current, 12, 0, Math.PI * 2);
      ctx.fill();

      // Obstacles
      ctx.fillStyle = "#4ade80";
      obstaclesRef.current.forEach((obs) => {
        ctx.fillRect(obs.x, 0, OBSTACLE_WIDTH, obs.top);
        ctx.fillRect(
          obs.x,
          obs.top + OBSTACLE_GAP,
          OBSTACLE_WIDTH,
          HEIGHT - obs.top - OBSTACLE_GAP
        );
      });

      // Score
      ctx.fillStyle = "#1e3a8a";
      ctx.font = "24px sans-serif";
      ctx.fillText(`${score}`, WIDTH / 2 - 10, 40);

      if (running) {
        frameRef.current = requestAnimationFrame(gameLoop);
      } else {
        // Game over
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "#fff";
        ctx.font = "20px sans-serif";
        ctx.fillText("Game Over", WIDTH / 2 - 60, HEIGHT / 2 - 20);
        ctx.fillText(`Điểm: ${score}`, WIDTH / 2 - 40, HEIGHT / 2 + 10);
        ctx.fillText("Nhấp để chơi lại", WIDTH / 2 - 80, HEIGHT / 2 + 40);

        // Cập nhật best
        setBest((prev) => {
          const newBest = Math.max(prev, score);
          localStorage.setItem("bestScore", newBest.toString());
          return newBest;
        });
      }
    }

    if (running) {
      frameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [running, score]);

  // Sự kiện click / space để nhảy hoặc bắt đầu lại
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (!running) {
          startGame();
        } else {
          jump();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [running, startGame, jump]);

  const handleCanvasClick = () => {
    if (!running) {
      startGame();
    } else {
      jump();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        onClick={handleCanvasClick}
        className="border-2 border-sky-400 bg-sky-200 rounded"
      />
      <p className="text-center text-sm text-gray-600">
        Điểm cao nhất: <span className="font-bold">{best}</span>
      </p>
      <p className="text-center text-xs text-gray-400">Nhấp chuột hoặc phím Space để bay lên</p>
    </div>
  );
}
