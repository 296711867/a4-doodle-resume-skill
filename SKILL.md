---
name: a4-doodle-resume
description: 手绘涂鸦风单页 A4 网页简历生成器。从职业人设产出恰好一页 A4 的单文件 HTML 简历:6 幅手绘 SVG 插画(借用素材库或纯原创)、描边入场动画、主题色/底色实时切换、printToPDF 恰好一页。触发词:A4 简历、网页简历、手绘风简历、单页简历、一页纸简历、resume、做份简历。
---

# A4 手绘涂鸦风简历生成器(a4-doodle-resume)

把一个职业人设变成**恰好一页 A4** 的手绘涂鸦风网页简历:黑墨 #141414 + 黄 #F6CB43、黄章节头 + Caveat 手写格言、6 幅手绘 SVG 插画、主题色实时切换、打印恰好一页。本技能包自带:`template/`(骨架源模板)、`tools/`(print_pdf·pageshot·theme_regression·svgshot2·make_light)、`fonts/`(字体 base64)、`assets-library/`(**23 幅手绘主题插画图库**,索引见 `assets-library/INDEX.md`,可直接白底化内联)、两套参考插画样本。五个完整职业成品见 `examples/`(fullstack/ops/bigdata/ai/robo,各含 index.html + 预览图)。

## 何时用

- 用户要"一页 A4 简历 / 网页简历 / 手绘风简历"并给出职业方向
- 已有手绘风 SVG 素材(或愿意让你现场原创)需要组装成纸面交付物
- 关键约束:恰好一页、可打印 PDF、零外部请求、单文件分发

## 执行流程(六步,详见母本 README)

### 1. 选骨架
复制 `template/index.template.html` 为工作目录的源模板。骨架已含:全部样式、主题切换(骨架级功能)、AI/机器人动画类、实体自检锚点。**不要从零写 HTML。**

### 2. 插画来源决策(先核查后原创)
- **借用核查必须真执行**(open/ls 打开文件,不能凭印象):先查包内图库 `assets-library/`(**23 幅**,`INDEX.md` 有主题索引),语义完全吻合才借。三条件同时满足:语义同义 / 无需大改构图 / 可独立提取。图库没有再考虑外部素材,仍没有就原创(默认)。
- **默认原创**:核查不过就从零画。按职业语义列 6 幅元素清单 → 打样 1 幅定风格 → 截图验收 → 批量。纯原创两铁律:
  1. 独立 SVG 无 `.in` 触发脚本,截图用 `shot_orig.mjs`(内联 HTML + 注入 .in)
  2. 内联前必须剥 `<style>/<script>`、`id="scene"` 命名空间化(`scene-A1…`/`scene-R1…`),否则样式互覆 + 触发失配 = 线条永久隐藏(实踩两次)
- 画法体系:viewBox 1254×700(或按构图),基组 `<g fill="none" stroke="#141414" stroke-width="3">`,手绘感 = Q 曲线抖动 + 圆头端点 + 白填充遮挡 + 黄点缀(配额克制),动画类(draw/fade/pop/dfill 入场 + 4~6 类循环)已内置模板

### 3. 内容片段(`*-body.frag.html`)
从 `examples/*/[职业]-body.frag.html` 复制结构改文案。**铁律**:
- 全角标点一律 `&#xFF0C;&#xFF1A;&#xFF08;&#xFF09;&#x201C;&#x201D;` 实体写入(手打全角会"丢 x"成 `&#FF0C;` 无效引用,assemble 的自检会兜底但别依赖)
- 文案按行数上限写死;数字自洽(工龄按当前日期核算,统计卡与 bullet 互相印证)
- 人设与联系方式为虚构占位(example.com / 138 0000 0000),README 声明

### 4. 组装(`assemble.py`)
照抄任一示例的 assemble.py:模板骨架(以 `<div class="page">` 与 `<div class="toolbar">` 切头尾)+ 片段 + 内联 SVG(剥 style/script)+ 字体 base64 + 实体自检与终检。素材白底化用 `make_light.py`(黑底 → 白底:删背景、虚线 #8f8f85、描边按槽位倍率、**裁切 viewBox 同步根元素宽高必须 count=1**)。

### 5. 验证(全要有输出)
```powershell
SIZE=794x1123 node <workflow>/素材复刻/tools/svgshot2.mjs index.html _check 5600 1   # 全页截图
node ../../tools/print_pdf.mjs index.html resume.pdf                                 # 打印导出
python -c "from pypdf import PdfReader; print(len(PdfReader('resume.pdf').pages))"   # 必须 == 1
node ../../tools/theme_regression.mjs                                                # 主题回归必须 PASS
```
- 截图证据用 pageshot(#clean + clip 到 .page),不要裸截视口(页边距会裁掉页脚)
- 减动效仿真(RM=1)下内容必须完整可见(基态在 no-preference MQ 内的纪律)

### 6. 交付
`index.html`(单文件)+ `resume.pdf` + `resume-preview.png` + README(运行说明 + 虚构内容声明)。

## 垂直预算(成败关键)

794×1123px 逐节分配并验证总和;**插画高度是最大变量**(槽位宽 ÷ viewBox 比例算显示高)。溢出回删顺序:插画尺寸 → 节间距 → 文案副行 → 主内容。装饰性 svg 必须显式宽高(默认 300×150 会撑爆行)。

## 主题切换(骨架级,组装即继承)

右下角「主题」按钮:6 主题色板 + 4 底色板 + 自定义取色器,localStorage 记忆。机制 = CSS 变量 `--accent/--accent-ink/--paper` + 属性选择器 `.page [fill="#F6CB43"] { fill: var(--accent) }` 接管 SVG 硬编码黄 + 亮度自适应翻字色。回归脚本 theme_regression.mjs 必须 PASS。

## 完成定义

截图页脚元素齐全 + PDF 恰 1 页 + 关键词文本抽验 + **主题回归 PASS** + 虚构内容声明在场。
