// VISUAL PATCH v3 §6 (Krok 3) — hover/focus preview card for project rows.
// Fine pointers only: gsap.quickTo follows the cursor; keyboard focus parks
// the card beside the row (deterministic spot). Touch and reduced-motion
// users get the static thumbnail inside the row instead (CSS). The card is
// aria-hidden + pointer-events:none. Motion mode only (boot.ts gate).
import { gsap } from 'gsap';

export function initProjectPreview(): void {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!fine.matches) return;
  const card = document.querySelector<HTMLImageElement>('.project-preview');
  if (!card) return;

  const xTo = gsap.quickTo(card, 'x', { duration: 0.28, ease: 'power3.out' });
  const yTo = gsap.quickTo(card, 'y', { duration: 0.28, ease: 'power3.out' });
  gsap.set(card, { rotation: -3 });

  const show = (src: string, x: number, y: number) => {
    if (card.dataset.src !== src) {
      card.src = src;
      card.dataset.src = src;
    }
    xTo(Math.max(12, Math.min(x, innerWidth - 320)));
    yTo(Math.max(12, Math.min(y, innerHeight - 202)));
    gsap.to(card, { opacity: 1, visibility: 'visible', duration: 0.18, overwrite: 'auto' });
  };

  const hide = () => gsap.to(card, { opacity: 0, visibility: 'hidden', duration: 0.15, overwrite: 'auto' });

  for (const row of document.querySelectorAll<HTMLElement>('.project-row[data-preview]')) {
    const src = row.dataset.preview as string;
    row.addEventListener('mouseenter', (e) => show(src, e.clientX + 24, e.clientY - 95));
    row.addEventListener('mousemove', (e) => show(src, e.clientX + 24, e.clientY - 95));
    row.addEventListener('mouseleave', hide);
    row.addEventListener('focusin', () => {
      const r = row.getBoundingClientRect();
      show(src, innerWidth - 340, r.top + r.height / 2 - 95);
    });
    row.addEventListener('focusout', hide);
  }
}
