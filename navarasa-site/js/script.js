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
      cell.style.setProperty('--d', day); // drives the cascade-in delay
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


// ============ VIDEOS — SCROLL REEL STRIP ============
const reelStripWrap = document.getElementById('reelStripWrap');

if (reelStripWrap){
  const reelCards = Array.from(reelStripWrap.querySelectorAll('.reel-card'));
  const reelPrevBtn = document.getElementById('reelPrev');
  const reelNextBtn = document.getElementById('reelNext');

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

  // Arrow navigation — steps to the previous/next reel (wraps around).
  // If the strip overflows it scrolls the target card to the middle; if all
  // cards already fit on screen (e.g. only a few reels on desktop) there is
  // nothing to scroll, so the highlighted "centre" card simply moves.
  function currentReelIndex(){
    const i = reelCards.findIndex(c => c.classList.contains('is-center'));
    return i < 0 ? 0 : i;
  }
  function goToReel(i){
    const n = reelCards.length;
    if (!n) return;
    i = (i + n) % n;
    const card = reelCards[i];
    if (reelStripWrap.scrollWidth > reelStripWrap.clientWidth + 1){
      const target = card.offsetLeft - (reelStripWrap.clientWidth - card.offsetWidth) / 2;
      reelStripWrap.scrollTo({ left: target, behavior: 'smooth' });
    }
    reelCards.forEach(c => c.classList.toggle('is-center', c === card));
  }
  if (reelPrevBtn) reelPrevBtn.addEventListener('click', () => goToReel(currentReelIndex() - 1));
  if (reelNextBtn) reelNextBtn.addEventListener('click', () => goToReel(currentReelIndex() + 1));

  // Desktop Cursor Click & Drag Moving Equipment
  let isDragging = false;
  let startX, scrollLeftPos;
  let hasDragged = false;

  reelStripWrap.addEventListener('mousedown', (e) => {
    isDragging = true;
    hasDragged = false;
    reelStripWrap.classList.add('grabbing');
    startX = e.pageX - reelStripWrap.offsetLeft;
    scrollLeftPos = reelStripWrap.scrollLeft;
  });
  reelStripWrap.addEventListener('mouseleave', () => {
    isDragging = false;
    reelStripWrap.classList.remove('grabbing');
  });
  reelStripWrap.addEventListener('mouseup', () => {
    isDragging = false;
    reelStripWrap.classList.remove('grabbing');
  });
  reelStripWrap.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - reelStripWrap.offsetLeft;
    const walk = (x - startX) * 1.6;
    if (Math.abs(walk) > 5) hasDragged = true;
    reelStripWrap.scrollLeft = scrollLeftPos - walk;
  });

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
    card.addEventListener('click', (e) => {
      if (hasDragged) return; // ignore click if mouse was dragging
      openVideoModal(card.dataset.title, card.dataset.video);
    });
  });
  const videoModalCloseBtn = document.getElementById('videoModalClose');
  const closeVideoModal = () => { videoModal.classList.remove('open'); videoModalCard.innerHTML = ''; };
  if (videoModalCloseBtn) videoModalCloseBtn.addEventListener('click', closeVideoModal);
  if (videoModal){
    videoModal.addEventListener('click', e => { if (e.target === videoModal) closeVideoModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideoModal(); });
  }
}

// ============ SCROLL SPY FOR SINGLE PAGE NAV ============
(function(){
  const sections = document.querySelectorAll('section[id], header[id]');
  const desktopLinks = document.querySelectorAll('.nav-links a');
  const drawerLinks = document.querySelectorAll('.drawer nav a');

  function highlightNav(){
    let current = 'top';
    const scrollPos = window.scrollY + 200;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height){
        current = sec.getAttribute('id');
      }
    });

    desktopLinks.forEach(a => {
      const href = a.getAttribute('href');
      if (href === `#${current}` || (href === 'index.html' && current === 'top')){
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });

    drawerLinks.forEach(a => {
      const href = a.getAttribute('href');
      if (href === `#${current}` || (href === 'index.html' && current === 'top')){
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav);
  highlightNav();
})();


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

// ============ DYNAMIC HEADING SCROLL REVEAL ============
(function(){
  const headings = document.querySelectorAll('.head-row h2, .section h2');
  if (headings.length){
    if ('IntersectionObserver' in window){
      const headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting){
            entry.target.classList.add('heading-in-view');
          }
        });
      }, { threshold: 0.15 });
      headings.forEach(h => headingObserver.observe(h));
    } else {
      headings.forEach(h => h.classList.add('heading-in-view'));
    }
  }
})();


// ============ PER-SECTION DYNAMIC EFFECTS ============
// Each section from "What we do" to "Previous members" has its own signature motion (see css/style.css).
(function(){
  document.documentElement.classList.add('fx');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (a, b) => a + Math.random() * (b - a);

  // --- scroll trigger: adds .sec-in when a section enters the viewport ---
  const ids = ['movement','events','gallery','videos','booking','team','achievements','alumni'];
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
  if ('IntersectionObserver' in window){
    const secObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('sec-in');
          secObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    sections.forEach(sec => secObserver.observe(sec));
  } else {
    sections.forEach(sec => sec.classList.add('sec-in'));
  }

  // --- 1. What we do: cursor spotlight + icon stroke-draw ---
  document.querySelectorAll('#movement .tile').forEach(tile => {
    tile.querySelectorAll('.ic path').forEach(path => path.setAttribute('pathLength', '1'));
    tile.addEventListener('mousemove', (e) => {
      const r = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      tile.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // --- 5. Book the room: music-visualiser bars behind the section ---
  const booking = document.getElementById('booking');
  if (booking){
    const eq = document.createElement('div');
    eq.className = 'eq-bars';
    eq.setAttribute('aria-hidden', 'true');
    const barCount = window.innerWidth < 640 ? 18 : 34;
    for (let i = 0; i < barCount; i++){
      const bar = document.createElement('i');
      bar.style.setProperty('--h', rand(0.35, 1).toFixed(2));
      bar.style.setProperty('--t', rand(0.7, 1.7).toFixed(2) + 's');
      bar.style.setProperty('--d', (-rand(0, 2)).toFixed(2) + 's');
      eq.appendChild(bar);
    }
    booking.appendChild(eq);
  }

  // --- 6. Team: camera-flash stagger + cursor-driven 3D tilt with glare ---
  document.querySelectorAll('.polaroid-card').forEach((card, i) => {
    card.style.setProperty('--flash-delay', (0.35 + (i % 8) * 0.06) + 's');
    if (reduced) return;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', ((x - 0.5) * 14).toFixed(2) + 'deg');
      card.style.setProperty('--rx', ((0.5 - y) * 12).toFixed(2) + 'deg');
      card.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
      card.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });

  // --- 7. Achievements: rising gold sparkles ---
  const achBox = document.querySelector('#achievements .alumni-box');
  if (achBox){
    const layer = document.createElement('div');
    layer.className = 'fx-layer';
    layer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 20; i++){
      const sp = document.createElement('span');
      sp.className = 'sparkle';
      sp.style.setProperty('--x', rand(3, 96).toFixed(1) + '%');
      sp.style.setProperty('--s', rand(10, 20).toFixed(1) + 'px');
      sp.style.setProperty('--t', rand(5, 9).toFixed(1) + 's');
      sp.style.setProperty('--d', (-rand(0, 9)).toFixed(1) + 's');
      layer.appendChild(sp);
    }
    achBox.prepend(layer);
  }

  // --- 8. Previous members: echo rings rippling outward ---
  const alBox = document.querySelector('#alumni .alumni-box');
  if (alBox){
    const layer = document.createElement('div');
    layer.className = 'fx-layer';
    layer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 3; i++){
      const ring = document.createElement('span');
      ring.className = 'echo-ring';
      ring.style.setProperty('--d', (-i * 2.5) + 's');
      layer.appendChild(ring);
    }
    alBox.prepend(layer);
  }
})();
