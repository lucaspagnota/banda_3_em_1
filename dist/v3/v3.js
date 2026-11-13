/* BANDA 3 EM 1 — V3 (teste)
 * Animações extras por cima do site da V1. Não altera textos, dados nem a agenda:
 * espera o React montar a página e só acrescenta efeitos visuais. */
"use strict";
(() => {
  const html = document.documentElement;
  const calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* Com <base href="../">, links "#secao" apontariam para o site principal.
   * Aqui eles rolam dentro da própria V3. */
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[href^='#']");
    if (!a || e.defaultPrevented) return;
    const id = a.getAttribute("href").slice(1);
    const alvo = id ? document.getElementById(id) : null;
    if (!id) return;
    e.preventDefault();
    if (alvo) alvo.scrollIntoView({ behavior: calmo ? "auto" : "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: calmo ? "auto" : "smooth" });
    history.replaceState(null, "", location.pathname + location.search + "#" + id);
  });

  /* ---------- Pré-carregamento ---------- */
  function preloader() {
    const fim = () => {
      html.classList.remove("v3-loading");
      html.classList.add("v3-ready");
    };
    let vista = false;
    try { vista = sessionStorage.getItem("v3-intro") === "1"; } catch (_) {}
    if (calmo || vista) return fim();
    try { sessionStorage.setItem("v3-intro", "1"); } catch (_) {}

    const nome = "BANDA 3 EM 1";
    const el = document.createElement("div");
    el.id = "v3-loader";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML =
      '<div class="v3-loader-in"><img src="assets/LOGO BRANCA (NOVA).png" alt="">' +
      '<div class="v3-loader-name">' +
      [...nome].map((c, i) => `<span style="animation-delay:${i * 45}ms">${c === " " ? "&nbsp;" : c}</span>`).join("") +
      '</div><div class="v3-loader-bar"><i></i></div><div class="v3-loader-count">000</div></div>';
    document.body.appendChild(el);

    const bar = $(".v3-loader-bar", el);
    const count = $(".v3-loader-count", el);
    const inicio = performance.now();
    const minimo = 1500;
    let carregou = document.readyState === "complete";
    window.addEventListener("load", () => (carregou = true), { once: true });
    setTimeout(() => (carregou = true), 4000); // nunca prende o visitante

    const passo = (t) => {
      const tempo = t - inicio;
      const alvo = carregou ? 1 : 0.9;
      const p = Math.min(alvo, tempo / minimo);
      bar.style.setProperty("--p", p.toFixed(3));
      count.textContent = String(Math.round(p * 100)).padStart(3, "0");
      if (p >= 1) {
        el.classList.add("is-done");
        setTimeout(fim, 250);
        setTimeout(() => el.remove(), 1300);
        return;
      }
      requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }

  /* ---------- Título do topo: letra por letra ---------- */
  function heroTitle() {
    const linha = $("#hero-titulo > span:first-child");
    if (!linha || linha.dataset.v3) return;
    linha.dataset.v3 = "1";
    const texto = linha.textContent;
    linha.textContent = "";
    linha.style.perspective = "600px";
    [...texto].forEach((c, i) => {
      const s = document.createElement("span");
      s.className = "v3-char";
      s.style.setProperty("--i", i);
      s.textContent = c;
      linha.appendChild(s);
    });
  }

  /* ---------- Títulos das seções: palavras sobem ---------- */
  function splitHeadings() {
    $$("h2, #experiencia-titulo, .members > h3").forEach((h) => {
      if (h.dataset.v3) return;
      h.dataset.v3 = "1";
      let i = 0;
      Array.from(h.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const partes = n.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          partes.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) return frag.appendChild(document.createTextNode(p));
            const w = document.createElement("span");
            w.className = "v3-word";
            w.setAttribute("aria-hidden", "true");
            const inner = document.createElement("span");
            inner.style.setProperty("--i", i++);
            inner.textContent = p;
            w.appendChild(inner);
            frag.appendChild(w);
          });
          if (!h.getAttribute("aria-label")) h.setAttribute("aria-label", h.textContent.trim());
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          n.classList.add("v3-split-hl");
          n.style.setProperty("--i", i++);
        }
      });
      // Títulos fora de um bloco "reveal" ganham seu próprio gatilho
      if (!h.closest(".reveal")) observeOnce(h, () => h.classList.add("v3-in"));
    });
  }

  /* ---------- Texto que acende com a rolagem ---------- */
  const scrubs = [];
  function scrubText() {
    const alvos = $$("#sobre blockquote");
    alvos.forEach((el) => {
      if (el.dataset.v3) return;
      el.dataset.v3 = "1";
      const texto = el.textContent;
      el.setAttribute("aria-label", texto);
      el.textContent = "";
      el.classList.add("v3-scrub");
      const letras = [];
      texto.split(/(\s+)/).forEach((pal) => {
        if (/^\s+$/.test(pal)) return el.appendChild(document.createTextNode(pal));
        const w = document.createElement("span");
        w.style.whiteSpace = "nowrap";
        w.setAttribute("aria-hidden", "true");
        [...pal].forEach((c) => {
          const s = document.createElement("span");
          s.className = "v3-l";
          s.textContent = c;
          w.appendChild(s);
          letras.push(s);
        });
        el.appendChild(w);
      });
      scrubs.push({ el, letras });
    });
  }
  function updateScrubs(vh) {
    scrubs.forEach(({ el, letras }) => {
      const r = el.getBoundingClientRect();
      // começa quando o texto entra pela parte de baixo e termina perto do meio da tela
      const p = clamp((vh * 0.92 - r.top) / (vh * 0.5), 0, 1);
      const n = Math.round(p * letras.length);
      letras.forEach((s, i) => {
        s.classList.toggle("on", i < n);
        s.classList.toggle("v3-hot", i < n && i >= n - 3 && p < 1);
      });
    });
  }

  /* ---------- Linha do tempo ---------- */
  let tl = null;
  function timeline() {
    const sec = $("#experiencia");
    if (!sec || tl) return;
    const horiz = $(".timeline-runner", sec)?.parentElement;
    const vert = horiz?.nextElementSibling;
    const itens = $$("ol > li", sec);
    if (!horiz || !itens.length) return;
    const add = (linha, vertical) => {
      if (!linha) return null;
      const f = document.createElement("span");
      f.className = "v3-tl-fill" + (vertical ? " is-v" : "");
      linha.appendChild(f);
      return f;
    };
    tl = { sec, itens, h: add(horiz, false), v: add(vert, true) };
  }
  function updateTimeline(vh) {
    if (!tl) return;
    const lista = $("ol", tl.sec);
    const r = lista.getBoundingClientRect();
    const p = clamp((vh * 0.8 - r.top) / (r.height + vh * 0.25), 0, 1);
    tl.sec.style.setProperty("--v3-tl", p.toFixed(3));
    tl.itens.forEach((li, i) => li.classList.toggle("v3-on", p >= i / Math.max(1, tl.itens.length - 1) - 0.02));
  }

  /* ---------- Fotos da galeria com cortina ---------- */
  function curtains() {
    $$("#lista-galeria button, .members .member-photo").forEach((b) => {
      if (b.dataset.v3) return;
      b.dataset.v3 = "1";
      b.classList.add("v3-curtain");
      if (!b.closest(".reveal")) observeOnce(b, () => b.classList.add("v3-in"));
    });
  }

  /* ---------- Parallax e inclinação ---------- */
  const pars = [];
  function parallax() {
    const add = (el, vel) => {
      if (!el || el.dataset.v3par) return;
      el.dataset.v3par = "1";
      el.classList.add("v3-par");
      pars.push({ el, vel });
    };
    const fundo = $("#inicio > div[aria-hidden]");
    if (fundo) {
      add(fundo.children[1], 0.25);
      add(fundo.children[2], -0.15);
    }
    add($(".hero-heading"), -0.12);
    add($(".hero-photo"), 0.1);
    const sobre = $$("#sobre .frame-neon");
    add(sobre[1], -0.08);
  }
  function updateParallax() {
    pars.forEach(({ el, vel }) => {
      const r = el.getBoundingClientRect();
      const centro = r.top + r.height / 2 - innerHeight / 2;
      el.style.setProperty("--py", (centro * vel * -1).toFixed(1) + "px");
    });
  }

  function tilt() {
    if (!mouse) return;
    $$(".hero-photo .frame-neon, #sobre .frame-neon, .member-photo").forEach((el) => {
      if (el.dataset.v3tilt) return;
      el.dataset.v3tilt = "1";
      el.classList.add("v3-tilt");
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--ry", (x * 10).toFixed(2) + "deg");
        el.style.setProperty("--rx", (y * -10).toFixed(2) + "deg");
      });
      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--ry", "0deg");
        el.style.setProperty("--rx", "0deg");
      });
    });
  }

  /* ---------- Cursor, botões magnéticos e luz nos cartões ---------- */
  function cursor() {
    if (!mouse) return;
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.id = "v3-dot";
    ring.id = "v3-ring";
    document.body.append(dot, ring);
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, ativo = false;
    addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!ativo) { ativo = true; rx = x; ry = y; html.classList.add("v3-cursor-on"); }
      const t = e.target;
      const campo = t.closest && t.closest("input, textarea, select, iframe");
      html.classList.toggle("v3-cursor-hidden", !!campo);
      const rotulo = t.closest && t.closest("#lista-galeria button, [id^='video'] button, [id^='video'] a");
      const link = t.closest && t.closest("a, button, [role='button'], summary, label");
      ring.classList.toggle("has-label", !!rotulo);
      ring.textContent = rotulo ? (rotulo.closest("#lista-galeria") ? "Ver" : "Play") : "";
      ring.classList.toggle("is-hover", !!link && !rotulo);
    }, { passive: true });
    document.addEventListener("mouseleave", () => html.classList.remove("v3-cursor-on"));
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      dot.style.transform = `translate3d(${x}px,${y}px,0)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function magnetic() {
    if (!mouse) return;
    $$(".btn, .social-btn").forEach((b) => {
      if (b.dataset.v3mag) return;
      b.dataset.v3mag = "1";
      b.classList.add("v3-magnetic");
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.setProperty("--mx", ((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1) + "px");
        b.style.setProperty("--my", ((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1) + "px");
      });
      b.addEventListener("pointerleave", () => {
        b.style.setProperty("--mx", "0px");
        b.style.setProperty("--my", "0px");
      });
    });
  }

  function spotlight() {
    if (!mouse) return;
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest && e.target.closest(".card-neon");
      $$(".card-neon.v3-lit").forEach((c) => c !== card && c.classList.remove("v3-lit"));
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--sx", e.clientX - r.left + "px");
      card.style.setProperty("--sy", e.clientY - r.top + "px");
      card.classList.add("v3-lit");
    }, { passive: true });
  }

  /* ---------- Faixa de estilos acelera com a rolagem ---------- */
  let marquee = null;
  function updateMarquee(vel) {
    const sec = $(".marquee");
    if (!sec) return;
    const track = $(".marquee-track", sec);
    if (!marquee && track && track.getAnimations) marquee = track.getAnimations()[0] || null;
    const v = clamp(vel, -60, 60);
    sec.style.setProperty("--v3-skew", (v * -0.12).toFixed(2) + "deg");
    if (marquee) marquee.playbackRate = 1 + Math.abs(v) / 6;
  }

  /* ---------- Utilidades ---------- */
  function observeOnce(el, fn) {
    if (!("IntersectionObserver" in window)) return fn();
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (en.isIntersecting) { fn(); io.disconnect(); }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
  }

  let ultimoY = scrollY, vel = 0, pendente = false;
  function frame() {
    pendente = false;
    const vh = innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    html.style.setProperty("--v3-scroll", max > 0 ? (scrollY / max).toFixed(4) : 0);
    vel = scrollY - ultimoY;
    ultimoY = scrollY;
    updateScrubs(vh);
    updateTimeline(vh);
    updateParallax();
    updateMarquee(vel);
    $("#v3-badge")?.classList.toggle("is-away", scrollY > 300);
    if (Math.abs(vel) > 0.5) agendar(); // deixa a faixa desacelerar suavemente
  }
  function agendar() {
    if (pendente) return;
    pendente = true;
    requestAnimationFrame(frame);
  }

  function aplicar() {
    if (calmo) return;
    heroTitle();
    splitHeadings();
    scrubText();
    timeline();
    curtains();
    parallax();
    tilt();
    magnetic();
    agendar();
  }

  function iniciar() {
    preloader();
    const prog = document.createElement("div");
    prog.id = "v3-progress";
    prog.setAttribute("aria-hidden", "true");
    document.body.appendChild(prog);

    const badge = document.createElement("a");
    badge.id = "v3-badge";
    badge.href = "https://banda3em1.github.io/";
    badge.title = "Abrir o site oficial";
    badge.innerHTML = "<b>V3</b> versão de teste";
    document.body.appendChild(badge);

    if (!calmo) {
      cursor();
      spotlight();
    }
    addEventListener("scroll", agendar, { passive: true });
    addEventListener("resize", agendar);

    // O React monta a página depois deste script; aplica os efeitos quando o conteúdo aparece
    const root = document.getElementById("root");
    let t = 0;
    const mo = new MutationObserver(() => {
      clearTimeout(t);
      t = setTimeout(aplicar, 60);
    });
    if (root) mo.observe(root, { childList: true, subtree: true });
    aplicar();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
