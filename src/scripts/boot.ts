// Motion boot (VISUAL RESET v2, §8): initMotion() = wayfinding + the hero
// pinned sequence ("wizytówka → strona", §6). Content is visible without JS;
// a 3 s watchdog (Base.astro) reveals everything if this module never runs.
// Static page state is the default — motion only under prefers-reduced-motion:
// no-preference (html.motion-on marks a live sequence).
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSmoothScroll, initAnchors, initScrollspy } from './motion/smooth-scroll';
import { initMenu } from './motion/menu';
import { initHeroCurtain } from './motion/hero-curtain';
import { initClock, initCopyEmail, initAccordion, initHeaderHide } from './motion/micro';
import { initIntro, initHeadingReveals, initGuidingWords } from './motion/reveals';
import { initProjectPreview } from './motion/project-preview';

declare global {
  interface Window {
    __MOTION_READY__?: boolean;
  }
}

export function initMotion(): void {
  // Wayfinding and content feedback are not motion — work in every mode.
  initScrollspy();
  initClock();
  initCopyEmail();

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    window.__MOTION_READY__ = true;
    return;
  }

  const lenis = initSmoothScroll();
  initAnchors(lenis);
  initMenu(lenis);
  initHeroCurtain();
  initAccordion();
  initHeaderHide();
  initIntro();
  initHeadingReveals();
  initGuidingWords();
  initProjectPreview();

  window.__MOTION_READY__ = true;

  // Triggers depend on layout: refresh once fonts and images settle.
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

try {
  initMotion();
} catch (error) {
  console.error('[motion] boot failed', error);
  document.documentElement.classList.add('reveal-all');
}
