document.addEventListener("DOMContentLoaded", () => {
    const target = document.getElementById("typingTarget");
    const plainText = "things that challenge &amp; impact.";
    const normalLen = "things that ".length;
    target.innerHTML = "";
    let i = 0;

    function type() {
        if (i <= plainText.length) {
            if (i <= normalLen) {
                target.textContent = plainText.slice(0, i);
            } else {
                target.innerHTML =
                    plainText.slice(0, normalLen) +
                    "<em>" +
                    plainText.slice(normalLen, i) +
                    "</em>";
            }
            i++;
            const delay = 35 + Math.random() * 40;
            setTimeout(type, delay);
        }
    }
    setTimeout(type, 200);
});