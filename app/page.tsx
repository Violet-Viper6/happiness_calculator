import Calculator from "@/components/Calculator";

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-3">
            幸福指数计算器
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            6大维度 · 科学评估 · 发现你的幸福密码
          </p>
        </div>
        <Calculator />
      </div>
    </main>
  );
}
