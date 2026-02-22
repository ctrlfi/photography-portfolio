document.addEventListener('DOMContentLoaded', () => {
  // Initialize Icons if needed (e.g. Lucide)
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* =========================================
     CAMERA SHUTTER LOADER (Carried Over)
  ========================================= */
  const loader = document.getElementById('loader');

  // Simulate loading time, then reveal the site
  setTimeout(() => {
    loader.classList.add('hidden');
    // We don't remove the DOM element immediately so the CSS transition can finish.
    setTimeout(() => {
      loader.remove();
    }, 2000); // 2 second buffer for animations
  }, 1500);

  /* =========================================
     PROJECT DATA
  ========================================= */
  const projects = [
    {
      title: "EVENTS",
      image: "images/DSCF3835.JPG",
      url: "#events",
      categories: ["VFX", "EDITING"]
    },
    {
      title: "MVMNT",
      image: "images/_DSF2921.JPG",
      url: "#mvmnt",
      categories: ["NARRATIVE", "BRANDING"]
    },
    {
      title: "COMMERCIAL",
      image: "images/_DSF3409.jpg",
      url: "#commercial",
      categories: ["PRODUCT", "LIFESTYLE"]
    },
    {
      title: "NARRATIVE",
      image: "images/_DSF3474.JPG",
      url: "#narrative",
      categories: ["SHORT FILM", "DOCUMENTARY"]
    }
  ];

  /* =========================================
     MENU TOGGLE LOGIC
  ========================================= */
  const menuToggleBtn = document.getElementById('menu-toggle');
  const menuOverlay = document.getElementById('menu-overlay');
  let menuOpen = false;

  if (menuToggleBtn && menuOverlay) {
    menuToggleBtn.addEventListener('click', () => {
      menuOpen = !menuOpen;
      if (menuOpen) {
        menuOverlay.classList.add('open');
        menuToggleBtn.innerText = 'CLOSE';
        document.body.style.overflow = 'hidden';
      } else {
        menuOverlay.classList.remove('open');
        menuToggleBtn.innerText = 'MENU';
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking a link
    menuOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        menuOverlay.classList.remove('open');
        menuToggleBtn.innerText = 'MENU';
        document.body.style.overflow = '';
      });
    });
  }

  /* =========================================
     GENERATE PROJECT GRID
  ========================================= */
  const galleryGrid = document.querySelector('.projects-grid');

  if (galleryGrid) {
    projects.forEach((proj, index) => {
      const card = document.createElement('a');
      card.href = proj.url;
      card.className = 'project-card magnetic';

      // Determine if it should be an offset card (for masonry effect)
      if (index % 2 !== 0) {
        card.classList.add('offset-card');
      }

      card.innerHTML = `
        <div class="project-image-wrapper">
          <img src="${proj.image}" alt="${proj.title}" class="project-image" loading="lazy" />
          <div class="project-noise-overlay"></div>
        </div>
        <div class="project-overlay">
          <div class="project-tags">
            ${proj.categories.map(c => `<span class="project-tag">${c}</span>`).join('')}
          </div>
          <h2 class="project-title">${proj.title}</h2>
        </div>
      `;
      galleryGrid.appendChild(card);
    });
  }

  /* =========================================
     MAGNETIC HOVER
  ========================================= */
  const magnetics = document.querySelectorAll('.magnetic');

  magnetics.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const hX = e.clientX - rect.left - rect.width / 2;
      const hY = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${hX * 0.1}px, ${hY * 0.1}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = `translate(0px, 0px)`;
    });
  });

});
