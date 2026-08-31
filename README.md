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

## Site config

All real business info is wired in:

- **Lead email:** `hello@phoenixrisingautomation.com` (`js/main.js`, `contact.php`'s `RECIPIENT_EMAIL`, and every footer/contact link)
- **Phone:** (850) 694-1657 (`js/main.js` and every footer)
- **Booking link:** [Cal.com](https://cal.com/phoenixrisingautomation-meghan/30min) — every "Book a Demo" button opens this directly instead of the contact form
- **Domain:** `reception.phoenixrisingautomation.com` — a subdomain of the main Phoenix Rising Automation site (`robots.txt`, `sitemap.xml`)

Nothing left to swap before launch — just deploy.

## Deploying to 20i

Phoenix Reception lives on the `reception` subdomain of
`phoenixrisingautomation.com`, so it needs its own document root
separate from the main site.

1. In the 20i control panel (my.20i.com), open the hosting package for
   `phoenixrisingautomation.com` and go to **Domains → Subdomains**
   (or **Manage Websites**) and add `reception` as a subdomain — this
   creates a folder (typically `public_html/reception/`) and its own
   free SSL certificate.
2. Open **File Manager** for that subdomain folder, or connect via
   FTP/SFTP (Hosting → your package → FTP & SSH Users for credentials),
   and upload the entire contents of this repo into it — keep the
   `css/`, `js/`, and `assets/` folders intact.
3. 20i's stack includes PHP already, so `contact.php` works with no
   extra setup. If outbound mail is disabled for your package, enable
   it under **Email → Email Settings**, or contact 20i support.
4. Confirm the SSL certificate for `reception.phoenixrisingautomation.com`
   is issued under **SSL** in the control panel (20i usually provisions
   this automatically once the subdomain resolves).
5. Visit `https://reception.phoenixrisingautomation.com` and submit a
   test lead through `contact.html` to confirm mail delivery, then
   check spam folders if it doesn't arrive.

## Local preview

No build tools needed — just serve the folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Note: the contact form needs PHP to
actually send mail, so `contact.php` won't work with the Python server —
test that part after deploying, or run it through `php -S localhost:8000`
if you have PHP installed locally.
