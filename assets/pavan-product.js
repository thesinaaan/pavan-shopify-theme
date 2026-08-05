/* Pavan Steamed Puttu Podi - Production Interactive JS Script */

document.addEventListener('DOMContentLoaded', function() {
  // 1. Mobile Sticky CTA Scroll Trigger
  const heroBtn = document.getElementById('HeroAddToCartBtn');
  const stickyCta = document.getElementById('PavanStickyMobileCta') || document.getElementById('PavanStickyBar') || document.getElementById('PavanStickyCTA');

  if (heroBtn && stickyCta) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) {
          stickyCta.classList.add('visible');
          stickyCta.classList.add('is-visible');
        } else {
          stickyCta.classList.remove('visible');
          stickyCta.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.1 });

    observer.observe(heroBtn);
  }

  // 2. Keyboard Accessibility (Escape key closes Lightbox)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closePavanLightbox();
    }
  });

  // 3. Lightbox backdrop click to close
  const modal = document.getElementById('PavanLightboxModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closePavanLightbox();
      }
    });
  }
});

// 4. Variant Selection Function
function selectProductVariant(el, priceText, mrpText) {
  var parent = el.closest('.variant-options, .variant-selector-grid') || el.parentElement;
  if (parent) {
    var cards = parent.querySelectorAll('.variant-card, .v-card-box');
    cards.forEach(function(card) { card.classList.remove('selected'); });
  }
  el.classList.add('selected');

  var priceEls = document.querySelectorAll('#ProductPrice, #HeroPrice, #StickyPrice, #StickyBarPrice, #PavanCurrentPrice, .curr-price');
  priceEls.forEach(function(p) { p.innerText = priceText; });

  var mrpEls = document.querySelectorAll('#MrpPrice, #HeroMrpPrice, #PavanComparePrice, .mrp-price');
  mrpEls.forEach(function(m) { m.innerText = mrpText; });
}

// 5. Language Switching Function for Recipe Steps
function toggleCookingLang(lang) {
  const stepsEN = document.getElementById('RecipeStepsEN');
  const stepsML = document.getElementById('RecipeStepsML');
  const btnEN = document.getElementById('TabBtnEN');
  const btnML = document.getElementById('TabBtnML');

  if (lang === 'ml') {
    if (stepsEN) stepsEN.style.display = 'none';
    if (stepsML) stepsML.style.display = 'flex';
    if (btnEN) {
      btnEN.style.background = 'transparent';
      btnEN.style.color = 'var(--text-main)';
    }
    if (btnML) {
      btnML.style.background = 'var(--primary)';
      btnML.style.color = 'white';
    }
  } else {
    if (stepsEN) stepsEN.style.display = 'flex';
    if (stepsML) stepsML.style.display = 'none';
    if (btnEN) {
      btnEN.style.background = 'var(--primary)';
      btnEN.style.color = 'white';
    }
    if (btnML) {
      btnML.style.background = 'transparent';
      btnML.style.color = 'var(--text-main)';
    }
  }
}

// 6. Packaging View Toggle Function (Front / Back)
function togglePackageView(view) {
  const img = document.getElementById('PackViewImg');
  const btnFront = document.getElementById('PackBtnFront');
  const btnBack = document.getElementById('PackBtnBack');

  if (!img) return;

  if (view === 'back') {
    img.src = img.src.replace('puttu-pack-front.jpg', 'puttu-pack-back.jpg');
    if (btnFront) {
      btnFront.style.background = 'white';
      btnFront.style.borderColor = 'var(--border-color)';
      btnFront.style.color = 'var(--text-muted)';
    }
    if (btnBack) {
      btnBack.style.background = 'var(--primary-light)';
      btnBack.style.borderColor = 'var(--primary)';
      btnBack.style.color = 'var(--primary-dark)';
    }
  } else {
    img.src = img.src.replace('puttu-pack-back.jpg', 'puttu-pack-front.jpg');
    if (btnFront) {
      btnFront.style.background = 'var(--primary-light)';
      btnFront.style.borderColor = 'var(--primary)';
      btnFront.style.color = 'var(--primary-dark)';
    }
    if (btnBack) {
      btnBack.style.background = 'white';
      btnBack.style.borderColor = 'var(--border-color)';
      btnBack.style.color = 'var(--text-muted)';
    }
  }
}

// 7. Lightbox Modal Functions
function openPavanLightbox(imgSrc, caption) {
  const modal = document.getElementById('PavanLightboxModal');
  const img = document.getElementById('PavanLightboxImg');
  const cap = document.getElementById('PavanLightboxCaption');

  if (modal && img) {
    img.src = imgSrc;
    if (cap) cap.innerText = caption || 'High Resolution View';
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closePavanLightbox() {
  const modal = document.getElementById('PavanLightboxModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// 8. Add to Cart Toast Notification
function pavanAddToCart(productName) {
  var name = productName || 'Pavan Steamed Puttu Podi';
  
  // Update header cart badge counter
  var badges = document.querySelectorAll('.cart-badge');
  badges.forEach(function(b) {
    var count = parseInt(b.innerText || '0') + 1;
    b.innerText = count;
  });

  // Display Toast Notification
  var toast = document.getElementById('PavanToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'PavanToast';
    toast.style.cssText = 'position: fixed; top: 24px; right: 24px; z-index: 10000; background: #1b4332; color: white; padding: 14px 22px; border-radius: 12px; font-weight: 600; font-size: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 10px; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); transform: translateY(-100px); opacity: 0;';
    toast.innerHTML = '<span>✓</span> <span id="PavanToastMsg"></span>';
    document.body.appendChild(toast);
  }

  var msg = document.getElementById('PavanToastMsg');
  if (msg) msg.innerText = 'Added "' + name + '" to cart!';

  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  setTimeout(function() {
    toast.style.transform = 'translateY(-100px)';
    toast.style.opacity = '0';
  }, 3000);
}
