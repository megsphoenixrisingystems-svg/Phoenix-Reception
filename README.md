# Phoenix Reception

Marketing site for **Phoenix Reception** — the AI phone answering and lead
recovery platform by Phoenix Rising Automation. Plain HTML/CSS/JS, no build
step, so it's ready to upload straight to shared hosting (built for **20i**).

## Structure

```
index.html      Landing page (hero, what it does, differentiators)
pricing.html    Starter / Growth / Pro / Multi-Location pricing
contact.html    Lead form — "Book a Demo", "Talk to Us", and per-plan "Get Started"
contact.php     Form handler, sends mail via PHP's mail() (works on 20i out of the box)
css/styles.css  Shared styles
js/main.js      Nav toggle, contact-form logic, site-wide config
assets/         Favicon / logo mark (SVG)
robots.txt, sitemap.xml
```

## Before you go live

Edit the config block at the top of **`js/main.js`**:

```js
const PHOENIX_CONFIG = {
  phone: "+1 (555) 010-2929",     // real business line
  phoneHref: "tel:+15550102929",
  email: "hello@phoenixreceptionai.com",
  calendlyUrl: "",                // paste a Calendly/Cal.com link and
                                   // "Book a Demo" buttons will jump straight there
};
```

Also replace the placeholder phone/email in the footers of `index.html`,
`pricing.html`, and `contact.html` (search for `555-010-2929` and
`hello@phoenixreceptionai.com`), and set `RECIPIENT_EMAIL` at the top of
**`contact.php`** to the inbox that should receive lead submissions.

Swap `https://www.phoenixreceptionai.com/` in `robots.txt` and
`sitemap.xml` for your real domain once it's live.

## Deploying to 20i

1. In the 20i control panel (my.20i.com), open your hosting package's
   **File Manager**, or connect via FTP/SFTP (Hosting → your package →
   FTP & SSH Users for credentials).
2. Upload the entire contents of this folder into `public_html/`
   (or your chosen document root) — keep the `css/`, `js/`, and `assets/`
   folders intact.
3. 20i's stack includes PHP already, so `contact.php` works with no
   extra setup. If outbound mail is disabled for your package, enable
   it under **Email → Email Settings**, or contact 20i support.
4. Point your domain at the hosting package (20i → Domains, or update
   the domain's nameservers if it's registered elsewhere) and add the
   free SSL certificate under **SSL** in the control panel.
5. Visit the live domain and submit a test lead through `contact.html`
   to confirm mail delivery, then check spam folders if it doesn't
   arrive.

## Local preview

No build tools needed — just serve the folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Note: the contact form needs PHP to
actually send mail, so `contact.php` won't work with the Python server —
test that part after deploying, or run it through `php -S localhost:8000`
if you have PHP installed locally.
