// Select elements
const navbar = document.querySelector('.main-nav-1');
const menu = document.querySelector('.inner-nav-1');
const hamburger = document.querySelector('.hamburger');

// Track the previous scroll position
let lastScrollY = window.scrollY;

// Timeout for inactivity
let inactivityTimeout;

// Threshold for the "top area" of the viewport (e.g., 100px from the top)
const TOP_AREA_THRESHOLD = 100;

// Function to hide the navbar
const hideNavbar = () => {
  navbar.classList.add('hidden');
};

// Function to show the navbar
const showNavbar = () => {
  navbar.classList.remove('hidden');
};

// Check if the user is viewing the first section
const isInFirstSection = () => {
  const firstSection = document.querySelector('#about');
  const rect = firstSection.getBoundingClientRect();
  return rect.top <= 0 && rect.bottom >= 0; // Navbar stays visible in this range
};

// Event listener for scrolling
window.addEventListener('scroll', () => {
  // Get the current scroll position
  const currentScrollY = window.scrollY;

  // If the user is viewing the first section, keep the navbar visible
  if (isInFirstSection()) {
    showNavbar();
    return;
  }

  // Check if user is scrolling down
  if (currentScrollY > lastScrollY) {
    hideNavbar(); // Hide the navbar
  }
  // Check if user is scrolling up
  else {
    showNavbar(); // Show the navbar
  }

  // Update the last scroll position
  lastScrollY = currentScrollY;

  // Clear the previous timeout and reset it
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(hideNavbar, 5000); // 3 seconds of no scrolling
});

// Event listener for mouse movement
window.addEventListener('mousemove', (e) => {
  if (e.clientY < TOP_AREA_THRESHOLD) {
    showNavbar();
    clearTimeout(inactivityTimeout);
  } else {
    hideNavbar();
  }
});

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
  menu.classList.toggle('active'); // Toggle the menu visibility
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active'); // Close menu on link click
    });
  });

});

// Prevent navbar from hiding if the user is in the first section
window.addEventListener('resize', () => {
  if (isInFirstSection()) {
    showNavbar();
  }
});
