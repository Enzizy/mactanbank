# Mactan Bank — Elementor reference site

A plain HTML/CSS design reference for rebuilding mactanbank.com in **WordPress + Elementor**. Nothing here needs to be uploaded to WordPress except the two logo files and the four footer affiliate logos. Use it as the visual spec and copy each section into Elementor.

## Open it

Double-click `index.html`, or serve the folder (`python -m http.server 8081`) and open http://127.0.0.1:8081. You need an internet connection because photos load from the live mactanbank.com Media Library and fonts load from Google Fonts.

## How to read it in Elementor terms

- **Elementor guide overlay**: add `?guide` to any URL (e.g. `index.html?guide`) to outline every block and label it with the container settings (red) and the widgets inside it (blue). The on-page toggle button is hidden for now; set `SHOW_GUIDE_BUTTON = true` in `assets/js/main.js` to bring it back.
- **[style-guide.html](style-guide.html)**: every value to enter in **Site Settings**, plus a widget map:
  - Global Colors
  - Global Fonts and the type scale per breakpoint
  - Buttons
  - Form Fields
  - Layout, spacing, radius and shadows
- All layouts use Flexbox/Grid **Containers**. No legacy sections or columns.
- Breakpoints match Elementor's defaults: Tablet ≤ 1024px and Mobile ≤ 767px. Check each page at those widths with your browser's dev tools.
- Icons are **Font Awesome 5 Free** names, so you can find each one in Elementor's icon library.
- Fonts are **Plus Jakarta Sans** (headings, buttons) and **Inter** (body). Both are in Elementor's Google Fonts list.

## Suggested build order

1. **Site Settings** → Global Colors, Global Fonts, Typography, Buttons, Form Fields, Layout (copy from the style guide).
2. **Theme Builder** → Header (top bar + sticky header) and Footer.
3. Build **Home**, then save the repeated blocks as **templates**: page hero, product card, CTA band, PDIC notice, FAQ accordion.
4. Build one **loan page** and one **savings page**, then duplicate them for the other products.
5. **Single Post** and **Archive** templates for news (Loop Grid or Posts widget).
6. Forms: use the Elementor **Form** widget (multi-step with Step fields for the loan application) or keep the existing Contact Form 7 shortcodes.
7. Rate and comparison tables: use an **HTML** widget with the table markup, or TablePress. Add the `.table` CSS from `assets/css/style.css` under Site Settings → Custom CSS, including the mobile rules. On phones each row becomes a card: the first cell is the card title and every other cell shows its column heading from its `data-label` attribute. Keep the `data-label`s when you paste the markup.
8. **Privacy & terms popup**: Templates → Popups (Elementor Pro). Trigger *On page load*, condition *Entire site*, Advanced Rules → **Show up to 1 time per Session**. Link the "I agree" button to *Actions → Popup → Close Popup* (leave *Don't Show Again* unticked). The popup then appears on every fresh visit (a new tab or window) and stays closed while the visitor browses in that tab. Without Pro, a free popup plugin such as Popup Maker can do the same with a session cookie. Add `?popup` to any preview URL to see it again in the same tab.
9. **Branch locator** (list + map): Elementor's Google Maps widget shows only one location, so the page uses an **HTML** widget. Paste in the locator markup from `branches.html` (the `.locator` block), the Leaflet CSS/JS links from that page's `<head>` and footer, and `assets/js/branch-map.js`. Add the *Branch locator* and *Map pins* CSS to Custom CSS. The map uses OpenStreetMap tiles, so it's free and needs no API key. Each pin comes from the `data-lat`/`data-lng` on its branch card. Clicking a card zooms the map to it, clicking a pin highlights its card, and the search and region chips filter the list and pins together.

## Pages (40)

| Group | Files |
| --- | --- |
| Core | `index.html`, `about.html`, `branches.html`, `services.html`, `contact.html`, `faq.html`, `resources.html`, `careers.html` |
| Loans | `loans.html` + 7 product pages `loan-*.html` + `apply.html` (online application, multi-step) |
| Deposits | `deposits.html` + 5 savings pages `savings-*.html` + `time-deposit.html` |
| News | `news.html` + 14 article pages `news-*.html` |
| Build notes | `style-guide.html` |

## Assets

- `assets/img/mactanbank-logo.png`: the original logo, trimmed, with a transparent background (use on light backgrounds).
- `assets/img/mactanbank-logo-white.png`: reversed logo, white + lime (use on Forest/dark backgrounds).
- `assets/img/favicon.png`: the triangle mark (use as Site Icon).
- `assets/img/affiliates/*.png`: the four "Related companies" logos for the footer (Mr. Yu Finance, Citizens Lending, Asaynica Realty, Ernesto Asay Yu Foundation), cut from the live site's single `affiliates.png`. Upload these to the Media Library too.
- `assets/css/style.css`: the whole design system. Comments map each block to Elementor settings.
- `assets/js/main.js`: only drives the preview. You don't need it in Elementor, because widgets already include these behaviors (tabs, accordion, sticky header, mobile menu, multi-step form, privacy popup, entrance animations).
- `assets/js/branch-map.js`: the branch locator map. Unlike `main.js`, this one **is** needed in WordPress (see build step 9).

## Content to confirm with Mactan Bank before launch

All copy, rates and contact details were copied from the live site (September 2026). These items need a decision:

1. **Commercial Loan** and **Industrial Loan** are left out because the live pages contain only Lorem Ipsum.
2. **Enterprise Loan**: the live page repeats the Back-to-Back Loan figures (90% of deposit, deposit rate + 3%). Those figures are left out. Confirm the real loanable amount, rate and term.
3. **Pensioner's Loan**: the live FAQ lists corporate requirements and an 18–70 age limit, which conflicts with the 71–80 age bracket. Only the age table and the general FAQ are used.
4. **Passbook replacement fee**: ₱150 on the product pages but ₱100 on the FAQ page. ₱150 is used everywhere.
5. **Bank services**: the intro names Lapu-Lapu, Cebu City, Moalboal, Tacloban and Dumaguete, but the ATM/POS list names Main, Bogo, Tacloban, Cebu City, Carcar and Moalboal. Confirm the branch lists. Also confirm TrueMoney remittance/bills payment is still offered (the source is a 2019 post).
6. **Job openings**: "Preferably male" was removed from two postings. Sex preferences in job ads may conflict with Philippine anti-discrimination rules, so HR should confirm the final wording.
7. **New short copy** written for the redesign needs approval: the one-line product intros on cards, the savings page lead sentences, the Division Paid Loan description (the live page has none), and the section headlines.
8. **Download links** on Forms & reports are placeholders (`#`). Link them to the real PDFs in the Media Library.
9. **Time deposit table**: row 2 starts at ₱50,000.00, which overlaps row 1's upper limit. It is copied as published.
10. Re-confirm all **rates, loan limits, phone numbers, emails and hours** with Compliance and Operations.
11. **Branch map pins** were geocoded from OpenStreetMap to street or barangay level, not to the exact building. Have each branch confirm its pin (drop a pin in Google Maps and copy the coordinates), then update `lat`/`lng` in `BRANCHES`.
12. **Privacy popup wording** is new copy based on the live Privacy Policy and Terms of Use pages. Compliance should approve it.

## Regenerate

The pages are generated from the content data in `../scripts/build-elementor-reference.mjs`. After editing the data or templates there, run:

```powershell
node .\scripts\build-elementor-reference.mjs
```

`assets/` is hand-written and is not touched by the generator.
