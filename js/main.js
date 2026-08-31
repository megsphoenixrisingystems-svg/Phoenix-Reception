/* ==========================================================================
   Phoenix Reception — shared site behavior
   Edit the CONFIG block below to point CTAs at your real booking link,
   phone number, and email once you have them.
   ========================================================================== */

const PHOENIX_CONFIG = {
  phone: "(850) 694-1657",
  phoneHref: "tel:+18506941657",
  email: "hello@phoenixrisingautomation.com",
  calendlyUrl: "https://cal.com/phoenixrisingautomation-meghan/30min",
};

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initYear();
  initDemoLinks();
  initContactForm();
});

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

// If a Calendly/Cal.com URL is configured, send "Book a Demo" buttons
// straight there instead of the contact form.
function initDemoLinks() {
  if (!PHOENIX_CONFIG.calendlyUrl) return;
  document.querySelectorAll("[data-demo-link]").forEach((el) => {
    el.setAttribute("href", PHOENIX_CONFIG.calendlyUrl);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");
  const plan = params.get("plan");

  const heading = document.getElementById("contact-heading");
  const subheading = document.getElementById("contact-subheading");
  const interestField = form.querySelector('[name="interest"]');
  const planSelect = form.querySelector('[name="plan"]');

  const copy = {
    demo: {
      h: "Book a Demo",
      s: "Tell us a bit about your business and we'll set up time to show you Phoenix Reception in action.",
    },
    talk: {
      h: "Talk to Us",
      s: "Questions about setup, scripting, or fit for your industry? Send us a note and a real person will get back to you.",
    },
    plan: {
      h: "Get Started",
      s: "You're a few details away from never missing another call. We'll follow up to finish setup.",
    },
  };

  let key = "talk";
  if (type === "demo") key = "demo";
  if (plan) key = "plan";

  if (heading && copy[key]) heading.textContent = copy[key].h;
  if (subheading && copy[key]) subheading.textContent = copy[key].s;
  if (interestField) interestField.value = type === "demo" ? "Book a Demo" : plan ? `Get Started — ${plan}` : "Talk to Us";
  if (planSelect && plan) {
    const match = Array.from(planSelect.options).find(
      (o) => o.value.toLowerCase() === plan.toLowerCase()
    );
    if (match) planSelect.value = match.value;
  }

  const status = document.getElementById("form-status");
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot — bots fill every field, humans never see this one.
    if (form.querySelector('[name="website"]').value) return;

    setStatus(status, "", false, false);
    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = "Sending…";

    try {
      const res = await fetch("contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)),
      });
      const data = await res.json().catch(() => ({ success: res.ok }));

      if (res.ok && data.success !== false) {
        form.reset();
        setStatus(status, "Thanks — we'll be in touch within one business day.", true);
      } else {
        setStatus(status, data.error || "Something went wrong. Please email us directly.", false);
      }
    } catch (err) {
      setStatus(status, "Something went wrong. Please email us directly.", false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}

function setStatus(el, message, success, show = true) {
  if (!el) return;
  el.textContent = message;
  el.classList.remove("success", "error", "show");
  if (!show) return;
  el.classList.add(success ? "success" : "error", "show");
}
