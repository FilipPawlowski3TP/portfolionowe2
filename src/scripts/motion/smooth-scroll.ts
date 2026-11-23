// Lenis smooth scroll synced with GSAP ScrollTrigger (MASTERPROMPT załącznik A).
// One animation loop: gsap.ticker drives Lenis. No extra requestAnimationFrame anywhere.
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Scrollspy: mark the current section in the nav (G2 polish) ---
export function initScrollspy(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.site-nav__list a'));
  const sections = links
    .map((link) => {
      const id = link.getAttribute('href')?.slice(1);
      return id ? document.getElementById(id) : null;
    })
    .filter((el): el is HTMLElement => el !== null);

  if (links.length === 0 || sections.length === 0) return;

  const setActive = (id: string | null) => {
    for (const link of links) {
      const match = id !== null && link.getAttribute('href') === `#${id}`;
      if (match) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(entry.target.id);
      }
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
  );
  for (const section of sections) observer.observe(section);
}

export function initSmoothScroll(): Lenis | null {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return null;

  const lenis = new Lenis({ lerp: 0.1 }); // autoRaf off — gsap.ticker drives it

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000)); // GSAP seconds -> Lenis ms
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

// Anchor navigation: smooth scroll with header offset, hash update, focus move.
// Native scrolling stays untouched everywhere else (no scroll-jacking).
export function initAnchors(lenis: Lenis | null): void {
  const headerH =
    document.querySelector('.site-header')?.getBoundingClientRect().height ?? 72;

  document.addEventListener('click', (event) => {
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
      'a[href^="#"]',
    );
    if (!anchor) return;
    const hash = anchor.getAttribute('href');
    if (!hash || hash.length < 2) return;
    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;

    event.preventDefault();
    history.replaceState(null, '', hash);

    const moveFocus = () => {
      const heading = target.querySelector<HTMLElement>('h1, h2, h3') ?? target;
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    };

    if (lenis) {
      lenis.scrollTo(target, {
        offset: -(headerH + 8),
        duration: 1.1,
        onComplete: moveFocus,
      });
    } else {
      target.scrollIntoView({ block: 'start' });
      moveFocus();
    }
  });
}
