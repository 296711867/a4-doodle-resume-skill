// A4 页面最终证据截图:#clean 隐藏工具条 + clip 到 .page
// node pageshot.mjs <html路径> <out.png> [waitMs] [scale]
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import { resolve } from 'node:path'
const [htmlPath, out, waitMs = '5600', scale = '1'] = process.argv.slice(2)
const url = 'file:///' + resolve(htmlPath).replace(/\\/g, '/') + '#clean'
const PORT = 9780 + Math.floor(Math.random() * 40)
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',
  ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--user-data-dir=${process.env.TEMP}/pgshot_${PORT}`, 'about:blank'], { stdio: 'ignore' })
const sleep = ms => new Promise(r => setTimeout(r, ms))
let ws
for (let i = 0; i < 30; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); ws = l.find(t => t.type === 'page')?.webSocketDebuggerUrl; if (ws) break } catch {} await sleep(400) }
const s = new WebSocket(ws); await new Promise(r => s.onopen = r)
let id = 0; const p = new Map()
s.onmessage = e => { const m = JSON.parse(e.data); if (m.id && p.has(m.id)) { p.get(m.id)(m); p.delete(m.id) } }
const send = (method, params = {}) => new Promise(r => { const i = ++id; p.set(i, r); s.send(JSON.stringify({ id: i, method, params })) })
await send('Emulation.setDeviceMetricsOverride', { width: 794, height: 1200, deviceScaleFactor: +scale, mobile: false })
await send('Page.enable'); await send('Page.navigate', { url }); await sleep(+waitMs)
const r = await send('Runtime.evaluate', { returnByValue: true, expression:
  `(() => { const b = document.querySelector('.page').getBoundingClientRect(); return { x: b.x, y: b.y, width: b.width, height: b.height } })()` })
const b = r.result.result.value
const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: b.x, y: b.y, width: b.width, height: b.height, scale: +scale } })
fs.writeFileSync(out, Buffer.from(shot.result.data, 'base64'))
console.log(out, Math.round(b.width) + 'x' + Math.round(b.height))
s.close(); chrome.kill(); process.exit(0)
