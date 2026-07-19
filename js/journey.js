const wrapper = document.querySelector(".journey__wrapper");

if (window.matchMedia("(pointer: fine)").matches) {
    let currentX = 0;
    
    wrapper.style.overflowX = "hidden";
    if (wrapper.firstElementChild) {
        wrapper.firstElementChild.style.transition = "transform 0.18s ease-out";
    }

    wrapper.addEventListener(
        "wheel",
        (e) => {
            const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
            
            const canScrollRight = e.deltaY > 0 && currentX < maxScrollLeft - 1;
            const canScrollLeft = e.deltaY < 0 && currentX > 0;
            
            if (canScrollRight || canScrollLeft) {
                e.preventDefault();
                
                currentX += e.deltaY;
                currentX = Math.max(0, Math.min(currentX, maxScrollLeft));
                
                if (wrapper.firstElementChild) {
                    wrapper.firstElementChild.style.transform = `translateX(${-currentX}px)`;
                }
            }
        },
        { passive: false },
    );
}
