"use client";

import { useState, useMemo } from "react";

// ============ 维度定义 ============
const DIMENSIONS = [
  {
    id: "health",
    name: "身心健康",
    icon: "💚",
    color: "#22c55e",
    description: "你的身体和心理状态",
    questions: [
      { id: "sleep", label: "睡眠质量", hint: "最近一个月睡得好吗？", low: "严重失眠", high: "一觉到天亮" },
      { id: "exercise", label: "运动频率", hint: "每周有多少运动？", low: "基本不动", high: "规律运动" },
      { id: "mood", label: "情绪状态", hint: "最近的心情如何？", low: "持续低落", high: "阳光灿烂" },
    ],
  },
  {
    id: "finance",
    name: "财务状况",
    icon: "💰",
    color: "#eab308",
    description: "你的经济安全感与消费自由",
    questions: [
      { id: "income", label: "收入满意度", hint: "收入能覆盖生活需要吗？", low: "入不敷出", high: "绰绰有余" },
      { id: "savings", label: "储蓄安全感", hint: "遇到意外有底气吗？", low: "毫无存款", high: "底气十足" },
      { id: "spending", label: "消费自由度", hint: "想买的东西敢买吗？", low: "啥都不敢买", high: "想买就买" },
    ],
  },
  {
    id: "relationship",
    name: "人际关系",
    icon: "❤️",
    color: "#ef4444",
    description: "你的亲密关系和社交圈",
    questions: [
      { id: "intimate", label: "亲密关系", hint: "伴侣/家人关系如何？", low: "孤身一人", high: "被爱包围" },
      { id: "social", label: "社交活跃度", hint: "朋友间的互动频率", low: "几乎不社交", high: "朋友遍天下" },
      { id: "belonging", label: "归属感", hint: "你觉得自己属于某个群体吗？", low: "格格不入", high: "如鱼得水" },
    ],
  },
  {
    id: "work",
    name: "工作状态",
    icon: "💼",
    color: "#3b82f6",
    description: "工作满意度与成就感",
    questions: [
      { id: "satisfaction", label: "工作满意度", hint: "对现在的工作满意吗？", low: "痛苦不堪", high: "乐在其中" },
      { id: "balance", label: "工作生活平衡", hint: "工作占用生活多少？", low: "全被占了", high: "完美平衡" },
      { id: "achievement", label: "成就感", hint: "工作让你觉得有价值吗？", low: "毫无意义", high: "价值满满" },
    ],
  },
  {
    id: "freedom",
    name: "生活自由",
    icon: "🦋",
    color: "#a855f7",
    description: "时间、选择和生活的自主权",
    questions: [
      { id: "time", label: "时间自由度", hint: "你的时间由谁支配？", low: "完全被动", high: "随心所欲" },
      { id: "choice", label: "选择自主权", hint: "生活中的选择权有多大？", low: "别无选择", high: "自由选择" },
      { id: "pace", label: "生活节奏", hint: "生活的节奏是快是慢？", low: "焦头烂额", high: "从容不迫" },
    ],
  },
  {
    id: "growth",
    name: "自我实现",
    icon: "✨",
    color: "#f97316",
    description: "成长、意义感和对未来的期待",
    questions: [
      { id: "learning", label: "成长进步", hint: "你还在成长吗？", low: "原地踏步", high: "飞速成长" },
      { id: "meaning", label: "人生意义感", hint: "觉得活着有意义吗？", low: "迷茫空虚", high: "意义满满" },
      { id: "future", label: "未来期待", hint: "对未来有信心吗？", low: "一片灰暗", high: "充满期待" },
    ],
  },
] as const;

// 维度权重（参考世界幸福报告研究：健康和人际关系权重更高）
const WEIGHTS: Record<string, number> = {
  health: 0.22,
  relationship: 0.20,
  finance: 0.15,
  work: 0.15,
  freedom: 0.13,
  growth: 0.15,
};

// 评分等级
const SCORE_LEVELS = [
  { min: 0, max: 29, label: "急需充电", emoji: "🔋", desc: "幸福指数偏低，建议先从身心健康入手，给自己一些恢复的时间。" },
  { min: 30, max: 49, label: "需要关注", emoji: "🌧️", desc: "有些方面需要重视了，找出最低的维度，迈出改变的第一步。" },
  { min: 50, max: 64, label: "中等水平", emoji: "🌤️", desc: "生活还算平稳，但还有不少提升空间，值得花心思经营。" },
  { min: 65, max: 79, label: "比较幸福", emoji: "☀️", desc: "整体状态不错！留意短板，可以让幸福更加均衡。" },
  { min: 80, max: 89, label: "非常幸福", emoji: "🌈", desc: "你在很多方面都做得很好，继续保持，也帮助身边的人。" },
  { min: 90, max: 100, label: "幸福天花板", emoji: "🏆", desc: "你简直是行走的幸福样本！请分享你的秘诀。" },
];

// ============ 类型 ============
type Scores = Record<string, number>;
type Step = "intro" | number | "result";

// ============ 组件 ============
export default function Calculator() {
  const [step, setStep] = useState<Step>("intro");
  const [scores, setScores] = useState<Scores>(() => {
    const init: Scores = {};
    DIMENSIONS.forEach((d) => d.questions.forEach((q) => (init[q.id] = 5)));
    return init;
  });

  const currentDimIndex = typeof step === "number" ? step - 1 : -1;
  const currentDim = DIMENSIONS[currentDimIndex];

  // 计算各维度分数（0-10 → 0-100）
  const dimScores = useMemo(() => {
    return DIMENSIONS.map((d) => {
      const avg = d.questions.reduce((sum, q) => sum + scores[q.id], 0) / d.questions.length;
      return { ...d, score: Math.round(avg * 10) };
    });
  }, [scores]);

  // 综合幸福指数
  const totalScore = useMemo(() => {
    return Math.round(
      dimScores.reduce((sum, d) => sum + d.score * WEIGHTS[d.id], 0)
    );
  }, [dimScores]);

  // 最低维度
  const lowestDim = useMemo(() => {
    return [...dimScores].sort((a, b) => a.score - b.score)[0];
  }, [dimScores]);

  // 当前等级
  const level = useMemo(() => {
    return SCORE_LEVELS.find((l) => totalScore >= l.min && totalScore <= l.max) || SCORE_LEVELS[0];
  }, [totalScore]);

  // 更新分数
  const updateScore = (questionId: string, value: number) => {
    setScores((prev) => ({ ...prev, [questionId]: value }));
  };

  // 雷达图数据
  const radarPoints = useMemo(() => {
    const cx = 150, cy = 150, r = 120;
    const angles = DIMENSIONS.map((_, i) => (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2);
    return angles.map((angle, i) => {
      const value = dimScores[i].score / 100;
      return {
        x: cx + r * value * Math.cos(angle),
        y: cy + r * value * Math.sin(angle),
        labelX: cx + (r + 30) * Math.cos(angle),
        labelY: cy + (r + 30) * Math.sin(angle),
      };
    });
  }, [dimScores]);

  // 环形进度
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* ====== 介绍页 ====== */}
      {step === "intro" && (
        <div className="glass-card rounded-3xl p-8 animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌅</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              你有多幸福？
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              不是鸡汤，不是玄学。通过 6 大维度 18 道题，给你的幸福一个数字。
              <br />全部在浏览器本地计算，你的数据不会上传。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {DIMENSIONS.map((d) => (
              <div
                key={d.id}
                className="text-center p-3 rounded-xl bg-white/50 dark:bg-white/5"
              >
                <div className="text-2xl mb-1">{d.icon}</div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{d.name}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep(1)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            开始测评 →
          </button>
          <p className="text-center text-gray-400 text-sm mt-3">大约 2 分钟</p>
        </div>
      )}

      {/* ====== 分步表单 ====== */}
      {typeof step === "number" && step >= 1 && step <= DIMENSIONS.length && currentDim && (
        <div className="glass-card rounded-3xl p-8 animate-fade-in-up">
          {/* 进度条 */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>{currentDim.icon} {currentDim.name}</span>
              <span>{step} / {DIMENSIONS.length}</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-500"
                style={{ width: `${(step / DIMENSIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 维度标题 */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
              {currentDim.icon} {currentDim.name}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{currentDim.description}</p>
          </div>

          {/* 问题列表 */}
          <div className="space-y-8">
            {currentDim.questions.map((q) => (
              <div key={q.id} className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{q.label}</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                    {scores[q.id]}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{q.hint}</p>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scores[q.id]}
                  onChange={(e) => updateScore(q.id, parseInt(e.target.value))}
                  className="slider-track w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{q.low}</span>
                  <span>{q.high}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 导航按钮 */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 rounded-2xl border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                ← 上一步
              </button>
            )}
            <button
              onClick={() => setStep(step < DIMENSIONS.length ? step + 1 : "result")}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]"
            >
              {step < DIMENSIONS.length ? "下一步 →" : "查看结果 🎉"}
            </button>
          </div>
        </div>
      )}

      {/* ====== 结果页 ====== */}
      {step === "result" && (
        <div className="space-y-6 animate-fade-in-up">
          {/* 总分卡片 */}
          <div className="glass-card rounded-3xl p-8 pulse-glow">
            <div className="flex flex-col items-center">
              <svg width="160" height="160" className="score-ring mb-4">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth="8" className="dark:stroke-gray-700" />
                <circle
                  cx="80" cy="80" r="70" fill="none"
                  stroke="url(#scoreGradient)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 80 80)"
                  className="animate-score"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <text x="80" y="72" textAnchor="middle" className="text-4xl font-bold" fill="currentColor">
                  {totalScore}
                </text>
                <text x="80" y="95" textAnchor="middle" className="text-sm" fill="#9ca3af">
                  幸福指数
                </text>
              </svg>
              <div className="text-center">
                <div className="text-3xl mb-1">{level.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{level.label}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">{level.desc}</p>
              </div>
            </div>
          </div>

          {/* 雷达图 */}
          <div className="glass-card rounded-3xl p-6">
            <h4 className="font-bold text-gray-800 dark:text-white mb-4 text-center">幸福维度雷达</h4>
            <svg viewBox="0 0 300 300" className="w-full max-w-sm mx-auto">
              {/* 网格 */}
              {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
                <polygon
                  key={scale}
                  points={DIMENSIONS.map((_, i) => {
                    const angle = (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2;
                    return `${150 + 120 * scale * Math.cos(angle)},${150 + 120 * scale * Math.sin(angle)}`;
                  }).join(" ")}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  className="dark:stroke-gray-600"
                />
              ))}
              {/* 轴线 */}
              {DIMENSIONS.map((_, i) => {
                const angle = (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2;
                return (
                  <line
                    key={i}
                    x1="150" y1="150"
                    x2={150 + 120 * Math.cos(angle)}
                    y2={150 + 120 * Math.sin(angle)}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    className="dark:stroke-gray-600"
                  />
                );
              })}
              {/* 数据区域 */}
              <polygon
                points={radarPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="rgba(249, 115, 22, 0.15)"
                stroke="#f97316"
                strokeWidth="2"
              />
              {/* 数据点 */}
              {radarPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill={DIMENSIONS[i].color} />
              ))}
              {/* 标签 */}
              {radarPoints.map((p, i) => (
                <text
                  key={i}
                  x={p.labelX}
                  y={p.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-medium"
                  fill={DIMENSIONS[i].color}
                >
                  {DIMENSIONS[i].icon} {DIMENSIONS[i].name}
                </text>
              ))}
            </svg>
          </div>

          {/* 各维度详情 */}
          <div className="glass-card rounded-3xl p-6">
            <h4 className="font-bold text-gray-800 dark:text-white mb-4">维度详情</h4>
            <div className="space-y-4">
              {dimScores.map((d) => (
                <div key={d.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {d.icon} {d.name}
                    </span>
                    <span className="text-sm font-bold" style={{ color: d.color }}>
                      {d.score}
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${d.score}%`, backgroundColor: d.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 建议 */}
          <div className="glass-card rounded-3xl p-6">
            <h4 className="font-bold text-gray-800 dark:text-white mb-3">💡 幸福提升建议</h4>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4">
              <p className="text-gray-700 dark:text-gray-300">
                你的最低维度是 <strong>{lowestDim.icon} {lowestDim.name}</strong>（{lowestDim.score}分），
                这是最值得投入精力改善的方向。从小处着手，持续行动比一蹴而就更有效。
              </p>
            </div>
            <div className="mt-3 bg-green-50 dark:bg-green-900/20 rounded-2xl p-4">
              <p className="text-gray-700 dark:text-gray-300">
                你的最高维度是 <strong>{[...dimScores].sort((a, b) => b.score - a.score)[0].icon} {[...dimScores].sort((a, b) => b.score - a.score)[0].name}</strong>，
                这是你的幸福支柱，好好维护它！
              </p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={() => { setStep("intro"); setScores(() => { const init: Scores = {}; DIMENSIONS.forEach((d) => d.questions.forEach((q) => (init[q.id] = 5))); return init; }); }}
              className="flex-1 py-3 rounded-2xl border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              重新测评
            </button>
            <button
              onClick={() => {
                const text = `我的幸福指数：${totalScore}分 ${level.emoji}

💚 身心健康 ${dimScores[0].score} | 💰 财务状况 ${dimScores[1].score}
❤️ 人际关系 ${dimScores[2].score} | 💼 工作状态 ${dimScores[3].score}
🦋 生活自由 ${dimScores[4].score} | ✨ 自我实现 ${dimScores[5].score}

来测测你的幸福指数 →`;
                if (navigator.share) {
                  navigator.share({ title: "幸福指数计算器", text });
                } else {
                  navigator.clipboard.writeText(text);
                  alert("结果已复制到剪贴板！");
                }
              }}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]"
            >
              分享结果
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
