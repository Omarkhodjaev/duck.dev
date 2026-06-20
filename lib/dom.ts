// Brauzer muhitidagi kichik yordamchilar (faqat client komponentlarda).

// Foydalanuvchi animatsiyalarni kamaytirishni so'raganmi?
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Qurilmada aniq (sichqonchali) ko'rsatkich bormi? Sensorli ekranlarda — yo'q.
export function hasFinePointer(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}
