"use client";
import { JSX, useEffect, useState, useRef } from "react";
import { CardContent } from "@/components/ui/card";
import confetti from "canvas-confetti";

export default function AbstractPoopPage() {
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [publicFile, setPublicFile] = useState<File | null>(null);
  const [proofResult, setProofResult] = useState<
    "pending" | "success" | "fail" | null
  >(null);
  const [times, setTimes] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [proofSuccessMessage, setProofSuccessMessage] = useState("");
  const [proofErrorMessage, setProofErrorMessage] = useState("");

  const colors = ["#FFFFFF", "#b8860b", "#FFFFFF", "#ff9900", "#FFFFFF"];
  const [poops, setPoops] = useState<
    {
      emoji: string | JSX.Element;
      left: number;
      top: number;
      delay: number;
      opacity: number;
      rotate: number;
    }[]
  >([]);

  useEffect(() => {
    const arr = [...Array(32)].map(() => {
      const isPoop = Math.random() < 0.85;
      return {
        emoji: isPoop ? <img src="/shit.png" width={200} alt="poop" /> : "🚽",
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 10,
        opacity: 0.25 + Math.random() * 0.5,
        rotate: Math.random() * 360,
      };
    });
    setPoops(arr);
  }, []);

  const handleSubmit = async () => {
    if (!proofFile || !publicFile) return;

    setProofResult("pending");

    try {
      const formData = new FormData();
      formData.append("proof", proofFile);
      formData.append("public", publicFile);

      const res = await fetch("http://?/verify", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.verified === true) {
        setProofResult("success");
        setProofSuccessMessage(data.actual);
        requestAnimationFrame(() => {
          const duration = 1500;
          const end = Date.now() + duration;
          const frame = () => {
            confetti({
              particleCount: 2,
              angle: 40,
              spread: 65,
              origin: { x: 0 },
              colors: colors,
              disableForReducedMotion: true,
            });
            confetti({
              particleCount: 2,
              angle: 140,
              spread: 65,
              origin: { x: 1 },
              colors: colors,
              disableForReducedMotion: true,
            });
            if (Date.now() < end) requestAnimationFrame(frame);
          };
          frame();
        });
      }
      if (data.verified === false) {
        setProofResult("fail");
        setProofErrorMessage(data.error);
        setTimes((prev) => {
          const newTimes = prev + 1;
          if (newTimes > 3) {
            dialogRef.current?.showModal();
          }
          return newTimes;
        });
      }
    } catch (e) {
      console.error(e);
      setProofResult("fail");
      setTimes((prev) => {
        const newTimes = prev + 1;
        if (newTimes > 3) {
          dialogRef.current?.showModal();
        }
        return newTimes;
      });
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        {poops.map((poop, i) => (
          <span
            key={i}
            className="absolute text-7xl animate-poop"
            style={{
              left: `${poop.left}%`,
              top: `${poop.top}%`,
              animationDelay: `${poop.delay}s`,
              opacity: poop.opacity,
              filter: "blur(1.5px)",
              rotate: `${poop.rotate}deg`,
            }}
          >
            <span role="img" aria-label="poop-or-toilet">
              {poop.emoji}
            </span>
          </span>
        ))}
      </div>
      <div
        className="w-full max-w-lg relative z-10 backdrop-blur-2xl font-[xiangsu] nes-container shadow-2xl"
        style={{
          backgroundImage: "url(/shit.png)",
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backgroundBlendMode: "overlay",
        }}
      >
        <CardContent className="p-8 space-y-6 flex flex-col items-center">
          <h2 className="text-4xl font-extrabold text-yellow-900 text-center border-b-4 w-full pb-3">
            找❓小游戏
          </h2>
          <div className="flex flex-col items-center justify-center w-full mt-4">
            <div className="relative w-96 space-y-10">
              <div className="mb-4">
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setProofFile(f);
                  }}
                  className="hidden "
                  id="proof-upload"
                />
                <label
                  htmlFor="proof-upload"
                  className="nes-btn is-primary w-full cursor-pointer flex items-center justify-center text-center px-4 py-2"
                >
                  {proofFile?.name || "选择 proof.json 文件"}
                </label>
              </div>
              <div className="mb-4">
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setPublicFile(f);
                }}
                className="hidden"
                id="public-upload"
              />
              <label
                htmlFor="public-upload"
                className="nes-btn is-primary w-full cursor-pointer flex items-center justify-center text-center px-4 py-2"
              >
                {publicFile?.name || "选择 public.json 文件"}
              </label>
              </div>
              <button
                className="nes-btn is-warning w-full"
                onClick={handleSubmit}
                disabled={!proofFile || !publicFile}
              >
                提交
              </button>
            </div>
          </div>
          <div className="w-full text-center text-3xl min-h-[2em] nes-container ">
            {proofResult === "pending" && (
              <p className="text-yellow-600">正在校验哟...</p>
            )}
            {proofResult === "success" && (
              <div className="text-lg">
                <p className="text-green-700 text-4xl">你答对了哟!!!<br/>{proofSuccessMessage}</p>
                <button
                  onClick={() =>
                    window.open("https://platform.cyclens.tech/", "_blank")
                  }
                  type="button"
                  className="w-full nes-btn is-warning"
                >
                  点我到平台提交答案哟
                </button>
              </div>
            )}
            {proofResult === "fail" && (
              <p className="text-red-700">答案不对哟&gt;-&lt;<br/>{proofErrorMessage}</p>
            )}
            {proofResult === null && <p>好无聊哟</p>}
          </div>
        </CardContent>
      </div>

      <dialog
        className="nes-dialog font-[xiangsu] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-0"
        id="dialog-default"
        ref={dialogRef}
      >
        <form method="dialog" className="flex flex-col items-center">
          <p className="title text-center text-3xl text-yellow-900">提示</p>
          <p className="text-center text-2xl">
            ‌‌‌‌‍‍‌﻿只有聪明的人才能看到这里的信息‌‌‌‌‍‬‬‌‌‌‌‌‍‬‌‍‌‌‌‌‍‬﻿‬‌‌‌‌‍‬‍﻿‌‌‌‌‍﻿‌‬‌‌‌‌‍‬‬‍‌‌‌‌‌‬﻿‍‌‌‌‌‍‌﻿‌‌‌‌‌‍‬‌‍‌‌‌‌‌‬‌‌‌‌‌‌‍‌‌﻿‌‌‌‌‍‬﻿﻿‌‌‌‌‍‬‌﻿‌‌‌‌‍‬‬﻿‌‌‌‌‍﻿‍‌‌‌‌‌‍‬‌‍‌‌‌‌‍‬‬‍‌‌‌‌‍‬﻿‌
            <img src="/screwdriver.png" width={200} />
          </p>
          <button className="nes-btn is-error w-full">关闭</button>
        </form>
      </dialog>

      <style jsx global>{`
        @keyframes poop-float {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
          }
          100% {
            transform: translateY(-200vh) scale(1.2) rotate(360deg);
          }
        }
        .animate-poop {
          animation: poop-float linear infinite 18s;
        }
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(-2deg) scale(1.01);
          }
          50% {
            transform: rotate(2deg) scale(1.03);
          }
        }
        .animate-wiggle {
          animation: wiggle 2.5s infinite;
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-8px);
          }
          40%,
          80% {
            transform: translateX(8px);
          }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .shadow-poop {
          box-shadow: 0 0 16px 4px #b8860b, 0 0 32px 8px #f5e042;
        }
      `}</style>
    </div>
  );
}
