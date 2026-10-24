// SVG 批量验收截图(自动读尺寸):node svgshot2.mjs <dir或文件> <outDir> [waitMs] [scale]
import { spawn } from 'node:child_process'
import { writeFileSync, readFileSync, readdirSync, mkdirSync } from 'node:fs'
import { join, basename } from 'node:path'
const [inPath, outDir, waitMs = '5200', scale = '1'] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })
import { statSync } from 'node:fs'
const isDir = statSync(inPath).isDirectory()
const files = isDir ? readdirSync(inPath).filter(f => f.endsWith('.svg')).map(f => join(inPath, f)) : []
const targets = files.length ? files : [inPath]
const PORT = 9500 + Math.floor(Math.random() * 40)
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',
  ['--headless=new', '--disable-gpu', '--hide-scrollbars',
   ...(process.env.RM === '1' ? ['--force-prefers-reduced-motion'] : []),
   `--remote-debugging-port=${PORT}`, `--user-data-dir=${process.env.TEMP}/ss2_${PORT}`, 'about:blank'],
  { stdio: 'ignore' })
const sleep = ms => new Promise(r => setTimeout(r, ms))
let ws
for (let i = 0; i < 30; i++) {
  try {
    const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
    ws = l.find(t => t.type === 'page')?.webSocketDebuggerUrl
    if (ws) break
  } catch {}
  await sleep(400)
}
const s = new WebSocket(ws); await new Promise(r => s.onopen = r)
let id = 0; const p = new Map()
s.onmessage = e => { const m = JSON.parse(e.data); if (m.id && p.has(m.id)) { p.get(m.id)(m); p.delete(m.id) } }
const send = (method, params = {}) => new Promise(r => { const i = ++id; p.set(i, r); s.send(JSON.stringify({ id: i, method, params })) })

for (const f of targets) {
  const svg = readFileSync(f, 'utf8')
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:#fff}</style></head><body>${svg}</body></html>`
  const tmp = process.env.TEMP + '\\ss2_inline.html'
  writeFileSync(tmp, html)
  const nums = (svg.match(/viewBox="([\d.\s]+)"/) || [])[1].trim().split(/\s+/).map(Number)
  const vw = process.env.SIZE ? +process.env.SIZE.split('x')[0] : nums[2]
  const vh = process.env.SIZE ? +process.env.SIZE.split('x')[1] : nums[3]
  await send('Emulation.setDeviceMetricsOverride', { width: vw, height: vh, deviceScaleFactor: +scale, mobile: false })
  await send('Page.navigate', { url: 'file:///' + tmp.replace(/\\/g, '/') })
  await sleep(+waitMs)
  let shot
  if (process.env.CLIP) {
    const r2 = await send('Runtime.evaluate', { returnByValue: true, expression:
      `(() => { const b = document.querySelector('${process.env.CLIP}').getBoundingClientRect(); return { x: b.x, y: b.y, width: b.width, height: b.height } })()` })
    const b = r2.result.result.value
    shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: b.x, y: b.y, width: b.width, height: b.height, scale: +scale } })
  } else {
    shot = await send('Page.captureScreenshot', { format: 'png' })
  }
  const out = join(outDir, basename(f, '.svg') + '.png')
  writeFileSync(out, Buffer.from(shot.result.data, 'base64'))
  console.log(out, vw + 'x' + vh)
}
s.close(); chrome.kill(); process.exit(0)
