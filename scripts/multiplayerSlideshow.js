let slideIndex = 0;
let x = document.getElementsByClassName("avatar-slideshow");
let prevButton = document.getElementById("avatar-previous-button");
let nextButton = document.getElementById("avatar-next-button");

showSlide(slideIndex);

/**
 * Show a specific slide by index.
 *
 * @param {Number} index - The index of the slide to show.
 * @returns {void}
 */
function showSlide(index) {
    // Hide all slides
    for (let i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }

    // Show the slide at the given index
    x[index].style.display = "block";
}

/**
 * Show the previous slide in a slideshow.
 *
 * @param {void}
 * @returns {void}
 */
function prevSlide() {
    slideIndex--;
    if (slideIndex < 0) {
        slideIndex = x.length - 1;
    }
    showSlide(slideIndex);
}

/**
 * Show the next slide in a slideshow.
 *
 * @param {void}
 * @returns {void}
 */
function nextSlide() {
    slideIndex++;
    if (slideIndex >= x.length) {
        slideIndex = 0;
    }
    showSlide(slideIndex);
}

// Add event listeners to the buttons
prevButton.addEventListener("click", prevSlide);
nextButton.addEventListener("click", nextSlide);

/**
 * Cycles recursively through the slides 
 * in a slideshow every 10 seconds.
 *
 * @param {void}
 * @returns {void}
 */
function carousel() {
    for (let i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }

    nextSlide();

    setTimeout(carousel, 10000);
}

carousel();