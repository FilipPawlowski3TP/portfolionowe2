// Single source of truth for all site content (Phase 1 copy deck).
// Plain text here; Polish typography (NBSP after single-letter prepositions etc.)
// is applied at render time by utils/typo.ts + <T> component.
// Values starting with TODO_ are placeholders tracked in docs/TODO_USER.md —
// scripts/check-placeholders.mjs fails the production build while any remain.

export const site = {
  brand: {
    name: 'Pawłowski Studio',
    wordmark: 'PAWŁOWSKI STUDIO',
    person: 'Filip Pawłowski',
    tagline: 'Projektowanie stron internetowych',
  },

  contact: {
    email: 'filip.pawlowski71@gmail.com',
    phone: '+48 884 898 970', // owner-provided (2026-11-17) for the "Zadzwoń" CTA (tel:)
  },

  legal: {
    // Owner decision (G0): no company data on the site (no NIP/REGON/address/legal form).
    administrator: 'Filip Pawłowski',
    address: null,
    nip: null,
  },

  domain: 'TODO_DOMENA',

  nav: {
    // Multi-page (user decision 2026-11-17): FAQ and Kontakt are own pages;
    // hash links work from every page.
    links: [
      { href: '/#oferta', label: 'Oferta' },
      { href: '/#realizacje', label: 'Realizacje' },
      { href: '/#proces', label: 'Proces' },
      { href: '/faq/', label: 'FAQ' },
    ],
    cta: { href: '/kontakt/', label: 'Napisz' },
  },

  seo: {
    title: 'Strony internetowe dla firm | Pawłowski Studio',
    description:
      'Projektuję szybkie strony internetowe dla małych firm i usługodawców. Bez szablonów, od pomysłu po publikację. Zobacz realizację i napisz do mnie.',
    ogImage: '/og/og-default.jpg',
    locale: 'pl_PL',
  },

  hero: {
    // §3 VISUAL PATCH v3 — H1 in 3 editorial lines.
    h1: ['Strony internetowe,', 'po których klient', 'dzwoni.'],
    lead:
      'Projektuję i buduję strony dla małych firm i usługodawców: szybkie, czytelne, gotowe na telefon i na Google.',
    // §2.5: "Zadzwoń" (tel:) + "Napisz" (obrys) — Kontakt is its own page now.
    ctas: [
      { href: 'tel:+48884898970', label: 'Zadzwoń', variant: 'primary' },
      { href: '/kontakt/', label: 'Napisz', variant: 'outline' },
    ],
  },

  // §5.3 — Zdanie przewodnie (words light up with scroll). Krok 5: the giant
  // line carries one sentence (scannable), the second is a small note below.
  guidingSentence:
    'Strona firmy ma jedno zadanie: sprawić, żeby klient w kilka sekund zrozumiał, czym się zajmujesz i jak się z Tobą skontaktować.',
  guidingNote:
    'Całą resztę, od animacji po kod, robię po to, żeby to zadanie wykonywała bez zgrzytów.',

  offer: {
    id: 'oferta',
    label: 'Oferta',
    heading: 'Co dla Ciebie zrobię',
    intro: 'Każdy projekt jest inny — od jednej strony po rozbudowany serwis. Zawsze pod Twój cel i budżet.',
    services: [
      {
        name: 'Strona firmowa (wielostronicowa)',
        icon: 'window',
        featured: true,
        what: 'Kilka podstron, osobne strony usług i miejsce, żeby rosnąć w Google.',
        forWho: 'Dla firmy z konkretną ofertą, która chce być widoczna w swojej okolicy.',
        cta: 'Porozmawiajmy',
      },
      {
        name: 'Strona-wizytówka (one-page)',
        icon: 'card',
        what: 'Wszystko na jednej stronie: oferta, zaufanie i kontakt.',
        forWho: 'Na start — gdy nie masz jeszcze strony i chcesz szybko być w internecie.',
      },
      {
        name: 'Landing page pod kampanię',
        icon: 'target',
        what: 'Jedna strona skupiona na jednym działaniu — pod reklamę, ofertę sezonową lub nowy produkt.',
        forWho: 'Gdy potrzebujesz konkretu, nie całego serwisu.',
      },
      {
        name: 'Opieka po wdrożeniu',
        icon: 'shield',
        what: 'Hosting, drobne zmiany, kopie zapasowe i aktualizacje — strona żyje, a Ty masz spokój.',
        forWho: 'Gdy nie chcesz zajmować się stroną po jej oddaniu.',
      },
    ],
    pricing: 'Wycena indywidualna po krótkiej rozmowie.',
  },

  process: {
    id: 'proces',
    label: 'Proces',
    heading: 'Jak wygląda współpraca',
    steps: [
      {
        name: 'Rozmowa',
        icon: 'chat',
        what: 'Piszesz, czego potrzebujesz. Zadaję kilka pytań i proponuję kierunek.',
        fromYou: 'Krótki opis firmy i celu strony.',
      },
      {
        name: 'Projekt i akceptacja',
        icon: 'pencil',
        what: 'Przygotowuję projekt wyglądu i treści. Poprawiasz, aż będzie po Twojemu.',
        fromYou: 'Materiały, które masz — teksty, zdjęcia, logo. Jeśli czegoś brakuje, pomogę.',
      },
      {
        name: 'Budowa',
        icon: 'layers',
        what: 'Składam stronę: szybką, czytelną na telefonie i przygotowaną na Google.',
        fromYou: 'Informacja zwrotna na etapach — bez pośpiechu, ale bez ciszy.',
      },
      {
        name: 'Start i opieka',
        icon: 'flag',
        what: 'Publikuję stronę, podłączam domenę i pokazuję, jak z niej korzystać.',
        fromYou: 'Domena i serwer — pomogę wybrać i podłączyć.',
      },
    ],
  },

  // §6 (VISUAL PATCH v3): projects list; the old case-study facts block
  // (Problem / Co zrobiłem / Technologia i wyniki) is removed per patch §1.
  // New projects = new array item, no layout change.
  projects: [
    {
      name: 'Koparki Pawłowski',
      type: 'Strona firmowa',
      year: 2026,
      url: 'https://koparkapawlowski.pl/',
      preview: '/media/case-desktop-thumb.webp',
    },
  ],

  standard: {
    id: 'standard',
    label: 'Standard',
    heading: 'Co dostajesz w każdej stronie',
    // TODO_PRZEWAGI — all four advantages need owner confirmation (G1)
    items: [
      {
        name: 'Szybkość, którą widać',
        icon: 'bolt',
        what: 'Strony buduję lekkie od podstaw — klienci nie lubią czekać, a Google to zauważa.',
      },
      {
        name: 'Telefon przede wszystkim',
        icon: 'phone',
        what: 'Większość Twoich klientów obejrzy stronę na telefonie. Dlatego projektuję najpierw pod telefony, nie pod duże ekrany.',
      },
      {
        name: 'Widoczność w Google',
        icon: 'search',
        what: 'Czysta struktura, sensowne opisy i szybkość — żeby klienci znajdowali Cię sami.',
      },
      {
        name: 'Twoja strona, nie wypożyczona',
        icon: 'key',
        what: 'Po oddaniu projektu strona należy do Ciebie. Bez abonamentów i bez zaskoczeń.',
      },
    ],
  },

  faq: {
    id: 'faq',
    label: 'FAQ',
    heading: 'Najczęstsze pytania',
    items: [
      {
        q: 'Ile kosztuje zrobienie strony?',
        a: 'Zależy od zakresu — inaczej wycenia się wizytówkę, inaczej większą stronę z kilkoma podstronami. Napisz, co planujesz: po krótkiej rozmowie dostaniesz konkretną wycenę.',
      },
      {
        q: 'Ile trwa realizacja?',
        a: 'Termin podaję po rozmowie, bo zależy od zakresu i materiałów. Najważniejsze z Twojej strony to treści i zdjęcia — resztą zajmuję się ja.',
      },
      {
        q: 'Co muszę przygotować?',
        a: 'To, co masz: nazwę firmy, zakres usług, zdjęcia z pracy, logo (jeśli jest). Jeśli czegoś brakuje, pomogę to ustalić — nie musisz mieć wszystkiego od razu.',
      },
      {
        q: 'Kto jest właścicielem strony?',
        a: 'Po zakończeniu projektu strona jest Twoja.',
      },
      {
        q: 'Co z domeną i serwerem?',
        a: 'Pomogę wybrać i podłączyć jedno i drugie. Opłaty za domenę i serwer są po stronie Twojej firmy — to zwykle kilkadziesiąt do kilkuset złotych rocznie.',
      },
      {
        q: 'Czy strona będzie widoczna w Google?',
        a: 'Buduję strony z poprawną strukturą, opisami i szybkością, które wyszukiwarka ceni. Miejsce w wynikach zależy też od konkurencji i Twoich treści — ale technicznie strona będzie na to gotowa.',
      },
      {
        q: 'Czy po oddaniu strony mogę zgłaszać zmiany?',
        a: 'Tak — możemy umówić się na opiekę po wdrożeniu albo wrócić do mnie, gdy będzie potrzebna zmiana.',
      },
    ],
  },

  contactSection: {
    id: 'kontakt',
    // §7 VISUAL RESET.
    heading: 'Porozmawiajmy o Twojej stronie.',
    lead: 'Napisz, czym się zajmujesz i czego potrzebujesz. Odpiszę z propozycją kolejnego kroku.',
    emailLabel: 'Napisz bezpośrednio',
    form: {
      name: { label: 'Imię', autocomplete: 'name', required: true },
      email: { label: 'E-mail', autocomplete: 'email', required: true },
      kind: {
        label: 'Jaka strona Cię interesuje?',
        required: false,
        options: [
          'Strona-wizytówka (one-page)',
          'Strona firmowa (wielostronicowa)',
          'Landing page pod kampanię',
          'Jeszcze nie wiem — porozmawiajmy',
        ],
      },
      message: { label: 'Opisz, czego potrzebujesz', required: true },
      submit: 'Wyślij zapytanie',
      sending: 'Wysyłanie…',
      success: 'Dzięki! Wiadomość poszła — odpowiem najszybciej, jak mogę.',
      error: 'Nie udało się wysłać. Sprawdź pola albo napisz bezpośrednio na adres e-mail poniżej.',
      errors: {
        name: 'Podaj imię — będę wiedział, do kogo piszę.',
        email: 'Podaj poprawny adres e-mail, żebym mógł odpowiedzieć.',
        message: 'Napisz choć kilka słów — co to za firma i czego potrzebujesz.',
      },
    },
    clause:
      'Administratorem danych jest Filip Pawłowski. Dane z formularza wykorzystam wyłącznie, żeby odpowiedzieć na Twoją wiadomość. Szczegóły znajdziesz w polityce prywatności.',
  },

  footer: {
    line: 'Projektowanie stron internetowych dla małych firm.',
    links: [
      { href: '/polityka-prywatnosci/', label: 'Polityka prywatności' },
      { href: '/polityka-cookies/', label: 'Polityka cookies' },
    ],
    copyright: (year: number) => `© ${year} Pawłowski Studio`,
  },
} as const;

export type Site = typeof site;
