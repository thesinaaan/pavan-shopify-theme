/* Pavan Steamed Puttu Podi - Production Interactive JS Script */

var selectedVariantId = null;
var isVariantAvailable = true;

document.addEventListener('DOMContentLoaded', function() {
  // 1. Initialize Variant State from initially selected variant card
  var initialCard = document.querySelector('.v-card-box.selected');
  if (initialCard) {
    selectProductVariant(initialCard);
  }

  // 2. Mobile Sticky CTA Scroll Trigger
  var heroBtn = document.getElementById('HeroAddToCartBtn');
  var stickyCta = document.getElementById('PavanStickyBar');

  if (heroBtn && stickyCta) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) {
          stickyCta.classList.add('is-visible');
        } else {
          stickyCta.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.1 });

    observer.observe(heroBtn);
  }

  // 3. Keyboard Accessibility (Escape key closes Lightbox)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closePavanLightbox();
    }
  });

  // 4. Lightbox backdrop click to close
  var modal = document.getElementById('PavanLightboxModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closePavanLightbox();
      }
    });
  }
});

function getSelectedVariantId() {
  if (selectedVariantId) return selectedVariantId;
  var hiddenInput = document.getElementById('SelectedVariantId');
  return hiddenInput ? hiddenInput.value : null;
}

// Helper to resolve selected quantity
function getSelectedQuantity() {
  var qtyInput = document.getElementById('HeroQty');
  if (qtyInput) {
    var val = parseInt(qtyInput.value, 10);
    if (val > 0) return val;
  }
  return 1;
}

// 5. Variant Selection Function
function selectProductVariant(el) {
  if (!el) return;

  var parent = el.closest('.variant-selector-grid');
  if (parent) {
    var cards = parent.querySelectorAll('.v-card-box');
    cards.forEach(function(card) { card.classList.remove('selected'); });
  }
  el.classList.add('selected');

  var variantId = el.dataset.variantId;
  var priceText = el.dataset.price;
  var mrpText = el.dataset.compareAtPrice;
  var available = el.dataset.available === 'true';

  selectedVariantId = variantId;
  isVariantAvailable = available;

  var hiddenInput = document.getElementById('SelectedVariantId');
  if (hiddenInput) {
    hiddenInput.value = variantId;
  }

  // Update Price Displays
  if (priceText) {
    var priceEls = document.querySelectorAll('#ProductPrice, #StickyBarPrice, .curr-price');
    priceEls.forEach(function(p) { p.innerText = priceText; });
  }

  // Update MRP / Compare-at Price Displays
  var mrpEls = document.querySelectorAll('#MrpPrice, .pavan-sticky-mrp');
  mrpEls.forEach(function(m) {
    if (mrpText) {
      m.innerText = mrpText;
      m.style.display = 'inline';
    } else {
      m.style.display = 'none';
    }
  });

  // Update CTA Buttons Availability State
  updateCtaButtonsState(available);
}

// Helper to toggle CTA button text and disabled attribute
function updateCtaButtonsState(available) {
  var heroBtn = document.getElementById('HeroAddToCartBtn');
  var heroBtnText = document.getElementById('HeroAddToCartBtnText');
  var stickyBtn = document.getElementById('StickyAddToCartBtn');
  var stickyBtnText = document.getElementById('StickyAddToCartBtnText');
  var buyNowBtn = document.getElementById('HeroBuyNowBtn');

  if (available) {
    if (heroBtn) {
      heroBtn.disabled = false;
      heroBtn.style.opacity = '1';
      heroBtn.style.cursor = 'pointer';
    }
    if (heroBtnText) heroBtnText.innerText = 'ADD TO CART';

    if (stickyBtn) {
      stickyBtn.disabled = false;
      stickyBtn.style.opacity = '1';
      stickyBtn.style.cursor = 'pointer';
    }
    if (stickyBtnText) stickyBtnText.innerText = 'ADD TO CART';

    if (buyNowBtn) {
      buyNowBtn.disabled = false;
      buyNowBtn.style.opacity = '1';
      buyNowBtn.style.cursor = 'pointer';
    }
  } else {
    if (heroBtn) {
      heroBtn.disabled = true;
      heroBtn.style.opacity = '0.5';
      heroBtn.style.cursor = 'not-allowed';
    }
    if (heroBtnText) heroBtnText.innerText = 'SOLD OUT';

    if (stickyBtn) {
      stickyBtn.disabled = true;
      stickyBtn.style.opacity = '0.5';
      stickyBtn.style.cursor = 'not-allowed';
    }
    if (stickyBtnText) stickyBtnText.innerText = 'SOLD OUT';

    if (buyNowBtn) {
      buyNowBtn.disabled = true;
      buyNowBtn.style.opacity = '0.5';
      buyNowBtn.style.cursor = 'not-allowed';
    }
  }
}

// 6. Real Add to Cart Function via Shopify Ajax API
function pavanAddToCart(customVariantId, customQty) {
  var vId = customVariantId || getSelectedVariantId();
  var qty = customQty || getSelectedQuantity();

  if (!vId) {
    showPavanToast('Please select a pack size.', true);
    return;
  }

  if (!isVariantAvailable) {
    showPavanToast('Selected variant is currently sold out.', true);
    return;
  }

  var heroBtn = document.getElementById('HeroAddToCartBtn');
  var stickyBtn = document.getElementById('StickyAddToCartBtn') || document.querySelector('.pavan-sticky-btn');
  if (heroBtn) heroBtn.disabled = true;
  if (stickyBtn) stickyBtn.disabled = true;

  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      items: [{
        id: parseInt(vId, 10),
        quantity: parseInt(qty, 10)
      }]
    })
  })
  .then(function(response) {
    if (!response.ok) {
      return response.json().then(function(err) {
        throw new Error(err.description || err.message || 'Unable to add item to cart.');
      });
    }
    return response.json();
  })
  .then(function(itemData) {
    return fetch('/cart.js', { headers: { 'Accept': 'application/json' } })
      .then(function(r) { return r.json(); })
      .then(function(cart) {
        var count = cart.item_count;
        var badges = document.querySelectorAll('.cart-badge');
        badges.forEach(function(b) {
          b.innerText = count;
        });

        var title = itemData.title || itemData.product_title || 'Item';
        showPavanToast('Added "' + title + '" to cart!', false);
      });
  })
  .catch(function(error) {
    console.error('Add to Cart Error:', error);
    showPavanToast(error.message || 'Error adding to cart. Please try again.', true);
  })
  .finally(function() {
    if (heroBtn && isVariantAvailable) heroBtn.disabled = false;
    if (stickyBtn && isVariantAvailable) stickyBtn.disabled = false;
  });
}

// Helper to show Toast Notification
function showPavanToast(message, isError) {
  var toast = document.getElementById('PavanToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'PavanToast';
    document.body.appendChild(toast);
  }

  var bgColor = isError ? '#991b1b' : '#1b4332';
  toast.style.cssText = 'position: fixed; top: 24px; right: 24px; z-index: 10000; background: ' + bgColor + '; color: white; padding: 14px 22px; border-radius: 12px; font-weight: 600; font-size: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 10px; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; transform: translateY(-100px); opacity: 0;';
  toast.innerHTML = '<span>' + (isError ? '✕' : '✓') + '</span> <span>' + message + '</span>';

  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  if (window.pavanToastTimeout) clearTimeout(window.pavanToastTimeout);
  window.pavanToastTimeout = setTimeout(function() {
    toast.style.transform = 'translateY(-100px)';
    toast.style.opacity = '0';
  }, 3500);
}

// 7. Language Switching Function for Recipe Steps
function toggleCookingLang(lang) {
  var stepsEN = document.getElementById('RecipeStepsEN');
  var stepsML = document.getElementById('RecipeStepsML');
  var btnEN = document.getElementById('TabBtnEN');
  var btnML = document.getElementById('TabBtnML');

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

// 8. Packaging View Toggle Function (Front / Back)
function togglePackageView(view) {
  var img = document.getElementById('PackViewImg');
  var btnFront = document.getElementById('PackBtnFront');
  var btnBack = document.getElementById('PackBtnBack');

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

// 9. Lightbox Modal Functions
function openPavanLightbox(imgSrc, caption) {
  var modal = document.getElementById('PavanLightboxModal');
  var img = document.getElementById('PavanLightboxImg');
  var cap = document.getElementById('PavanLightboxCaption');

  if (modal && img) {
    img.src = imgSrc;
    if (cap) cap.innerText = caption || 'High Resolution View';
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closePavanLightbox() {
  var modal = document.getElementById('PavanLightboxModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}
