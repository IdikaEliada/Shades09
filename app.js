document.addEventListener("DOMContentLoaded", () => {
  // === NAV TOGGLE ===
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("open");
      navLinks.classList.toggle("active");
    });
  }

  // Side nav toggle
  const sideNav = document.getElementById("side-nav");
  const overlay = document.getElementById("side-nav-overlay");

  function closeSideNav() {
    sideNav.classList.remove("active");
    overlay.classList.remove("active");
  }

  if (navToggle && sideNav && overlay) {
    navToggle.addEventListener("click", () => {
      sideNav.classList.toggle("active");
      overlay.classList.toggle("active");
    });
    overlay.addEventListener("click", closeSideNav);
    // Optional: close on link click (mobile UX)
    sideNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeSideNav);
    });
  }

  // === HERO CAROUSEL (with images and scrolling) ===
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  let currentIndex = 0;

  function updateCarousel() {
    if (track) {
      track.style.transform = `translateX(-${currentIndex * 100}vw)`;
    }
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  if (nextBtn && prevBtn && slides.length && track) {
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    setInterval(nextSlide, 7000); // auto-slide
    updateCarousel();
  }

  // === SERVICE POPUPS ===
  const serviceCards = document.querySelectorAll(".service-card");
  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popup-title");
  const popupBody = document.getElementById("popup-body");
  const popupClose = document.getElementById("popup-close");

  serviceCards.forEach(card => {
    card.addEventListener("click", () => {
      const title = card.querySelector("h3")?.textContent || "Service";
      const desc = card.getAttribute("data-description") || "Details coming soon.";
      if (popupTitle) popupTitle.textContent = title;
      if (popupBody) popupBody.textContent = desc;
      if (popup) popup.classList.add("active");
    });
  });

  if (popupClose && popup) {
    popupClose.addEventListener("click", () => {
      popup.classList.remove("active");
    });

    popup.addEventListener("click", (e) => {
      if (e.target === popup) {
        popup.classList.remove("active");
      }
    });
  }

  // === BLOG SECTION ===
  class BlogPost {
    constructor(title, excerpt, fullText, image) {
      this.title = title;
      this.excerpt = excerpt;
      this.fullText = fullText;
      this.image = image;
    }

    renderCard(index) {
      const card = document.createElement("div");
      card.className = "blog-card";
      card.innerHTML = `
        <img src="${this.image}" alt="${this.title}">
        <div class="blog-content">
          <h3>${this.title}</h3>
          <p>${this.excerpt}</p>
          <a class="read-more" href="#" data-index="${index}">Read More</a>
        </div>
      `;
      return card;
    }
  }

  class BlogPopup {
    constructor() {
      this.popup = document.getElementById("blog-popup");
      this.title = document.getElementById("popup-title");
      this.body = document.getElementById("popup-body");
      this.image = document.getElementById("popup-image");
      this.closeBtn = document.getElementById("popup-close");

      if (this.closeBtn) {
        this.closeBtn.addEventListener("click", () => this.close());
      }
      window.addEventListener("click", (e) => {
        if (e.target === this.popup) this.close();
      });
    }

    open(post) {
      if (this.title) this.title.textContent = post.title;
      if (this.body) this.body.textContent = post.fullText;
      if (this.image) this.image.src = post.image;
      if (this.popup) this.popup.style.display = "flex";
    }

    close() {
      if (this.popup) this.popup.style.display = "none";
    }
  }

  class BlogManager {
    constructor(containerId, postsData) {
      this.container = document.getElementById(containerId);
      this.posts = postsData.map(
        data => new BlogPost(data.title, data.excerpt, data.fullText, data.image)
      );
      this.popup = new BlogPopup();

      this.renderPosts();
      this.attachEvents();
    }

    renderPosts() {
      if (!this.container) return;
      this.container.innerHTML = "";
      this.posts.forEach((post, index) => {
        const card = post.renderCard(index);
        this.container.appendChild(card);
      });
    }

    attachEvents() {
      if (!this.container) return;
      this.container.addEventListener("click", (e) => {
        if (e.target.classList.contains("read-more")) {
          e.preventDefault();
          const index = parseInt(e.target.getAttribute("data-index"), 10);
          this.popup.open(this.posts[index]);
        }
      });
    }
  }

  const blogData = [
    {
      title: "5 Tips for Efficient Solar Installations",
      excerpt: "Maximize your ROI with these proven solar setup strategies...",
      fullText: "Maximize your ROI with these proven solar setup strategies that reduce downtime, improve panel efficiency, and simplify maintenance for both commercial and residential use cases.",
      image: "https://images.unsplash.com/photo-1581091012184-e84f6a6f1b47?w=600"
    },
    {
      title: "Understanding Marine Logistics in Nigeria",
      excerpt: "Learn how marine logistics supports oil & gas and construction sectors...",
      fullText: "Learn how marine logistics supports oil & gas and construction sectors, and how Sombreiro Energy’s integrated fleet ensures timely delivery and safety compliance.",
      image: "https://images.unsplash.com/photo-1607092360316-7541e48f3d32?w=600"
    },
    {
      title: "Why EPC Services Matter in Energy Projects",
      excerpt: "From concept to commissioning, EPC makes execution seamless...",
      fullText: "From concept to commissioning, EPC makes execution seamless. Discover how we manage timelines, costs, and quality while minimizing risk in large-scale projects.",
      image: "https://images.unsplash.com/photo-1581090700227-199fa2ccf491?w=600"
    }
  ];

  new BlogManager("blog-cards", blogData);

  // === CONTACT FORM HANDLER ===
  const form = document.getElementById("contact-form");
  const responseMsg = document.getElementById("form-response");

  if (form && responseMsg) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        responseMsg.textContent = "Please fill out all fields.";
        responseMsg.style.color = "red";
        return;
      }

      if (!validateEmail(email)) {
        responseMsg.textContent = "Please enter a valid email address.";
        responseMsg.style.color = "red";
        return;
      }

      // Simulate sending the form
      responseMsg.textContent = "Sending...";
      responseMsg.style.color = "#ff9800";
      setTimeout(() => {
        responseMsg.textContent = "Your message has been sent successfully!";
        responseMsg.style.color = "green";
        form.reset();
      }, 1000);
    });
  }

  function validateEmail(email) {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  }

  // Contact Form Submission (AJAX)
  document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const data = {
          name: contactForm.name.value,
          email: contactForm.email.value,
          message: contactForm.message.value
        };
        try {
          const res = await fetch('/send-contact', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
          });
          const result = await res.json();
          alert(result.message);
          if(result.success) contactForm.reset();
        } catch (err) {
          alert('There was an error sending your message.');
        }
      });
    }

    // Animate sections on load and scroll
    function animateSections() {
      const sections = document.querySelectorAll('.animated-section');
      const trigger = window.innerHeight * 0.92;
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < trigger) {
          section.classList.add('in-view');
        }
      });
    }
    animateSections();
    window.addEventListener('scroll', animateSections);

    // Chart.js Line Graph (if present)
    const ctx = document.getElementById('aboutLineGraph');
    if (ctx && typeof Chart !== 'undefined') {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
          datasets: [
            {
              label: 'Solar Usage (kWh)',
              data: [1000, 2500, 5000, 9000, 15000, 22000, 30000],
              borderColor: '#045b62',
              backgroundColor: 'rgba(4,91,98,0.08)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#045b62',
              pointBorderColor: '#fff',
              pointRadius: 4
            },
            {
              label: 'Efficiency (%)',
              data: [60, 65, 68, 70, 73, 75, 78],
              borderColor: '#00b500',
              backgroundColor: 'rgba(0,181,0,0.08)',
              tension: 0.4,
              fill: false,
              yAxisID: 'y1',
              pointBackgroundColor: '#00b500',
              pointBorderColor: '#fff',
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true }
          },
          scales: {
            x: {
              title: { display: true, text: 'Year' }
            },
            y: {
              title: { display: true, text: 'Solar Usage (kWh)' },
              beginAtZero: true
            },
            y1: {
              position: 'right',
              title: { display: true, text: 'Efficiency (%)' },
              min: 50,
              max: 100,
              grid: { drawOnChartArea: false }
            }
          }
        }
      });
    }
  });
});
