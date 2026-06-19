// Sanani o'qishga qulay ko'rinishga keltiradi: 2026-06-09 -> 09 Iyun 2026
const MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  return `${day} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// Bugungi sana ISO formatida (YYYY-MM-DD) — admin va API uchun yagona manba.
export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
