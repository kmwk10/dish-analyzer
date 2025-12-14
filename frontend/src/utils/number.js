export function formatNumber(num, fractionDigits = 1) {
  if (num == null || isNaN(num)) return "";
  return parseFloat(num.toFixed(fractionDigits)).toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  });
}

export function toNumber(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;
  return Number(value.replace(",", "."));
}
