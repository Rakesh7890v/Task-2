document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const opaqueRing = document.querySelector('#Opaque_Ring');
    const navItems = document.querySelectorAll('.nav');
    let currentSlideIndex = 0;
    let isTransitioning = false;

    const dotPositions = [
        10,       
        140,     
        280,     
        410,     
        530,
        670,     
        810      
    ];

    const ringPath = opaqueRing.getTotalLength();
    opaqueRing.style.strokeDasharray = `${ringPath} ${ringPath}`;

    function incrementOffset(targetOffset) {
        let currentOffset = parseFloat(opaqueRing.style.strokeDashoffset) || ringPath;
        const step = 5;

        function animate() {
            if (currentOffset > targetOffset) {
                currentOffset = currentOffset - step;
                opaqueRing.style.strokeDashoffset = currentOffset;
                requestAnimationFrame(animate);
            } else {
                opaqueRing.style.strokeDashoffset = targetOffset;
            }
        }
        animate();
    }

    function decrementOffset(targetOffset) {
        let currentOffset = parseFloat(opaqueRing.style.strokeDashoffset) || ringPath;
        const step = 5;

        function animate() {
            if (currentOffset < targetOffset) {
                currentOffset = currentOffset + step;
                opaqueRing.style.strokeDashoffset = currentOffset;
                requestAnimationFrame(animate);
            } else {
                opaqueRing.style.strokeDashoffset = targetOffset;
            }
        }
        animate();
    }

    function updateRing() {
        const targetOffset = ringPath - dotPositions[currentSlideIndex];
        incrementOffset(targetOffset);
    }

    function deleteRing() {
        const targetOffset = ringPath - dotPositions[currentSlideIndex];
        decrementOffset(targetOffset);
    }

    function animateCurrentSlide() {
        const leftSide = slides[currentSlideIndex].querySelector('.left-side');
        const rightSide = slides[currentSlideIndex].querySelector('.right-side');
        const nav = navItems[currentSlideIndex]
        nav.classList.add('on');
        if(window.innerWidth > 950) {
            leftSide.classList.add('animate');
            rightSide.classList.add('animate');
        }
    }

    function resetAnimation(slideIndex) {
        const leftSide = slides[slideIndex].querySelector('.left-side');
        const rightSide = slides[slideIndex].querySelector('.right-side');
        const nav = navItems[currentSlideIndex]
        nav.classList.remove('on');
        leftSide.classList.remove('animate');
        rightSide.classList.remove('animate');
    }

    function showNextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;

        resetAnimation(currentSlideIndex);
        slides[currentSlideIndex].classList.remove('current-slide');
        slides[currentSlideIndex].classList.remove('prev');
        slides[currentSlideIndex].classList.remove('animate2');
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        if(window.innerWidth > 950) {
            slides[currentSlideIndex].classList.add('current-slide');
        } else if (window.innerWidth < 950) {
            slides[currentSlideIndex].classList.add('animate2');
        }

        animateCurrentSlide();
        updateRing();

        setTimeout(function() {
            isTransitioning = false;
        }, 500);
    }

    function showPreviousSlide() {
        if (isTransitioning) return;
        isTransitioning = true;

        resetAnimation(currentSlideIndex);
        slides[currentSlideIndex].classList.remove('current-slide');
        slides[currentSlideIndex].classList.remove('animate2');
        slides[currentSlideIndex].classList.remove('prev');
        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        if(window.innerWidth > 950) {
            slides[currentSlideIndex].classList.add('current-slide');
        } else if (window.innerWidth < 950) {
            slides[currentSlideIndex].classList.add('prev');
        }

        animateCurrentSlide();
        deleteRing();

        setTimeout(function() {
            isTransitioning = false;
        }, 500);
    }

    window.addEventListener('wheel', function(event) {
        if (event.deltaY > 0 || event.deltaX > 0) {
            showNextSlide();
        } else {
            showPreviousSlide();
        }
    });

    animateCurrentSlide();
    updateRing();
});
