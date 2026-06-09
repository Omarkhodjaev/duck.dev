---
title: "JavaScript: eng kerakli array metodlari"
date: "2026-06-08"
description: "map, filter, reduce va boshqa array metodlarini amaliy misollar bilan tushunamiz."
tags: ["javascript", "asoslar"]
---

JavaScript'da massiv (array) bilan ishlash kundalik vazifa. Quyida eng ko'p
ishlatiladigan metodlarni amaliy misollar bilan ko'rib chiqamiz.

## map — har bir elementni o'zgartirish

`map` massivning har bir elementini o'zgartirib, **yangi** massiv qaytaradi:

```js
const sonlar = [1, 2, 3, 4];
const kvadratlar = sonlar.map((n) => n * n);

console.log(kvadratlar); // [1, 4, 9, 16]
```

## filter — shartga mos elementlarni tanlash

```js
const sonlar = [1, 2, 3, 4, 5, 6];
const juftlar = sonlar.filter((n) => n % 2 === 0);

console.log(juftlar); // [2, 4, 6]
```

## reduce — bitta qiymatga jamlash

`reduce` massivni bitta natijaga "yig'adi" — masalan, yig'indi:

```js
const sonlar = [10, 20, 30];
const jami = sonlar.reduce((acc, n) => acc + n, 0);

console.log(jami); // 60
```

## Zanjirlash (chaining)

Bu metodlarni ketma-ket ulash mumkin:

```js
const natija = [1, 2, 3, 4, 5, 6]
  .filter((n) => n % 2 === 0) // [2, 4, 6]
  .map((n) => n * 10)         // [20, 40, 60]
  .reduce((a, b) => a + b, 0); // 120

console.log(natija); // 120
```

## Xulosa

| Metod    | Vazifasi                       | Qaytaradi      |
| -------- | ------------------------------ | -------------- |
| `map`    | har bir elementni o'zgartirish | yangi massiv   |
| `filter` | shartga mos elementlar         | yangi massiv   |
| `reduce` | bitta qiymatga jamlash         | bitta qiymat   |

Bu uchta metodni yaxshi o'zlashtirsangiz, kodingiz ancha toza va o'qiladigan
bo'ladi.
