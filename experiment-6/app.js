const board = document.getElementById('board');
const layer = document.getElementById('draw-layer');
const ghost = document.getElementById('ghost-layer');
const colorEl = document.getElementById('color');
const widthEl = document.getElementById('width');

const tools = { PEN: 'pen', LINE: 'line', RECT: 'rect' };
let currentTool = tools.PEN;

const toolButtons = {
  [tools.PEN]: document.getElementById('tool-pen'),
  [tools.LINE]: document.getElementById('tool-line'),
  [tools.RECT]: document.getElementById('tool-rect'),
};

function setTool(t) {
  currentTool = t;
  Object.values(toolButtons).forEach(b => b.classList.remove('active'));
  toolButtons[t].classList.add('active');
}

toolButtons[tools.PEN].onclick = () => setTool(tools.PEN);
toolButtons[tools.LINE].onclick = () => setTool(tools.LINE);
toolButtons[tools.RECT].onclick = () => setTool(tools.RECT);

window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'p') setTool(tools.PEN);
  if (e.key.toLowerCase() === 'l') setTool(tools.LINE);
  if (e.key.toLowerCase() === 'r') setTool(tools.RECT);
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') undo();
});

let drawing = false, start = null, el = null;

const pt = board.createSVGPoint();
function cursor(evt) {
  const isTouch = evt.touches && evt.touches[0];
  const { clientX, clientY } = isTouch ? evt.touches[0] : evt;
  pt.x = clientX; pt.y = clientY;
  const ctm = board.getScreenCTM().inverse();
  const p = pt.matrixTransform(ctm);
  return { x: p.x, y: p.y };
}

function onDown(evt) {
  drawing = true; ghost.innerHTML = '';
  start = cursor(evt);
  const stroke = colorEl.value; const w = widthEl.value;

  if (currentTool === tools.PEN) {
    el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke', stroke);
    el.setAttribute('stroke-width', w);
    el.setAttribute('stroke-linecap', 'round');
    el.setAttribute('stroke-linejoin', 'round');
    el._d = `M ${start.x} ${start.y}`;
    el.setAttribute('d', el._d);
    layer.appendChild(el);
  }
  if (currentTool === tools.LINE) {
    el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    el.setAttribute('x1', start.x); el.setAttribute('y1', start.y);
    el.setAttribute('x2', start.x); el.setAttribute('y2', start.y);
    el.setAttribute('stroke', stroke); el.setAttribute('stroke-width', w);
    layer.appendChild(el);
  }
  if (currentTool === tools.RECT) {
    el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    el.setAttribute('x', start.x); el.setAttribute('y', start.y);
    el.setAttribute('width', 0); el.setAttribute('height', 0);
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke', stroke);
    el.setAttribute('stroke-width', w);
    layer.appendChild(el);
  }
}

function onMove(evt) {
  if (!drawing || !el) return;
  const p = cursor(evt);

  if (currentTool === tools.PEN) {
    el._d += ` L ${p.x} ${p.y}`;
    el.setAttribute('d', el._d);
  }
  if (currentTool === tools.LINE) {
    el.setAttribute('x2', p.x);
    el.setAttribute('y2', p.y);
  }
  if (currentTool === tools.RECT) {
    const x = Math.min(p.x, start.x);
    const y = Math.min(p.y, start.y);
    const w = Math.abs(p.x - start.x);
    const h = Math.abs(p.y - start.y);
    el.setAttribute('x', x); el.setAttribute('y', y);
    el.setAttribute('width', w); el.setAttribute('height', h);
  }
}

function onUp() { drawing = false; el = null; }

function undo() {
  const last = layer.lastChild;
  if (last) layer.removeChild(last);
}

function clearBoard() {
  layer.innerHTML = '';
}

function downloadSvg() {
  const svgData = new XMLSerializer().serializeToString(board);
  const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "drawing.svg";
  a.click();
  URL.revokeObjectURL(url);
}

board.addEventListener('mousedown', onDown);
board.addEventListener('mousemove', onMove);
board.addEventListener('mouseup', onUp);

board.addEventListener('touchstart', onDown);
board.addEventListener('touchmove', onMove);
board.addEventListener('touchend', onUp);

document.getElementById('undo').onclick = undo;
document.getElementById('clear').onclick = clearBoard;
document.getElementById('downloadSvg').onclick = downloadSvg;