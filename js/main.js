(function() {
    "use strict";

    function initAOS() {
        if (!window.AOS) return;
        window.AOS.init({
            duration: 700,
            easing: "ease-out-cubic",
            once: true,
            offset: 60,
        });
    }

    function initHeroParticles() {
        const container = document.getElementById("heroParticles");
        if (!container) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const colors = [
            "oklch(0.78 0.12 200 / 0.7)",
            "oklch(0.78 0.12 280 / 0.5)",
            "oklch(0.80 0.13 60 / 0.4)",
            "rgba(255,255,255,0.4)",
        ];
        for (let i = 0; i < 28; i++) {
            const p = document.createElement("div");
            p.className = "hero__particle";
            const size = Math.random() * 3 + 1.5;
            p.style.cssText = [
                `--s:${size}px`,
                `--c:${colors[Math.floor(Math.random() * colors.length)]}`,
                `--d:${(Math.random() * 12 + 10).toFixed(1)}s`,
                `--delay:${(Math.random() * 14).toFixed(1)}s`,
                `--dx:${(Math.random() * 160 - 80).toFixed(0)}px`,
                `--o:${(Math.random() * 0.4 + 0.2).toFixed(2)}`,
                `left:${(Math.random() * 100).toFixed(1)}%`,
            ].join(";");
            container.appendChild(p);
        }
    }

    function syncCarouselBtn(paused) {
        const pi = document.getElementById("carouselPauseIcon");
        const pl = document.getElementById("carouselPlayIcon");
        if (pi) pi.style.display = paused ? "none" : "";
        if (pl) pl.style.display = paused ? "" : "none";
    }

    function initMotionToggle() {
        const btn = document.getElementById("motionToggle");
        if (!btn) return;
        const pauseIcon = document.getElementById("motionPauseIcon");
        const playIcon = document.getElementById("motionPlayIcon");
        const label = document.getElementById("motionLabel");
        let paused = false;
        btn.addEventListener("click", () => {
            paused = !paused;
            document.body.dataset.anim = paused ? "paused" : "";
            if (pauseIcon) pauseIcon.style.display = paused ? "none" : "";
            if (playIcon) playIcon.style.display = paused ? "" : "none";
            if (label) label.textContent = paused ? "재생" : "정지";
            const carousel = document.getElementById("ghCarousel");
            if (carousel) carousel.classList.toggle("is-paused", paused);
            syncCarouselBtn(paused);
            if (paused) window._carouselPausedByMotion = true;
            else {
                window._carouselPausedByMotion = false;
            }
        });
    }

    function initSkillTilt() {
        const isMobile =
            window.matchMedia("(pointer: coarse)").matches || // 터치스크린
            window.matchMedia("(hover: none)").matches || // hover 불가 기기
            window.innerWidth <= 768;
        if (isMobile) return;
        document.querySelectorAll(".skill-card").forEach((card) => {
            let raf = null;

            card.addEventListener("mouseenter", () => {
                card.style.transition = "border-color 0.3s, box-shadow 0.3s";
            });

            card.addEventListener("mousemove", (e) => {
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                if (raf) cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    const rx = ((0.5 - py) * 24).toFixed(2);
                    const ry = ((px - 0.5) * 24).toFixed(2);
                    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
                    card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
                    card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
                });
            });

            card.addEventListener("mouseleave", () => {
                if (raf) cancelAnimationFrame(raf);
                card.style.transition =
                    "transform 0.6s cubic-bezier(0.2,0.8,0.2,1), border-color 0.3s, box-shadow 0.3s";
                card.style.transform =
                    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
                setTimeout(() => {
                    card.style.transition = "";
                    card.style.transform = "";
                }, 600);
            });
        });
    }

    function initSkillBars() {
        const bars = document.querySelectorAll(".skill-card__bar-fill");
        if (!("IntersectionObserver" in window)) {
            bars.forEach(
                (b) => (b.style.transform = `scaleX(${b.dataset.level || 0.7})`),
            );
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    el.style.transition = "transform 1.1s cubic-bezier(0.2,0.8,0.2,1)";
                    el.style.transform = `scaleX(${parseFloat(el.dataset.level || "0.7")})`;
                    io.unobserve(el);
                });
            }, {
                threshold: 0.4
            },
        );
        bars.forEach((b) => {
            b.style.transform = "scaleX(0)";
            io.observe(b);
        });
    }

    function tryImages(imgEl, candidates, onLoad) {
        let idx = 0;
        (function next() {
            if (idx >= candidates.length) return;
            const src = candidates[idx++];
            const probe = new Image();
            probe.onload = () => {
                imgEl.src = src;
                imgEl.classList.add("is-loaded");
                if (onLoad) onLoad();
            };
            probe.onerror = next;
            probe.src = src;
        })();
    }

    function initImageLoader() {
        const avatarImg = document.getElementById("heroAvatarImg");
        if (avatarImg) {
            avatarImg.src = "images/minirang.svg";
            avatarImg.classList.add("is-loaded");
        }

        document
            .querySelectorAll(".skill-card__icon[data-skill]")
            .forEach((iconEl) => {
                const skill = iconEl.dataset.skill;
                const img = iconEl.querySelector("img");
                if (!img) return;

                const skillCaseMap = {
                    cpp: "CPP",
                    css: "CSS",
                    go: "Go",
                    html: "HTML",
                    javascript: "JavaScript",
                    node: "Node",
                    powershell: "PowerShell",
                    python: "Python",
                    swift: "Swift",
                    typescript: "TypeScript",
                };

                const correctName = skillCaseMap[skill.toLowerCase()] || skill;

                img.src = `images/skills/${correctName}.svg`;
                img.classList.add("is-loaded");
            });

        const ghAv = document.querySelector(".contact__github-avatar");
        if (ghAv) {
            ghAv.onload = () => ghAv.classList.add("is-loaded");
            if (ghAv.complete && ghAv.naturalWidth) ghAv.classList.add("is-loaded");
        }
    }
    // Carousel
    let _carouselTimer = null;
    let _carouselPaused = false;
    let _slides = [];
    let _current = 0;

    function initCarousel() {
        const carousel = document.getElementById("ghCarousel");
        if (!carousel) return;
        const exts = ["png", "jpg", "webp", "jpeg"];
        const candidates = [];
        for (let i = 1; i <= 20; i++) {
            exts.forEach((e) => {
                candidates.push(`/images/projects/${String(i).padStart(2, "0")}.${e}`);
                candidates.push(`/images/projects/project-${i}.${e}`);
            });
        }
        const unique = [...new Set(candidates)];
        let checked = 0,
            found = [];

        function afterProbe() {
            if (++checked < unique.length) return;
            found.sort((a, b) => a.idx - b.idx);
            found.length ?
                buildImages(
                    carousel,
                    found.map((f) => f.src),
                ) :
                buildPlaceholder(carousel);
        }
        if (!unique.length) {
            buildPlaceholder(carousel);
            return;
        }
        unique.forEach((src, idx) => {
            const img = new Image();
            img.onload = () => {
                found.push({
                    src,
                    idx
                });
                afterProbe();
            };
            img.onerror = afterProbe;
            img.src = src;
        });
    }

    function buildImages(carousel, srcs) {
        carousel.innerHTML = "";
        srcs.forEach((src, i) => {
            const s = document.createElement("div");
            s.className = "carousel__slide" + (i === 0 ? " is-active" : "");
            s.style.backgroundImage = `url(${src})`;
            carousel.appendChild(s);
        });
        setupControls(carousel);
    }

    function buildPlaceholder(carousel) {
        carousel.innerHTML = "";
        setupControls(carousel);
    }

    function setupControls(carousel) {
        _slides = Array.from(carousel.querySelectorAll(".carousel__slide"));
        _current = 0;
        const dotsEl = document.getElementById("carouselDots");
        if (dotsEl) {
            dotsEl.innerHTML = "";
            _slides.forEach((_, i) => {
                const dot = document.createElement("button");
                dot.className = "carousel__dot" + (i === 0 ? " is-active" : "");
                dot.setAttribute("aria-label", "Slide " + (i + 1));
                dot.addEventListener("click", () => goTo(i));
                dotsEl.appendChild(dot);
            });
        }

        function goTo(idx) {
            _slides[_current].classList.remove("is-active");
            const dots = dotsEl ? dotsEl.querySelectorAll(".carousel__dot") : [];
            if (dots[_current]) dots[_current].classList.remove("is-active");
            _current = (idx + _slides.length) % _slides.length;
            _slides[_current].classList.add("is-active");
            if (dots[_current]) dots[_current].classList.add("is-active");
        }

        function start() {
            stop();
            _carouselTimer = setInterval(() => {
                if (!_carouselPaused && document.body.dataset.anim !== "paused")
                    goTo(_current + 1);
            }, 4000);
        }

        function stop() {
            if (_carouselTimer) clearInterval(_carouselTimer);
        }
        document.getElementById("carouselNext")?.addEventListener("click", () => {
            goTo(_current + 1);
            start();
        });
        document.getElementById("carouselPrev")?.addEventListener("click", () => {
            goTo(_current - 1);
            start();
        });
        document
            .getElementById("carouselPlayPause")
            ?.addEventListener("click", () => {
                _carouselPaused = !_carouselPaused;
                carousel.classList.toggle("is-paused", _carouselPaused);
                _carouselPaused ? stop() : start();
                syncCarouselBtn(_carouselPaused);
            });
        start();
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((a) => {
            if (a.closest(".site-header")) return;
            a.addEventListener("click", (e) => {
                const id = a.getAttribute("href").slice(1);
                const target = id && document.getElementById(id);
                if (!target) return;
                e.preventDefault();
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - 80,
                    behavior: "smooth",
                });
            });
        });
    }

    // GitHub stats
    const GH_CACHE_KEY = "ghstats:cache:v1";
    const GH_BLOCK_KEY = "ghstats:block:v1";
    const GH_TTL = 1800000;

    function ghReadCache(user) {
        try {
            const c = JSON.parse(localStorage.getItem(GH_CACHE_KEY) || "null");
            return c && c.user === user && Date.now() - c.t < GH_TTL ? c.data : null;
        } catch {
            return null;
        }
    }

    function ghWriteCache(user, data) {
        try {
            localStorage.setItem(
                GH_CACHE_KEY,
                JSON.stringify({
                    user,
                    t: Date.now(),
                    data
                }),
            );
        } catch {}
    }

    function ghIsBlocked() {
        try {
            const {
                until
            } = JSON.parse(localStorage.getItem(GH_BLOCK_KEY) || "{}");
            return until > Date.now() ? until : 0;
        } catch {
            return 0;
        }
    }

    function ghSetBlocked(ts) {
        try {
            localStorage.setItem(GH_BLOCK_KEY, JSON.stringify({
                until: ts
            }));
        } catch {}
    }

    function showGhEmpty(title, msg, ghUser) {
        const el = document.getElementById("ghEmpty");
        if (!el) return;
        el.style.display = "";
        const t = document.getElementById("ghEmptyTitle");
        const m = document.getElementById("ghEmptyMsg");
        const b = document.getElementById("ghEmptyBtn");
        if (t) t.textContent = title;
        if (m) m.textContent = msg;
        if (b && ghUser && ghUser !== "minirang") {
            b.href = `https://github.com/${ghUser}`;
            b.innerHTML = `github.com/${ghUser} 바로가기 <span aria-hidden="true">↗</span>`;
        }
    }

    function initGitHubStats() {
        const grid = document.querySelector(".ghstats__grid");
        if (!grid) return;
        const user = grid.dataset.ghUser;
        const status = document.querySelector('[data-stat="status"]');
        const dot = document.querySelector(".ghstats__dot");
        if (!user) {
            if (status)
                status.textContent = "GitHub 통계는 이 계정에 대해 제공되지 않습니다.";
            return;
        }

        const fmt = (n) =>
            typeof n !== "number" ?
            n :
            n >= 10000 ?
            (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" :
            n.toLocaleString();
        const setStat = (key, val) => {
            const el = grid.querySelector(`[data-stat="${key}"]`);
            if (el) {
                el.textContent = fmt(val);
                el.classList.remove("is-loading");
            }
        };
        const showCached = (data, label) => {
            setStat("repos", data.repos);
            setStat("stars", data.stars);
            setStat("issues", data.issues);
            setStat("prs", data.prs);
            if (status) status.textContent = label;
        };
        const showError = (msg, title) => {
            if (dot) dot.classList.add("is-error");
            if (status) status.textContent = msg;
            showGhEmpty(title || "API 오류", msg, user);
        };

        grid
            .querySelectorAll(".ghstat-card__value")
            .forEach((el) => el.classList.add("is-loading"));

        const cached = ghReadCache(user);
        if (cached) {
            showCached(cached, `캐시됨 · github.com/${user}`);
            return;
        }

        const blockedUntil = ghIsBlocked();
        if (blockedUntil) {
            const mins = Math.ceil((blockedUntil - Date.now()) / 60000);
            showError(
                `Rate limit 중 · 약 ${mins}분 후 재시도`,
                "Rate limit 중이에요",
            );
            try {
                const c = JSON.parse(localStorage.getItem(GH_CACHE_KEY) || "null");
                if (c && c.user === user) showCached(c.data, "마지막 캐시 값");
            } catch {}
            return;
        }

        fetch("https://api.github.com/rate_limit")
            .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
            .then((rl) => {
                const core = rl?.resources?.core?.remaining ?? 0;
                const search = rl?.resources?.search?.remaining ?? 0;
                const reset = (rl?.resources?.core?.reset ?? 0) * 1000;
                if (core < 8 || search < 2) {
                    ghSetBlocked(reset || Date.now() + 3600000);
                    const mins = reset ?
                        Math.max(1, Math.ceil((reset - Date.now()) / 60000)) :
                        60;
                    showError(`API 잔량 부족 · 약 ${mins}분 후 복구`, "API 한도 초과");
                    return;
                }
                return runFetches(user).then((data) => {
                    ghWriteCache(user, data);
                    showCached(data, `실시간 · github.com/${user}`);
                });
            })
            .catch((err) => {
                if (err === 403 || err === 429) {
                    ghSetBlocked(Date.now() + 3600000);
                    showError(
                        "Rate limited · 1시간 후 자동 복구",
                        "Rate limit에 걸렸어요",
                    );
                } else showError("GitHub API 응답 없음", "API에 연결할 수 없어요");
                console.warn("[ghstats]", err);
            });
    }

    async function ghFetchJSON(url) {
        const r = await fetch(url);
        if (r.status === 403 || r.status === 429) throw r.status;
        if (!r.ok) throw r.status;
        return r.json();
    }
    async function runFetches(user) {
        const profile = await ghFetchJSON(
            `https://api.github.com/users/${encodeURIComponent(user)}`,
        );
        const repos = await fetchAllRepos(user);
        const issues = await ghFetchJSON(
            `https://api.github.com/search/issues?q=${encodeURIComponent("author:" + user + " type:issue")}&per_page=1`,
        );
        const prs = await ghFetchJSON(
            `https://api.github.com/search/issues?q=${encodeURIComponent("author:" + user + " type:pr")}&per_page=1`,
        );
        return {
            repos: profile.public_repos || 0,
            stars: repos.reduce((s, r) => s + (r.stargazers_count || 0), 0),
            issues: issues.total_count || 0,
            prs: prs.total_count || 0,
        };
    }
    async function fetchAllRepos(user) {
        const all = [];
        for (let p = 1; p <= 3; p++) {
            const b = await ghFetchJSON(
                `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&type=owner&page=${p}`,
            );
            all.push(...b);
            if (b.length < 100) break;
        }
        return all;
    }

    function ready(fn) {
        if (document.readyState === "loading")
            document.addEventListener("DOMContentLoaded", fn);
        else fn();
    }

    ready(() => {
        initAOS();
        initHeroParticles();
        initMotionToggle();
        initSkillTilt();
        initSkillBars();
        initImageLoader();
        initCarousel();
        initLogoMarquee();
        initSmoothScroll();
        initGitHubStats();
    });

    /* ---- Logo Marquee ---- */
    function initLogoMarquee() {
        const wrap = document.getElementById("logoMarqueeWrap");
        const track = document.getElementById("logoTrack");
        if (!wrap || !track) return;

        const exts = ["png", "jpg", "webp", "svg"];
        const names = [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
        ];

        const candidates = [];
        names.forEach((n) => {
            exts.forEach((e) => candidates.push(`images/logos/${n}.${e}`));
        });

        const unique = [...new Set(candidates)];
        let found = [];
        let checked = 0;

        if (!unique.length) {
            wrap.classList.add("is-hidden");
            return;
        }

        unique.forEach((src) => {
            const img = new Image();
            img.onload = () => {
                found.push({
                    src,
                    order: unique.indexOf(src)
                });
                checked++;
                if (checked === unique.length) done();
            };
            img.onerror = () => {
                checked++;
                if (checked === unique.length) done();
            };
            img.src = src;
        });

        function done() {
            found.sort((a, b) => a.order - b.order);
            if (!found.length) {
                wrap.classList.add("is-hidden");
                return;
            }

            // build items × 2 for seamless loop
            const allSrcs = [...found, ...found];
            track.innerHTML = "";
            allSrcs.forEach((f) => {
                const item = document.createElement("div");
                item.className = "logo-marquee__item";
                const img = document.createElement("img");
                img.src = f.src;
                img.alt = "";
                img.loading = "lazy";
                item.appendChild(img);
                track.appendChild(item);
            });
        }
    }
})();