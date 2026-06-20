// Sarlavhani fayl nomiga (slug) aylantiradi.
// Kirill va o'zbek harflarini lotinga o'giradi, bo'sh joyni "-" qiladi.
const MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "x", ц: "ts",
  ч: "ch", ш: "sh", щ: "sh", ъ: "", ы: "i", ь: "", э: "e", ю: "yu",
  я: "ya", ў: "o", қ: "q", ғ: "g", ҳ: "h",
};

export function slugify(text: string): string {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/['’`]/g, "")
    .split("")
    .map((ch) => (ch in MAP ? MAP[ch] : ch))
    .join("")
    .replace(/[^a-z0-9]+/g, "-") // harf/raqamdan boshqasini "-" ga
    .replace(/^-+|-+$/g, "")     // chetdagi "-" larni olib tashlash
    .replace(/-{2,}/g, "-");     // ketma-ket "-" larni bittaga
}
