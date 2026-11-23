// Mobile menu enhancement (the <details> disclosure already works without JS):
// Escape closes, opening freezes smooth scroll and marks the rest inert.
import type Lenis from 'lenis';

export function initMenu(lenis: Lenis | null): void {
  const details = document.querySelector<HTMLDetailsElement>('.nav-mobile');
  if (!details) return;
  const summary = details.querySelector<HTMLElement>('summary');
  const main = document.getElementById('tresc');
  const footer = document.querySelector('.site-footer');

  const sync = () => {
    const open = details.open;
    if (open) lenis?.stop();
    else lenis?.start();
    main?.toggleAttribute('inert', open);
    footer?.toggleAttribute('inert', open);
  };

  details.addEventListener('toggle', sync);

  details.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && details.open) {
      details.open = false;
      summary?.focus();
    }
  });

  details.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      details.open = false;
    });
  });
}
