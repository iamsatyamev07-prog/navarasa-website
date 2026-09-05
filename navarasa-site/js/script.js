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

// lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
document.querySelectorAll('#galleryGrid img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.dataset.full;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
  });
});
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
