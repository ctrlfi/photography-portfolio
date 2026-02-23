// --- DYNAMIC DAY/NIGHT THEME ---
function setTimeBasedTheme() {
  const currentHour = new Date().getHours();
  // Daytime is between 6 AM (6) and 6 PM (18)
  if (currentHour >= 6 && currentHour < 18) {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}
setTimeBasedTheme();
setInterval(setTimeBasedTheme, 60000);

// --- PROJECT DATA ---
const projects = [
  { id: 1, title: 'Urban Shadows', category: 'Street', file: 'images/DSCF3835.JPG' },
  { id: 2, title: 'Minimalist Architecture', category: 'Architecture', file: 'images/_DSF2921.JPG' },
  { id: 3, title: 'The Quiet Hour', category: 'Landscape', file: 'images/_DSF3409.jpg' },
  { id: 4, title: 'Neon Nights', category: 'Nightscape', file: 'images/_DSF3474.JPG' },
  { id: 5, title: 'Concrete Geometry', category: 'Architecture', file: 'images/_DSF3738.JPG' },
  { id: 6, title: 'Golden Details', category: 'Abstract', file: 'images/_DSF3839.JPG' },
  { id: 7, title: 'Motion Blur', category: 'Street', file: 'images/download.jpg' }
];

// --- CUSTOM DRAG CURSOR PHYSICS ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = window.innerWidth / 2;
let ringY = window.innerHeight / 2;
let speed = 0.15; // Lower is more lag/spring

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Dot follows exactly immediately
  if (cursorDot) {
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  }
});

function animateCursor() {
  // Lerp (Linear Interpolation) for the ring trailing effect
  ringX += (mouseX - ringX) * speed;
  ringY += (mouseY - ringY) * speed;

  if (cursorRing) {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
  }

  requestAnimationFrame(animateCursor);
}
animateCursor();

// Add hover states to interactive elements
function attachCursorEvents() {
  document.querySelectorAll('a, button, input, textarea, .masonry-item').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}
attachCursorEvents();

// --- MAGNETIC ELEMENTS ---
const magneticEls = document.querySelectorAll('.magnetic');
magneticEls.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    // Calculate offsets from the center of the element
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Move element slightly toward cursor
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0px, 0px)';
  });
});

// --- POPULATE MASONRY GALLERY ---
const grid = document.getElementById('masonry-grid');
if (grid) {
  projects.forEach(p => {
    const item = document.createElement('div');
    item.className = 'masonry-item';
    item.innerHTML = `
            <img src="${p.file}" alt="${p.title}" loading="lazy">
            <div class="item-overlay">
                <div>
                    <h3>${p.title}</h3>
                    <p>${p.category}</p>
                </div>
            </div>
        `;

    // Open lightbox on click
    item.addEventListener('click', () => openLightbox(p));

    grid.appendChild(item);
  });
  // Reattach custom cursor events for dynamically loaded gallery items
  attachCursorEvents();
}

// --- SCROLL ANIMATIONS (Reveal & Parallax) ---
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, observerOptions);

document.querySelectorAll('.masonry-item').forEach(item => {
  observer.observe(item);
});

// Uniform Smooth Glide Parallax
let targetScrollY = window.scrollY;
let currentScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  targetScrollY = window.scrollY;
});

function animateParallax() {
  // Smoothly interpolate the scroll position
  currentScrollY += (targetScrollY - currentScrollY) * 0.1;

  document.querySelectorAll('.masonry-item').forEach((item) => {
    if (item.classList.contains('in-view')) {
      // Apply a uniform, gentle parallax offset to make them glide together
      const offset = currentScrollY * 0.04;
      item.style.transform = `translateY(${offset}px)`;
    }
  });

  requestAnimationFrame(animateParallax);
}
animateParallax();


// --- LIGHTBOX INTEGRATION ---
const lightbox = document.getElementById('lightbox');
const lbImg = document.querySelector('.lightbox-img');
const lbClose = document.querySelector('.lightbox-close');

function openLightbox(project) {
  if (!lightbox) return;
  lbImg.src = project.file;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // Stop background scrolling
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    // Click outside the image to close
    if (e.target === lightbox) closeLightbox();
  });
}
