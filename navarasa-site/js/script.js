// ============ INITIAL LANDING ANIMATION (index.html only) ============
(function(){
  const overlay = document.getElementById('introOverlay');
  if (!overlay) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.style.overflow = 'hidden';
  const holdTime = reduced ? 150 : 1500;
  setTimeout(() => {
    overlay.classList.add('hide');
    document.body.style.overflow = '';
    setTimeout(() => { overlay.style.display = 'none'; }, reduced ? 0 : 650);
  }, holdTime);
})();


// ============ NAV (every page) ============
const topbar = document.getElementById('topbar');
if (topbar){
  window.addEventListener('scroll', () => {
    topbar.classList.toggle('scrolled', window.scrollY > 30);
  });
}

const drawer = document.getElementById('drawer');
const menuOpenBtn = document.getElementById('menuOpen');
const menuCloseBtn = document.getElementById('menuClose');
if (drawer && menuOpenBtn) menuOpenBtn.addEventListener('click', () => drawer.classList.add('open'));
if (drawer && menuCloseBtn) menuCloseBtn.addEventListener('click', () => drawer.classList.remove('open'));
if (drawer){
  document.querySelectorAll('.dl').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));
}


// ============ ABOUT — 3D TILT CARD (index.html only) ============
const aboutCard = document.getElementById('aboutCard');
const aboutTiltWrap = document.getElementById('aboutTiltWrap');
if (aboutCard && aboutTiltWrap){
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion){
    aboutTiltWrap.addEventListener('mousemove', (e) => {
      const rect = aboutTiltWrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;   // 0..1
      const y = (e.clientY - rect.top) / rect.height;    // 0..1
      const rotateY = (x - 0.5) * 20;
      const rotateX = (0.5 - y) * 16;
      aboutCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    aboutTiltWrap.addEventListener('mouseleave', () => {
      aboutCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
    // gentle touch support — tilt follows the finger while dragging
    aboutTiltWrap.addEventListener('touchmove', (e) => {
      const rect = aboutTiltWrap.getBoundingClientRect();
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left) / rect.width;
      const y = (touch.clientY - rect.top) / rect.height;
      const rotateY = (Math.min(Math.max(x, 0), 1) - 0.5) * 16;
      const rotateX = (0.5 - Math.min(Math.max(y, 0), 1)) * 12;
      aboutCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }, { passive: true });
    aboutTiltWrap.addEventListener('touchend', () => {
      aboutCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }
}


// ============ EVENTS — CALENDAR + POSTER MODAL (events.html only) ============
// Events are keyed "YYYY-M-D" so the same club can have entries across
// different months/years without collisions. Add more as dates firm up.
// Set `poster` to an assets path (e.g. 'assets/posters/garba-night.jpg') once you
// have it — the modal switches from the placeholder note to the real image automatically.
const calendarGrid = document.getElementById('calendarGrid');

if (calendarGrid){
  const calendarEvents = {
    '2026-10-3':  { title: 'Move & Chill',          cat: 'monthly', tag: 'MONTHLY', date: 'Sat, Oct 3',  poster: null },
    '2026-10-10': { title: 'Garba Night',           cat: 'october', tag: 'OCTOBER', date: 'Sat, Oct 10', poster: null },
    '2026-10-17': { title: 'Dance Reels',           cat: 'october', tag: 'OCTOBER', date: 'Sat, Oct 17', poster: null },
    '2026-10-24': { title: 'Spotlight: Nrittarang', cat: 'october', tag: 'OCTOBER', date: 'Sat, Oct 24', poster: null }
  };

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const calendarMonthLabel = document.getElementById('calendarMonth');
  const posterModal = document.getElementById('posterModal');
  const posterCard = document.getElementById('posterCard');
  const posterCloseBtn = document.getElementById('posterClose');
  const calPrevBtn = document.getElementById('calPrev');
  const calNextBtn = document.getElementById('calNext');

  // the month currently shown — starts on October 2026, where the known events live
  let calYear = 2026;
  let calMonthIndex = 9; // 0-indexed: October

  function openPoster(key){
    const ev = calendarEvents[key];
    if (!ev || !posterModal || !posterCard) return;
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
  if (posterCloseBtn) posterCloseBtn.addEventListener('click', () => posterModal.classList.remove('open'));
  if (posterModal){
    posterModal.addEventListener('click', e => { if (e.target === posterModal) posterModal.classList.remove('open'); });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && posterModal) posterModal.classList.remove('open'); });

  function renderCalendar(){
    if (calendarMonthLabel) calendarMonthLabel.textContent = `${MONTH_NAMES[calMonthIndex]} ${calYear}`;

    // clear everything after the 7 static day-of-week header spans
    while (calendarGrid.children.length > 7){
      calendarGrid.removeChild(calendarGrid.lastChild);
    }

    const firstWeekday = new Date(calYear, calMonthIndex, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(calYear, calMonthIndex + 1, 0).getDate();

    for (let i = 0; i < firstWeekday; i++){
      const blank = document.createElement('span');
      blank.className = 'cal-day empty';
      calendarGrid.appendChild(blank);
    }
    for (let day = 1; day <= daysInMonth; day++){
      const key = `${calYear}-${calMonthIndex + 1}-${day}`;
      const cell = document.createElement('div');
      const ev = calendarEvents[key];
      if (ev){
        cell.className = 'cal-day marked';
        cell.innerHTML = `
          <span class="num">${day}</span>
          <span class="dot-bar cat-${ev.cat}"></span>
          <span class="cal-cap">${ev.title}</span>`;
        cell.addEventListener('click', () => openPoster(key));
      } else {
        cell.className = 'cal-day';
        cell.innerHTML = `<span class="num">${day}</span>`;
      }
      calendarGrid.appendChild(cell);
    }
  }

  if (calPrevBtn) calPrevBtn.addEventListener('click', () => {
    calMonthIndex--;
    if (calMonthIndex < 0){ calMonthIndex = 11; calYear--; }
    renderCalendar();
  });
  if (calNextBtn) calNextBtn.addEventListener('click', () => {
    calMonthIndex++;
    if (calMonthIndex > 11){ calMonthIndex = 0; calYear++; }
    renderCalendar();
  });

  renderCalendar();
}


// ============ GALLERY — 3D CAROUSEL (gallery.html only) ============
const carouselTrack = document.getElementById('carouselTrack');

if (carouselTrack){
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const slideCount = slides.length;
  let activeSlide = 0;

  const dotsWrap = document.getElementById('carouselDots');
  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Show photo ${i + 1}`);
    dot.addEventListener('click', () => { activeSlide = i; renderCarousel(); });
    if (dotsWrap) dotsWrap.appendChild(dot);
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

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      if (slide.classList.contains('active')){
        if (lightbox && lightboxImg){
          lightboxImg.src = slide.dataset.full;
          lightboxImg.alt = slide.querySelector('img').alt;
          lightbox.classList.add('open');
        }
      } else if (slide.classList.contains('prev') || slide.classList.contains('next')){
        activeSlide = i;
        renderCarousel();
      }
    });
  });

  const carouselPrevBtn = document.getElementById('carouselPrev');
  const carouselNextBtn = document.getElementById('carouselNext');
  if (carouselPrevBtn) carouselPrevBtn.addEventListener('click', () => {
    activeSlide = (activeSlide - 1 + slideCount) % slideCount;
    renderCarousel();
  });
  if (carouselNextBtn) carouselNextBtn.addEventListener('click', () => {
    activeSlide = (activeSlide + 1) % slideCount;
    renderCarousel();
  });

  // touch swipe
  let carouselTouchX = null;
  const carouselWrap = document.querySelector('.stage-carousel-wrap');
  if (carouselWrap){
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
  }

  renderCarousel();

  if (lightbox){
    const lightboxCloseBtn = document.getElementById('lightboxClose');
    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', () => lightbox.classList.remove('open'));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') lightbox.classList.remove('open'); });
  }
}


// ============ VIDEOS — SCROLL REEL STRIP (gallery.html only) ============
// Deliberately scroll-driven (continuous) rather than click-driven like the
// photo carousel above, so it reads as a different kind of interaction.
const reelStripWrap = document.getElementById('reelStripWrap');

if (reelStripWrap){
  const reelCards = Array.from(reelStripWrap.querySelectorAll('.reel-card'));

  function updateCenterReel(){
    const wrapRect = reelStripWrap.getBoundingClientRect();
    const wrapCenter = wrapRect.left + wrapRect.width / 2;
    let closest = null;
    let closestDist = Infinity;
    reelCards.forEach(card => {
      const r = card.getBoundingClientRect();
      const cardCenter = r.left + r.width / 2;
      const dist = Math.abs(cardCenter - wrapCenter);
      if (dist < closestDist){ closestDist = dist; closest = card; }
    });
    reelCards.forEach(card => card.classList.toggle('is-center', card === closest));
  }

  let reelTicking = false;
  reelStripWrap.addEventListener('scroll', () => {
    if (!reelTicking){
      requestAnimationFrame(() => { updateCenterReel(); reelTicking = false; });
      reelTicking = true;
    }
  });
  window.addEventListener('resize', updateCenterReel);
  updateCenterReel();

  const videoModal = document.getElementById('videoModal');
  const videoModalCard = document.getElementById('videoModalCard');

  function openVideoModal(title, src){
    if (!videoModal || !videoModalCard) return;
    if (src){
      videoModalCard.innerHTML = `<video src="${src}" controls autoplay playsinline></video>`;
    } else {
      videoModalCard.innerHTML = `
        <div class="video-body">
          <h3>${title}</h3>
          <p class="video-placeholder-note">This reel is on its way — once it's edited it'll play right here. Meanwhile, check <a href="https://instagram.com/_navarasa_" target="_blank" rel="noopener">@_navarasa_</a> for clips.</p>
        </div>`;
    }
    videoModal.classList.add('open');
  }
  reelCards.forEach(card => {
    card.addEventListener('click', () => openVideoModal(card.dataset.title, card.dataset.video));
  });
  const videoModalCloseBtn = document.getElementById('videoModalClose');
  if (videoModalCloseBtn) videoModalCloseBtn.addEventListener('click', () => videoModal.classList.remove('open'));
  if (videoModal){
    videoModal.addEventListener('click', e => { if (e.target === videoModal) videoModal.classList.remove('open'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') videoModal.classList.remove('open'); });
  }
}


// ============ TEAM — DYNAMIC REVEAL + IDLE FLOAT (team.html only) ============
const polaroids = Array.from(document.querySelectorAll('.polaroid-card'));
if (polaroids.length){
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
}


// ============ BOOKING FORM -> MAILTO (booking.html only) ============
const bookingForm = document.getElementById('bookingForm');
if (bookingForm){
  bookingForm.addEventListener('submit', function(e){
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
}

// ============ ALUMNI FORM -> MAILTO (alumni.html only) ============
const alumniForm = document.getElementById('alumniForm');
if (alumniForm){
  alumniForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('alName').value;
    const year = document.getElementById('alYear').value;
    const now = document.getElementById('alNow').value;
    const subject = encodeURIComponent(`Alumni wall — ${name}`);
    const body = encodeURIComponent(`Hi Navarasa,\n\nAdd me to the alumni wall:\n\nName: ${name}\nBatch: ${year}\nNow: ${now}\n\nThanks!`);
    window.location.href = `mailto:dance@sac.iiserpune.ac.in?subject=${subject}&body=${body}`;
    document.getElementById('alumniNote').style.display = 'block';
  });
}
