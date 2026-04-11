import './style.css'

// Add scrolled class to navbar on scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Intersection Observer for scroll animations
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, revealOptions);

revealElements.forEach(el => {
  revealOnScroll.observe(el);
});

// Add a slight parallax effect to the hero orbs
document.addEventListener('mousemove', (e) => {
  const orbs = document.querySelectorAll('.orb');
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  orbs.forEach((orb, index) => {
    const speed = (index + 1) * 20;
    const xPos = (x * speed);
    const yPos = (y * speed);
    orb.style.transform = `translate(${xPos}px, ${yPos}px)`;
  });
});
