// YouTube havola yoki ID bilan ishlash uchun yordamchilar.

// Turli ko'rinishdagi havoladan (yoki xom ID'dan) 11 belgilik video ID'ni ajratadi.
//  - https://www.youtube.com/watch?v=ID
//  - https://youtu.be/ID
//  - https://www.youtube.com/embed/ID
//  - https://www.youtube.com/shorts/ID
//  - ID (xuddi o'zi)
export function youtubeId(input: string | null | undefined): string {
  if (!input) return "";
  const trimmed = input.trim();
  const match = trimmed.match(
    /(?:v=|\/embed\/|youtu\.be\/|\/shorts\/)([\w-]{11})/
  );
  if (match) return match[1];
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  return "";
}

// Embed (iframe) uchun manzil.
export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube.com/embed/${id}`;
}

// Ro'yxatdagi karta uchun muqova (thumbnail) rasmi.
export function youtubeThumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
