// VISUAL RESET v2 §6/§8 Krok 3 — reveals: intro (<= 1.2 s), section heading
// line-mask reveals, guiding sentence stagger (50 ms). SplitText API verified
// against the installed gsap typings (mask/aria/autoSplit/onSplit). Hidden
// initial states exist only while these timelines run (JS-set, motion mode);
// html.reveal-all (watchdog) force-shows everything.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// §6 intro: H1 lines in from a mask, then lead + CTAs, then the thumbnail
// (y: 24px + opacity). Total <= 1.2 s, no preloader.
export function initIntro(): void {
  const h1 = document.querySelector<HTMLElement>('.hero__h1');
  const lead = document.querySelector<HTMLElement>('.hero__lead');
  const ctas = document.querySelector<HTMLElement>('.hero__ctas');
  if (!h1) return;

  const split = SplitText.create(h1, {
    type: 'lines',
    mask: 'lines',
    aria: 'auto',
    linesClass: 'split-line',
  });

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from(split.lines, { yPercent: 110, duration: 0.7, stagger: 0.08 }, 0).from(
    [lead, ctas].filter(Boolean),
    { y: 16, opacity: 0, duration: 0.35, stagger: 0.08 },
    0.35,
  );
}

// §6: "Wejście nagłówków sekcji maską linii przy wejściu w viewport".
export function initHeadingReveals(): void {
  for (const h of document.querySelectorAll<HTMLElement>('main h2')) {
    const split = SplitText.create(h, {
      type: 'lines',
      mask: 'lines',
      aria: 'auto',
      linesClass: 'split-line',
    });
    gsap.from(split.lines, {
      yPercent: 110,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power3.out',
      scrollTrigger: { trigger: h, start: 'top 88%', once: true },
    });
  }
}

// Patch §1: the guiding sentence lights up word by word as the page scrolls
// (scrubbed; opacity only — the §7 motion whitelist). aria:'none': the <p>
// has a generic role, aria-label on it is prohibited (axe).
export function initGuidingWords(): void {
  const el = document.querySelector<HTMLElement>('.guiding__text');
  if (!el) return;
  const split = SplitText.create(el, {
    type: 'words',
    aria: 'none',
    wordsClass: 'split-word',
  });
  gsap.fromTo(
    split.words,
    // 0.6 is the dim floor: blended over --paper it keeps contrast ~4.8:1
    // (axe/Lighthouse colour-contrast), while 1 is the lit state.
    { opacity: 0.6 },
    {
      opacity: 1,
      ease: 'none',
      stagger: 0.5,
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
    },
  );
}
