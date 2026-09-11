// ============ NAV ============
const topbar = document.getElementById('topbar');
window.addEventListener('scroll', () => {
  topbar.classList.toggle('scrolled', window.scrollY > 30);
});

const drawer = document.getElementById('drawer');
document.getElementById('menuOpen').addEventListener('click', () => drawer.classList.add('open'));
document.getElementById('menuClose').addEventListener('click', () => drawer.classList.remove('open'));
document.querySelectorAll('.dl').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));


// ============ EVENTS — CALENDAR + POSTER MODAL ============
// October 2026: the 1st falls on a Thursday, so the grid needs 4 leading blanks.
const CAL_LEADING_BLANKS = 4;
const CAL_DAYS_IN_MONTH = 31;

// Edit dates, titles and poster image paths here as the real schedule firms up.
// Set `poster` to an assets path (e.g. 'assets/posters/garba-night.jpg') once you have it —
// the modal will show the image instead of the placeholder note automatically.
const calendarEvents = {
  3:  { title: 'Move & Chill',          cat: 'monthly', tag: 'MONTHLY', date: 'Sat, Oct 3',  poster: null },
  10: { title: 'Garba Night',           cat: 'october', tag: 'OCTOBER', date: 'Sat, Oct 10', poster: null },
  17: { title: 'Dance Reels',           cat: 'october', tag: 'OCTOBER', date: 'Sat, Oct 17', poster: null },
  24: { title: 'Spotlight: Nrittarang', cat: 'october', tag: 'OCTOBER', date: 'Sat, Oct 24', poster: null }
};

const calendarGrid = document.getElementById('calendarGrid');
const posterModal = document.getElementById('posterModal');
const posterCard = document.getElementById('posterCard');

function openPoster(day){
  const ev = calendarEvents[day];
  if (!ev) return;
  const tagClass = ev.cat === 'october' ? 'status-october' : 'status-monthly';

  if (ev.poster){
    posterCard.innerHTML = `
      <img src="${ev.poster}" alt="${ev.title} poster">
      <div class="poster-body">
        <span class="tag ${tagClass} poster-tag">${ev.tag}</span>
        <h3>${ev.title}</h3>
        <p class="poster-date">${ev.date}</p>
      </div>`;
  } else {
    posterCard.innerHTML = `
      <div class="poster-body">
        <span class="tag ${tagClass} poster-tag">${ev.tag}</span>
        <h3>${ev.title}</h3>
        <p class="poster-date">${ev.date}</p>
        <p class="poster-placeholder-note">Poster coming soon — once it's designed it'll show up right here. Meanwhile, check <a href="https://instagram.com/_navarasa_" target="_blank" rel="noopener">@_navarasa_</a> for updates.</p>
      </div>`;
  }
  posterModal.classList.add('open');
}
document.getElementById('posterClose').addEventListener('click', () => posterModal.classList.remove('open'));
posterModal.addEventListener('click', e => { if (e.target === posterModal) posterModal.classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') posterModal.classList.remove('open'); });

// build the calendar grid (dow headers are already static markup in index.html)
for (let i = 0; i < CAL_LEADING_BLANKS; i++){
  const blank = document.createElement('span');
  blank.className = 'cal-day empty';
  calendarGrid.appendChild(blank);
}
for (let day = 1; day <= CAL_DAYS_IN_MONTH; day++){
  const cell = document.createElement('div');
  const ev = calendarEvents[day];
  if (ev){
    cell.className = 'cal-day marked';
    cell.innerHTML = `
      <span class="num">${day}</span>
      <span class="dot-bar cat-${ev.cat}"></span>
      <span class="cal-cap">${ev.title}</span>`;
    cell.addEventListener('click', () => openPoster(day));
  } else {
    cell.className = 'cal-day';
    cell.innerHTML = `<span class="num">${day}</span>`;
  }
  calendarGrid.appendChild(cell);
}


// ============ GALLERY — 3D CAROUSEL ============
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const slideCount = slides.length;
let activeSlide = 0;

const dotsWrap = document.getElementById('carouselDots');
const dots = slides.map((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'carousel-dot';
  dot.setAttribute('aria-label', `Show photo ${i + 1}`);
  dot.addEventListener('click', () => { activeSlide = i; renderCarousel(); });
  dotsWrap.appendChild(dot);
  return dot;
});

function renderCarousel(){
  slides.forEach((slide, i) => {
    let offset = i - activeSlide;
    if (offset > slideCount / 2) offset -= slideCount;
    if (offset <= -slideCount / 2) offset += slideCount;

    slide.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
    if (offset === 0) slide.classList.add('active');
    else if (offset === 1) slide.classList.add('next');
    else if (offset === -1) slide.classList.add('prev');
    else if (offset > 1) slide.classList.add('far-next');
    else slide.classList.add('far-prev');
  });
  dots.forEach((d, i) => d.classList.toggle('active', i === activeSlide));
}

slides.forEach((slide, i) => {
  slide.addEventListener('click', () => {
    if (slide.classList.contains('active')){
      lightboxImg.src = slide.dataset.full;
      lightboxImg.alt = slide.querySelector('img').alt;
      lightbox.classList.add('open');
    } else if (slide.classList.contains('prev') || slide.classList.contains('next')){
      activeSlide = i;
      renderCarousel();
    }
  });
});

document.getElementById('carouselPrev').addEventListener('click', () => {
  activeSlide = (activeSlide - 1 + slideCount) % slideCount;
  renderCarousel();
});
document.getElementById('carouselNext').addEventListener('click', () => {
  activeSlide = (activeSlide + 1) % slideCount;
  renderCarousel();
});

// touch swipe
let carouselTouchX = null;
const carouselWrap = document.querySelector('.stage-carousel-wrap');
carouselWrap.addEventListener('touchstart', e => { carouselTouchX = e.touches[0].clientX; });
carouselWrap.addEventListener('touchend', e => {
  if (carouselTouchX === null) return;
  const dx = e.changedTouches[0].clientX - carouselTouchX;
  if (Math.abs(dx) > 40){
    activeSlide = dx < 0 ? (activeSlide + 1) % slideCount : (activeSlide - 1 + slideCount) % slideCount;
    renderCarousel();
  }
  carouselTouchX = null;
});

renderCarousel();

// shared lightbox (gallery)
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') lightbox.classList.remove('open'); });


// ============ TEAM — DYNAMIC REVEAL + IDLE FLOAT ============
const polaroids = Array.from(document.querySelectorAll('.polaroid-card'));
polaroids.forEach((card, i) => {
  // stagger both the idle float and the scroll-reveal so the wall feels alive, not synced
  card.style.setProperty('--float-delay', `${(i % 6) * 0.45}s`);
  card.style.transitionDelay = `${(i % 8) * 0.06}s`;
});

if ('IntersectionObserver' in window){
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  polaroids.forEach(card => revealObserver.observe(card));
} else {
  polaroids.forEach(card => card.classList.add('in-view'));
}


// ============ BOOKING FORM -> MAILTO ============
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

// ============ ALUMNI FORM -> MAILTO ============
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
