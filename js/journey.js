const wrapper = document.querySelector(".journey__wrapper");

if (window.matchMedia("(pointer: fine)").matches) {
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
        }, {
            passive: false
        },
    );
}
