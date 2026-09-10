// nav scroll state
const topbar = document.getElementById('topbar');
window.addEventListener('scroll', () => {
  topbar.classList.toggle('scrolled', window.scrollY > 30);
});

// drawer
const drawer = document.getElementById('drawer');
document.getElementById('menuOpen').addEventListener('click', () => drawer.classList.add('open'));
document.getElementById('menuClose').addEventListener('click', () => drawer.classList.remove('open'));
document.querySelectorAll('.dl').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));

// event filter
const filterBtns = document.querySelectorAll('.filter-btn');
const eventCards = document.querySelectorAll('.event-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    eventCards.forEach(c => {
      c.style.display = (f === 'all' || c.dataset.cat === f) ? '' : 'none';
    });
  });
});

// ============ 3D CAROUSEL ============
const slides = document.querySelectorAll('.carousel-slide');
const dotsContainer = document.getElementById('carouselDots');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
let currentIndex = 0;
const total = slides.length;

// Create dots
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.classList.add('carousel-dot');
  dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});
const dots = document.querySelectorAll('.carousel-dot');

function getClass(offset) {
  // offset is the relative position from current
  if (offset === 0) return 'active';
  if (offset === -1) return 'prev';
  if (offset === 1) return 'next';
  if (offset === -2) return 'far-prev';
  if (offset === 2) return 'far-next';
  return '';
}

function updateCarousel() {
  slides.forEach((slide, i) => {
    // Clear all position classes
    slide.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');

    // Calculate offset with wrapping
    let offset = i - currentIndex;
    // Wrap around for continuous feel
    if (offset > Math.floor(total / 2)) offset -= total;
    if (offset < -Math.floor(total / 2)) offset += total;

    const cls = getClass(offset);
    if (cls) {
      slide.classList.add(cls);
    }
  });

  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

function goToSlide(index) {
  currentIndex = ((index % total) + total) % total;
  updateCarousel();
}

function nextSlide() {
  goToSlide(currentIndex + 1);
}

function prevSlide() {
  goToSlide(currentIndex - 1);
}

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Click on side slides to navigate to them
slides.forEach((slide, i) => {
  slide.addEventListener('click', () => {
    if (slide.classList.contains('active')) {
      // Open lightbox on active slide click
      const fullSrc = slide.dataset.full;
      const img = slide.querySelector('img');
      lightboxImg.src = fullSrc;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
    } else {
      goToSlide(i);
    }
  });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

// Auto-advance every 5 seconds (pause on hover)
let autoPlay = setInterval(nextSlide, 5000);
const carouselWrap = document.querySelector('.stage-carousel-wrap');

carouselWrap.addEventListener('mouseenter', () => clearInterval(autoPlay));
carouselWrap.addEventListener('mouseleave', () => {
  autoPlay = setInterval(nextSlide, 5000);
});

// Touch/swipe support
let touchStartX = 0;
let touchEndX = 0;

carouselWrap.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carouselWrap.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextSlide();
    else prevSlide();
  }
}, { passive: true });

// Initialize carousel
updateCarousel();

// ============ LIGHTBOX ============
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') lightbox.classList.remove('open'); });

// booking form -> mailto
document.getElementById('bookingForm').addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('bName').value;
  const email = document.getElementById('bEmail').value;
  const date = document.getElementById('bDate').value;
  const slot = document.getElementById('bSlot').value;
  const purpose = document.getElementById('bPurpose').value;
  const subject = encodeURIComponent(`Dance room booking — ${date}`);
  const body = encodeURIComponent(
    `Hi Navarasa,\n\nI'd like to book the dance room.\n\nName: ${name}\nEmail: ${email}\nDate: ${date}\nSlot: ${slot}\nPurpose: ${purpose}\n\nThanks!`
  );
  window.location.href = `mailto:dance@sac.iiserpune.ac.in?subject=${subject}&body=${body}`;
  document.getElementById('confirmBox').classList.add('show');
});

// alumni form -> mailto
document.getElementById('alumniForm').addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('alName').value;
  const year = document.getElementById('alYear').value;
  const now = document.getElementById('alNow').value;
  const subject = encodeURIComponent(`Alumni wall — ${name}`);
  const body = encodeURIComponent(`Hi Navarasa,\n\nAdd me to the alumni wall:\n\nName: ${name}\nBatch: ${year}\nNow: ${now}\n\nThanks!`);
  window.location.href = `mailto:dance@sac.iiserpune.ac.in?subject=${subject}&body=${body}`;
  document.getElementById('alumniNote').style.display = 'block';
});

// ============ SCROLL REVEAL ANIMATIONS ============
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Apply scroll-reveal to polaroid cards
document.querySelectorAll('.polaroid-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `opacity .5s ease ${i * .06}s, transform .5s ease ${i * .06}s, box-shadow .35s ease, border-color .35s ease`;
  revealObserver.observe(card);
});
