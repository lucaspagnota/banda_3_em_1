/* BANDA 3 EM 1 — versão 2. Interações e animações em JavaScript puro.
 * Conteúdo: conteudo.js (window.BANDA e window.CONTEUDO) · Visual: styles.css */
'use strict';
(() => {
  const B = window.BANDA || {};
  const C = window.CONTEUDO || {};
  const html = document.documentElement;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const range = (v, a, b) => clamp((v - a) / (b - a));
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const pad = (n) => String(n).padStart(2, '0');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const get = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), { BANDA: B, CONTEUDO: C });

  // ---------- Contato e datas (mesmas regras do site atual) ----------

  const onlyDigits = (v) => String(v || '').replace(/\D/g, '');
  const waNumber = (() => {
    const d = onlyDigits(B.whatsapp);
    return d.length >= 10 && d.length <= 15 ? d : null;
  })();
  const whatsappUrl = (msg) =>
    !waNumber ? null : msg ? `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}` : `https://wa.me/${waNumber}`;

  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

  function parseLocalDate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso ?? '').trim());
    if (!m) return null;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const formatDateBR = (iso) => {
    const d = parseLocalDate(iso);
    return d ? d.toLocaleDateString('pt-BR') : iso;
  };

  // ---------- Textos e links vindos do conteudo.js ----------

  function bindContent() {
    $$('[data-text]').forEach((el) => {
      let v = get(el.dataset.text);
      if (typeof v !== 'string' || !v.trim()) return;
      if (el.hasAttribute('data-first-sentence')) v = v.split(/(?<=\.)\s/)[0];
      el.textContent = v;
    });
    const hrefs = {
      instagram: B.instagram,
      youtube: B.youtube,
      whatsapp: whatsappUrl(B.mensagemWhatsApp),
      email: B.email ? `mailto:${B.email}` : null,
    };
    $$('[data-href]').forEach((a) => {
      const h = hrefs[a.dataset.href];
      if (h) a.href = h;
      else (a.closest('li') || a).remove();
    });
    $$('[data-whatsapp]').forEach((a) => {
      const h = whatsappUrl(a.dataset.whatsapp);
      if (h) a.href = h;
      else a.remove();
    });
    $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  // Seções do menu: as do conteudo.js + integrantes e contrate, na ordem da página.
  const SECTIONS = (() => {
    const list = (C.MENU || []).map((m) => ({ id: m.id, label: m.label }));
    if (!list.some((s) => s.id === 'integrantes')) list.push({ id: 'integrantes', label: 'Integrantes' });
    if (!list.some((s) => s.id === 'contrate')) list.push({ id: 'contrate', label: 'Contrate' });
    return list
      .filter((s) => document.getElementById(s.id))
      .sort((a, b) =>
        document.getElementById(a.id).compareDocumentPosition(document.getElementById(b.id)) &
        Node.DOCUMENT_POSITION_FOLLOWING
          ? -1
          : 1
      );
  })();

  // Galeria na mesma ordem do site atual: destaques primeiro.
  const GALLERY = (() => {
    const destaques = B.galeriaDestaques || [];
    const rank = (p) => {
      const i = destaques.indexOf(p);
      return i < 0 ? 999 : i;
    };
    return [...(B.fotos || [])]
      .sort((a, b) => rank(a.arquivo) - rank(b.arquivo))
      .map((f) => ({
        src: f.arquivo,
        ratio: f.proporcao || '4/3',
        alt: f.legenda || B.nome,
        caption: String(f.legenda || B.nome || '').split('—').pop().trim(),
      }));
  })();

  // ---------- Montagem das seções ----------

  function renderNumbers() {
    const list = $('[data-numbers]');
    if (!list) return;
    list.innerHTML = (C.SOBRE?.numeros || [])
      .map(
        (n, i) => `<li data-reveal style="--delay:${i * 0.1}s">
          <span class="numbers__value">${n.prefixo ? `<small>${esc(n.prefixo)}</small>` : ''}<span data-count="${Number(n.valor) || 0}">0</span>${n.sufixo ? `<small>${esc(n.sufixo)}</small>` : ''}</span>
          <span class="numbers__label">${esc(n.rotulo)}</span>
        </li>`
      )
      .join('');
  }

  function renderMarquee() {
    const star = icon('star');
    const serif = $('[data-mq-row="-1"]');
    const sans = $('[data-mq-row="1"]');
    const frase = [C.EXPERIENCIA?.titulo, C.EXPERIENCIA?.destaque].filter(Boolean).join(' ') || 'Uma viagem musical';
    if (serif) serif.innerHTML = Array(4).fill(`<span>${esc(frase)}</span>${star}`).join('');
    const estilos = C.FAIXA_ESTILOS || B.estilos || [];
    if (sans) sans.innerHTML = Array(4).fill(estilos.map((e) => `<span>${esc(e)}</span>${star}`).join('')).join('');
  }

  function renderGallery() {
    const track = $('[data-track]');
    if (!track) return;
    const H = [54, 40, 60, 46, 36, 56, 44];
    const Y = [-6, 12, -10, 16, -14, 8, 18];
    const quotes = [C.SOBRE?.frase, C.EXPERIENCIA?.frase, B.descricaoRepertorio].filter(Boolean);
    let out = '';
    GALLERY.forEach((f, i) => {
      const [w, h] = f.ratio.split('/').map(Number);
      out += `<figure class="hg-item" style="--h:${H[i % H.length]}vh;--y:${Y[i % Y.length]}vh" data-depth="${(i % 3) + 1}">
        <figcaption>${pad(i + 1)} — ${esc(f.caption)}</figcaption>
        <button type="button" data-photo="${i}" data-cursor="Ver" aria-label="Ampliar foto ${i + 1}: ${esc(f.caption)}">
          <img src="${esc(f.src)}" alt="${esc(f.alt)}" width="${w}" height="${h}" style="aspect-ratio:${w}/${h}" loading="lazy" decoding="async">
        </button>
      </figure>`;
      if ([2, 8, 13].includes(i) && quotes.length) {
        out += `<blockquote class="hg-quote" style="--y:${i === 8 ? -12 : 10}vh">
          <p>${esc(quotes.shift())}</p>
          <svg class="scribble" viewBox="0 0 520 260" aria-hidden="true"><use href="#i-scribble"/></svg>
        </blockquote>`;
      }
    });
    track.insertAdjacentHTML('beforeend', out);
  }

  function renderMembers() {
    const list = $('[data-members]');
    if (!list) return;
    list.innerHTML = (B.integrantes || [])
      .map((m, i) => {
        const key = String(m.nome || '').toUpperCase();
        const fotos = (B.fotos || []).map((f) => f.arquivo).filter((p) => p.toUpperCase().includes(key));
        const a = fotos[0] || m.arquivo;
        const b = fotos[1] || m.arquivo;
        return `<li class="member" data-reveal style="--delay:${i * 0.12}s">
          <article class="member__card" data-tilt>
            <img class="member__img member__img--a" src="${esc(a)}" alt="${esc(m.nome)}, ${esc(String(m.funcao).toLowerCase())} da banda" loading="lazy">
            <img class="member__img member__img--b" src="${esc(b)}" alt="" loading="lazy">
            <span class="member__glare" aria-hidden="true"></span>
            <span class="member__index" aria-hidden="true">${pad(i + 1)}</span>
            <div class="member__info">
              <p class="member__role">${esc(m.funcao)}</p>
              <h3 class="member__name">${esc(m.nome)}</h3>
              <p class="member__desc"><span><span>${esc(m.descricao)}</span></span></p>
            </div>
          </article>
        </li>`;
      })
      .join('');
    list.addEventListener('click', (e) => {
      const card = e.target.closest('.member__card');
      if (card && !finePointer) card.classList.toggle('is-active');
    });
  }

  function renderVenues() {
    const el = $('[data-venues]');
    if (!el) return;
    const run = (C.SOBRE?.ondeTocamos || []).map((v) => `<span>${esc(v)}</span>${icon('star')}`).join('');
    el.innerHTML = `<div class="venues__run">${run}</div><div class="venues__run" aria-hidden="true">${run}</div>`;
  }

  function renderDecades() {
    const list = $('[data-decades]');
    if (!list) return;
    list.innerHTML = (C.EXPERIENCIA?.linhaDoTempo || [])
      .map((d, i) => {
        const num = (String(d.decada).match(/\d+/) || [d.decada])[0];
        return `<li class="decade${i === 1 ? ' is-active' : ''}" tabindex="0" data-decade>
          <span class="decade__label">${esc(d.decada)}</span>
          <span class="decade__bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <div><span class="decade__num" aria-hidden="true">${esc(num)}</span><p class="decade__text">${esc(d.texto)}</p></div>
        </li>`;
      })
      .join('');
    const all = $$('[data-decade]', list);
    const activate = (li) => all.forEach((x) => x.classList.toggle('is-active', x === li));
    all.forEach((li) => {
      li.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && activate(li));
      li.addEventListener('focus', () => activate(li));
      li.addEventListener('click', () => activate(li));
    });
  }

  const Songs = {
    filtro: 'todos',
    expandido: false,
    LIMITE: 8,
    init() {
      this.list = $('[data-songs]');
      if (!this.list) return;
      this.count = $('[data-songs-count]');
      this.more = $('[data-songs-more]');
      this.filters = $('[data-filters]');
      this.pill = $('[data-filter-pill]');
      const all = C.REPERTORIO || [];
      const btns = [
        { id: 'todos', label: 'Todos', n: all.length },
        ...(C.CATEGORIAS || []).map((c) => ({ id: c.id, label: c.label, n: all.filter((s) => s.categoria === c.id).length })),
      ];
      this.filters.insertAdjacentHTML(
        'beforeend',
        btns
          .map(
            (b) =>
              `<button class="filter" type="button" aria-pressed="${b.id === 'todos'}" data-filter="${b.id}">${esc(b.label)} <small>${b.n}</small></button>`
          )
          .join('')
      );
      this.filters.addEventListener('click', (e) => {
        const b = e.target.closest('[data-filter]');
        if (!b || b.dataset.filter === this.filtro) return;
        this.filtro = b.dataset.filter;
        this.expandido = false;
        this.render();
      });
      this.more.addEventListener('click', () => {
        this.expandido = !this.expandido;
        this.render();
        if (!this.expandido) Smooth.to(this.filters.getBoundingClientRect().top + scrollY - 120);
      });
      this.render();
    },
    render() {
      const cats = Object.fromEntries((C.CATEGORIAS || []).map((c) => [c.id, c.label]));
      const lista = (C.REPERTORIO || []).filter((s) => this.filtro === 'todos' || s.categoria === this.filtro);
      const vis = this.expandido ? lista : lista.slice(0, this.LIMITE);
      this.list.innerHTML = vis
        .map(
          (s, i) => `<li class="song" style="--i:${i % this.LIMITE}" data-decade="${esc(s.decada)}" data-cat="${esc(cats[s.categoria] || s.categoria)}">
            <span class="song__n">${pad(i + 1)}</span>
            <span class="song__main"><span class="song__title">${esc(s.titulo)}</span><span class="song__artist">${esc(s.artista)}</span></span>
            <span class="song__tag">${esc(cats[s.categoria] || s.categoria)}</span>
            <span class="song__decade">${esc(s.decada)}</span>
          </li>`
        )
        .join('');
      this.count.textContent = `Mostrando ${vis.length} de ${lista.length} músicas`;
      this.more.hidden = lista.length <= this.LIMITE;
      this.more.textContent = this.expandido ? 'Ver menos músicas' : 'Ver mais músicas';
      $$('[data-filter]', this.filters).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === this.filtro)));
      this.movePill();
    },
    movePill() {
      const a = this.filters && $('[data-filter][aria-pressed="true"]', this.filters);
      if (!a) return;
      this.pill.style.width = `${a.offsetWidth}px`;
      this.pill.style.height = `${a.offsetHeight}px`;
      this.pill.style.transform = `translate(${a.offsetLeft}px, ${a.offsetTop}px)`;
    },
  };

  function renderVideos() {
    const list = $('[data-fan]');
    if (!list) return;
    const vids = (B.videos || []).filter((v) => v.youtubeId);
    const mid = (vids.length - 1) / 2;
    list.innerHTML = vids
      .map((v, i) => {
        const k = i - mid;
        return `<li class="fan__item" style="--x:${(k * 58).toFixed(1)};--y:${(Math.abs(k) * 7).toFixed(1)};--r:${(k * 9).toFixed(1)};z-index:${10 - Math.round(Math.abs(k))}">
          <button class="fan__card" type="button" data-video="${esc(v.youtubeId)}" data-title="${esc(v.titulo)}" data-cursor="Play" aria-label="Assistir ao vídeo ${esc(v.titulo)}">
            <img src="${esc(v.capa)}" alt="" loading="lazy">
            <span class="fan__play" aria-hidden="true">${icon('play')}</span>
            <span class="fan__meta"><span class="fan__tag">YouTube</span><span class="fan__title">${esc(v.titulo)}</span></span>
          </button>
        </li>`;
      })
      .join('');
  }

  function renderBooking() {
    const ct = C.CONTRATACAO || {};
    const events = $('[data-events]');
    if (events) events.innerHTML = (ct.eventos || []).map((e) => `<li>${esc(e)}</li>`).join('');
    const steps = $('[data-steps]');
    if (steps)
      steps.innerHTML = (ct.passos || [])
        .map(
          (p, i) => `<li data-reveal style="--delay:${i * 0.1}s"><span class="steps__n">${pad(i + 1)}</span><span class="steps__t">${esc(p.titulo)}</span><span class="steps__d">${esc(p.texto)}</span></li>`
        )
        .join('');
    const select = $('[data-event-types]');
    if (select) select.insertAdjacentHTML('beforeend', (ct.tiposDeEvento || []).map((t) => `<option>${esc(t)}</option>`).join(''));
  }

  function renderFaq() {
    const list = $('[data-faq]');
    if (!list) return;
    list.innerHTML = (C.FAQ || [])
      .map(
        (f, i) => `<li class="qa${i === 0 ? ' is-open' : ''}" data-reveal style="--delay:${i * 0.06}s">
          <h3><button class="qa__btn" type="button" id="faq-b-${i}" aria-expanded="${i === 0}" aria-controls="faq-${i}">
            <span class="qa__n">${pad(i + 1)}</span><span class="qa__q">${esc(f.pergunta)}</span><span class="qa__icon" aria-hidden="true"></span>
          </button></h3>
          <div class="qa__panel" id="faq-${i}" role="region" aria-labelledby="faq-b-${i}"><div><p>${esc(f.resposta)}</p></div></div>
        </li>`
      )
      .join('');
    list.addEventListener('click', (e) => {
      const b = e.target.closest('.qa__btn');
      if (!b) return;
      const li = b.closest('.qa');
      const open = !li.classList.contains('is-open');
      li.classList.toggle('is-open', open);
      b.setAttribute('aria-expanded', String(open));
    });
  }

  function renderNav() {
    const links = $('[data-menu-links]');
    if (links)
      links.innerHTML = SECTIONS.map(
        (s, i) => `<li><a href="#${s.id}" style="--i:${i}" data-tile="${i % 4}" data-section-link="${s.id}">${esc(s.label)}</a></li>`
      ).join('');
    const foot = $('[data-footer-links]');
    if (foot) foot.innerHTML = SECTIONS.map((s) => `<li><a href="#${s.id}">${esc(s.label)}</a></li>`).join('');
  }

  // ---------- Agenda (mesma fonte e regras do site atual) ----------

  const NextShow = {
    update(s) {
      const card = $('[data-next-show]');
      const menu = $('[data-menu-next]');
      if (!s) {
        if (card) card.hidden = true;
        if (menu) menu.innerHTML = '';
        return;
      }
      const data = `${pad(s.date.getDate())}.${pad(s.date.getMonth() + 1)}`;
      if (card) {
        card.hidden = false;
        $('[data-next-date]', card).textContent = data;
        $('[data-next-name]', card).textContent = s.evento;
        card.setAttribute('aria-label', `Próximo show: ${s.date.toLocaleDateString('pt-BR')}, ${s.evento}. Ver agenda`);
      }
      if (menu) menu.innerHTML = `Próximo show <strong>${data} · ${esc(s.evento)}</strong>`;
    },
  };

  const Agenda = {
    eventos: B.agenda || [],
    expandida: false,
    falha: false,
    assinatura: '',
    init() {
      this.list = $('[data-shows]');
      if (!this.list) return;
      this.status = $('[data-agenda-status]');
      this.empty = $('[data-agenda-empty]');
      this.more = $('[data-shows-more]');
      this.more.addEventListener('click', () => {
        this.expandida = !this.expandida;
        this.render();
      });
      this.list.addEventListener('click', (e) => this.toggleMap(e.target.closest('[data-map]')));
      this.render();
      this.atualizar();
      setInterval(() => !document.hidden && this.atualizar(), 60000);
      document.addEventListener('visibilitychange', () => !document.hidden && this.atualizar());
    },
    // No GitHub Pages lê o arquivo publicado ao lado do site; fora dele (arquivo local
    // ou teste no computador) lê a agenda publicada e, se falhar, a cópia local.
    urls() {
      const publicada = 'https://lucaspagnota.github.io/banda_3_em_1/assets/agenda.json';
      return /\.github\.io$/.test(location.hostname) ? ['assets/agenda.json'] : [publicada, 'assets/agenda.json'];
    },
    async atualizar() {
      for (const url of this.urls()) {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 15000);
        try {
          const r = await fetch(url, { cache: 'no-store', signal: ctrl.signal });
          if (!r.ok) throw Error('Agenda indisponível');
          const dados = await r.json();
          if (
            !Array.isArray(dados.eventos) ||
            !dados.eventos.every((s) => typeof s.evento === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s.data))
          )
            throw Error('Agenda inválida');
          this.eventos = dados.eventos;
          const updated = Date.parse(dados.atualizadoEm);
          this.falha = !Number.isFinite(updated) || Date.now() - updated > 24 * 60 * 60 * 1000;
          this.render();
          return;
        } catch (err) {
          // tenta a próxima fonte
        } finally {
          clearTimeout(timer);
        }
      }
      this.falha = true;
      this.render();
    },
    shows() {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      return this.eventos
        .map((s) => ({ ...s, date: parseLocalDate(s.data) }))
        .filter((s) => s.date && (!B.ocultarShowsPassados || (parseLocalDate(s.dataFim) || s.date) >= hoje))
        .sort((a, b) => a.date - b.date);
    },
    render() {
      const shows = this.shows();
      this.status.hidden = !this.falha;
      NextShow.update(shows[0]);
      const sig = JSON.stringify([shows.map((s) => [s.id, s.data, s.evento, s.horario, s.local]), this.expandida]);
      if (sig === this.assinatura) return;
      this.assinatura = sig;
      this.empty.hidden = shows.length > 0;
      const vis = this.expandida ? shows : shows.slice(0, 3);
      this.list.innerHTML = vis.map((s, i) => this.item(s, i)).join('');
      this.more.hidden = shows.length <= 3;
      this.more.textContent = this.expandida ? 'Ver menos datas' : 'Ver mais datas';
      this.more.setAttribute('aria-expanded', String(this.expandida));
    },
    item(s, i) {
      const d = s.date;
      const local = s.endereco || s.local || s.cidade || '';
      const linkOk = /^https?:\/\//i.test(s.linkMapa || '');
      const embedOk = /^https?:\/\//i.test(s.mapaEmbed || '');
      return `<li class="show" style="--i:${i}">
        <div class="show__row">
          <div class="show__date" aria-hidden="true">
            <span class="show__day">${pad(d.getDate())}</span>
            <span class="show__month">${MESES[d.getMonth()]}<small>${d.getFullYear()}</small></span>
          </div>
          <div class="show__info">
            <p class="show__meta"><span class="sr-only">${d.toLocaleDateString('pt-BR')}, </span>${DIAS[d.getDay()]}${s.horario ? ` • ${esc(s.horario)}` : ''}${i === 0 ? '<span class="show__badge">Próximo show</span>' : ''}</p>
            <h3 class="show__name">${esc(s.evento)}</h3>
            ${local ? `<p class="show__place">${icon('pin')}<span>${esc(local)}</span></p>` : ''}
          </div>
          <div class="show__actions">
            ${linkOk ? `<a class="btn btn--accent btn--sm" href="${esc(s.linkMapa)}" target="_blank" rel="noopener"><span>Como chegar</span>${icon('arrow')}</a>` : ''}
            ${embedOk ? `<button class="btn btn--outline-light btn--sm" type="button" aria-expanded="false" data-map="${esc(s.mapaEmbed)}" data-title="${esc(s.evento)}"><span>Ver no mapa</span></button>` : ''}
          </div>
        </div>
        ${embedOk ? '<div class="show__map"><div></div></div>' : ''}
      </li>`;
    },
    toggleMap(btn) {
      if (!btn) return;
      const li = btn.closest('.show');
      const open = !li.classList.contains('is-map');
      const box = $('.show__map > div', li);
      if (open && !box.firstElementChild) {
        box.innerHTML = `<iframe src="${esc(btn.dataset.map)}" loading="lazy" title="Mapa: ${esc(btn.dataset.title)}" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
      }
      li.classList.toggle('is-map', open);
      btn.setAttribute('aria-expanded', String(open));
      $('span', btn).textContent = open ? 'Fechar mapa' : 'Ver no mapa';
    },
  };

  // ---------- Formulário de orçamento (mesma mensagem do site atual) ----------

  const Form = {
    campos: ['nome', 'telefone', 'email', 'tipo', 'data', 'horario', 'local', 'cidade', 'mensagem'],
    init() {
      this.f = $('[data-form]');
      if (!this.f) return;
      const hoje = new Date();
      $('#campo-data').min = `${hoje.getFullYear()}-${pad(hoje.getMonth() + 1)}-${pad(hoje.getDate())}`;
      this.f.addEventListener('submit', (e) => {
        e.preventDefault();
        this.tentou = true;
        const v = this.valores();
        const erros = this.validar(v);
        this.mostrar(erros);
        const primeiro = Object.keys(erros)[0];
        if (primeiro) {
          $(`[name="${primeiro}"]`, this.f).focus();
          return;
        }
        const url = whatsappUrl(this.mensagem(v));
        if (url) window.open(url, '_blank', 'noopener');
      });
      const revalidar = () => this.tentou && this.mostrar(this.validar(this.valores()));
      this.f.addEventListener('input', revalidar);
      this.f.addEventListener('change', revalidar);
    },
    valores() {
      const fd = new FormData(this.f);
      return Object.fromEntries(this.campos.map((k) => [k, String(fd.get(k) || '')]));
    },
    validar(v) {
      const erros = {};
      if (v.nome.trim().length < 2) erros.nome = 'Informe seu nome.';
      if (onlyDigits(v.telefone).length < 10) erros.telefone = 'Informe um telefone com DDD.';
      if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) erros.email = 'Confira o e-mail digitado.';
      if (!v.tipo) erros.tipo = 'Selecione o tipo de evento.';
      if (!v.data) erros.data = 'Informe a data do evento.';
      else {
        const data = parseLocalDate(v.data);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        if (!data) erros.data = 'Data inválida.';
        else if (data < hoje) erros.data = 'A data não pode estar no passado.';
      }
      if (v.cidade.trim().length < 2) erros.cidade = 'Informe a cidade do evento.';
      return erros;
    },
    mostrar(erros) {
      ['nome', 'telefone', 'email', 'tipo', 'data', 'cidade'].forEach((k) => {
        const input = $(`[name="${k}"]`, this.f);
        input.closest('.field').classList.toggle('has-error', !!erros[k]);
        input.setAttribute('aria-invalid', erros[k] ? 'true' : 'false');
        const msg = $(`#erro-${k}`);
        if (msg) msg.textContent = erros[k] || '';
      });
    },
    mensagem(v) {
      const linhas = [
        `Olá! Gostaria de solicitar um orçamento para a ${B.nome || 'banda'}.`,
        '',
        `*Nome:* ${v.nome.trim()}`,
        `*Telefone/WhatsApp:* ${v.telefone.trim()}`,
      ];
      if (v.email.trim()) linhas.push(`*E-mail:* ${v.email.trim()}`);
      linhas.push(`*Tipo de evento:* ${v.tipo}`);
      linhas.push(`*Data:* ${formatDateBR(v.data)}`);
      if (v.horario) linhas.push(`*Horário:* ${v.horario}`);
      if (v.local.trim()) linhas.push(`*Local:* ${v.local.trim()}`);
      linhas.push(`*Cidade:* ${v.cidade.trim()}`);
      if (v.mensagem.trim()) linhas.push('', `*Observações:* ${v.mensagem.trim()}`);
      linhas.push('', 'Gostaria de mais informações sobre a contratação.');
      return linhas.join('\n');
    },
  };

  // ---------- Texto dividido em palavras / letras ----------

  function splitWords(el, inner) {
    let i = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(' '));
              return;
            }
            const w = document.createElement('span');
            w.className = 'w';
            if (inner) {
              const s = document.createElement('span');
              s.className = 'w__in';
              s.style.setProperty('--i', i);
              s.textContent = part;
              w.appendChild(s);
            } else w.textContent = part;
            frag.appendChild(w);
            i++;
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') walk(child);
      });
    };
    walk(el);
  }

  function splitHeroTitle() {
    const h1 = $('.hero__title');
    if (!h1) return;
    h1.setAttribute('aria-label', h1.textContent.replace(/\s+/g, ' ').trim());
    let i = 0;
    [$('[data-hero-small]'), $('[data-hero-big]')].forEach((el) => {
      if (!el) return;
      const text = el.textContent.trim();
      el.dataset.label = text;
      el.setAttribute('aria-hidden', 'true');
      el.textContent = '';
      [...text].forEach((ch) => {
        const s = document.createElement('span');
        s.className = 'ch';
        s.style.setProperty('--i', i++);
        s.textContent = ch === ' ' ? ' ' : ch;
        el.appendChild(s);
      });
      // Marcador de altura zero na linha de base: dá a posição exata para o neon.
      const probe = document.createElement('i');
      probe.className = 'hero__probe';
      el.appendChild(probe);
    });
  }

  const Reveal = {
    init() {
      $$('[data-split]').forEach((el) => {
        splitWords(el, true);
        el.classList.add('split');
      });
      const words = $('[data-words]');
      if (words) splitWords(words, false);
      const targets = $$('[data-reveal], .split');
      if (reduced || !('IntersectionObserver' in window)) {
        targets.forEach((el) => el.classList.add('is-in'));
        return;
      }
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }),
        { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
      );
      targets.forEach((el) => io.observe(el));
    },
  };

  function initCounters() {
    const els = $$('[data-count]');
    const run = (el) => {
      const to = Number(el.dataset.count) || 0;
      if (reduced) {
        el.textContent = to;
        return;
      }
      const t0 = performance.now();
      const step = (t) => {
        const p = clamp((t - t0) / 1800);
        el.textContent = Math.round(to * (1 - Math.pow(2, -10 * p)));
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = to;
      };
      requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) return els.forEach(run);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          run(e.target);
          io.unobserve(e.target);
        }),
      { threshold: 0.6 }
    );
    els.forEach((el) => io.observe(el));
  }

  // ---------- Rolagem suave (roda do mouse) ----------

  const Smooth = {
    on: finePointer && !reduced,
    target: 0,
    current: 0,
    running: false,
    locked: false,
    init() {
      this.current = this.target = scrollY;
      if (!this.on) return;
      addEventListener('wheel', (e) => this.wheel(e), { passive: false });
      addEventListener('scroll', () => !this.running && (this.current = this.target = scrollY), { passive: true });
    },
    max() {
      return document.documentElement.scrollHeight - innerHeight;
    },
    wheel(e) {
      if (e.ctrlKey || this.locked) return;
      if (e.target.closest && e.target.closest('textarea, select, [data-native-scroll]')) return;
      let d = e.deltaY;
      if (e.deltaMode === 1) d *= 40;
      else if (e.deltaMode === 2) d *= innerHeight;
      if (!d) return;
      e.preventDefault();
      if (!this.running) this.current = scrollY;
      this.target = clamp(this.target + d, 0, this.max());
      this.running = true;
    },
    to(y) {
      y = clamp(y, 0, this.max());
      if (!this.on) {
        scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
        return;
      }
      this.current = scrollY;
      this.target = y;
      this.running = true;
    },
    tick() {
      if (!this.running) return;
      this.current = lerp(this.current, this.target, 0.1);
      if (Math.abs(this.target - this.current) < 0.5) {
        this.current = this.target;
        this.running = false;
      }
      scrollTo(0, this.current);
    },
    lock(v) {
      this.locked = v;
      this.running = false;
      html.classList.toggle('is-locked', v);
    },
  };

  function initAnchors() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      const target = id ? document.getElementById(id) : null;
      if (id && !target) return;
      e.preventDefault();
      if (Menu.open) Menu.toggle(false, false);
      const y = !target || id === 'inicio' ? 0 : target.getBoundingClientRect().top + scrollY - (target.matches('section') ? 0 : 96);
      Smooth.to(y);
      if (target && target.matches('section')) {
        target.setAttribute('tabindex', '-1');
        setTimeout(() => target.focus({ preventScroll: true }), 900);
      }
    });
  }

  // ---------- Medidas, cenas ligadas à rolagem e cor do cabeçalho ----------

  const Scenes = {
    list: [],
    add(el, fn) {
      if (el) this.list.push({ el, fn, top: 0, h: 0, active: undefined });
    },
    measure(y) {
      this.list.forEach((s) => {
        const r = s.el.getBoundingClientRect();
        s.top = r.top + y;
        s.h = r.height;
      });
    },
    update(y, force) {
      const vh = Layout.vh;
      this.list.forEach((s) => {
        const inside = y > s.top - vh - 40 && y < s.top + s.h + 40;
        if (!inside && s.active === false && !force) return;
        s.active = inside;
        const pin = clamp((y - s.top) / Math.max(1, s.h - vh));
        const view = clamp((y - (s.top - vh)) / (s.h + vh));
        s.fn(pin, view, s, y);
      });
    },
  };

  const Layout = {
    vw: innerWidth,
    vh: innerHeight,
    dirty: true,
    themed: [],
    sections: [],
    current: 'inicio',
    refresh() {
      this.dirty = true;
    },
    measure() {
      this.vw = innerWidth;
      this.vh = innerHeight;
      const hg = $('[data-hgallery]');
      if (hg) {
        const track = $('[data-track]', hg);
        hg._extra = Math.max(0, track.scrollWidth - innerWidth);
        // A faixa anda um pouco mais rápido que a rolagem para a seção não ficar longa demais.
        hg.style.height = `${Math.round(hg._extra * 0.72 + innerHeight)}px`;
      }
      const y = scrollY;
      const box = (el) => {
        const r = el.getBoundingClientRect();
        return { el, top: r.top + y, bottom: r.bottom + y };
      };
      this.themed = $$('main [data-theme], .footer, .footer__tab').map(box);
      this.sections = SECTIONS.map((s) => ({ id: s.id, top: box(document.getElementById(s.id)).top }));
      Scenes.measure(y);
      this.dirty = false;
      return true;
    },
  };

  const header = $('[data-header]');
  const metaTheme = $('meta[name="theme-color"]');

  function updateHeader(y) {
    const probe = y + 34;
    let theme = 'light';
    for (const t of Layout.themed) if (probe >= t.top && probe < t.bottom) theme = t.el.dataset.theme || theme;
    if (Menu.open) theme = 'dark';
    if (header.dataset.on !== theme) {
      header.dataset.on = theme;
      if (metaTheme) metaTheme.content = theme === 'dark' ? '#0d0b14' : '#f2f0ea';
    }
    let current = Layout.sections[0]?.id;
    for (const s of Layout.sections) if (s.top <= y + Layout.vh * 0.35) current = s.id;
    Layout.current = current;
  }

  function buildScenes() {
    // Capa: tudo sobe um pouco mais devagar que a rolagem.
    const frame = $('[data-hero]');
    Scenes.add($('.hero'), (p, v, s, y) => {
      if (!frame || reduced) return;
      const k = clamp(y / Layout.vh);
      frame.style.transform = `translate3d(0, ${(y * 0.3).toFixed(1)}px, 0) scale(${(1 - k * 0.07).toFixed(4)})`;
    });

    // Letreiro gigante + foto central + rabisco desenhado.
    const mqRows = $$('[data-mq-row]');
    const photo = $('[data-pin-photo]');
    const photoImg = photo && $('img', photo);
    const pinScribble = $('.scribble--pin');
    Scenes.add($('.marquee-pin'), (p, v) => {
      if (reduced) {
        p = 0.5;
        v = 0.5;
      }
      mqRows.forEach((r) => {
        const x = Number(r.dataset.mqRow) < 0 ? -6 - v * 36 : -44 + v * 36;
        r.style.transform = `translate3d(${x.toFixed(3)}%, 0, 0)`;
      });
      if (photo) {
        photo.style.transform = `scale(${lerp(1.3, 0.84, easeInOut(p)).toFixed(4)})`;
        photoImg.style.transform = `scale(${lerp(1.18, 1, p).toFixed(4)})`;
        photoImg.style.filter = `grayscale(${(p * 0.9).toFixed(3)}) contrast(${(1 + p * 0.12).toFixed(3)})`;
      }
      if (pinScribble) pinScribble.style.strokeDashoffset = (1 - easeInOut(range(p, 0.2, 0.75))).toFixed(4);
    });

    // Manifesto: as palavras acendem conforme a rolagem.
    const stmt = $('[data-words]');
    if (stmt) {
      const words = $$('.w', stmt);
      const n = words.length;
      const last = [];
      Scenes.add(stmt, (p, v, s, y) => {
        const top = s.top - y;
        const prog = reduced ? 1 : clamp((Layout.vh * 0.88 - top) / (s.h + Layout.vh * 0.4));
        words.forEach((w, i) => {
          const o = Math.round((0.14 + (0.86 * clamp(prog * (n + 6) - i, 0, 6)) / 6) * 100) / 100;
          if (last[i] !== o) {
            last[i] = o;
            w.style.opacity = o;
          }
        });
      });
    }

    // Galeria horizontal: a rolagem vertical empurra as fotos para o lado
    // e o fundo passa do escuro para o claro.
    const hg = $('[data-hgallery]');
    if (hg) {
      const track = $('[data-track]', hg);
      const pin = $('.pin', hg);
      const canvas = $('canvas', hg);
      const ink = [13, 11, 20];
      const paper = [242, 240, 234];
      const textLight = [20, 17, 26];
      Scenes.add(hg, (p) => {
        track.style.transform = `translate3d(${(-(hg._extra || 0) * p).toFixed(1)}px, 0, 0)`;
        const m = easeInOut(range(p, 0.32, 0.72));
        const mix = (a, b) => a.map((c, i) => Math.round(lerp(c, b[i], m))).join(',');
        pin.style.setProperty('--hg-bg', `rgb(${mix(ink, paper)})`);
        pin.style.setProperty('--hg-fg', `rgb(${mix(paper, textLight)})`);
        pin.style.setProperty('--hg-accent', m > 0.5 ? 'var(--accent)' : 'var(--accent-hi)');
        const theme = m > 0.5 ? 'light' : 'dark';
        if (hg.dataset.theme !== theme) hg.dataset.theme = theme;
        if (canvas) canvas._mix = m;
      });
    }

    // "Quem faz esse som": fotos entram pelas laterais, palavras se juntam.
    const duo = $('.duo');
    if (duo) {
      const imgs = $$('[data-duo]', duo);
      const words = $$('[data-duo-word]', duo);
      const scr = $('.scribble--duo', duo);
      Scenes.add(duo, (p, v) => {
        if (reduced) v = 0.6;
        const e = easeOut(range(v, 0.06, 0.5));
        imgs.forEach((f) => {
          const d = Number(f.dataset.duo);
          const x = (1 - e) * d * 60;
          const y = lerp(16, -16, v) * (d < 0 ? 1 : 0.6);
          f.style.transform = `translate3d(${x.toFixed(2)}vw, calc(-50% + ${y.toFixed(2)}vh), 0) rotate(${(d * (3 + (1 - e) * 12)).toFixed(2)}deg)`;
        });
        const we = easeOut(range(v, 0.12, 0.48));
        words.forEach((w) => {
          const d = Number(w.dataset.duoWord);
          w.style.transform = `translate3d(${((1 - we) * d * 24).toFixed(2)}vw, 0, 0)`;
          if (d === 0) w.style.opacity = we.toFixed(3);
        });
        if (scr) scr.style.strokeDashoffset = (1 - easeInOut(range(v, 0.34, 0.62))).toFixed(4);
      });
    }

    // Foto que abre até ocupar a tela inteira.
    const bleed = $('[data-bleed]');
    if (bleed) {
      Scenes.add(bleed.parentElement, (p, v) => {
        const t = reduced ? 1 : easeInOut(range(v, 0.12, 0.58));
        const small = Layout.vw < 720;
        bleed.style.setProperty('--ci-y', `${lerp(small ? 22 : 16, 0, t).toFixed(3)}%`);
        bleed.style.setProperty('--ci-x', `${lerp(small ? 8 : 28, 0, t).toFixed(3)}%`);
        bleed.style.setProperty('--ci-r', `${lerp(28, 0, t).toFixed(2)}px`);
        bleed.style.setProperty('--ci-s', lerp(1.3, 1, t).toFixed(4));
      });
    }

    const footScr = $('.scribble--footer');
    Scenes.add($('.footer'), (p, v) => {
      if (footScr) footScr.style.strokeDashoffset = (1 - easeInOut(range(v, 0.12, 0.42))).toFixed(4);
    });
  }

  // ---------- Linhas de som no fundo (reagem ao mouse) ----------

  class Waves {
    constructor(canvas) {
      this.c = canvas;
      this.ctx = canvas.getContext('2d');
      this.mode = canvas.dataset.waves;
      this.visible = false;
      this.mx = this.tx = -9999;
      this.my = this.ty = -9999;
      this.energy = 0;
      this.seed = Math.random() * 100;
      this.last = 0;
      this.drawn = false;
      new IntersectionObserver(([e]) => (this.visible = e.isIntersecting)).observe(canvas);
      this.resize();
    }
    resize() {
      const r = this.c.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      this.w = r.width;
      this.h = r.height;
      this.c.width = Math.max(1, Math.round(r.width * dpr));
      this.c.height = Math.max(1, Math.round(r.height * dpr));
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.drawn = false;
    }
    pointer(x, y) {
      if (!this.visible) return;
      const r = this.c.getBoundingClientRect();
      this.tx = x - r.left;
      this.ty = y - r.top;
      this.energy = 1;
    }
    color() {
      const m = this.mode === 'light' ? 1 : this.mode === 'dark' ? 0 : this.c._mix || 0;
      const r = Math.round(lerp(242, 20, m));
      const g = Math.round(lerp(240, 17, m));
      const b = Math.round(lerp(234, 26, m));
      return `rgba(${r},${g},${b},${lerp(0.085, 0.11, m).toFixed(3)})`;
    }
    draw(t) {
      if (!this.visible || !this.w) return;
      if (reduced && this.drawn) return;
      if (t - this.last < 33) return;
      this.last = t;
      const { ctx, w, h } = this;
      this.mx = lerp(this.mx, this.tx, 0.08);
      this.my = lerp(this.my, this.ty, 0.08);
      this.energy *= 0.98;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.color();
      const lines = Math.round(clamp(h / 30, 12, 46));
      const gap = h / lines;
      const time = reduced ? 0 : t * 0.00018;
      const step = Math.max(14, w / 90);
      for (let i = -1; i <= lines + 1; i++) {
        const base = i * gap;
        ctx.beginPath();
        for (let x = -step; x <= w + step; x += step) {
          let y =
            base +
            Math.sin(x * 0.0042 + i * 0.33 + time * 2 + this.seed) * gap * 0.9 +
            Math.sin(x * 0.011 - i * 0.21 - time * 3) * gap * 0.25;
          const dx = x - this.mx;
          const dy = base - this.my;
          const k = Math.exp(-(dx * dx + dy * dy) / 26000);
          if (k > 0.002) y += k * Math.sin(x * 0.045 - t * 0.006) * 24 * (0.35 + this.energy * 0.65);
          if (x === -step) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      this.drawn = true;
    }
  }

  // ---------- Capa: o mouse "acende o palco" ----------
  // Em cima da foto normal (estúdio) desenhamos, só dentro do rastro do mouse,
  // uma versão "palco": fundo escuro, luzes, letreiro em neon e a banda em duotone.

  const Hero = {
    points: [],
    w: 0,
    h: 0,
    user: false,
    inside: false,
    lastUser: -1e9,
    autoT: 0,
    moves: 0,
    init() {
      this.sec = $('.hero');
      this.frame = $('[data-hero]');
      this.img = $('[data-hero-img]');
      this.cv = $('[data-hero-reveal]');
      if (!this.cv || !this.img) return;
      this.ctx = this.cv.getContext('2d');
      this.stage = document.createElement('canvas');
      this.hint = $('.hero__hint');
      this.visible = true;
      new IntersectionObserver(([e]) => (this.visible = e.isIntersecting)).observe(this.sec);
      if (this.img.complete && this.img.naturalWidth) this.build();
      else this.img.addEventListener('load', () => this.build(), { once: true });
      // O letreiro em neon precisa das mesmas fontes do texto da página.
      if (document.fonts?.load) {
        Promise.all([document.fonts.load('900 100px "Mona Sans"'), document.fonts.load('100px "Instrument Serif"')])
          .then(() => this.build())
          .catch(() => {});
      }
      const move = (e) => this.move(e.clientX, e.clientY, e.pointerType);
      this.sec.addEventListener('pointermove', move);
      this.sec.addEventListener('pointerdown', move);
      this.sec.addEventListener('pointerleave', () => (this.inside = false));
      this.sec.addEventListener(
        'touchmove',
        (e) => e.touches[0] && this.move(e.touches[0].clientX, e.touches[0].clientY, 'touch'),
        { passive: true }
      );
    },
    move(x, y, type) {
      if (!this.w) return;
      const r = this.cv.getBoundingClientRect();
      const px = ((x - r.left) * this.w) / r.width;
      const py = ((y - r.top) * this.h) / r.height;
      this.user = true;
      this.lastUser = performance.now();
      this.inside = type === 'mouse' || type === 'pen';
      this.addPoint(px, py);
      if (this.hint && ++this.moves === 50) this.hint.classList.add('is-done');
    },
    addPoint(x, y) {
      const last = this.points[this.points.length - 1];
      const d = last ? Math.hypot(x - last.x, y - last.y) : 999;
      if (d < 7) {
        last.life = 1;
        return;
      }
      this.points.push({ x, y, life: 1, size: 0.78 + Math.min(d, 120) / 320 });
      if (this.points.length > 70) this.points.shift();
    },
    offset(el) {
      let x = 0;
      let y = 0;
      for (let n = el; n && n !== this.frame; n = n.offsetParent) {
        x += n.offsetLeft;
        y += n.offsetTop;
      }
      return { x, y };
    },
    build() {
      const w = this.frame.offsetWidth;
      const h = this.frame.offsetHeight;
      if (!w || !h || !this.img.naturalWidth) return;
      const dpr = Math.min(devicePixelRatio || 1, 1.6);
      Object.assign(this, { w, h, dpr });
      this.cv.width = this.stage.width = Math.round(w * dpr);
      this.cv.height = this.stage.height = Math.round(h * dpr);
      const g = this.stage.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Posição da foto (left: 50% + translateX(-50%), presa embaixo).
      const iw = this.img.offsetWidth;
      const ih = this.img.offsetHeight;
      const ix = this.img.offsetLeft - iw / 2;
      const iy = this.img.offsetTop;

      // Fundo de palco com brilho violeta e feixes de luz.
      g.fillStyle = '#0d0b14';
      g.fillRect(0, 0, w, h);
      const cx = w / 2;
      const cy = iy + ih * 0.42;
      const glow = g.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.6);
      glow.addColorStop(0, 'rgba(138,63,252,0.6)');
      glow.addColorStop(0.45, 'rgba(91,43,214,0.2)');
      glow.addColorStop(1, 'rgba(13,11,20,0)');
      g.fillStyle = glow;
      g.fillRect(0, 0, w, h);
      g.globalCompositeOperation = 'lighter';
      [
        [0.16, 'rgba(61,227,255,0.13)'],
        [0.5, 'rgba(182,140,255,0.14)'],
        [0.84, 'rgba(61,227,255,0.13)'],
      ].forEach(([fx, col]) => {
        const x0 = w * fx;
        const beam = g.createLinearGradient(0, 0, 0, h);
        beam.addColorStop(0, col);
        beam.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = beam;
        g.beginPath();
        g.moveTo(x0 - w * 0.015, 0);
        g.lineTo(x0 + w * 0.015, 0);
        g.lineTo(x0 + w * 0.17, h);
        g.lineTo(x0 - w * 0.17, h);
        g.closePath();
        g.fill();
      });
      g.globalCompositeOperation = 'source-over';

      // Linhas de som em violeta.
      g.strokeStyle = 'rgba(182,140,255,0.18)';
      g.lineWidth = 1;
      const lines = Math.round(clamp(h / 30, 12, 46));
      const gap = h / lines;
      for (let i = 0; i <= lines; i++) {
        g.beginPath();
        for (let x = 0; x <= w + 20; x += 20) {
          const y = i * gap + Math.sin(x * 0.0042 + i * 0.33) * gap * 0.9;
          if (x === 0) g.moveTo(x, y);
          else g.lineTo(x, y);
        }
        g.stroke();
      }

      // Letreiro "BANDA 3 EM 1" em neon, no mesmo lugar do texto da página.
      this.neon(g, $('[data-hero-small]'), true);
      this.neon(g, $('[data-hero-big]'), false);

      // Banda em duotone violeta com luz ciano de recorte.
      g.drawImage(this.duotone(Math.round(iw * dpr), Math.round(ih * dpr)), ix, iy, iw, ih);
      this.cleared = false;
    },
    // Desenha cada letra exatamente onde ela está na página (posição de layout, sem a animação).
    neon(g, el, fill) {
      const probe = el && $('.hero__probe', el);
      if (!probe) return;
      const cs = getComputedStyle(el);
      const size = parseFloat(cs.fontSize);
      const base = this.offset(probe).y;
      const chars = $$('.ch', el)
        .map((ch) => ({ ch: ch.textContent.toUpperCase(), x: this.offset(ch).x }))
        .filter((c) => c.ch.trim());
      g.save();
      g.font = `${cs.fontStyle} ${cs.fontWeight} ${size}px ${cs.fontFamily}`;
      g.textAlign = 'left';
      g.textBaseline = 'alphabetic';
      g.lineJoin = 'round';
      g.shadowColor = 'rgba(138,63,252,0.95)';
      const pass = (blur, paint) => {
        g.shadowBlur = blur;
        chars.forEach((c) => paint(c.ch, c.x, base));
      };
      if (fill) {
        g.fillStyle = '#e6d9ff';
        pass(size * 0.4, (t, x, y) => g.fillText(t, x, y));
      } else {
        g.strokeStyle = '#8a3ffc';
        g.lineWidth = Math.max(2, size * 0.022);
        pass(size * 0.1, (t, x, y) => g.strokeText(t, x, y));
        g.strokeStyle = '#efe6ff';
        g.lineWidth = Math.max(1, size * 0.007);
        pass(size * 0.04, (t, x, y) => g.strokeText(t, x, y));
      }
      g.restore();
    },
    // Duotone só com modos de mistura (funciona até abrindo o arquivo direto no navegador).
    duotone(w, h) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const x = c.getContext('2d');
      x.drawImage(this.img, 0, 0, w, h);
      x.globalCompositeOperation = 'saturation';
      x.fillStyle = '#808080';
      x.fillRect(0, 0, w, h);
      x.globalCompositeOperation = 'multiply';
      x.fillStyle = '#d8c6ff';
      x.fillRect(0, 0, w, h);
      x.globalCompositeOperation = 'screen';
      x.fillStyle = '#2a0b63';
      x.fillRect(0, 0, w, h);
      const rim = x.createLinearGradient(w, 0, w * 0.35, h * 0.6);
      rim.addColorStop(0, 'rgba(61,227,255,0.55)');
      rim.addColorStop(1, 'rgba(61,227,255,0)');
      x.fillStyle = rim;
      x.fillRect(0, 0, w, h);
      x.globalCompositeOperation = 'destination-in';
      x.drawImage(this.img, 0, 0, w, h);
      return c;
    },
    shapes(ctx, grow) {
      const R = clamp(this.w * 0.075, 60, 140);
      const radius = (p) => Math.max(0, R * p.size * easeOut(clamp(p.life)) + grow);
      ctx.beginPath();
      for (const p of this.points) {
        const r = radius(p);
        if (r <= 0) continue;
        ctx.moveTo(p.x + r, p.y);
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.lineCap = 'round';
      for (let i = 1; i < this.points.length; i++) {
        const a = this.points[i - 1];
        const b = this.points[i];
        if (Math.hypot(b.x - a.x, b.y - a.y) > 240) continue;
        const r = Math.min(radius(a), radius(b));
        if (r <= 0) continue;
        ctx.lineWidth = r * 2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    },
    tick(t, dt) {
      if (!this.visible || !this.w || !html.classList.contains('is-loaded')) return;
      // Sem interação, um "holofote" passeia sozinho para mostrar o efeito.
      const idle = !this.user || (!finePointer && t - this.lastUser > 2600);
      if (idle && !reduced) {
        this.autoT += dt;
        const a = this.autoT * 0.0007;
        this.addPoint(this.w * (0.5 + Math.sin(a) * 0.3), this.h * (0.6 + Math.sin(a * 1.7) * 0.13));
      }
      if (this.inside && this.points.length) this.points[this.points.length - 1].life = 1;
      const decay = dt / 950;
      this.points.forEach((p) => (p.life -= decay));
      while (this.points.length && this.points[0].life <= 0) this.points.shift();

      const ctx = this.ctx;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      if (!this.points.length) {
        if (!this.cleared) ctx.clearRect(0, 0, this.w, this.h);
        this.cleared = true;
        return;
      }
      this.cleared = false;
      ctx.clearRect(0, 0, this.w, this.h);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = ctx.strokeStyle = '#fff';
      this.shapes(ctx, 0);
      ctx.globalCompositeOperation = 'source-in';
      ctx.drawImage(this.stage, 0, 0, this.w, this.h);
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = ctx.strokeStyle = 'rgba(182,140,255,0.95)';
      this.shapes(ctx, 3);
      ctx.globalCompositeOperation = 'source-over';
    },
  };

  // ---------- Cursor, botões magnéticos, cards 3D e prévia das músicas ----------

  const Cursor = {
    init() {
      if (!finePointer) return;
      html.classList.add('has-cursor');
      this.el = $('.cursor');
      this.dot = $('.cursor__dot');
      this.ring = $('.cursor__ring');
      this.label = $('.cursor__label');
      this.x = this.rx = innerWidth / 2;
      this.y = this.ry = innerHeight / 2;
      this.el.classList.add('is-out');
      addEventListener(
        'pointermove',
        (e) => {
          if (e.pointerType !== 'mouse') return;
          this.x = e.clientX;
          this.y = e.clientY;
          this.el.classList.remove('is-out');
          this.dot.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
        },
        { passive: true }
      );
      document.documentElement.addEventListener('mouseleave', () => this.el.classList.add('is-out'));
      document.addEventListener('mouseover', (e) => this.hover(e.target));
    },
    hover(t) {
      if (!t.closest) return;
      const lab = t.closest('[data-cursor]');
      const link = t.closest('a, button, [data-decade], label, [data-tilt]');
      const text = t.closest('input, textarea, select, iframe');
      const hide = (t.closest('.hero') && !link) || t.closest('.song');
      this.el.classList.toggle('is-label', !!lab);
      this.label.textContent = lab ? lab.dataset.cursor : '';
      this.el.classList.toggle('is-link', !!link && !lab);
      this.el.classList.toggle('is-text', !!text);
      this.el.classList.toggle('is-hero', !!hide && !lab);
    },
    tick() {
      if (!this.ring) return;
      this.rx = lerp(this.rx, this.x, 0.2);
      this.ry = lerp(this.ry, this.y, 0.2);
      this.ring.style.transform = `translate3d(${this.rx.toFixed(2)}px, ${this.ry.toFixed(2)}px, 0)`;
    },
  };

  function initMagnetic() {
    if (!finePointer || reduced) return;
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${(dx * 0.22).toFixed(2)}px, ${(dy * 0.32).toFixed(2)}px)`;
      });
      el.addEventListener('pointerleave', () => (el.style.transform = ''));
    });
  }

  function initTilt() {
    if (!finePointer || reduced) return;
    $$('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', `${((px - 0.5) * 14).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${((0.5 - py) * 12).toFixed(2)}deg`);
        card.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  const Preview = {
    init() {
      if (!finePointer) return;
      this.el = $('[data-song-preview]');
      const list = $('[data-songs]');
      if (!this.el || !list) return;
      this.decade = $('.song-preview__decade', this.el);
      this.cat = $('.song-preview__cat', this.el);
      this.x = this.px = 0;
      this.y = this.py = 0;
      list.addEventListener('pointermove', (e) => {
        const row = e.target.closest('.song');
        this.x = e.clientX;
        this.y = e.clientY;
        if (!this.on) {
          this.px = this.x + 96;
          this.py = this.y;
        }
        if (row && row !== this.row) {
          this.row = row;
          this.decade.textContent = row.dataset.decade;
          this.cat.textContent = row.dataset.cat;
        }
        this.on = !!row;
        this.el.classList.toggle('is-on', this.on);
      });
      list.addEventListener('pointerleave', () => {
        this.on = false;
        this.row = null;
        this.el.classList.remove('is-on');
      });
    },
    tick() {
      if (!this.el || !this.on) return;
      this.px = lerp(this.px, this.x + 96, 0.16);
      this.py = lerp(this.py, this.y, 0.16);
      this.el.style.transform = `translate3d(${this.px.toFixed(1)}px, ${this.py.toFixed(1)}px, 0)`;
    },
  };

  // Fotos da galeria flutuam levemente com o mouse (profundidades diferentes).
  const Parallax = {
    items: [],
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    init() {
      if (!finePointer || reduced) return;
      this.items = $$('.hg-item');
      addEventListener(
        'pointermove',
        (e) => {
          this.tx = e.clientX / innerWidth - 0.5;
          this.ty = e.clientY / innerHeight - 0.5;
        },
        { passive: true }
      );
    },
    tick(active) {
      if (!this.items.length || !active) return;
      const nx = lerp(this.x, this.tx, 0.06);
      const ny = lerp(this.y, this.ty, 0.06);
      if (Math.abs(nx - this.x) < 0.0003 && Math.abs(ny - this.y) < 0.0003) return;
      this.x = nx;
      this.y = ny;
      this.items.forEach((el) => {
        const d = Number(el.dataset.depth) || 1;
        el.style.transform = `translate3d(${(-this.x * d * 22).toFixed(2)}px, ${(-this.y * d * 16).toFixed(2)}px, 0)`;
      });
    },
  };

  // ---------- Menu em tela cheia ----------

  const Menu = {
    open: false,
    init() {
      this.el = $('[data-menu]');
      this.btn = $('[data-menu-toggle]');
      if (!this.el || !this.btn) return;
      this.label = $('[data-menu-label]');
      this.tiles = $$('.menu__tile', this.el);
      this.btn.addEventListener('click', () => this.toggle(!this.open, true));
      const hot = (e) => {
        const a = e.target.closest('[data-tile]');
        if (a) this.hot(Number(a.dataset.tile));
      };
      this.el.addEventListener('pointerover', hot);
      this.el.addEventListener('focusin', hot);
      document.addEventListener('keydown', (e) => {
        if (!this.open) return;
        if (e.key === 'Escape') this.toggle(false, true);
        if (e.key === 'Tab') this.trap(e);
      });
      this.hot(0);
    },
    hot(i) {
      this.tiles.forEach((t, k) => t.classList.toggle('is-hot', k === i));
    },
    toggle(open, returnFocus) {
      if (open === this.open) return;
      this.open = open;
      clearTimeout(this.timer);
      this.btn.setAttribute('aria-expanded', String(open));
      this.label.textContent = open ? 'Fechar menu' : 'Abrir menu';
      Smooth.lock(open);
      updateHeader(scrollY);
      if (open) {
        $$('[data-section-link]', this.el).forEach((a) =>
          a.classList.toggle('is-current', a.dataset.sectionLink === Layout.current)
        );
        this.el.hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => this.el.classList.add('is-open')));
        this.timer = setTimeout(() => $('a', this.el)?.focus({ preventScroll: true }), 450);
      } else {
        this.el.classList.remove('is-open');
        this.timer = setTimeout(() => (this.el.hidden = true), 900);
        if (returnFocus) this.btn.focus({ preventScroll: true });
      }
    },
    trap(e) {
      const items = [this.btn, ...$$('a[href]', this.el)];
      const i = items.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        items[items.length - 1].focus();
      } else if (!e.shiftKey && i === items.length - 1) {
        e.preventDefault();
        items[0].focus();
      }
    },
  };

  // ---------- Janela de fotos e vídeos ----------

  const Modal = {
    items: [],
    index: 0,
    mode: null,
    init() {
      this.el = $('[data-modal]');
      if (!this.el) return;
      this.body = $('[data-modal-body]');
      this.cap = $('[data-modal-caption]');
      this.prev = $('[data-modal-prev]');
      this.next = $('[data-modal-next]');
      this.closeBtn = $('[data-modal-close]');
      this.closeBtn.addEventListener('click', () => this.close());
      this.prev.addEventListener('click', () => this.go(-1));
      this.next.addEventListener('click', () => this.go(1));
      this.el.addEventListener('click', (e) => (e.target === this.el || e.target === this.body) && this.close());
      document.addEventListener('keydown', (e) => {
        if (this.el.hidden) return;
        if (e.key === 'Escape') this.close();
        if (this.mode === 'photo' && e.key === 'ArrowLeft') this.go(-1);
        if (this.mode === 'photo' && e.key === 'ArrowRight') this.go(1);
        if (e.key === 'Tab') {
          const items = $$('button:not([hidden]), iframe', this.el);
          const i = items.indexOf(document.activeElement);
          if (e.shiftKey && i <= 0) {
            e.preventDefault();
            items[items.length - 1].focus();
          } else if (!e.shiftKey && i === items.length - 1) {
            e.preventDefault();
            items[0].focus();
          }
        }
      });
      let sx = null;
      this.el.addEventListener('pointerdown', (e) => (sx = e.clientX));
      this.el.addEventListener('pointerup', (e) => {
        if (sx === null || this.mode !== 'photo') return;
        const dx = e.clientX - sx;
        sx = null;
        if (Math.abs(dx) > 50) this.go(dx < 0 ? 1 : -1);
      });
      document.addEventListener('click', (e) => {
        const p = e.target.closest('[data-photo]');
        if (p) return this.photos(Number(p.dataset.photo));
        const v = e.target.closest('[data-video]');
        if (v) this.video(v.dataset.video, v.dataset.title);
      });
    },
    show() {
      this.last = document.activeElement;
      this.el.hidden = false;
      requestAnimationFrame(() => this.el.classList.add('is-open'));
      Smooth.lock(true);
      this.closeBtn.focus({ preventScroll: true });
    },
    photos(i) {
      this.mode = 'photo';
      this.el.classList.remove('is-video');
      this.items = GALLERY;
      this.index = i;
      this.prev.hidden = this.next.hidden = GALLERY.length < 2;
      this.render();
      this.show();
    },
    render() {
      const f = this.items[this.index];
      this.body.innerHTML = `<img src="${esc(f.src)}" alt="${esc(f.alt)}">`;
      this.cap.textContent = `${pad(this.index + 1)} / ${pad(this.items.length)} — ${f.caption}`;
    },
    go(d) {
      this.index = (this.index + d + this.items.length) % this.items.length;
      this.render();
    },
    video(id, title) {
      // Aberto direto do arquivo (file://) o YouTube não deixa incorporar: abre em nova aba.
      if (location.protocol === 'file:') {
        window.open(`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`, '_blank', 'noopener');
        return;
      }
      this.mode = 'video';
      this.el.classList.add('is-video');
      this.prev.hidden = this.next.hidden = true;
      const v = (B.videos || []).find((x) => x.youtubeId === id);
      this.body.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0" title="${esc(title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
      this.cap.textContent = v?.descricao || title;
      this.show();
    },
    close() {
      this.el.classList.remove('is-open');
      Smooth.lock(false);
      setTimeout(() => {
        this.el.hidden = true;
        this.body.innerHTML = '';
      }, 350);
      this.last?.focus?.({ preventScroll: true });
    },
  };

  // ---------- Rodapé com "aba" recortada (forma do rodapé do Lando) ----------

  function shapeFooter() {
    const tab = $('.footer__tab');
    if (!tab || !window.CSS?.supports?.('clip-path', 'path("M0 0")')) return;
    const w = tab.offsetWidth;
    const h = tab.offsetHeight;
    const t = Math.min(58, w * 0.08);
    const r = Math.min(40, w * 0.05);
    const s = Math.min(46, w * 0.06);
    const bw = Math.min(w * 0.5, 640);
    const b0 = (w - bw) / 2;
    const b1 = b0 + bw;
    const d = `M0 ${t + r} Q0 ${t} ${r} ${t} L${b0 - s} ${t} C${b0} ${t} ${b0} 0 ${b0 + s} 0 L${b1 - s} 0 C${b1} 0 ${b1} ${t} ${b1 + s} ${t} L${w - r} ${t} Q${w} ${t} ${w} ${t + r} L${w} ${h} L0 ${h} Z`;
    tab.style.clipPath = `path("${d}")`;
    tab.style.borderRadius = '0';
  }

  // ---------- Tela de carregamento ----------

  const Loader = {
    init() {
      this.el = $('.loader');
      this.num = $('[data-loader-count]');
      if (!this.el || reduced) return this.finish();
      const img = $('[data-hero-img]');
      const tasks = [
        img && !img.complete
          ? new Promise((r) => {
              img.addEventListener('load', r, { once: true });
              img.addEventListener('error', r, { once: true });
            })
          : Promise.resolve(),
        document.fonts ? document.fonts.ready : Promise.resolve(),
        document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => addEventListener('load', r, { once: true })),
      ];
      let done = 0;
      tasks.forEach((p) => p.then(() => done++, () => done++));
      const cap = setTimeout(() => (done = tasks.length), 4500);
      const t0 = performance.now();
      let shown = 0;
      const step = (t) => {
        const goal = Math.min((done / tasks.length) * 100, clamp((t - t0) / 1500) * 100);
        shown = goal - shown < 0.6 ? goal : lerp(shown, goal, 0.12);
        this.num.textContent = Math.round(shown);
        if (shown >= 100) {
          clearTimeout(cap);
          setTimeout(() => this.finish(), 260);
          return;
        }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },
    finish() {
      html.classList.add('is-loaded');
      setTimeout(() => this.el?.remove(), 1400);
      Layout.refresh();
    },
  };

  // ---------- Início ----------

  bindContent();
  renderNav();
  renderNumbers();
  renderMarquee();
  renderGallery();
  renderMembers();
  renderVenues();
  renderDecades();
  renderVideos();
  renderBooking();
  renderFaq();
  splitHeroTitle();
  Songs.init();
  Agenda.init();
  Form.init();
  Reveal.init();
  initCounters();
  Smooth.init();
  initAnchors();
  buildScenes();
  Menu.init();
  Modal.init();
  Cursor.init();
  initMagnetic();
  initTilt();
  Preview.init();
  Parallax.init();
  Hero.init();
  shapeFooter();
  Loader.init();

  const waves = $$('canvas[data-waves]').map((c) => new Waves(c));
  addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'mouse') waves.forEach((w) => w.pointer(e.clientX, e.clientY));
    },
    { passive: true }
  );

  const relayout = () => {
    waves.forEach((w) => w.resize());
    Hero.build();
    shapeFooter();
    Songs.movePill();
    Layout.refresh();
  };
  document.fonts?.ready.then(relayout);
  let fontTimer;
  document.fonts?.addEventListener?.('loadingdone', () => {
    clearTimeout(fontTimer);
    fontTimer = setTimeout(relayout, 120);
  });

  let resizeTimer;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // No celular a barra de endereço muda a altura ao rolar; só refaz se mudar de verdade.
      if (innerWidth === Layout.vw && !finePointer && Math.abs(innerHeight - Layout.vh) < 160) return;
      relayout();
    }, 160);
  });
  if ('ResizeObserver' in window) new ResizeObserver(() => Layout.refresh()).observe(document.body);

  const venues = $('.venues__track');
  const hgSection = $('[data-hgallery]');
  let lastY = -1;
  let lastT = performance.now();
  let skew = 0;

  function frame(t) {
    const dt = Math.min(64, t - lastT);
    lastT = t;
    Smooth.tick();
    const measured = Layout.dirty && Layout.measure();
    const y = scrollY;
    if (y !== lastY || measured) {
      Scenes.update(y, measured);
      updateHeader(y);
    }
    if (venues && !reduced) {
      const vel = lastY < 0 ? 0 : y - lastY;
      skew = lerp(skew, clamp(-vel * 0.35, -10, 10), 0.12);
      if (Math.abs(skew) > 0.05 || venues.style.transform) venues.style.transform = Math.abs(skew) > 0.05 ? `skewX(${skew.toFixed(2)}deg)` : '';
    }
    lastY = y;
    waves.forEach((w) => w.draw(t));
    Hero.tick(t, dt);
    Cursor.tick();
    Preview.tick();
    Parallax.tick(hgSection && y > hgSection.offsetTop - innerHeight && y < hgSection.offsetTop + hgSection.offsetHeight);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
