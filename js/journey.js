if (window.matchMedia("(pointer: fine)").matches) {
    const globalLenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    function raf(time) {
        globalLenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    const wrapper = document.querySelector(".journey__wrapper");

    if (wrapper) {
        wrapper.addEventListener("wheel", (e) => {
            const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
            const currentX = wrapper.scrollLeft;
            const canScrollRight = e.deltaY > 0 && currentX < maxScrollLeft - 1;
            const canScrollLeft = e.deltaY < 0 && currentX > 0;

            if (canScrollRight || canScrollLeft) {
                e.preventDefault();
                e.stopPropagation();

                globalLenis.stop();
                wrapper.scrollLeft += e.deltaY;
            } else {
                globalLenis.start();
            }
        }, {
            passive: false
        });

        wrapper.addEventListener("mouseleave", () => {
            globalLenis.start();
        });
    }
}