# 🦆 duck.dev

Dasturlashga oid maqolalar blogi. **Next.js** + **Markdown** asosida, terminal
uslubidagi dizayn bilan.

## Ishga tushirish

```bash
npm install      # bir marta — paketlarni o'rnatish
npm run dev      # http://localhost:3000 da ochiladi
```

Production uchun:

```bash
npm run build
npm run start
```

## Yangi maqola qo'shish

`posts/` papkasiga yangi `.md` fayl yarating. Fayl nomi sayt manzili (URL)
bo'ladi, masalan `posts/react-asoslari.md` → `/blog/react-asoslari`.

Har bir fayl boshida **frontmatter** bo'lishi kerak:

```markdown
---
title: "Maqola sarlavhasi"
date: "2026-06-09"
description: "Qisqa tavsif — ro'yxatda va Google'da ko'rinadi."
tags: ["javascript", "react"]
---

Maqola matni shu yerdan boshlanadi. Markdown'ning hamma imkoniyatlari ishlaydi:
sarlavhalar, ro'yxatlar, jadvallar va kod bloklari.
```

Tayyor! Saqlaganingizdan so'ng maqola avtomatik bosh sahifada paydo bo'ladi.

## Tuzilma

```
app/
  layout.js            # umumiy karkas (header, footer)
  page.js              # bosh sahifa — maqolalar ro'yxati
  about/page.js        # "Men haqimda"
  blog/[slug]/page.js  # bitta maqola sahifasi
  globals.css          # barcha dizayn (ranglar, terminal uslubi)
lib/
  posts.js             # markdown fayllarni o'qish va HTMLga aylantirish
  config.js            # sayt nomi, tavsifi, ijtimoiy havolalar
  format.js            # sana formati
posts/                 # MAQOLALAR shu yerda (.md fayllar)
```

## Sozlash

- **Sayt nomi / tavsif / havolalar** → `lib/config.js`
- **Ranglar va dizayn** → `app/globals.css` (yuqorida `:root` ichidagi `--bg`,
  `--accent` va h.k.)

## Deploy (joylashtirish)

Eng oson yo'li — [Vercel](https://vercel.com):

1. Loyihani GitHub'ga yuklang
2. Vercel'da "Import" qiling — qo'shimcha sozlash shart emas
3. `duck.dev` domenini Vercel sozlamalarida ulang
```
