import { calculateCurrent, formatCurrent } from './calculations.js';

const $ = (id) => document.getElementById(id);
const voltage = $('voltage');
const resistance = $('resistance');
const power = $('power');
const canvas = $('chart');
const ctx = canvas.getContext('2d');
const state = { voltage: 12, resistance: 6, isOn: false };

function render() {
  const current = calculateCurrent(state.voltage, state.resistance, state.isOn);
  for (const slider of [voltage, resistance]) {
    const percent = ((Number(slider.value) - Number(slider.min)) / (Number(slider.max) - Number(slider.min))) * 100;
    slider.style.background = `linear-gradient(90deg,#40cdbc 0%,#40cdbc ${percent}%,#263b4e ${percent}%,#263b4e 100%)`;
  }
  $('voltageValue').textContent = Number(state.voltage).toFixed(1).replace(/\.0$/, '');
  $('resistanceValue').textContent = String(state.resistance);
  $('currentValue').textContent = formatCurrent(current);
  $('meterVoltage').textContent = Number(state.voltage).toFixed(1);
  $('meterResistance').textContent = String(state.resistance);
  $('meterCurrent').textContent = formatCurrent(current);
  $('graphResistance').textContent = `R = ${state.resistance} Ω`;
  $('currentNote').textContent = state.isOn ? `${state.voltage} V ÷ ${state.resistance} Ω` : 'Circuit is switched off';
  $('statusText').textContent = state.isOn ? 'CIRCUIT ON' : 'CIRCUIT OFF';
  $('statusNote').textContent = state.isOn ? `Current flowing at ${formatCurrent(current)} A` : 'Switch on to start the experiment';
  $('powerLabel').textContent = state.isOn ? 'POWER OFF' : 'POWER ON';
  $('circuitCaption').textContent = state.isOn ? 'Current is flowing through the circuit' : 'Switch on to visualize current flow';
  power.setAttribute('aria-pressed', String(state.isOn));
  $('circuitStage').classList.toggle('powered', state.isOn);
  document.body.classList.toggle('circuit-on', state.isOn);
  drawChart(current);
}

function drawChart(current) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(320, rect.width);
  const height = 240;
  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  const pad = { left: 48, right: 18, top: 14, bottom: 31 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const maxI = Math.max(1, 24 / state.resistance);
  const x = (v) => pad.left + (v / 24) * plotW;
  const y = (i) => pad.top + plotH - (i / maxI) * plotH;
  ctx.font = '11px Inter, system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= 4; i++) {
    const yy = pad.top + (plotH * i) / 4;
    ctx.strokeStyle = '#203143'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(width - pad.right, yy); ctx.stroke();
    ctx.fillStyle = '#8294a8'; ctx.textAlign = 'right'; ctx.fillText((maxI * (1 - i / 4)).toFixed(1), pad.left - 9, yy);
    const xx = pad.left + (plotW * i) / 4;
    ctx.fillStyle = '#8294a8'; ctx.textAlign = 'center'; ctx.fillText(String(i * 6), xx, height - 12);
  }
  ctx.strokeStyle = '#2b4156'; ctx.beginPath(); ctx.moveTo(pad.left, pad.top); ctx.lineTo(pad.left, pad.top + plotH); ctx.lineTo(width - pad.right, pad.top + plotH); ctx.stroke();
  const gradient = ctx.createLinearGradient(pad.left, 0, width - pad.right, 0);
  gradient.addColorStop(0, '#32d2c1'); gradient.addColorStop(1, '#43a4ff');
  ctx.beginPath();
  for (let n = 0; n <= 60; n++) { const v = n * 0.4; if (n === 0) ctx.moveTo(x(v), y(v / state.resistance)); else ctx.lineTo(x(v), y(v / state.resistance)); }
  ctx.strokeStyle = gradient; ctx.lineWidth = 2.5; ctx.stroke();
  const px = x(state.voltage), py = y(current);
  ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fillStyle = 'rgba(57, 206, 190, .2)'; ctx.fill();
  ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fillStyle = '#45e0cb'; ctx.fill(); ctx.strokeStyle = '#d3fff8'; ctx.lineWidth = 1.5; ctx.stroke();
}

voltage.addEventListener('input', () => { state.voltage = Number(voltage.value); render(); });
resistance.addEventListener('input', () => { state.resistance = Number(resistance.value); render(); });
power.addEventListener('click', () => { state.isOn = !state.isOn; render(); });
$('reset').addEventListener('click', () => {
  state.voltage = 12; state.resistance = 6; state.isOn = false;
  voltage.value = '12'; resistance.value = '6'; render();
});
new ResizeObserver(render).observe(canvas);
render();
