function toMinor(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) throw new Error("Invalid money amount");
  return Math.round(number * 100);
}

module.exports = { toMinor };
