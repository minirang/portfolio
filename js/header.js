/* ============================================
   header.js — Reusable across every page.
   Usage on any page:
     1. Add  <div id="site-header-mount"></div>  where header should appear
     2. Add  <script src="js/header.js" data-active="skills"></script>
        (data-active = which nav item to highlight; optional)
   header.css is auto-injected.
   ============================================ */

(function() {
    "use strict";

    const currentScript = document.currentScript;
    const scriptSrc = currentScript ? currentScript.src : "";
    const baseURL = scriptSrc ? scriptSrc.replace(/[^\/]+\/[^\/]+$/, "") : "";

    const activeKey = currentScript?.dataset.active || "";

    function ensureCSS() {
        const exists = [...document.styleSheets].some(
            (s) => s.href && s.href.endsWith("css/header.css"),
        );
        if (exists) return;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = baseURL + "css/header.css";
        document.head.appendChild(link);
    }

    async function mount() {
        ensureCSS();

        let mountEl = document.getElementById("site-header-mount");
        if (!mountEl) {
            mountEl = document.createElement("div");
            mountEl.id = "site-header-mount";
            document.body.insertBefore(mountEl, document.body.firstChild);
        }

        try {
            const res = await fetch(baseURL + "header.html");
            if (!res.ok) throw new Error("header.html " + res.status);
            mountEl.innerHTML = await res.text();
        } catch (err) {
            console.warn("[header] fetch failed", err);
            mountEl.innerHTML = `
        <header id="siteHeader" style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem; background: var(--bg, #0a0a0a); border-bottom: 1px solid rgba(255,255,255,0.05);">
          <div style="font-weight: 700; color: var(--text, #fff); opacity: 0.5;">M</div>
          <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.85rem; color: rgba(255,255,255,0.4);">
            <span>헤더를 불러오지 못했습니다.</span>
            <button onclick="window.location.reload()" style="background: rgba(255,255,255,0.1); color: #fff; border: none; padding: 0.25rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.75rem; transition: background 0.2s;">
              다시 시도
            </button>
          </div>
        </header>
      `;
        }

        bindBehavior();
    }

    function bindBehavior() {
        const header = document.getElementById("siteHeader");
        if (!header) return;

        if (activeKey) {
            header.querySelectorAll("[data-nav]").forEach((el) => {
                if (el.dataset.nav === activeKey) el.classList.add("is-active");
            });
        }

        const onScroll = () => {
            header.classList.toggle("scrolled", window.scrollY > 8);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, {
            passive: true
        });

        const toggle = document.getElementById("siteHeaderToggle");
        const mobile = document.getElementById("siteHeaderMobile");
        if (toggle && mobile) {
            const close = () => {
                toggle.classList.remove("is-open");
                mobile.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
                document.body.style.overflow = "";
            };
            toggle.addEventListener("click", () => {
                const open = !mobile.classList.contains("is-open");
                toggle.classList.toggle("is-open", open);
                mobile.classList.toggle("is-open", open);
                toggle.setAttribute("aria-expanded", String(open));
                document.body.style.overflow = open ? "hidden" : "";
            });
            mobile
                .querySelectorAll("a")
                .forEach((a) => a.addEventListener("click", close));
            window.addEventListener("resize", () => {
                if (window.innerWidth > 768) close();
            });
        }

        header.querySelectorAll('a[href*="#"]').forEach((a) => {
            a.addEventListener("click", (e) => {
                const href = a.getAttribute("href");
                const hashIdx = href.indexOf("#");
                if (hashIdx === -1) return;
                const id = href.slice(hashIdx + 1);
                const target = document.getElementById(id);
                if (target) {
                    e.preventDefault();
                    const top = target.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({
                        top,
                        behavior: "smooth"
                    });
                    history.replaceState(null, "", "#" + id);
                }
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mount);
    } else {
        mount();
    }
})();