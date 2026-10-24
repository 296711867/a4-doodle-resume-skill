// 打印验证:printToPDF(背景+CSS 页尺寸) → resume.pdf
// 用法:node print_pdf.mjs [html路径] [输出名] — 路径缺省=resume-fullstack
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { resolve } from 'node:path';
const htmlArg = process.argv[2] || 'C:/Awork/001-学校资料/师姐简历/刘文洁/resume-fullstack/index.html';
const outName = process.argv[3] || 'resume.pdf';
const PORT = 9760 + Math.floor(Math.random() * 40);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--remote-debugging-port=' + PORT, '--user-data-dir=' + process.env.TEMP + '/pdf_' + PORT, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  let ws;
  for (let i = 0; i < 30; i++) { try { const l = await (await fetch('http://127.0.0.1:' + PORT + '/json/list')).json(); ws = l.find(t => t.type === 'page')?.webSocketDebuggerUrl; if (ws) break } catch {} await sleep(400) }
  const s = new WebSocket(ws); await new Promise(r => s.onopen = r);
  let id = 0; const p = new Map();
  s.onmessage = e => { const m = JSON.parse(e.data); if (m.id && p.has(m.id)) { p.get(m.id)(m); p.delete(m.id) } };
  const send = (method, params = {}) => new Promise(r => { const i = ++id; p.set(i, r); s.send(JSON.stringify({ id: i, method, params })) });
  await send('Page.enable');
  await send('Page.navigate', { url: 'file:///' + resolve(htmlArg).replace(/\\/g, '/') });
  await sleep(2500);
  await send('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => true)', awaitPromise: true });
  const pdf = await send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 });
  fs.writeFileSync(outName, Buffer.from(pdf.result.data, 'base64'));
  console.log('PDF saved,', Math.round(pdf.result.data.length / 1024), 'KB');
  s.close(); chrome.kill(); process.exit(0);
})();
