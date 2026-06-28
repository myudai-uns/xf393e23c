/* AT-T RECRUITING SITE 共通スクリプト */

document.addEventListener('DOMContentLoaded', () => {

  /* 透過ヘッダー: スクロールでダーク背景 */
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* TOPインタビューカルーセル: 左右に連続ループ・中央カードを拡大 */
  const wrap = document.querySelector('.carousel-wrap');
  const carousel = document.querySelector('.carousel');
  if (wrap && carousel) {
    const orig = [...carousel.querySelectorAll('.iv-card')];
    const N = orig.length;
    if (N) {
      // 無限ループ用に前後へ複製（計3セット）
      for (let s = 0; s < 2; s++) orig.forEach(c => {
        const cl = c.cloneNode(true);
        cl.setAttribute('aria-hidden', 'true');
        cl.setAttribute('tabindex', '-1');
        carousel.appendChild(cl);
      });
      const cards = [...carousel.querySelectorAll('.iv-card')];
      let NORMAL = 302, FEAT = 322, GAP = 34;  // 実寸を測って上書き（SP/PCのCSS差=vwに追従し、写真を必ず画面中央へ）
      let active = N + 2;
      let timer = null, busy = false;
      const setTrans = (on) => {
        carousel.style.transition = on ? '' : 'none';
        cards.forEach(c => { c.style.transition = on ? '' : 'none'; });
      };
      const measureDims = () => {
        setTrans(false);
        cards.forEach((c, i) => c.classList.toggle('featured', i === active));
        void carousel.offsetWidth; // 強制リフローして実寸確定
        const cs = getComputedStyle(carousel);
        GAP = parseFloat(cs.columnGap || cs.gap) || GAP;
        FEAT = cards[active].getBoundingClientRect().width || FEAT;
        const nf = cards.find((c, i) => i !== active);
        NORMAL = nf ? nf.getBoundingClientRect().width : FEAT;
        setTrans(true);
      };
      const place = () => {
        cards.forEach((c, i) => c.classList.toggle('featured', i === active));
        const center = active * (NORMAL + GAP) + FEAT / 2;
        carousel.style.transform = 'translateX(' + Math.round(wrap.clientWidth / 2 - center) + 'px)';
      };
      const recenter = () => {
        let n = active;
        if (active >= 2 * N) n = active - N;
        else if (active < N) n = active + N;
        if (n !== active) {
          setTrans(false);
          active = n;
          place();
          void carousel.offsetWidth; // 強制リフロー（瞬間移動・継ぎ目なし）
          setTrans(true);
        }
        busy = false;
      };
      const go = (n) => {
        active = n;
        setTrans(true);
        place();
        if (active >= 2 * N || active < N) { busy = true; setTimeout(recenter, 620); }
      };
      const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
      const play = () => { stop(); timer = setInterval(() => { if (!busy) go(active + 1); }, 3000); };
      document.querySelector('.carousel-btn.prev')?.addEventListener('click', () => { if (!busy) { go(active - 1); play(); } });
      document.querySelector('.carousel-btn.next')?.addEventListener('click', () => { if (!busy) { go(active + 1); play(); } });
      wrap.addEventListener('mouseenter', stop);
      wrap.addEventListener('mouseleave', play);
      window.addEventListener('resize', () => { measureDims(); place(); });
      measureDims();
      place();
      play();
    }
  }

  /* FAQ アコーディオン（初期は閉・A非表示、＋で開いてーになる） */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      item.classList.toggle('closed');
      q.querySelector('.toggle').textContent = item.classList.contains('closed') ? '＋' : '−';
    });
  });

  /* RECRUIT 新卒／中途タブ切替 */
  const tabBtns = document.querySelectorAll('.tab-btn');
  if (tabBtns.length) {
    const panels = document.querySelectorAll('.recruit-panel');
    const showPanel = (name) => {
      tabBtns.forEach(btn => {
        const on = btn.dataset.tab === name;
        btn.classList.toggle('t-dark', on);
        btn.classList.toggle('t-line', !on);
      });
      panels.forEach(pn => { pn.hidden = (pn.dataset.panel !== name); });
    };
    tabBtns.forEach(btn => btn.addEventListener('click', () => showPanel(btn.dataset.tab)));
    if (location.hash === '#chuto') showPanel('chuto');
  }

  /* スクロール連動：数字カウントアップ／ボイスメーター */
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const countUp = (target, decimals, dur, render) => {
    let start = null;
    const step = (t) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / dur, 1);
      render((target * easeOut(p)).toFixed(decimals));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // NUMBERS: 数値を0に初期化して保持
  document.querySelectorAll('.num-box .value').forEach(v => {
    const tn = v.firstChild;
    const raw = (tn.textContent || '').trim();
    v.dataset.target = raw;
    const dec = (raw.split('.')[1] || '').length;
    tn.textContent = (0).toFixed(dec);
  });
  const animateNum = (v) => {
    const tn = v.firstChild;
    const raw = v.dataset.target || '';
    const target = parseFloat(raw.replace(/,/g, ''));
    if (isNaN(target)) return;
    const dec = (raw.split('.')[1] || '').length;
    countUp(target, dec, 1500, val => { tn.textContent = val; });
  };

  // VOICE: メーター幅と％を0に初期化して保持
  document.querySelectorAll('.voice-bar .fill').forEach(f => {
    f.dataset.w = f.style.width || '0%';
    const m = (f.textContent || '').match(/^(.*?)([\d.]+)％/);
    f.dataset.label = m ? m[1] : '';
    f.dataset.num = m ? m[2] : '0';
    f.style.width = '0%';
    f.textContent = (m ? m[1] : '') + '0％';
  });
  const animateVoice = (bar) => {
    const f = bar.querySelector('.fill');
    if (!f) return;
    requestAnimationFrame(() => { f.style.width = f.dataset.w; });
    const num = parseFloat(f.dataset.num);
    countUp(num, 0, 1500, val => { f.textContent = f.dataset.label + val + '％'; });
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        if (el.classList.contains('num-box')) animateNum(el.querySelector('.value'));
        else if (el.classList.contains('voice-bar')) animateVoice(el);
        io.unobserve(el);
      });
    }, { threshold: 0.45 });
    document.querySelectorAll('.num-box').forEach(n => io.observe(n));
    document.querySelectorAll('.voice-bar').forEach(b => io.observe(b));
  }

  /* エントリーフォーム: 送信前の確認画面（JS無効時は直接送信にフォールバック） */
  const entryForm = document.getElementById('entry-form');
  if (entryForm) {
    const inputView   = document.getElementById('form-input');
    const confirmView = document.getElementById('form-confirm');
    const confirmRows = document.getElementById('confirmRows');
    const toEdit      = document.getElementById('toEdit');
    const sendBtn     = document.getElementById('sendBtn');
    const steps       = document.querySelectorAll('.entry-steps .entry-step');
    let confirmed = false;

    const fields = [
      ['kbn', '応募区分'], ['name', '氏名'], ['kana', 'フリガナ'], ['birth', '生年月日'],
      ['email', 'メール'], ['tel', '電話番号'], ['address', '住所'], ['education', '学歴'],
      ['career', '職歴'], ['motivation', '志望動機'], ['kengaku', '工場見学希望']
    ];
    const getVal = (n) => {
      const els = entryForm.elements[n];
      if (!els) return '';
      if (typeof els.length === 'number' && els[0] && els[0].type === 'radio') {
        const c = [...els].find(r => r.checked);
        return c ? c.value : '';
      }
      return (els.value || '').trim();
    };
    const esc = (s) => s.replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
    const setStep = (n) => steps.forEach((s, i) => s.classList.toggle('active', i === n));

    const buildConfirm = () => {
      confirmRows.innerHTML = fields.map(([n, label]) => {
        const v = getVal(n);
        const disp = v === '' ? '（未入力）' : esc(v);
        return '<div class="form-row"><span class="f-label">' + label + '</span><div class="confirm-val">' + disp + '</div></div>';
      }).join('');
    };

    entryForm.addEventListener('submit', (e) => {
      if (confirmed) return;                 // 「送信する」押下後は本送信を許可
      e.preventDefault();
      if (!entryForm.reportValidity()) return; // 必須・メール形式チェック
      buildConfirm();
      inputView.hidden = true;
      confirmView.hidden = false;
      setStep(1);                            // 02 確認
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    toEdit.addEventListener('click', () => {
      confirmView.hidden = true;
      inputView.hidden = false;
      setStep(0);                            // 01 入力
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    sendBtn.addEventListener('click', () => { confirmed = true; });
  }

});
