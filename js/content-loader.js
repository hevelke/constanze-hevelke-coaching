/**
 * Content Loader — lädt Inhalte aus /content/data.json
 * und befüllt alle Seitenelemente dynamisch.
 */
(async function () {
  const ICONS = {
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    star:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  };

  try {
    const res = await fetch('/content/data.json');
    if (!res.ok) return;
    const d = await res.json();

    // ── Meta ───────────────────────────────────────────────
    if (d.meta) {
      if (d.meta.siteTitle) document.title = d.meta.siteTitle;
      const desc = document.querySelector('meta[name="description"]');
      if (desc && d.meta.metaDescription) desc.content = d.meta.metaDescription;
    }

    // ── Markenname ─────────────────────────────────────────
    if (d.brand?.name) {
      setText('nav-logo', d.brand.name);
      setText('footer-logo', d.brand.name);
    }

    // ── Hero ───────────────────────────────────────────────
    if (d.hero) {
      setText('hero-subtitle', d.hero.subtitle);
      setText('hero-title-text', d.hero.title);
      setText('hero-title-em', d.hero.titleEm);
      setText('hero-text', d.hero.text);
      setLink('hero-btn1', d.hero.button1Url, d.hero.button1Label);
      setLink('hero-btn2', d.hero.button2Url, d.hero.button2Label);
    }

    // ── Über mich ──────────────────────────────────────────
    if (d.about) {
      if (d.about.photo) setAttr('about-photo', 'src', d.about.photo);
      if (d.about.photoAlt) setAttr('about-photo', 'alt', d.about.photoAlt);
      setText('about-lead', d.about.lead);
      const body = document.getElementById('about-body');
      if (body && d.about.paragraphs?.length) {
        body.innerHTML = '';
        d.about.paragraphs.forEach(p => {
          const el = document.createElement('p');
          el.textContent = p;
          body.appendChild(el);
        });
      }
    }

    // ── Angebote ───────────────────────────────────────────
    if (d.angebote) {
      setText('angebote-title', d.angebote.title);
      setText('angebote-subtitle', d.angebote.subtitle);
      const grid = document.getElementById('angebote-grid');
      if (grid && d.angebote.packages?.length) {
        grid.innerHTML = d.angebote.packages.map(pkg => {
          const icon = ICONS[pkg.icon] || ICONS.star;
          const badge = pkg.badge ? `<div class="angebot-badge">${esc(pkg.badge)}</div>` : '';
          const features = (pkg.features || []).map(f => `<li>${esc(f)}</li>`).join('');
          return `
            <div class="angebot-card${pkg.featured ? ' featured' : ''}">
              ${badge}
              <div class="angebot-icon">${icon}</div>
              <h3>${esc(pkg.name)}</h3>
              <p>${esc(pkg.description)}</p>
              <ul class="angebot-features">${features}</ul>
              <div class="angebot-price">${esc(pkg.price)}</div>
              <a href="${esc(pkg.ctaUrl || '#kontakt')}" class="btn-text" style="margin-top:1.5rem;display:inline-block">${esc(pkg.ctaLabel || 'Erstgespräch vereinbaren')} &rarr;</a>
            </div>`;
        }).join('');
      }
    }

    // ── Methoden ───────────────────────────────────────────
    if (d.methoden) {
      setText('methoden-title', d.methoden.title);
      setText('methoden-lead', d.methoden.lead);
      if (d.methoden.photo) setAttr('methoden-photo', 'src', d.methoden.photo);
      if (d.methoden.photoAlt) setAttr('methoden-photo', 'alt', d.methoden.photoAlt);
      const list = document.getElementById('methoden-list');
      if (list && d.methoden.items?.length) {
        list.innerHTML = d.methoden.items.map(item => `
          <div class="methode-item">
            <div class="methode-number">${esc(item.number)}</div>
            <div>
              <h4>${esc(item.title)}</h4>
              <p>${esc(item.description)}</p>
            </div>
          </div>`).join('');
      }
    }

    // ── Zitat ──────────────────────────────────────────────
    if (d.quote) {
      setText('quote-text', d.quote.text);
      setText('quote-author', d.quote.author);
    }

    // ── Instagram ──────────────────────────────────────────
    if (d.instagram) {
      setText('instagram-subtitle', d.instagram.subtitle);
      const grid = document.getElementById('instagram-grid');
      if (grid && d.instagram.posts?.length) {
        grid.innerHTML = d.instagram.posts.map((post, i) => `
          <a href="${esc(post.url)}" target="_blank" rel="noopener" class="instagram-item">
            <img src="${esc(post.image)}" alt="Instagram Post ${i + 1}">
          </a>`).join('');
      }
      const profileLink = document.getElementById('instagram-profile-link');
      if (profileLink) {
        if (d.instagram.profileUrl) profileLink.href = d.instagram.profileUrl;
        if (d.instagram.handle) profileLink.textContent = d.instagram.handle;
      }
    }

    // ── Kontakt ────────────────────────────────────────────
    if (d.contact) {
      setText('contact-title', d.contact.title);
      setText('contact-text', d.contact.text);
      if (d.contact.email) {
        const el = document.getElementById('contact-email-link');
        if (el) { el.href = `mailto:${d.contact.email}`; el.textContent = d.contact.email; }
      }
      if (d.contact.phone) {
        const el = document.getElementById('contact-phone-link');
        if (el) { el.href = `tel:${d.contact.phone.replace(/\s/g, '')}`; el.textContent = d.contact.phone; }
      }
      setText('contact-location', d.contact.location);
      if (d.contact.instagramUrl) setAttr('contact-instagram-link', 'href', d.contact.instagramUrl);
    }

    // ── Footer ─────────────────────────────────────────────
    if (d.footer) {
      setText('footer-description', d.footer.description);
      setText('footer-copyright', d.footer.copyright);
    }

  } catch (e) {
    // Stille Fehlerbehandlung — statische HTML-Inhalte bleiben sichtbar
    console.warn('[content-loader]', e);
  }

  function setText(id, val) {
    if (val == null) return;
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function setAttr(id, attr, val) {
    if (val == null) return;
    const el = document.getElementById(id);
    if (el) el[attr] = val;
  }

  function setLink(id, href, text) {
    const el = document.getElementById(id);
    if (!el) return;
    if (href != null) el.href = href;
    if (text != null) el.textContent = text;
  }

  function esc(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
