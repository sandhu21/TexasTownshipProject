document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for navigation links
  var navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      var targetId = this.getAttribute('href');
      if (targetId === '/TexasTownshipProject/index.html') {
        window.location.href = targetId;
      } else {
        targetId = targetId.split('#')[1];
        var targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Scroll to the target section on page load
  window.addEventListener('load', function() {
    var hash = window.location.hash;
    if (hash) {
      var targetElement = document.querySelector(hash);
      if (targetElement) {
        setTimeout(function() {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }, 500);
      }
    }
  });

  // Close dropdown menu when clicking outside
  window.addEventListener('click', function(event) {
    var dropdowns = document.getElementsByClassName('dropdown-toggle');
    for (var i = 0; i < dropdowns.length; i++) {
      var dropdown = dropdowns[i];
      if (!dropdown.contains(event.target)) {
        dropdown.nextElementSibling.classList.remove('show');
      }
    }
  });
});