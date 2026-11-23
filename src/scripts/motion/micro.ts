// VISUAL RESET v2 §5.4/§5.6/§8 Krok 3 — micro-interactions: live clock
// (Europe/Warsaw), copy email with an aria-live status, smooth FAQ accordion,
// header hide on scroll down. Clock + copy are content/feedback and work in
// every mode; accordion + header hide are motion (skipped under reduced).
import { gsap } from 'gsap';

// §5.4: "Wrocław · 14:32 · poniedziałek", live, Europe/Warsaw, every 30 s.
export function initClock(): void {
  const timeEl = document.querySelector<HTMLElement>('[data-clock-time]');
  if (!timeEl) return;
  // §2.3 patch v3: "Wrocław, 20:36" — no weekday.
  const fmt = new Intl.DateTimeFormat('pl-PL', {
    timeZone: 'Europe/Warsaw',
    hour: '2-digit',
    minute: '2-digit',
  });
  const tick = () => {
    timeEl.textContent = fmt.format(new Date());
  };
  tick();
  window.setInterval(tick, 30_000);
}

// §5.6: "Kopiuj e-mail" -> clipboard, "Skopiowano" in place for 1,5 s,
// announced via aria-live="polite" (data-copy-status).
export function initCopyEmail(): void {
  const btn = document.querySelector<HTMLButtonElement>('[data-copy-email]');
  const status = document.querySelector<HTMLElement>('[data-copy-status]');
  if (!btn || !status) return;
  let timer = 0;
  btn.addEventListener('click', async () => {
    const email = btn.dataset.copyEmail ?? '';
    try {
      await navigator.clipboard.writeText(email);
      status.textContent = 'Skopiowano';
    } catch {
      status.textContent = 'Nie udało się skopiować — zaznacz adres ręcznie';
    }
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      status.textContent = '';
    }, 1500);
  });
}

// §8: "płynne rozwinięcie akordeonu i rotacja plusa". The only height
// animation on the page (transform-only cannot move sibling rows); native
// <details> stays instant without JS and under reduced motion.
export function initAccordion(): void {
  for (const d of document.querySelectorAll<HTMLDetailsElement>('details.faq-item')) {
    const answer = d.querySelector<HTMLElement>('.faq-item__answer');
    const summary = d.querySelector<HTMLElement>('summary');
    if (!answer || !summary) continue;
    summary.addEventListener('click', (e) => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      e.preventDefault();
      if (d.open) {
        gsap.to(answer, {
          height: 0,
          opacity: 0,
          duration: 0.25,
          ease: 'power2.inOut',
          onComplete: () => {
            d.open = false;
            gsap.set(answer, { clearProps: 'height,opacity' });
          },
        });
      } else {
        d.open = true;
        gsap.fromTo(
          answer,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' },
        );
      }
    });
  }
}

// §5: "Nagłówek chowa się przy przewijaniu w dół i wraca przy przewijaniu
// w górę" — transform only. 8px hysteresis: Lenis settling must not flicker
// the header back over the content mid-scroll.
export function initHeaderHide(): void {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;
  let last = window.scrollY;
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      if (y > last + 8 && y > 120) header.classList.add('is-hidden');
      else if (y < last - 8) header.classList.remove('is-hidden');
      last = y;
    },
    { passive: true },
  );
}
