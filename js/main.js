// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
  
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
// Function to handle mouse move event on a business card
function handleMouseMove(event) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const offsetX = (mouseX - centerX) / (rect.width / 2);
  const offsetY = (mouseY - centerY) / (rect.height / 2);
  const rotateX = -10 * offsetY;
  const rotateY = 10 * offsetX;
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
}

// Function to handle mouse leave event on a business card
function handleMouseLeave(event) {
  const card = event.currentTarget;
  card.style.transform = 'none';
}

// Add event listeners to business cards
const businessCards = document.querySelectorAll('.business-card');
businessCards.forEach(card => {
  card.addEventListener('mousemove', handleMouseMove);
  card.addEventListener('mouseleave', handleMouseLeave);
});