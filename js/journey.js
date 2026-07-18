const wrapper = document.querySelector(".journey__wrapper");

wrapper.addEventListener(
    "wheel",
    (e) => {
        const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
        const currentScrollLeft = wrapper.scrollLeft;

        const canScrollRight =
            e.deltaY > 0 && currentScrollLeft < maxScrollLeft - 1;
        const canScrollLeft =
            e.deltaY < 0 && currentScrollLeft > 0;

        if (canScrollRight || canScrollLeft) {
            e.preventDefault();
            wrapper.scrollLeft += e.deltaY;
        }
    },
    { passive: false },
);

let startX;
let startY;
let startScroll;

wrapper.addEventListener(
    "touchstart",
    (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startScroll = wrapper.scrollLeft;
    },
    { passive: true },
);

wrapper.addEventListener(
    "touchmove",
    (e) => {
        const dx = startX - e.touches[0].clientX;
        const dy = startY - e.touches[0].clientY;

        if (Math.abs(dy) > Math.abs(dx)) {
            const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
            const currentScrollLeft = wrapper.scrollLeft;

            const canScrollRight =
                dy > 0 && currentScrollLeft < maxScrollLeft - 1;
            const canScrollLeft =
                dy < 0 && currentScrollLeft > 0;

            if (canScrollRight || canScrollLeft) {
                e.preventDefault();
                wrapper.scrollLeft = startScroll + dy;
            }
        }
    },
    { passive: false },
);