# 插画图库索引(assets-library/)

黑底手绘风动画 SVG,统一:viewBox 1254²(03 为 1448×1086)、墨 #141414、黄 #F6CB43、`<style>` 动画类(draw/fade/pop/dfill 入场 + 循环)、`<g id="scene">`。**内联进简历前必须剥 style/script 并将 id 命名空间化**(见 SKILL.md 铁律)。

| 文件 | 主题 | 适合章节 |
|---|---|---|
| 01-dashboard | 后台仪表盘窗口 | 项目卡:管理后台/中台类 |
| 02-api | 服务器→API←数据库+齿轮 | 头部主视觉:后端/API 主题 |
| 03-dataflow | 笔记本→网页→云→服务器→数据库链路 | 头部/PROFILE:全链路叙事 |
| 04-deploy | 代码→容器×3→云→服务器 | PROFILE/项目卡:部署交付 |
| 05-monitor | 数据大屏显示器 | 项目卡/经历:监控看板 |
| 06-workstation | 开发工位(代码本+浮窗+咖啡) | 头部主视觉:通用开发 |
| 07-responsive | 手机⇄浏览器双向环+太阳 | 项目卡:多端/响应式 |
| 08-security | 安全盾+钥匙孔+仪表盘 | 经历/项目卡:安全与稳定性 |
| 09-brain | 神经网络对话(问→网络→答) | 头部/PROFILE:AI/ML 主题 |
| 10-chip-hub | 训练曲线+GPU 芯片+日志 | 经历/项目卡:模型训练 |
| 11-chatbot | Agent 工具调用(四工具环绕) | 项目卡:Agent/LLM 应用 |
| 12-vision-screen | 数据大屏(折线/饼/柱) | 项目卡:BI/可视化 |
| 13-ml-pipeline | ML 流水线 | 项目卡:MLOps |
| 14-agent-loop | Agent 循环 | 项目卡:自动化 |
| 15-cam-arm | 相机+机械臂 | 项目卡:视觉引导 |
| 16-ai-shield | 安全盾+评估 | 项目卡:模型治理 |
| 17-vision-rig | 视觉工装 | 项目卡:检测系统 |
| 18-handeye-calib | 手眼标定 | 项目卡:标定工具 |
| 19-sensor-split | 传感器融合 | 项目卡:多传感 |
| 20-detect-table | 桌面检测 | 项目卡:质检 |
| 21-agv-nav | AGV 导航 | 项目卡:移动机器人 |
| 22-pose-grasp | 位姿估计抓取 | 项目卡:抓取系统 |
| 23-sort-pipeline | 分拣流水线 | 项目卡:分拣/物流 |

## 使用

1. 选图 → `make_light.py` 式白底化(黑底删除、虚线 #8f8f85、描边按槽位倍率、裁切 viewBox count=1)
2. 内联前剥 `<style>/<script>`、`id="scene"` → `scene-XX`
3. 语义不合 → 按 SKILL.md 第 3.5 步原创(默认原创,借用须核查)
