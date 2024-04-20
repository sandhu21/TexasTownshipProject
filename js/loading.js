// Function to hide the loading screen and show the welcome message
function showWelcomeMessage() {
  const loadingScreen = document.querySelector('.loading-screen');
  const loadingContainer = document.querySelector('.loading-container');
  const welcomeMessage = document.querySelector('.welcome-message');

  loadingContainer.style.display = 'none';
  welcomeMessage.classList.add('show');

  setTimeout(function() {
      loadingScreen.style.display = 'none';
  }, 2000);
}

// Function to simulate loading (replace with your own logic)
function simulateLoading() {
  const loadingScreen = document.querySelector('.loading-screen');
  loadingScreen.style.display = 'flex';

  setTimeout(function() {
      showWelcomeMessage();
  }, 3000);
}

// Call the simulateLoading function when the page loads
window.addEventListener('load', simulateLoading);