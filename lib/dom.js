// Brauzer muhitidagi kichik yordamchilar (faqat client komponentlarda).

// Foydalanuvchi animatsiyalarni kamaytirishni so'raganmi?
export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Qurilmada aniq (sichqonchali) ko'rsatkich bormi? Sensorli ekranlarda — yo'q.
export function hasFinePointer() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}
