// VISUAL PATCH v3 §4 — kinetic hero + curtain. The hero is pinned while its
// three lines drift apart (x + opacity) and the sub fades; the next section
// ([data-curtain]) slides over the pinned hero (pinSpacing:false = the
// curtain effect) with its rounded top corners flattening as it docks.
// Motion mode only (boot.ts gate) — static pages never hide content.
// Curves/props from patch §4 (verified GSAP API: timeline + ScrollTrigger pin,
// scrub, invalidateOnRefresh — same recipe as the v2 hero window).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHeroCurtain(): void {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]');
  if (!hero || lines.length < 3) return;

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
        scrub: true,
        invalidateOnRefresh: true,
      },
    })
    .to(lines[0], { x: () => innerWidth * -0.18, opacity: 0.5 }, 0)
    .to(lines[1], { x: () => innerWidth * 0.17, opacity: 0.32 }, 0)
    .to(lines[2], { x: () => innerWidth * -0.11, opacity: 0.18 }, 0)
    .to('[data-hero-sub]', { y: -40, opacity: 0, duration: 0.4 }, 0)
    // gentle depth: the decorative wireframe drifts slower than the text
    .to('.hero__bg-art', { y: -48 }, 0);

  const curtain = document.querySelector<HTMLElement>('[data-curtain]');
  if (curtain) {
    gsap.fromTo(
      curtain,
      { borderTopLeftRadius: 40, borderTopRightRadius: 40 },
      {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: curtain,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  }
}
