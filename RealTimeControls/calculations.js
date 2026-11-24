/** Pure Ohm's law calculations; input validation is shared by UI and tests. */
export function calculateCurrent(voltage, resistance, isOn = true) {
  const v = Number(voltage);
  const r = Number(resistance);
  if (!isOn || !Number.isFinite(v) || !Number.isFinite(r) || v < 0 || r <= 0) return 0;
  return v / r;
}

export function formatCurrent(current) {
  return Number.isFinite(current) && current >= 0 ? current.toFixed(2) : '0.00';
}
