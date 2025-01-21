// Function to load content into the #content div based on the URL hash
function loadContentFromHash() {
    const page = window.location.hash.substr(1) || 'home'; // Default to 'home' if no hash is provided
    fadeOutAndLoad(`${page}.html`);
}

// Function to load content via fetch API with fade effect
function fadeOutAndLoad(page) {
    const contentDiv = document.getElementById('content');

    // Apply fade-out effect
    contentDiv.classList.add('fade-out');

    setTimeout(() => {
        // Fetch the new page content after fade-out completes
        fetch(page)
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    return Promise.reject('404'); // Return 404 error if the page is not found
                }
            })
            .then(data => {
                contentDiv.innerHTML = data;
                contentDiv.classList.remove('fade-out'); // Remove fade-out class

                if (page === 'presentation.html') {
                    initializePresentation(); // Initialize presentation functionality
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                contentDiv.innerHTML = `
                    <h1>Page Not Found</h1>
                    <p>The page you are looking for does not exist. Please check the URL or go back to <a href="#home">Home</a>.</p>
                `;
                contentDiv.classList.remove('fade-out');
            });
    }, 500); // Wait for fade-out duration (0.5s)
}

// Function to initialize slideshow functionality on the presentation page
function initializePresentation() {
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');

    if (slides.length === 0) return; // Exit if no slides are found

    let currentSlide = 0;
    slides[currentSlide].classList.add('active');

    // Helper function to update the active slide
    function updateSlide(newIndex) {
        slides[currentSlide].classList.remove('active');
        currentSlide = newIndex;
        slides[currentSlide].classList.add('active');
    }

    // Button Event Listeners
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            const newIndex = (currentSlide - 1 + slides.length) % slides.length;
            updateSlide(newIndex);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const newIndex = (currentSlide + 1) % slides.length;
            updateSlide(newIndex);
        });
    }

    // Scroll Event Listener
    document.getElementById('presentation-container')?.addEventListener('wheel', (event) => {
        event.preventDefault();

        const direction = event.deltaY > 0 ? 1 : -1;
        const newIndex = (currentSlide + direction + slides.length) % slides.length;
        updateSlide(newIndex);
    });
}

// Load content on initial page load
window.onload = function () {
    loadContentFromHash();
};

// Load content when the hash changes
window.onhashchange = function () {
    loadContentFromHash();
};


document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');
    const pagination = document.getElementById('pagination');

    if (slides.length === 0) return;

    let currentSlide = 0;

    // Initialize Pagination Dots
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        pagination.appendChild(dot);
    });

    const updateSlide = (newIndex) => {
        // Remove the active class from the current slide
        slides[currentSlide].classList.remove('active');
        pagination.children[currentSlide].classList.remove('active');
    
        // Update the current slide index
        currentSlide = newIndex;
    
        // Add the active class to the new slide
        slides[currentSlide].classList.add('active');
        pagination.children[currentSlide].classList.add('active');
    };
    

    // Add Event Listeners for Buttons
    prevButton.addEventListener('click', () => {
        const newIndex = (currentSlide - 1 + slides.length) % slides.length;
        updateSlide(newIndex);
    });

    nextButton.addEventListener('click', () => {
        const newIndex = (currentSlide + 1) % slides.length;
        updateSlide(newIndex);
    });

    // Optional: Scroll Interaction
    document.getElementById('presentation-container')?.addEventListener('wheel', (event) => {
        event.preventDefault();
        const direction = event.deltaY > 0 ? 1 : -1;
        const newIndex = (currentSlide + direction + slides.length) % slides.length;
        updateSlide(newIndex);
    });

    // Initialize First Slide
    slides[currentSlide].classList.add('active');
});
