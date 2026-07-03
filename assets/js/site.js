(function(){
  // Mobile nav: wire the burger to an accessible disclosure menu.
  var burger=document.querySelector('.burger'), navEl=document.querySelector('header nav');
  if(burger&&navEl){
    navEl.id='primary-nav';
    burger.setAttribute('aria-controls','primary-nav');
    burger.setAttribute('aria-expanded','false');
    function closeNav(){navEl.classList.remove('open');burger.setAttribute('aria-expanded','false');}
    burger.addEventListener('click',function(){
      var open=navEl.classList.toggle('open');
      burger.setAttribute('aria-expanded',open?'true':'false');
    });
    navEl.addEventListener('click',function(e){ if(e.target.closest('a')) closeNav(); });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&navEl.classList.contains('open')){closeNav();burger.focus();}
    });
  }
  // Hero channel strip (homepage only; harmless elsewhere)
  var ch=document.getElementById('ch'); if(!ch) return;
  var lv=[62,88,40,74,52,96,34,80,58,70,46,90,66,50,84,42,76,60,94,38,72,54];
  lv.forEach(function(h){var b=document.createElement('i');b.style.height=h+'%';ch.appendChild(b);});
})();
