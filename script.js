document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()

  // Theme Toggle
  const themeToggle = document.getElementById("theme-toggle")
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)")

  // Check for saved theme preference or use device preference
  const savedTheme = localStorage.getItem("theme")

  if (savedTheme === "dark" || (!savedTheme && prefersDarkScheme.matches)) {
    document.body.classList.add("dark-theme")
    themeToggle.checked = true
  }

  themeToggle.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark-theme")
      localStorage.setItem("theme", "dark")
    } else {
      document.body.classList.remove("dark-theme")
      localStorage.setItem("theme", "light")
    }
  })

  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const mobileNav = document.querySelector(".mobile-nav")

  mobileMenuBtn.addEventListener("click", function () {
    mobileNav.classList.toggle("active")

    // Change icon
    const icon = this.querySelector("i")
    if (mobileNav.classList.contains("active")) {
      icon.classList.remove("fa-bars")
      icon.classList.add("fa-times")
    } else {
      icon.classList.remove("fa-times")
      icon.classList.add("fa-bars")
    }
  })

  // Smooth Scrolling for Navigation Links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        // Close mobile menu if open
        mobileNav.classList.remove("active")
        const icon = mobileMenuBtn.querySelector("i")
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")

        // Scroll to target
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: "smooth",
        })
      }
    })
  })

  // Animated Counters
  function animateCounters() {
    const counters = document.querySelectorAll(".counter")
    const speed = 200 // Lower is faster

    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target")
      let count = 0

      const updateCount = () => {
        const increment = target / speed

        if (count < target) {
          count += increment
          counter.innerText = Math.floor(count)
          setTimeout(updateCount, 1)
        } else {
          counter.innerText = target
        }
      }

      updateCount()
    })
  }

  // Intersection Observer for Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains("stats")) {
          animateCounters()
        }
        entry.target.classList.add("fade-in")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".stats, .service-card, .about-feature, .gallery-item").forEach((el) => {
    observer.observe(el)
  })

  // Portfolio Tabs
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons and contents
      tabBtns.forEach((b) => b.classList.remove("active"))
      tabContents.forEach((c) => c.classList.remove("active"))

      // Add active class to clicked button and corresponding content
      btn.classList.add("active")
      const category = btn.getAttribute("data-category")
      document.getElementById(`${category}-content`).classList.add("active")
    })
  })

  // Generate Gallery Items
  function generateGalleryItems() {
    const categories = ["windows", "doors", "boats"]
    const itemsPerCategory = 6

    categories.forEach((category) => {
      const gallery = document.querySelector(`#${category}-content .gallery`)

      for (let i = 1; i <= itemsPerCategory; i++) {
        const item = document.createElement("div")
        item.className = "gallery-item"
        item.setAttribute("data-index", i - 1)
        item.setAttribute("data-category", category)

        item.innerHTML = `
          <div class="gallery-image">
            <img src="https://placehold.co/400x300/e2e8f0/1e293b?text=${category.charAt(0).toUpperCase() + category.slice(1)}+${i}" alt="${category} project ${i}">
            <div class="gallery-overlay">
              <i class="fas fa-eye gallery-icon"></i>
            </div>
          </div>
          <div class="gallery-caption">
            <h4>${category.charAt(0).toUpperCase() + category.slice(1)} Project ${i}</h4>
            <p>Professional installation with premium materials</p>
          </div>
        `

        gallery.appendChild(item)

        // Add click event for lightbox
        item.addEventListener("click", () => {
          openLightbox(category, i - 1)
        })
      }
    })
  }

  generateGalleryItems()

  // Lightbox Functionality
  const lightbox = document.getElementById("lightbox")
  const lightboxImage = document.querySelector(".lightbox-image")
  const lightboxClose = document.querySelector(".lightbox-close")
  const lightboxPrev = document.querySelector(".lightbox-prev")
  const lightboxNext = document.querySelector(".lightbox-next")
  const lightboxDots = document.querySelector(".lightbox-dots")

  let currentCategory = ""
  let currentIndex = 0
  let totalImages = 0

  function openLightbox(category, index) {
    currentCategory = category
    currentIndex = index
    totalImages = document.querySelectorAll(`#${category}-content .gallery-item`).length

    updateLightboxImage()
    createLightboxDots()

    lightbox.classList.add("active")
    document.body.style.overflow = "hidden" // Prevent scrolling
  }

  function closeLightbox() {
    lightbox.classList.remove("active")
    document.body.style.overflow = "" // Re-enable scrolling
  }

  function updateLightboxImage() {
    lightboxImage.src = `https://placehold.co/800x600/e2e8f0/1e293b?text=${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}+${currentIndex + 1}`
    lightboxImage.alt = `${currentCategory} project ${currentIndex + 1}`

    // Update dots
    const dots = document.querySelectorAll(".lightbox-dot")
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex)
    })
  }

  function createLightboxDots() {
    lightboxDots.innerHTML = ""

    for (let i = 0; i < totalImages; i++) {
      const dot = document.createElement("div")
      dot.className = `lightbox-dot ${i === currentIndex ? "active" : ""}`
      dot.addEventListener("click", () => {
        currentIndex = i
        updateLightboxImage()
      })
      lightboxDots.appendChild(dot)
    }
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + totalImages) % totalImages
    updateLightboxImage()
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % totalImages
    updateLightboxImage()
  }

  // Lightbox event listeners
  lightboxClose.addEventListener("click", closeLightbox)
  lightboxPrev.addEventListener("click", prevImage)
  lightboxNext.addEventListener("click", nextImage)

  // Close lightbox when clicking outside the image
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox()
    }
  })

  // Keyboard navigation for lightbox
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return

    if (e.key === "Escape") closeLightbox()
    if (e.key === "ArrowLeft") prevImage()
    if (e.key === "ArrowRight") nextImage()
  })

  // Form Validation and Submission
  const contactForm = document.getElementById("contact-form")
  const formProgress = document.querySelector(".form-progress")
  const progressFill = document.querySelector(".progress-fill")
  const progressPercentage = document.querySelector(".progress-percentage")
  const btnText = document.querySelector(".btn-text")
  const btnLoading = document.querySelector(".btn-loading")

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Validate form
    const name = document.getElementById("name")
    const email = document.getElementById("email")
    const phone = document.getElementById("phone")
    const service = document.getElementById("service")

    let isValid = true

    // Simple validation
    if (!name.value.trim()) {
      document.getElementById("name-error").textContent = "Name is required"
      isValid = false
    } else {
      document.getElementById("name-error").textContent = ""
    }

    if (!email.value.trim()) {
      document.getElementById("email-error").textContent = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
      document.getElementById("email-error").textContent = "Email is invalid"
      isValid = false
    } else {
      document.getElementById("email-error").textContent = ""
    }

    if (!phone.value.trim()) {
      document.getElementById("phone-error").textContent = "Phone is required"
      isValid = false
    } else {
      document.getElementById("phone-error").textContent = ""
    }

    if (!service.value) {
      document.getElementById("service-error").textContent = "Please select a service"
      isValid = false
    } else {
      document.getElementById("service-error").textContent = ""
    }

    if (!isValid) return

    // Show progress
    formProgress.classList.remove("hidden")
    btnText.classList.add("hidden")
    btnLoading.classList.remove("hidden")

    // Simulate form submission with progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      progressFill.style.width = `${progress}%`
      progressPercentage.textContent = `${progress}%`

      if (progress >= 100) {
        clearInterval(interval)

        // Simulate completion
        setTimeout(() => {
          alert("Thank you for your inquiry! We'll get back to you within 24 hours.")
          contactForm.reset()
          formProgress.classList.add("hidden")
          btnText.classList.remove("hidden")
          btnLoading.classList.add("hidden")
          progressFill.style.width = "0%"
        }, 500)
      }
    }, 200)
  })
})
