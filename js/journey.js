const wrapper = document.querySelector(".journey__wrapper");

if (window.matchMedia("(pointer: fine)").matches) {
    let targetScrollLeft = wrapper.scrollLeft;
    let isAnimating = false;
    const LERP_FACTOR = 0.15;
    function animate() {
        const diff = targetScrollLeft - wrapper.scrollLeft;
        if (Math.abs(diff) > 0.5) {
            wrapper.scrollLeft += diff * LERP_FACTOR;
            requestAnimationFrame(animate);
        } else {
            wrapper.scrollLeft = targetScrollLeft;
            isAnimating = false;
        }
    }

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
                if (!isAnimating) {
                    targetScrollLeft = wrapper.scrollLeft;
                }
                targetScrollLeft += e.deltaY * 1.5;
                targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft));
                if (!isAnimating) {
                    isAnimating = true;
                    requestAnimationFrame(animate);
                }
            }
        },
        { passive: false },
    );
}
