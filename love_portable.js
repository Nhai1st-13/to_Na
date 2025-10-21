(function(){
  const $ = (sel, root=document) => root.querySelector(sel);

  const env = $('#envelope');
  if (!env) return; // guard if markup missing

  const btnOpen = $('#open');
  const btnReset = $('#reset');
  const bgDim = $('.background-dim');
  const bgLayer = $('.bg-parallax');

  function openEnvelope(){
    env.setAttribute("aria-expanded","true");
    env.classList.add('open'); env.classList.remove('close');
    spawnFlowers(); if (bgDim) bgDim.classList.add('dim');
    spawnFireworks(); startFireworksLoop(); playMusic();
  }
  function closeEnvelope(){
    env.setAttribute("aria-expanded","false");
    env.classList.add('close'); env.classList.remove('open'); env.classList.remove('show-photo');
    clearFlowers(); if (bgDim) bgDim.classList.remove('dim');
    clearFireworks(); stopFireworksLoop(); fadeOutMusic();
  }

  env.addEventListener('click', ()=> {
  if (!env.classList.contains('open')) { openEnvelope(); return; }
  if (!env.classList.contains('show-photo')) { env.classList.add('show-photo'); return; }
  openImageModal();
});
  env.addEventListener('keydown', (e)=>{
  if (e.key==='Enter' || e.key===' '){
    if (!env.classList.contains('open')) { openEnvelope(); return; }
    if (!env.classList.contains('show-photo')) { env.classList.add('show-photo'); return; }
    openImageModal();
  }
});
  if (btnOpen) btnOpen.addEventListener('click', openEnvelope);
  if (btnReset) btnReset.addEventListener('click', closeEnvelope);

  // ===== Parallax logic with composed transform (mousemove + scroll) =====
  (function parallax(){
    if (!bgLayer) return;
    const strength = 18; // px movement radius
    let mx = 0, my = 0, sy = 0;
    const apply = ()=>{
      bgLayer.style.transform = `translate3d(${mx}px, ${my - sy}px, 0) scale(1.05)`;
    };
    window.addEventListener('mousemove', (e)=>{
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mx = (-x * strength);
      my = (-y * strength);
      apply();
    }, { passive: true });
    window.addEventListener('scroll', ()=>{
      sy = window.scrollY * 0.12;
      apply();
    }, { passive: true });
  })();

  // ===== Flowers =====
  function spawnFlowers(){
    const container = env.querySelector('.flowers'); if (!container) return;
    const count = 12; const colors = ['pink','lilac','peach','mint'];
    for (let i=0;i<count;i++){
      const f = document.createElement('div'); f.className = 'flower ' + colors[(Math.random()*colors.length)|0];
      f.style.left = (Math.random()*100)+'%'; f.style.top = (Math.random()*100)+'%';
      const tx = (Math.random()*40-20)+'px', ty = (Math.random()*40-20)+'px', scale=(1.6+Math.random()*1.6).toFixed(2);
      f.style.setProperty('--scale', scale); f.style.setProperty('--x','calc(-50% + '+tx+')'); f.style.setProperty('--y','calc(-50% + '+ty+')');
      const delay = (Math.random()*300)|0; f.style.animationDelay = delay+'ms, '+(delay+150)+'ms';
      const floatMs = 2000 + (Math.random()*1200|0); f.style.animationDuration = '1200ms, '+floatMs+'ms';
      container.appendChild(f);
    }
  }
  function clearFlowers(){ const c = env.querySelector('.flowers'); if (c) c.innerHTML=''; }

  // ===== Fireworks =====
  function spawnFireworks(){
    const container = env.querySelector('.fireworks'); if (!container) return;
    const bursts = 5; const colors = ['pink','lilac','peach','mint','sun','coral'];
    for (let b=0;b<bursts;b++){
      const burst = document.createElement('div'); burst.className='burst';
      burst.style.left = (Math.random()*100)+'%'; burst.style.top = (Math.random()*100)+'%';
      const sparks = 10 + (Math.random()*6|0); const radius = (40 + Math.random()*70|0) + 'px';
      for (let s=0;s<sparks;s++){
        const sp = document.createElement('div'); sp.className = 'spark ' + colors[(Math.random()*colors.length)|0];
        const deg = ((360/sparks)*s + Math.random()*8).toFixed(1) + 'deg';
        sp.style.setProperty('--deg', deg); sp.style.setProperty('--r', radius);
        const delay = (Math.random()*300)|0; sp.style.animationDelay = delay+'ms, '+(delay+150)+'ms';
        burst.appendChild(sp);
      }
      container.appendChild(burst);
      setTimeout(()=> burst.remove(), 1600);
    }
  }
  function clearFireworks(){ const c = env.querySelector('.fireworks'); if (c) c.innerHTML=''; }
  let _fwTimer = null;
  function startFireworksLoop(){ if (_fwTimer) return; spawnFireworks(); _fwTimer = setInterval(spawnFireworks, 1200); }
  function stopFireworksLoop(){ if (_fwTimer){ clearInterval(_fwTimer); _fwTimer=null; } }

  // ===== Modal =====
  const modal = $('.image-modal');
  const backdrop = $('.image-modal__backdrop');
  const heartClick = $('.heart-click');
  function openImageModal(){ if (!modal) return; modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
  function closeImageModal(){ if (!modal) return; modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow='auto'; }
  if (heartClick) heartClick.addEventListener('click', (e)=>{
  e.stopPropagation();
  if (!env.classList.contains('open')) { openEnvelope(); return; }
  if (!env.classList.contains('show-photo')) { env.classList.add('show-photo'); return; }
  openImageModal();
});
  if (backdrop) backdrop.addEventListener('click', closeImageModal);
  document.addEventListener('keydown', (e)=>{ if (e.key==='Escape') closeImageModal(); });

  // ===== Music =====
  const music = document.getElementById('bg-music');
  function playMusic(){
  if (!music) return;
  try {
    // chỉ gọi play nếu đang tạm dừng; không reset currentTime
    if (music.paused) {
      if (typeof music.volume !== 'number') music.volume = 0.9; // tuỳ chỉnh 0.0–1.0
      music.play();
    }
  } catch (e) {}
}
  function fadeOutMusic(){
    if (!music) return;
    let fade = setInterval(()=>{
      if (music.volume > 0.05) music.volume -= 0.05;
      else { clearInterval(fade); music.pause(); music.currentTime=0; music.volume = 0.7; }
    }, 150);
  }
})();