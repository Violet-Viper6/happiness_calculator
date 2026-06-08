"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ShareContent() {
  const params = useSearchParams();
  const score = params.get("score") || "??";
  const level = params.get("level") || "未知";
  const emoji = params.get("emoji") || "🌅";

  const dims = [
    { icon: "💚", name: "身心健康", score: params.get("health") || "?" },
    { icon: "💰", name: "财务状况", score: params.get("finance") || "?" },
    { icon: "❤️", name: "人际关系", score: params.get("relationship") || "?" },
    { icon: "💼", name: "工作状态", score: params.get("work") || "?" },
    { icon: "🦋", name: "生活自由", score: params.get("freedom") || "?" },
    { icon: "✨", name: "自我实现", score: params.get("growth") || "?" },
  ];

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-md mx-auto glass-card rounded-3xl p-8 text-center">
        <div className="text-5xl mb-4">{emoji}</div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
          我的幸福指数
        </h1>
        <div className="text-6xl font-black bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-1">
          {score}
        </div>
        <div className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-6">{level}</div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          {dims.map((d) => (
            <div key={d.name} className="bg-white/50 dark:bg-white/5 rounded-xl p-2">
              {d.icon} {d.name}: <strong>{d.score}</strong>
            </div>
          ))}
        </div>

        <p className="text-gray-400 text-xs">
          来测测你的幸福指数 →
        </p>
      </div>
    </main>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">加载中...</div>}>
      <ShareContent />
    </Suspense>
  );
}
