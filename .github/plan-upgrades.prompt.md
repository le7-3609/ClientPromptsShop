# Plan: Angular Frontend — 5 Feature Upgrades

**TL;DR:** Your Angular 21 project at `D:\WEB API\Project\ClientPromptsShop` currently has simpler versions of several components compared to the `D:\promptsShop\client\client` reference. The plan covers: (1) redesigning `SubCategory` to match the reference's `Category` style with checkboxes/filter bar, (2) making the AI prompt in `BasicSite` replace the site type dropdown instead of coexisting, (3) adding a `CurrencyService` with a selector in the menu, (4) adding a "accept site rules" checkbox to the register tab in `Auth`, and (5) restyling `CartSidebar` and `Cart` to match the reference's drawer/full-cart design.

---

## Step 1 — Subcategory: Design + Product/Category prompt logic

**Target files:**
- `src/app/components/sub-category/sub-category.ts`
- `src/app/components/sub-category/sub-category.html`
- `src/app/components/sub-category/sub-category.scss`

**Changes:**

### 1a. Visual design
Replace the current radio-button card grid with the reference's layout:
- Sticky top filter bar with price-range `p-slider`, sort `p-select`, and search `p-iconfield`
- Hero image section with gradient overlay (already exists, keep and enhance)
- Products rendered as rows inside a white card using `p-dataview`, each row with a `p-checkbox`

### 1b. Selection logic
Switch from single `selectedProduct` (radio) to `chosenProducts: boolean[]` array (checkboxes), matching the reference exactly.

### 1c. Prompt belongs to empty product
The `EmptyProduct` component is already wired up; confirm the logic: when `addToCart()` is called, if `pendingGeminiPrompt` exists, the empty product (`emptyProductId`) is added to cart separately with the `promptId`. No structural change needed — just verify and clean up. The `EmptyProduct` component handles generating the prompt; the parent only holds `pendingGeminiPrompt` until cart add.

### 1d. Empty category two-step
The `EmptyCategory` component is already rendered for `isEmpty === true` categories. Verify the two-step flow (step 1: category prompt, step 2: product prompt) is intact. If the reference's `EmptyCategory` differs, update the component to match the reference's two-phase UI with a step indicator.

### 1e. Platform selector
Move platform `p-select` to a dedicated "platform-required-bar" above the product list (sticky), consistent with the reference.

---

## Step 2 — BasicSite: Prompt replaces site type

**Target files:**
- `src/app/components/basic-site/basic-site.ts`
- `src/app/components/basic-site/basic-site.html`
- `src/app/components/basic-site/basic-site.scss`

**Changes:**

### 2a. Mutual exclusivity flag
Add a `useAiMode: boolean = false` flag. When the user types in the AI field and generates a prompt, set `useAiMode = true` and **hide** the `p-select` for site type. When they delete the prompt, set `useAiMode = false` and show the site type dropdown again.

### 2b. Template update
Wrap the site type `p-floatlabel` in `@if(!useAiMode)` so it disappears when AI mode is active.

### 2c. Validation update
Update `saveBasicSite()` validation to require either `siteTypeId` OR `prompt` (not both), matching the reference's submit guard logic:
```html
[disabled]="basicSiteForm.invalid || (!formData.siteTypeId && !isSubmitted)"
```

### 2d. Second bar placement
The "AI Assistance" `gemini-integration-wrapper` card sits below the platform/site-type row as the "second bar". Confirm this placement is correct; ensure it visually reflects mutual exclusivity via the `useAiMode` flag.

---

## Step 3 — Currency conversion

**Target files:**
- New: `src/app/services/currencyService/currency-service.ts`
- `src/app/components/menu/menu.ts` + `menu.html` + `menu.scss`
- `src/app/components/sub-category/sub-category.ts` + `sub-category.html`
- `src/app/components/cart/cart.ts` + `cart.html`
- `src/app/components/cart-sidebar/cart-sidebar.ts` + `cart-sidebar.html`

**Changes:**

### 3a. Create `currency-service.ts`
Port directly from the reference's `CurrencyServise`:
- `BehaviorSubject` for `currencies$`, `selectedCurrency$`, `rate$`, `error$`
- `loadCurrencies()` → GET `https://api.frankfurter.app/currencies`
- `selectCurrency(c)` → updates selected + fetches rate from Frankfurter API
- Default: `{ code: 'USD', name: 'United States Dollar' }`, rate `1`

```typescript
export interface CurrencyOption {
  code: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  // BehaviorSubjects for currencies$, selectedCurrency$, rate$, error$
  loadCurrencies(): void { /* GET https://api.frankfurter.app/currencies */ }
  selectCurrency(currency: CurrencyOption): void { /* update + fetch rate */ }
  private fetchRate(code: string): void { /* GET https://api.frankfurter.app/latest?from=USD&to={code} */ }
}
```

### 3b. Menu currency selector
Add a currency `p-select` dropdown to `menu.html` (top navbar):
- Calls `currencyService.loadCurrencies()` on init
- Binds to `currencies$` observable
- Calls `selectCurrency()` on change

### 3c. SubCategory prices
Inject `CurrencyService`, subscribe to `selectedCurrency$` and `rate$`, expose `currencyCode` and `currencyRate`. Replace `$ {{ item.price }}` with:
```html
{{ item.price * currencyRate | currency:currencyCode }}
```

### 3d. Cart prices
Apply the same currency pattern to `cart.ts`/`cart.html` and `cart-sidebar.ts`/`cart-sidebar.html`.

### 3e. Import `CurrencyPipe`
Import `CurrencyPipe` from `@angular/common` in each component that uses it.

---

## Step 4 — Auth: "Accept site rules" checkbox on Register

**Target files:**
- `src/app/components/auth/auth.ts`
- `src/app/components/auth/auth.html`
- `src/app/components/auth/auth.scss`

**Changes:**

### 4a. FormControl
In the register `FormGroup` inside `auth.ts`, add:
```typescript
acceptTerms: new FormControl(false, [Validators.requiredTrue])
```

### 4b. Template
In the register tab of `auth.html`, add a `privacy-policy-row` div with:
- `<p-checkbox formControlName="acceptTerms" [binary]="true" />`
- Label: _"I have read and agree to the [Terms of Service](/terms-of-service) and [Privacy Policy](/privacy-policy)"_
- Error message (shown when touched + invalid): `"You must accept the terms to register"`

### 4c. Submit guard
Ensure the Register submit button is:
```html
[disabled]="!registerForm.valid"
```
(already covers `acceptTerms` via `requiredTrue`)

### 4d. Styles
Add to `auth.scss`: flex row, gap, purple checkbox color matching the reference's register styles.

---

## Step 5 — Cart and Cart Sidebar: Redesign

**Target files:**
- `src/app/components/cart/cart.html`
- `src/app/components/cart/cart.scss`
- `src/app/components/cart-sidebar/cart-sidebar.html`
- `src/app/components/cart-sidebar/cart-sidebar.scss`

**Changes:**

### 5a. Cart sidebar → match reference `pop-cart` drawer
- Fixed right-side slide-in panel (`transform: translateX(100%)` → `.open { translateX(0) }`)
- Dark overlay backdrop (`.drawer-overlay`)
- Header with title + close `pi pi-times` button
- Item rows: product name, platform, price (with currency), remove button
- Footer: total price + "View Full Cart" + "Continue Shopping" buttons
- Purple theme, `420px` width, z-index above content

### 5b. Full cart → match reference `full-screen-cart`
- Two-column layout on desktop: items list (left) + order summary card (right)
- Each item row: name, platform, valid/invalid badge, price, remove button
- "Foundation card" section showing `basicSite` info — if missing, show warning card with "Initialize Site Base" button navigating to `/basicSite`
- "Complete Purchase" button — disabled if `basicSite` is missing
- Prices rendered with currency pipe

---

## Verification Checklist

- [ ] `ng serve` — no compilation errors
- [ ] `/sub-category/:id` — checkboxes work, filter bar is sticky, empty product prompt wires to cart, empty category shows two-step UI
- [ ] `/basicSite` — AI generation hides site type dropdown; deleting prompt restores it; submit requires one or the other
- [ ] Menu currency selector — change to EUR/GBP, verify prices update live in sub-category + cart
- [ ] `/auth` (register tab) — submit button stays disabled until terms checkbox is checked
- [ ] Cart sidebar — slides in from right, overlay closes it, items deletable, total correct
- [ ] `/cart` — two-column layout, foundation card visible, complete purchase disabled without basic site

---

## Naming Decisions

- `CurrencyService` at `services/currencyService/currency-service.ts` (project's camelCase convention — not misspelled like the reference's `currencyServise`)
- "Site rules" checkbox links to both `/terms-of-service` AND `/privacy-policy` (both routes already exist in the project)
- `useAiMode` flag approach for basic site keeps existing form + create/update flow intact
