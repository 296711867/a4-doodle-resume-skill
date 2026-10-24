// 四份简历主题功能全量回归:按钮存在/弹层开合/切换生效/记忆写入/恢复
import { spawn } from 'node:child_process'
import { resolve } from 'node:path'
const BASE = 'C:/Awork/001-学校资料/师姐简历/刘文洁'
const PAGES = [
  ['fullstack', BASE + '/resume-fullstack/index.html'],
  ['ops', BASE + '/A4简历工作流/examples/ops/index.html'],
  ['bigdata', BASE + '/A4简历工作流/examples/bigdata/index.html'],
  ['ai', BASE + '/A4简历工作流/examples/ai/index.html'],
]
const PORT = 9970 + Math.floor(Math.random() * 40)
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',
  ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, `--user-data-dir=${process.env.TEMP}/thmreg_${PORT}`, 'about:blank'], { stdio: 'ignore' })
const sleep = ms => new Promise(r => setTimeout(r, ms))
let ws
for (let i = 0; i < 30; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); ws = l.find(t => t.type === 'page')?.webSocketDebuggerUrl; if (ws) break } catch {} await sleep(400) }
const s = new WebSocket(ws); await new Promise(r => s.onopen = r)
let id = 0; const p = new Map()
s.onmessage = e => { const m = JSON.parse(e.data); if (m.id && p.has(m.id)) { p.get(m.id)(m); p.delete(m.id) } }
const send = (method, params = {}) => new Promise(r => { const i = ++id; p.set(i, r); s.send(JSON.stringify({ id: i, method, params })) })

for (const [name, path] of PAGES) {
  await send('Page.enable')
  await send('Page.navigate', { url: 'file:///' + resolve(path).replace(/\\/g, '/') })
  await sleep(4200)
  const r = await send('Runtime.evaluate', { returnByValue: true, expression: `
    (() => {
      const btn = document.getElementById('btn-theme');
      const pop = document.getElementById('theme-pop');
      if (!btn || !pop) return 'FAIL: no theme controls';
      btn.click();
      const opened = !pop.hidden;
      const swatches = document.querySelectorAll('.swatches[data-kind="accent"] .swatch');
      const n = swatches.length;
      const rootVarBefore = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      if (swatches[4]) swatches[4].click();
      const rootVarAfter = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      const svgProbe = document.querySelector('.page svg [fill="#F6CB43"]');
      const fill = svgProbe ? getComputedStyle(svgProbe).fill : '(no probe)';
      const saved = !!localStorage.getItem('resume-theme');
      document.getElementById('theme-reset').click();
      const rootVarReset = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      return JSON.stringify({ opened, n, rootVarBefore, rootVarAfter, svgFill: fill, saved, rootVarReset,
        pass: opened && n >= 6 && rootVarAfter !== rootVarBefore && saved && rootVarReset.toLowerCase() === '#f6cb43' });
    })()` })
  const v = JSON.parse(r.result.result.value)
  console.log(name.padEnd(10), v.pass ? 'PASS' : 'FAIL', JSON.stringify(v))
  console.log(name.padEnd(10), r.result.result.value)
}
s.close(); chrome.kill(); process.exit(0)
