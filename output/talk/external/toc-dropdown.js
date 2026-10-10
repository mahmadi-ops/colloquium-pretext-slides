/* Table-of-contents dropdown for the PreTeXt reveal.js slideshow.
 *
 * A small button in the bottom-left corner shows the slide number, the part of the
 * talk, and the current slide's title. It follows every slide change. Click it, or
 * press T, to open the contents: the parts of the talk with their slides, the
 * current slide highlighted and kept in view. Each "How it's coded" walkthrough is
 * one entry; its steps open while you are inside it. Click any entry to jump there.
 * Esc or T closes the list; arrow keys keep moving through the slides while it is
 * open, and the highlight moves with them.
 *
 * Loaded by xsl/talk-revealjs.xsl; styled at the end of assets/talk.css.
 */
(function () {
  'use strict';

  var WALK = /^How it(?:’|')s coded · (.+?) · step (\d+) of (\d+)/;

  function text(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }

  // One entry per slide: its kind, its title, the part of the talk it belongs to.
  function readSlides(slides) {
    var part = '', out = [];
    slides.forEach(function (s, i) {
      var h1 = s.querySelector(':scope > h1'), h2 = s.querySelector(':scope > h2'), h3 = s.querySelector(':scope > h3');
      var e = { i: i, el: s, kind: 'slide', title: '', part: part };
      if (h1) { e.kind = 'cover'; e.title = text(h1); }
      else if (h2 && s.children.length === 1) { e.kind = 'part'; e.title = text(h2); part = e.title; e.part = part; }
      else {
        e.title = text(h3 || h2) || 'Slide ' + (i + 1);
        var alert = s.querySelector('.alert');
        var m = alert && text(alert).match(WALK);
        if (m) { e.kind = 'step'; e.walk = m[1]; e.step = +m[2]; e.steps = +m[3]; }
      }
      out.push(e);
    });
    return out;
  }

  function el(tag, cls, html) {
    var x = document.createElement(tag);
    if (cls) x.className = cls;
    if (html != null) x.innerHTML = html;
    return x;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function start() {
    var slides = Reveal.getSlides();
    var items = readSlides(slides);
    var N = items.length;

    // ----- the button -----
    var nav = el('nav', 'toc-dd');
    nav.setAttribute('aria-label', 'Table of contents');
    var btn = el('button', 'toc-dd-btn');
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'toc-dd-panel');
    btn.title = 'Table of contents (T)';
    btn.innerHTML = '<span class="toc-dd-n"></span><span class="toc-dd-txt"><small></small><b></b></span><span class="toc-dd-caret" aria-hidden="true">▴</span>';
    var bN = btn.querySelector('.toc-dd-n'), bPart = btn.querySelector('small'), bTitle = btn.querySelector('b');

    // ----- the list -----
    var panel = el('div', 'toc-dd-panel');
    panel.id = 'toc-dd-panel';
    panel.hidden = true;
    panel.appendChild(el('div', 'toc-dd-head', 'Contents <span><kbd>T</kbd> opens and closes · click to jump</span>'));
    var list = el('ol', 'toc-dd-list');
    panel.appendChild(list);

    var rows = new Array(N);     // the button for each slide
    var groups = [];             // walkthrough groups, to open the current one
    function jumpButton(e, label, cls) {
      var b = el('button', cls || '', label);
      b.type = 'button';
      b.dataset.i = e.i;
      rows[e.i] = b;
      return b;
    }
    for (var k = 0; k < N; k++) {
      var e = items[k];
      if (e.kind === 'step') {
        // a walkthrough: one entry, its steps nested and folded
        var li = el('li', 'toc-dd-walk');
        var head = el('button', 'toc-dd-walkhead', '<span class="toc-dd-num">' + (e.i + 1) + '</span><span>How it’s coded · ' + esc(e.walk) + ' <i>' + e.steps + ' steps</i></span>');
        head.type = 'button';
        head.dataset.i = e.i;
        li.appendChild(head);
        var sub = el('ol', 'toc-dd-steps');
        var first = k;
        while (k < N && items[k].kind === 'step' && items[k].walk === e.walk) {
          var s = items[k];
          var sli = el('li');
          sli.appendChild(jumpButton(s, '<span class="toc-dd-num">' + (s.i + 1) + '</span><span>' + s.step + '. ' + esc(s.title) + '</span>'));
          sub.appendChild(sli);
          k++;
        }
        k--;
        li.appendChild(sub);
        list.appendChild(li);
        groups.push({ li: li, from: first, to: k });
      } else {
        var li2 = el('li', e.kind === 'part' ? 'toc-dd-part' : (e.kind === 'cover' ? 'toc-dd-cover' : ''));
        li2.appendChild(jumpButton(e, '<span class="toc-dd-num">' + (e.i + 1) + '</span><span>' + esc(e.title) + '</span>'));
        list.appendChild(li2);
      }
    }

    nav.appendChild(panel);
    nav.appendChild(btn);
    document.body.appendChild(nav);

    // ----- follow the slides -----
    var current = -1;
    function update() {
      var i = slides.indexOf(Reveal.getCurrentSlide());
      if (i < 0) return;
      current = i;
      var e = items[i];
      bN.textContent = (i + 1) + ' / ' + N;
      bPart.textContent = e.kind === 'part' || e.kind === 'cover' ? 'Contents' : e.part;
      bTitle.textContent = e.kind === 'step' ? 'How it’s coded · ' + e.walk + ' · ' + e.step + '/' + e.steps : e.title;
      rows.forEach(function (r) { if (r) r.removeAttribute('aria-current'); });
      if (rows[i]) rows[i].setAttribute('aria-current', 'true');
      groups.forEach(function (g) {
        var inside = i >= g.from && i <= g.to;
        g.li.classList.toggle('open', inside);
        g.li.classList.toggle('here', inside);
      });
      if (!panel.hidden) keepInView();
    }
    function keepInView() {
      var r = rows[current];
      if (!r) return;
      var top = r.offsetTop - list.offsetTop, h = r.offsetHeight;
      if (top < list.scrollTop + 8 || top + h > list.scrollTop + list.clientHeight - 8) {
        list.scrollTop = top - list.clientHeight / 2 + h / 2;
      }
    }

    // ----- open, close, jump -----
    function open() {
      panel.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      nav.classList.add('is-open');
      keepInView();
    }
    function close() {
      panel.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }
    function toggle() { if (panel.hidden) open(); else close(); }

    btn.addEventListener('click', function (ev) { ev.stopPropagation(); toggle(); });
    panel.addEventListener('click', function (ev) {
      var b = ev.target.closest('button[data-i]');
      if (!b) return;
      ev.stopPropagation();
      var idx = Reveal.getIndices(slides[+b.dataset.i]);
      Reveal.slide(idx.h, idx.v);
      close();
      btn.focus();
    });
    document.addEventListener('click', function (ev) {
      if (!panel.hidden && !nav.contains(ev.target)) close();
    });
    // T toggles; Esc closes the list before reveal.js sees it (Esc is its overview key)
    window.addEventListener('keydown', function (ev) {
      var t = ev.target, tag = (t && t.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
      if (ev.altKey || ev.ctrlKey || ev.metaKey) return;
      if (ev.key === 't' || ev.key === 'T') { ev.preventDefault(); ev.stopPropagation(); toggle(); }
      else if (ev.key === 'Escape' && !panel.hidden) { ev.preventDefault(); ev.stopPropagation(); close(); btn.focus(); }
    }, true);

    Reveal.on('slidechanged', update);
    update();
  }

  if (window.Reveal && Reveal.isReady && Reveal.isReady()) start();
  else if (window.Reveal) Reveal.on('ready', start);
})();
