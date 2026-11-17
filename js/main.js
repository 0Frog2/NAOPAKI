/* NAOPAKI — site behaviour. No libraries, no build step. */
(function () {
  "use strict";

  const projects = window.NAOPAKI_PROJECTS || [];
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = (n, l = 2) => String(n).padStart(l, "0");

  /* ---------- counts & year ---------- */
  $("#count-hero").textContent = pad(projects.length, 3);
  $("#count-work").textContent = "[" + pad(projects.length) + "]";
  $("#year").textContent = new Date().getFullYear();

  /* ---------- endless marquee ----------
     One "half" is filled with the phrase until it is wider than the screen,
     then the half is duplicated; the track slides exactly one half and loops. */
  const track = $(".marquee__track");
  function buildMarquee() {
    const text = track.dataset.text;
    track.innerHTML = "";
    const half = document.createElement("div");
    half.style.display = "flex";
    track.appendChild(half);
    do {
      const s = document.createElement("span");
      s.textContent = text;
      half.appendChild(s);
    } while (half.scrollWidth < window.innerWidth + 200 && half.children.length < 50);
    track.appendChild(half.cloneNode(true));
    track.style.setProperty("--marquee-time", (half.scrollWidth / 60) + "s"); // ~60px per second at any width
  }
  buildMarquee();
  let mqTimer;
  window.addEventListener("resize", () => { clearTimeout(mqTimer); mqTimer = setTimeout(buildMarquee, 200); });

  /* ---------- build work list ---------- */
  const list = $("#work-list");
  list.innerHTML = projects.map((p, i) => `
    <li class="work__item" data-type="${p.type}">
      <a href="#work/${p.slug}" data-index="${i}">
        <img class="work__thumb" src="${p.cover}" alt="" loading="lazy">
        <span class="work__num">${pad(i + 1)}</span>
        <span class="work__title">${p.title}</span>
        <span class="work__type">${p.type}</span>
        <span class="work__year">${p.year}</span>
        <span class="work__arrow">→</span>
      </a>
    </li>`).join("");

  /* ---------- filter & view toggles ---------- */
  $$("[data-filter]").forEach(btn => btn.addEventListener("click", () => {
    $$("[data-filter]").forEach(b => b.classList.toggle("is-on", b === btn));
    const f = btn.dataset.filter;
    $$(".work__item", list).forEach(li => li.classList.toggle("is-hidden", f !== "ALL" && li.dataset.type !== f));
  }));
  const setView = v => {
    list.dataset.view = v;
    $$("[data-view]").forEach(b => b.classList.toggle("is-on", b.dataset.view === v));
  };
  $$("[data-view]").forEach(btn => btn.addEventListener("click", () => setView(btn.dataset.view)));

  /* ---------- cursor-following preview (list view, mouse only) ---------- */
  const preview = $("#hover-preview");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer) {
    let x = 0, y = 0, tx = 0, ty = 0, raf = null;
    const loop = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      preview.style.left = x + "px"; preview.style.top = y + "px";
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : null;
    };
    list.addEventListener("mousemove", e => {
      tx = e.clientX + 120; ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    $$(".work__item a", list).forEach(a => {
      a.addEventListener("mouseenter", () => {
        if (list.dataset.view !== "list") return;
        preview.src = projects[a.dataset.index].cover;
        preview.classList.add("is-on");
      });
      a.addEventListener("mouseleave", () => preview.classList.remove("is-on"));
    });
  }

  /* ---------- project view ---------- */
  const view = $("#project");
  const scroller = $("#project-scroll");
  let current = -1;
  let lastFocus = null;

  function mediaHTML(m) {
    if (m.type === "image") {
      return `<figure style="margin:0"><img src="${m.src}" alt="${m.alt || ""}" loading="lazy"></figure>`;
    }
    if (m.type === "youtube") {
      return `<div class="embed"><iframe src="https://www.youtube-nocookie.com/embed/${m.id}?rel=0&modestbranding=1&color=white"
        title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe></div>`;
    }
    if (m.type === "vimeo") {
      return `<div class="embed"><iframe src="https://player.vimeo.com/video/${m.id}?color=EEEDE7&title=0&byline=0&portrait=0&dnt=1"
        title="Video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
    }
    if (m.type === "video") {
      return `<div class="embed"><video src="${m.src}" ${m.poster ? `poster="${m.poster}"` : ""} controls playsinline preload="metadata"></video></div>`;
    }
    return "";
  }

  function render(i) {
    const p = projects[i];
    current = i;
    document.title = p.title.toUpperCase() + " — NAOPAKI";
    $("#project-index").textContent = pad(i + 1) + " / " + pad(projects.length);
    $("#project-title").textContent = p.title;
    $("#project-meta").innerHTML = `<span>${p.type}</span><span>${p.year}</span>${p.line ? `<span>${p.line}</span>` : ""}`;
    const media = $("#project-media");
    media.innerHTML = p.media.map(mediaHTML).join("");
    // tall photos sit side by side in pairs; a tall photo without a partner is centred
    const imgs = $$("img", media);
    Promise.all(imgs.map(img => img.complete && img.naturalWidth ? Promise.resolve()
      : new Promise(r => { img.addEventListener("load", r, { once: true }); img.addEventListener("error", r, { once: true }); })))
      .then(() => {
        if (current !== i) return;
        let run = [];
        const flush = () => { if (run.length % 2) run[run.length - 1].classList.replace("is-portrait", "is-solo"); run = []; };
        [...media.children].forEach(el => {
          const img = el.querySelector("img");
          if (img) img.classList.add("is-loaded");
          if (img && img.naturalHeight > img.naturalWidth) { el.classList.add("is-portrait"); run.push(el); }
          else flush();
        });
        flush();
      });
    const next = projects[(i + 1) % projects.length];
    $("#project-next").href = "#work/" + next.slug;
    $("#project-next-title").textContent = next.title;
    scroller.scrollTop = 0;
  }

  function open(i) {
    if (!view.classList.contains("is-open")) lastFocus = document.activeElement;
    render(i);
    view.hidden = false;
    document.body.classList.add("is-locked");
    requestAnimationFrame(() => requestAnimationFrame(() => view.classList.add("is-open")));
    view.focus({ preventScroll: true });
  }

  function close() {
    if (view.hidden) return;
    view.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    $$("video, iframe", view).forEach(el => el.tagName === "VIDEO" ? el.pause() : (el.src = "about:blank"));
    document.title = "NAOPAKI — Visual Works";
    current = -1;
    setTimeout(() => { if (current === -1) view.hidden = true; }, 600);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  /* hash routing: #work/slug opens a project, so links are shareable */
  function route() {
    const m = location.hash.match(/^#work\/(.+)$/);
    if (m) {
      const i = projects.findIndex(p => p.slug === m[1]);
      if (i > -1) return open(i);
    }
    close();
  }
  window.addEventListener("hashchange", route);
  route();

  const goto = i => { location.hash = "work/" + projects[(i + projects.length) % projects.length].slug; };
  $("[data-close]", view).addEventListener("click", () => {
    history.pushState("", document.title, location.pathname + location.search + "#work");
    close();
  });
  $$("[data-step]", view).forEach(b => b.addEventListener("click", () => goto(current + Number(b.dataset.step))));

  document.addEventListener("keydown", e => {
    if (current === -1) return;
    if (e.key === "Escape") $("[data-close]", view).click();
    if (e.key === "ArrowRight") goto(current + 1);
    if (e.key === "ArrowLeft") goto(current - 1);
  });
})();
