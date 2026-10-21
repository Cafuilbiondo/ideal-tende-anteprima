/* Ideal Tende — script comune */
(function(){
  var WA = '393803147697';
  var $ = function(s,c){return (c||document).querySelector(s)}, $$ = function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = matchMedia('(hover: none)').matches;
  $$('[data-year]').forEach(function(e){ e.textContent = new Date().getFullYear(); });

  /* header + menu */
  var hdr = $('#hdr');
  var onS = function(){ hdr.classList.toggle('solid', scrollY > 30); };
  addEventListener('scroll', onS, {passive:true}); onS();
  var burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', function(){ var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); document.body.style.overflow = o ? 'hidden' : ''; });
  $$('a', nav).forEach(function(a){ a.addEventListener('click', function(){ nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); document.body.style.overflow=''; }); });

  /* video: si scaricano in anticipo e partono prima di entrare nello schermo,
     così quando arrivi sono già in movimento (piano o veloce). Fuori schermo si fermano. */
  function load(v){ if (!v.getAttribute('src') && v.dataset.src) { v.preload = 'auto'; v.src = v.dataset.src; v.load(); } }
  function vplay(v){ load(v); var p = v.play(); if (p) p.catch(function(){}); }
  $$('video').forEach(function(v){
    if (v.poster) v.style.background = 'center / cover no-repeat url("' + v.poster + '")';
    v.addEventListener('loadeddata', function(){ var c = v.closest('[data-hover-video]'); if (c && c._want) c.classList.add('on'); });
  });
  $$('[data-hover-video]').forEach(function(c){
    var v = $('video', c); if (!v) return;
    if (!touch) {
      c.addEventListener('mouseenter', function(){ c._want = true; vplay(v); if (v.readyState >= 2) c.classList.add('on'); });
      c.addEventListener('mouseleave', function(){ c._want = false; c.classList.remove('on'); v.pause(); });
    }
  });
  // 1) scarica i video quando mancano ~2 schermate
  var pre = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) { load(e.target); pre.unobserve(e.target); } }); }, {rootMargin:'1600px 0px'});
  $$('video[data-src]').forEach(function(v){ pre.observe(v); });
  // 2) li avvia mezza schermata prima che entrino, li ferma quando sono lontani
  var vio = new IntersectionObserver(function(es){ es.forEach(function(e){
    var el = e.target, v = el.tagName === 'VIDEO' ? el : $('video', el);
    if (e.isIntersecting) { if (reduce) return; el._want = true; vplay(v); if (el.tagName === 'VIDEO' || v.readyState >= 2) el.classList.add('on'); }
    else { el._want = false; v.pause(); if (el.tagName !== 'VIDEO') el.classList.remove('on'); }
  }); }, {rootMargin:'400px 0px 400px 0px'});
  $$('video[data-auto]').forEach(function(v){ vio.observe(v); });
  if (touch) $$('[data-hover-video]').forEach(function(c){ vio.observe(c); });

  // hero: video orizzontale su computer, verticale su telefono
  $$('video[data-desk]').forEach(function(v){
    if (v.closest('.player')) return;
    v.src = matchMedia('(max-width:768px)').matches ? v.dataset.mob : v.dataset.desk;
  });
  // video di sfondo: avvio esplicito (alcuni browser ignorano autoplay)
  $$('video[autoplay]').forEach(function(v){ v.muted = true; if (reduce) { v.removeAttribute('autoplay'); v.pause(); return; } var p = v.play(); if (p) p.catch(function(){}); });
  // e si fermano quando escono dallo schermo (meno video insieme = scorrimento più fluido)
  var hio = new IntersectionObserver(function(es){ es.forEach(function(e){ var v = e.target; if (reduce) return; if (e.isIntersecting) { var p = v.play(); if (p) p.catch(function(){}); } else v.pause(); }); }, {rootMargin:'300px 0px'});
  $$('video[autoplay]').forEach(function(v){ hio.observe(v); });

  /* lettore showreel */
  $$('.player').forEach(function(pl){
    var v = $('video', pl);
    // telefono: video verticale; computer: orizzontale. Si cambia solo finché non parte.
    var mq = matchMedia('(max-width:768px)');
    var pick = function(){
      if (!pl.dataset.desk || pl.classList.contains('playing')) return;
      var src = mq.matches ? pl.dataset.mob : pl.dataset.desk;
      pl.classList.toggle('is-vert', mq.matches);
      if (v.getAttribute('src') !== src) { v.setAttribute('src', src); v.preload = 'metadata'; }
    };
    pick();
    if (mq.addEventListener) mq.addEventListener('change', pick);
    var go = function(e){ if (pl.classList.contains('playing')) return; if (e) e.preventDefault(); pl.classList.add('playing'); v.preload='auto'; var p = v.play(); if (p) p.catch(function(){}); };
    pl.addEventListener('click', go);
    pl.addEventListener('keydown', function(e){ if (e.key==='Enter'||e.key===' ') go(e); });
    // a fine video torna la copertina
    v.addEventListener('ended', function(){ pl.classList.remove('playing'); v.currentTime = 0; });
  });

  /* galleria completa (pagina Lavori) */
  var CAT = {tendaggi:'Tendaggi', tecniche:'Tende a rullo', tappezzeria:'Tappezzeria', pergole:'Pergole e dehors', vetrate:'Vetrate', laboratorio:'Laboratorio', showroom:'Showroom'};
  var GROUP = {interni:['tendaggi','tecniche'], tappezzeria:['tappezzeria','laboratorio'], outdoor:['pergole','vetrate']};
  var F = {
    tendaggi:['56381','01639','56421','104511','06378','56384','69886','56383','84151','56590','104506','56422','06379','56423','104513','84154','56113'],
    tecniche:['69881','56388','69883','05994','69903','56401','69879','05990'],
    tappezzeria:['05982','05338','05343','05762','05985','05345','05764','05981','05344','05760','05984','05763','05983'],
    laboratorio:['96001','96000','96002'],
    pergole:['40141','06362','50046','40138','06364','97054','06361','40144','50048','06360','06363','06358','56087'],
    vetrate:['18891','17483','18892'],
    showroom:['117210','117211']
  };
  var gal = $('#gallery');
  if (gal) {
    var all = [], order = ['tendaggi','tappezzeria','tecniche','pergole','showroom','laboratorio','vetrate'], max = 0;
    order.forEach(function(k){ max = Math.max(max, F[k].length); });
    for (var i=0;i<max;i++) order.forEach(function(k){ if (F[k][i]) all.push({c:k, n:F[k][i]}); });
    gal.innerHTML = all.map(function(p){
      return '<button type="button" class="gph" data-c="'+p.c+'" data-cap="'+CAT[p.c]+'"><img src="assets/foto/'+p.c+'-'+p.n+'-m.jpg" data-full="assets/foto/'+p.c+'-'+p.n+'.jpg" alt="'+CAT[p.c]+', lavoro realizzato da Ideal Tende" loading="lazy" decoding="async"></button>';
    }).join('');
    var items = $$('.gph', gal), STEP = 20, shown = STEP, cur = 'all', moreBtn = $('#moreBtn');
    var inCur = function(el){ return cur==='all' || (GROUP[cur] ? GROUP[cur].indexOf(el.dataset.c) > -1 : el.dataset.c===cur); };
    var render = function(){
      var v = items.filter(inCur);
      items.forEach(function(el){ el.classList.add('hide'); });
      v.forEach(function(el,k){ if (k < shown) el.classList.remove('hide'); });
      if (moreBtn) moreBtn.parentNode.style.display = v.length > shown ? '' : 'none';
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    };
    $$('#filters button').forEach(function(b){
      var f = b.dataset.f, n = f==='all' ? items.length : items.filter(function(el){ return GROUP[f] ? GROUP[f].indexOf(el.dataset.c)>-1 : el.dataset.c===f; }).length;
      var s = $('span', b); if (s) s.textContent = n;
      b.addEventListener('click', function(){
        cur = f; shown = STEP;
        $$('#filters button').forEach(function(x){ x.setAttribute('aria-pressed', x===b); });
        render(); history.replaceState(null, '', f==='all' ? location.pathname : '#' + f);
      });
    });
    if (moreBtn) moreBtn.addEventListener('click', function(){ shown += STEP; render(); });
    var h = location.hash.slice(1); var hb = h && $('#filters button[data-f="'+h+'"]');
    if (hb) hb.click(); else render();
  }

  /* ingrandimento foto (tutte le .gph della pagina) */
  var lb = $('#lb'), stage = $('#lbStage'), cnt = $('#lbC'), list = [], idx = 0, last;
  function show(i){ idx = (i + list.length) % list.length; var im = $('img', list[idx]);
    stage.innerHTML = '<img src="'+(im.dataset.full || im.src)+'" alt="'+im.alt+'">';
    cnt.textContent = (list[idx].dataset.cap || '') + ' · ' + (idx+1) + ' di ' + list.length; }
  function open(el){ var grp = el.closest('[data-lb-group]') || document; list = $$('.gph', grp).filter(function(x){ return !x.classList.contains('hide'); });
    last = document.activeElement; show(list.indexOf(el)); lb.hidden = false; document.body.style.overflow='hidden'; $('[data-lb="x"]', lb).focus(); }
  function close(){ lb.hidden = true; stage.innerHTML=''; document.body.style.overflow=''; if (last) last.focus(); }
  document.addEventListener('click', function(e){ var g = e.target.closest('.gph'); if (g) open(g); });
  $('[data-lb="x"]', lb).addEventListener('click', close);
  $('[data-lb="p"]', lb).addEventListener('click', function(){ show(idx-1); });
  $('[data-lb="n"]', lb).addEventListener('click', function(){ show(idx+1); });
  lb.addEventListener('click', function(e){ if (e.target === lb) close(); });
  addEventListener('keydown', function(e){
    if (lb.hidden) return;
    if (e.key==='Escape') close(); else if (e.key==='ArrowLeft') show(idx-1); else if (e.key==='ArrowRight') show(idx+1);
    else if (e.key==='Tab'){ var f = $$('.lb-btn', lb), a = f.indexOf(document.activeElement); e.preventDefault(); f[(a + (e.shiftKey?-1:1) + f.length) % f.length].focus(); }
  });
  var tx = null;
  lb.addEventListener('touchstart', function(e){ tx = e.touches[0].clientX; }, {passive:true});
  lb.addEventListener('touchend', function(e){ if (tx===null) return; var d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) show(idx + (d<0?1:-1)); tx = null; });

  /* preventivo -> WhatsApp */
  var form = $('#prevForm');
  if (form) {
    var q = new URLSearchParams(location.search).get('tipo');
    if (q) { var c = $('#tipo input[value="'+q+'"]'); if (c) c.checked = true; }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var g = function(id){ return $('#'+id).value.trim(); };
      var ok = g('nome') && g('tel'); $('#err').classList.toggle('show', !ok);
      if (!ok) { $('#' + (g('nome') ? 'tel' : 'nome')).focus(); return; }
      var tipi = $$('#tipo input:checked').map(function(i){ return i.value; });
      var m = 'Buongiorno Ideal Tende, vorrei un preventivo.\n\nMi serve: ' + (tipi.join(', ') || 'da definire') + '\n';
      if (g('larg') || g('alt')) m += 'Misure indicative: ' + (g('larg')||'?') + ' x ' + (g('alt')||'?') + ' cm\n';
      m += 'Dove: ' + g('dove') + ' a ' + (g('com') || 'Trinitapoli') + '\nNome: ' + g('nome') + '\nTelefono: ' + g('tel') + '\n';
      if (g('note')) m += 'Note: ' + g('note') + '\n';
      m += '\nGrazie, attendo un vostro contatto.';
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(m), '_blank', 'noopener');
    });
  }

  /* animazioni */
  function anim(){
    if (!window.gsap || !window.ScrollTrigger || reduce) { document.documentElement.classList.remove('js'); return; }
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('h1 .line>span', {y:0, duration:1.2, stagger:.1, ease:'expo.out', delay:.1});
    gsap.from('[data-hero]', {opacity:0, y:28, duration:1, stagger:.1, ease:'expo.out', delay:.4});
    $$('[data-r]').forEach(function(el){ gsap.to(el, {opacity:1, y:0, duration:.7, ease:'power3.out', scrollTrigger:{trigger:el, start:'top 96%', once:true}}); });
    // se si salta oltre (scorrimento veloce, ancore) gli elementi già passati compaiono subito
    ScrollTrigger.addEventListener('refresh', function(){ $$('[data-r]').forEach(function(el){ if (el.getBoundingClientRect().bottom < 0) gsap.set(el, {opacity:1, y:0}); }); });
    $$('[data-clip]').forEach(function(el){ gsap.to(el, {clipPath:'inset(0% 0% 0% 0% round 28px)', duration:1.4, ease:'expo.out', scrollTrigger:{trigger:el, start:'top 85%', once:true}}); });
    if (!touch) $$('[data-par]').forEach(function(el){ gsap.to(el, {yPercent:parseFloat(el.dataset.par), ease:'none', scrollTrigger:{trigger:el.parentNode, start:'top bottom', end:'bottom top', scrub:true}}); });
    var sf = $('#stepsFill');
    if (sf) gsap.to(sf, {scaleX:1, ease:'none', scrollTrigger:{trigger:'#steps', start:'top 75%', end:'bottom 55%', scrub:true,
      onUpdate:function(s){ $$('.step').forEach(function(st,i){ st.classList.toggle('lit', s.progress >= i/3 - .02); }); }}});
    addEventListener('load', function(){ ScrollTrigger.refresh(); });
  }
  anim(); // gli script "defer" partono dopo GSAP, nell'ordine in cui sono scritti
})();

/* social: inserire qui gli indirizzi dei profili; quelli vuoti restano nascosti */
(function(){
  var SOCIAL={instagram:'https://www.instagram.com/idealtende.trinitapoli/',facebook:'',tiktok:''};
  document.querySelectorAll('[data-social] a[data-net]').forEach(function(a){
    var u=SOCIAL[a.dataset.net]; if(u){a.href=u;a.hidden=false;}
  });
})();

/* telefono: nei blocchi di testo lunghi si vede il primo paragrafo, il resto con "Continua a leggere" */
(function(){
  if(!window.matchMedia('(max-width:640px)').matches) return;
  document.querySelectorAll('.split > [data-r], .split > div:not(.split-media):not(.duo)').forEach(function(box){
    var ps=[].slice.call(box.querySelectorAll(':scope > p')).filter(function(p){return !p.classList.contains('lead')||true;});
    if(ps.length<2) return;
    ps.slice(1).forEach(function(p){p.classList.add('more-p');});
    box.classList.add('is-clamped');
    var b=document.createElement('button'); b.type='button'; b.className='more-btn'; b.textContent='Continua a leggere';
    ps[0].after(b);
    b.addEventListener('click',function(){box.classList.remove('is-clamped'); b.remove();});
  });
})();
