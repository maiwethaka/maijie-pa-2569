/* PA 2569 — interactions */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  /* Safety net: whatever happens below, nothing stays hidden for long */
  const revealAll = () => {
    $$('.reveal').forEach((el) => el.classList.add('is-in'));
    $$('[data-count]').forEach((el) => { el.textContent = el.dataset.count; });
  };
  if (reduceMotion) revealAll();
  window.addEventListener('error', revealAll);

  /* Local soundtrack: starts after a visitor gesture, loops without external services. */
  const soundtrack = $('#soundtrack'), musicBtn = $('#music');
  soundtrack.volume = .35;
  function setMusicUI(on) {
    musicBtn.classList.toggle('is-playing',on);
    musicBtn.setAttribute('aria-pressed',String(on));
    $('.music__label',musicBtn).textContent = on ? 'ปิดเพลง' : 'เปิดเพลง';
  }
  async function playMusic() {
    pendingHeroAudio = false;
    heroVideo.muted = true;
    $('#videoSound').textContent = 'ฟังคำต้อนรับ';
    $('#videoSound').setAttribute('aria-pressed','false');
    try { await soundtrack.play(); } catch { $('#musicStatus').textContent='กดเปิดเพลงอีกครั้งเพื่อเริ่มฟัง'; }
  }
  function pauseMusic() { soundtrack.pause(); }
  soundtrack.addEventListener('play',()=>{ setMusicUI(true); $('#musicStatus').textContent='กำลังเล่นเพลงประกอบ'; });
  soundtrack.addEventListener('pause',()=>{ setMusicUI(false); $('#musicStatus').textContent='หยุดเพลงประกอบแล้ว'; });
  soundtrack.addEventListener('error',()=>{setMusicUI(false);$('#musicStatus').textContent='ไม่สามารถโหลดเพลงได้ กรุณาลองใหม่';});
  musicBtn.addEventListener('click',()=>soundtrack.paused?playMusic():pauseMusic());

  /* ---------------- Entry gate ---------------- */
  const gate = $('#gate');
  const heroVideo = $('.hero__video');
  const videoToggle = $('#videoToggle'), videoSound = $('#videoSound');
  let pendingWelcomeAudio=false, pendingHeroAudio=false;
  function syncHeroSound(){videoSound.textContent=heroVideo.muted?'ฟังคำต้อนรับ':'ปิดเสียงต้อนรับ';videoSound.setAttribute('aria-pressed',String(!heroVideo.muted));}
  function startHeroWelcome(){
    pendingHeroAudio=false; pauseMusic(); heroVideo.muted=false; heroVideo.loop=true;
    syncHeroSound();
    heroVideo.play().catch(error=>{if(error.name==='NotAllowedError'){
      pendingHeroAudio=true;heroVideo.muted=true;syncHeroSound();heroVideo.play().catch(()=>{});
    }});
  }
  heroVideo.addEventListener('volumechange',syncHeroSound);
  if (reduceMotion) { heroVideo.autoplay = false; heroVideo.pause(); videoToggle.textContent = 'เล่นวิดีโอ'; }
  videoToggle.addEventListener('click', () => { if(heroVideo.paused) heroVideo.play().catch(()=>{}); else heroVideo.pause(); });
  ['play','pause'].forEach(event => heroVideo.addEventListener(event,()=> { videoToggle.textContent=heroVideo.paused?'เล่นวิดีโอ':'หยุดวิดีโอ'; videoToggle.setAttribute('aria-pressed',String(heroVideo.paused)); }));
  videoSound.addEventListener('click',()=>{ pendingHeroAudio=false; heroVideo.muted=!heroVideo.muted; if(!heroVideo.muted){ pauseMusic(); heroVideo.play().catch(()=>{}); } syncHeroSound(); });
  const menu = $('#menuToggle');
  menu.addEventListener('click',()=>{ const on=menu.getAttribute('aria-expanded')!=='true'; menu.setAttribute('aria-expanded',String(on)); $('.nav__links').classList.toggle('is-open',on); });
  $$('.nav__links a').forEach(a=>a.addEventListener('click',()=>{ menu.setAttribute('aria-expanded','false'); $('.nav__links').classList.remove('is-open'); }));
  document.body.classList.add('is-open');
  function openSite(withMusic) {
    if (withMusic) playMusic();
    gate.classList.add('is-hidden');
    document.body.classList.add('is-open');
    !reduceMotion && heroVideo && heroVideo.play && heroVideo.play().catch(() => {});
    setTimeout(() => gate.remove(), 900);
  }
  $('#enter').addEventListener('click', () => openSite(true));
  $('#enterQuiet').addEventListener('click', () => openSite(false));
  if (location.search.includes('nogate')) { gate.remove(); document.body.classList.add('is-open'); revealAll(); }

  /* The same supplied film introduces the site and accompanies the challenge. */
  const welcomeDialog = $('#welcomeVideoDialog');
  const welcomeFilm = $('#welcomeVideo');
  const challengeFilm = $('#challengeVideo');
  const welcomeSound = $('#welcomeVideoSound');
  const stopOtherAudio = () => { pauseMusic(); heroVideo.muted=true; $('#videoSound').textContent='ฟังคำต้อนรับ'; $('#videoSound').setAttribute('aria-pressed','false'); };
  function closeWelcome() { pendingWelcomeAudio=false; welcomeFilm.pause(); welcomeDialog.close(); startHeroWelcome(); }
  welcomeDialog.addEventListener('close',()=>{
    welcomeFilm.pause(); document.body.classList.remove('welcome-video-open');
    pendingWelcomeAudio=false;
    if(heroVideo.paused) startHeroWelcome();
    $('#videoToggle').focus({preventScroll:true});
  });
  $('#closeWelcomeVideo').addEventListener('click',closeWelcome);
  welcomeSound.addEventListener('click',()=>{ pendingWelcomeAudio=false; welcomeFilm.muted=!welcomeFilm.muted; if(!welcomeFilm.muted){stopOtherAudio();welcomeFilm.play().catch(()=>{});} });
  welcomeFilm.addEventListener('volumechange',()=>{welcomeSound.textContent=welcomeFilm.muted?'เปิดเสียงวิดีโอ':'ปิดเสียงวิดีโอ';welcomeSound.setAttribute('aria-pressed',String(!welcomeFilm.muted));if(!welcomeFilm.muted)stopOtherAudio();});
  challengeFilm.addEventListener('play',()=>{stopOtherAudio();heroVideo.pause();});
  soundtrack.addEventListener('play',()=>challengeFilm.pause());
  heroVideo.addEventListener('volumechange',()=>{if(!heroVideo.muted)challengeFilm.pause();});
  welcomeDialog.showModal(); document.body.classList.add('welcome-video-open');
  heroVideo.pause();
  welcomeFilm.muted=false;
  welcomeFilm.volume=.7;
  welcomeSound.textContent='ปิดเสียงวิดีโอ';
  welcomeSound.setAttribute('aria-pressed','true');
  stopOtherAudio();
  welcomeFilm.play().catch(async(error)=>{
    if(!welcomeDialog.open || error.name!=='NotAllowedError')return;
    pendingWelcomeAudio=true;
    welcomeFilm.muted=true;
    await welcomeFilm.play().catch(()=>{});
    welcomeSound.textContent='แตะเพื่อเปิดเสียงวิดีโอ';
  });
  // Retry blocked audio on a real visitor gesture; never override a sound control.
  function unlockRequestedAudio(event){
    if(event.target.closest('button,a,input,video,select,textarea'))return;
    if(welcomeDialog.open&&pendingWelcomeAudio){
      pendingWelcomeAudio=false;welcomeFilm.muted=false;stopOtherAudio();
      welcomeFilm.play().catch(()=>{pendingWelcomeAudio=true;welcomeFilm.muted=true;});
    }else if(!welcomeDialog.open&&pendingHeroAudio)startHeroWelcome();
  }
  document.addEventListener('click',unlockRequestedAudio);
  document.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')unlockRequestedAudio(event);});
  $('#closeWelcomeVideo').focus({preventScroll:true});

  /* ---------------- Magic wand + falling stars ---------------- */
  if (finePointer && !reduceMotion) {
    document.body.classList.add('has-wand-cursor');
    const cur = $('#cursor');
    const canvas = $('#dust');
    const ctx = canvas.getContext('2d');
    let W, H, dpr;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.width = innerWidth * dpr; H = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
    };
    resize(); addEventListener('resize', resize);

    const particles = [];
    let mx = -100, my = -100, lx = -100, ly = -100, tx = -100, ty = -100;

    addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      const dx = tx - lx, dy = ty - ly;
      const speed = Math.hypot(dx, dy);
      lx = tx; ly = ty;
      const n = Math.min(6, Math.floor(speed / 6));
      for (let i = 0; i < n; i++) {
        if (particles.length > 220) particles.shift();
        particles.push({ star: Math.random() < .7, rotation: Math.random() * Math.PI,
          x: (tx + (Math.random() - .5) * 6) * dpr,
          y: (ty + 2 + Math.random() * 4) * dpr,
          vx: (Math.random() - .5) * 0.6 * dpr - dx * 0.02 * dpr,
          vy: (Math.random() * 0.6) * dpr,
          r: (Math.random() * 1.8 + 0.6) * dpr,
          life: 1, decay: 0.008 + Math.random() * 0.014
        });
      }
    }, { passive: true });
    addEventListener('pointerdown', () => cur.classList.add('is-pressed'));
    addEventListener('pointerup', () => cur.classList.remove('is-pressed'));
    document.addEventListener('mouseleave', () => { cur.style.opacity = 0; });
    document.addEventListener('mouseenter', () => { cur.style.opacity = ''; });

    let dark = false, lastProbe = 0;
    const tick = (t) => {
      mx += (tx - mx) * 0.35; my += (ty - my) * 0.35;
      cur.style.transform = `translate(${mx}px, ${my}px) translate(-10px, -10px) rotate(-28deg)${cur.classList.contains('is-pressed') ? ' scale(.94)' : ''}`;
      ctx.clearRect(0, 0, W, H);
      if (t - lastProbe > 120) {
        lastProbe = t;
        const el = document.elementFromPoint(Math.max(0, Math.min(innerWidth - 1, tx)), Math.max(0, Math.min(innerHeight - 1, ty)));
        if (el) dark = !!el.closest('.hero, .chapter--dark, .gate, .lightbox, .nav, .footer');
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += 0.035 * dpr; p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0 || p.y > H) { particles.splice(i, 1); continue; }
        ctx.globalAlpha = p.life * (p.star ? .55 + .45 * Math.sin(t*.012+p.rotation*5)**2 : .45);
        ctx.fillStyle = dark ? '#ffffff' : '#8a8a8f';
        ctx.beginPath();
        if (p.star) {
          ctx.fillStyle = dark ? '#ffeab5' : '#a36a18';
          const size = (p.r + 3*dpr) * p.life;
          for(let j=0;j<8;j++){ const a=j*Math.PI/4+p.rotation; const r=j%2?size*.24:size; const x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r; if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y); } ctx.closePath();
        } else ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------------- Reveal on scroll ---------------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    $$('.reveal').forEach((el) => io.observe(el));

    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target, end = +el.dataset.count;
        countIO.unobserve(el);
        if (reduceMotion) { el.textContent = end; return; }
        const t0 = performance.now(), dur = 1400;
        const step = (t) => {
          const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(end * e);
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach((el) => countIO.observe(el));

    /* Nav active link */
    const links = $$('.nav__links a');
    const secIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['profile', 'story', 'evidence', 'ai', 'challenge', 'awards'].forEach((id) => { const s = document.getElementById(id); if (s) secIO.observe(s); });
  } else {
    revealAll();
  }

  /* ---------------- 3D tilt card ---------------- */
  const card = $('#card3d');
  if (card && finePointer && !reduceMotion) {
    const inner = $('.card3d__inner', card), glare = $('.card3d__glare', card);
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      inner.style.transform = `rotateY(${(px - .5) * 18}deg) rotateX(${(.5 - py) * 14}deg) translateZ(10px)`;
      glare.style.setProperty('--gx', px * 100 + '%'); glare.style.setProperty('--gy', py * 100 + '%');
    });
    card.addEventListener('pointerleave', () => { inner.style.transform = ''; });
  }

  /* ---------------- 3D spatial ring ---------------- */
  const ring = $('#ring'), stage = $('#ringStage');
  if (ring) {
    const figs = $$('figure', ring);
    const n = figs.length;
    let radius = 0;
    const layout = () => {
      const w = figs[0].getBoundingClientRect().width || 240;
      radius = Math.round((w * n) / (2 * Math.PI) * 1.3);
      figs.forEach((f, i) => { f.style.transform = `translate(-50%,-50%) rotateY(${(360 / n) * i}deg) translateZ(${radius}px)`; });
    };
    layout(); addEventListener('resize', layout);

    let angle = 0, vel = reduceMotion ? 0 : 0.06, dragging = false, lastX = 0, autoSpeed = reduceMotion ? 0 : 0.06;
    const render = () => { ring.style.transform = `translateZ(${-radius}px) rotateX(-8deg) rotateY(${angle}deg)`; };
    stage.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; vel = 0; stage.setPointerCapture(e.pointerId); });
    stage.addEventListener('pointermove', (e) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; angle += dx * 0.35; vel = dx * 0.35; render(); });
    const end = () => { dragging = false; };
    stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
    let visible = true;
    const pauseRing=$('#ringPause');
    if(reduceMotion){ pauseRing.textContent='หมุนอัตโนมัติ'; pauseRing.setAttribute('aria-pressed','true'); }
    pauseRing.addEventListener('click',()=>{ autoSpeed=autoSpeed?0:.06;vel=0;pauseRing.textContent=autoSpeed?'หยุดหมุน':'หมุนอัตโนมัติ';pauseRing.setAttribute('aria-pressed',String(!autoSpeed)); });
    $('#ringPrev').addEventListener('click',()=>{ angle+=360/n;vel=0;render(); });
    $('#ringNext').addEventListener('click',()=>{ angle-=360/n;vel=0;render(); });
    if ('IntersectionObserver' in window) new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(stage);
    const loop = () => {
      if (visible && !document.hidden && !dragging) {
        // inertia settles back to a slow auto-rotate
        vel += (autoSpeed - vel) * 0.03;
        angle += vel;
        render();
      }
      requestAnimationFrame(loop);
    };
    render(); requestAnimationFrame(loop);
  }

  /* ---------------- Timetable tabs ---------------- */
  $$('.tab').forEach((tab,i)=>{ tab.tabIndex=i===0?0:-1; tab.addEventListener('keydown',e=>{ const tabs=$$('.tab'); let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();tabs[next].click();tabs[next].focus();} }); });
  $$('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('.tab').forEach((t) => { t.setAttribute('aria-selected', String(t === tab)); t.tabIndex=t===tab?0:-1; });
      ['t1', 't2'].forEach((id) => { const p = document.getElementById(id); if (p) p.hidden = id !== tab.getAttribute('aria-controls'); });
    });
  });

  /* ---------------- Lightbox ---------------- */
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  let items = [], idx = 0, lastFocus = null;
  const allFigures = $$('[data-gallery] figure');
  allFigures.forEach((fig, i) => fig.querySelector('button').addEventListener('click', () => open(i)));
  function open(i) {
    items = allFigures; idx = i; lastFocus = document.activeElement;
    show(); lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    $('#lbClose').focus();
  }
  function show() {
    const fig = items[idx], img = fig.querySelector('img');
    lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt;
    lbCap.textContent = fig.querySelector('figcaption')?.textContent || '';
  }
  function close() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { lb.hidden = true; }, 320);
    lastFocus?.focus();
  }
  $('#lbClose').addEventListener('click', close);
  $('#lbPrev').addEventListener('click', () => { idx = (idx - 1 + items.length) % items.length; show(); });
  $('#lbNext').addEventListener('click', () => { idx = (idx + 1) % items.length; show(); });
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { const buttons=$$('button',lb),first=buttons[0],last=buttons[buttons.length-1]; if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();} }
    if (e.key === 'ArrowLeft') $('#lbPrev').click();
    if (e.key === 'ArrowRight') $('#lbNext').click();
  });
})();
