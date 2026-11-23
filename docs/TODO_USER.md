# TODO_USER — rzeczy do uzupełnienia / decyzje właściciela

Aktualizacja: 2026-11-06 (po G0)

## A. Zatwierdzone w G0 (2026-11-06)

- [x] `{{OSOBA}}` = Filip Pawłowski
- [x] `{{EMAIL}}` = filip.pawlowski71@gmail.com
- [x] `{{TELEFON}}` — **nie publikować** (decyzja); CTA bez telefonu
- [x] `{{FORMA_PRAWNA}}`/`{{NIP}}`/`{{ADRES_FIRMY}}` — **nie publikować** (brak działalności; plan: umowa o dzieło)
- [x] `{{LOKALIZACJA_DZIALANIA}}` = cała Polska + wzmocnienie Wrocław
- [x] `{{ZAKRES_USLUG}}` = strony na zamówienie (bez odświeżania istniejących)
- [x] `{{CASE_STUDY_ZGODA}}` = tak, z linkiem na żywo

## B. Zatwierdzone w G1 (2026-11-06)

- [x] `{{MARKA}}` = **Pawłowski Studio**
- [x] Hero: wariant C „tytułówka rysunku”
- [x] `{{PRZEWAGI}}` — potwierdzone 4: szybkość, mobile-first, widoczność w Google, własność strony + hasło o czasie odpowiedzi
- [x] 4. usługa „Opieka po wdrożeniu” — TAK (dodana do `site.ts`)
- [x] FAQ (własność strony, domena/serwer, zmiany po oddaniu) — potwierdzone
- [x] Cała talia treści (`src/data/site.ts`) — zaakceptowana

## C. Zmienne niekrytyczne (domyślne założenia — popraw, jeśli chcesz inaczej)

- [ ] `{{DOMENA}}` — docelowa domena (`TODO_DOMENA` w kodzie blokuje build produkcyjny do czasu uzupełnienia; canonical: z `www` czy bez?)
- [ ] `{{CENNIK_MODEL}}` — domyślnie „Wycena indywidualna po krótkiej rozmowie”
- [ ] `{{CZAS_REALIZACJI}}` — brak (FAQ odpowiada bez konkretnych terminów)
- [ ] `{{SOCIAL}}` — brak linków
- [ ] `{{GBP}}` — czy istnieje Google Business Profile?
- [ ] `{{ANALITYKA}}` — brak
- [ ] `{{FORMA_ZWRACANIA}}` — „Ty”

## D. Do zrobienia po stronie właściciela (poza kodem)

- [ ] Weryfikacja treści prawnych przez prawnika (`docs/LEGAL_DRAFT_NOTES.md`) — uwaga: brak danych firmowych wymaga sprawdzenia klauzul
- [ ] Google Business Profile + Google Search Console (zgłoszenie sitemapy po wdrożeniu)
- [ ] DNS / domena / konto Cloudflare Pages (patrz `docs/DEPLOY.md`)
- [ ] Testy na realnych urządzeniach (telefon + laptop) — headless nie odzwierciedla FPS/GPU
