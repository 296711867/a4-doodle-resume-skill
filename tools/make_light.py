# -*- coding: utf-8 -*-
"""黑底素材 SVG → 白底简历变体
规则(融合思考B方案):去背景/去style与script/去注释/id改名/虚线#8f8f85/
06蒸汽与08火花→#b4b4aa/06桌沿→墨色/按槽位倍率补偿 stroke-width/裁切 viewBox 同步 width/height"""
import re, os

SRC = r'C:\Awork\001-学校资料\师姐简历\刘文洁\素材复刻'
DST = r'C:\Awork\001-学校资料\师姐简历\刘文洁\resume-fullstack\assets'
os.makedirs(DST, exist_ok=True)

CROPS = {
    '01-dashboard':  '35 275 1180 765',
    '02-api':        '70 430 1115 620',
    '03-dataflow':   '105 340 1280 470',
    '04-deploy':     '50 480 1180 400',
    '05-monitor':    '150 295 950 815',
    '06-workstation':'80 340 1180 640',
    '07-responsive': '80 270 1080 765',
    '08-security':   '75 365 1105 590',
}
# 槽位显示宽度 → 描边补偿倍率(1254 viewBox 下 main 6px;显示 ≤260px 时按比例补)
MULT = {
    '01-dashboard':  1.7,   # 项目卡 ~192px
    '02-api':        1.0,   # 未上页
    '03-dataflow':   1.5,   # PROFILE 右栏 ~220px
    '04-deploy':     1.7,   # 项目卡 ~192px
    '05-monitor':    1.3,   # EXPERIENCE 右栏 ~220px
    '06-workstation':1.4,   # Header 右主视觉 ~230px
    '07-responsive': 1.7,   # 项目卡 ~192px
    '08-security':   1.0,   # 未上页
}

def mult_sw(s, k):
    return re.sub(r'stroke-width="([\d.]+)"', lambda m: f'stroke-width="{round(float(m.group(1))*k, 2)}"', s)

for name, crop in CROPS.items():
    src = os.path.join(SRC, name + '.svg')
    nn = name.split('-')[0]
    s = open(src, encoding='utf-8').read()
    s = re.sub(r'<rect width="\d+" height="\d+" fill="#050505" />', '', s)
    s = re.sub(r'<style>.*?</style>', '', s, flags=re.S)
    s = re.sub(r'<script>.*?</script>', '', s, flags=re.S)
    s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
    s = s.replace('id="scene"', f'id="scene-{nn}"')
    s = s.replace('stroke="#d8d8d2"', 'stroke="#8f8f85"')
    if name == '06-workstation':
        s = s.replace('stroke="#f2f2ee" stroke-width="4.5" d="M 1120 812', 'stroke="#b4b4aa" stroke-width="4.5" d="M 1120 812')
        s = s.replace('stroke="#f2f2ee" stroke-width="4.5" d="M 1148 806', 'stroke="#b4b4aa" stroke-width="4.5" d="M 1148 806')
        s = s.replace('stroke="#f2f2ee" d="M 60 900', 'stroke="#141414" d="M 60 900')
    if name == '08-security':
        s = s.replace('class="tw fade" style="--d:1800ms" stroke="#f2f2ee"', 'class="tw fade" style="--d:1800ms" stroke="#b4b4aa"')
    s = mult_sw(s, MULT[name])
    nums = crop.split()
    s = re.sub(r'viewBox="0 0 \d+ \d+"', f'viewBox="{crop}"', s)
    s = re.sub(r'width="\d+" height="\d+"', f'width="{nums[2]}" height="{nums[3]}"', s, count=1)
    s = re.sub(r'\n{3,}', '\n\n', s).strip() + '\n'
    out = os.path.join(DST, name + '.svg')
    open(out, 'w', encoding='utf-8').write(s)
    print(out, len(s))
