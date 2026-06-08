# 🎯 幸福指数计算器 (Happiness Calculator)

一款引导式幸福指数测评工具，通过 6 大维度 18 道题帮助用户量化生活满意度，生成可视化报告并支持分享。

## ✨ 功能特性

- **分步引导式测评** — 6 个维度（健康、关系、财务、工作、自由、成长），每题 1-10 分滑块打分
- **可视化报告** — SVG 环形总分、六边形雷达图、维度柱状对比
- **等级评定** — 6 档幸福等级（极低→极高）
- **一键分享** — 生成 /share 页面链接，无需登录即可查看
- **暗色模式** — 毛玻璃质感 + Tailwind dark mode

## 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| **Next.js 15** | App Router，React 19 |
| **TypeScript** | Strict mode |
| **Tailwind CSS 3.4** | Utility-first + dark mode |
| **SVG** | 纯手写雷达图、环形图，零图片依赖 |

## 🚀 本地运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build
npm start
```

打开 [http://localhost:3000](http://localhost:3000) 即可使用。

## 📂 项目结构

```
happiness-calculator/
├── app/
│   ├── globals.css          # 全局样式（毛玻璃、动画、自定义滑块）
│   ├── layout.tsx           # 根布局 + SEO 元数据
│   ├── page.tsx             # 首页路由
│   └── share/
│       └── page.tsx         # 分享页路由（读取 URL 参数）
├── components/
│   └── Calculator.tsx       # 核心组件（状态机 + 计算引擎）
├── public/                  # 静态资源（当前为空，纯 CSS 绘制）
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## 📊 计算模型

总分 = 加权求和（健康 ×0.22 + 关系 ×0.20 + 财务 ×0.15 + 工作 ×0.15 + 自由 ×0.13 + 成长 ×0.15）

每种维度由 3 道题打分（1-10），维度分数 = 题目均分 × 10，满分 100。

## 📄 License

MIT
