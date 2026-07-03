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

(function(){
  // Current-conditions widget. Keyless Open-Meteo (no API key, CORS, no tracking). Hides on any failure.
  var el=document.getElementById('wx'); if(!el) return;
  var WMO={0:'Clear',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',56:'Freezing drizzle',57:'Freezing drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',66:'Freezing rain',67:'Freezing rain',71:'Light snow',73:'Snow',75:'Heavy snow',77:'Snow grains',80:'Rain showers',81:'Rain showers',82:'Heavy showers',85:'Snow showers',86:'Snow showers',95:'Thunderstorm',96:'Thunderstorm',99:'Thunderstorm'};
  var url='https://api.open-meteo.com/v1/forecast?latitude=34.0975&longitude=-117.6484&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles';
  fetch(url).then(function(r){return r.ok?r.json():Promise.reject();}).then(function(d){
    var c=(d&&d.current)||{}, day=(d&&d.daily)||{};
    if(typeof c.temperature_2m!=='number') return;
    document.getElementById('wx-temp').textContent=Math.round(c.temperature_2m);
    document.getElementById('wx-cond').textContent=WMO[c.weather_code]||'';
    if(day.temperature_2m_max&&day.temperature_2m_min){
      document.getElementById('wx-hilo').textContent='H '+Math.round(day.temperature_2m_max[0])+'\u00b0  \u00b7  L '+Math.round(day.temperature_2m_min[0])+'\u00b0';
    }
    el.hidden=false;
  }).catch(function(){/* stays hidden */});
})();

(function(){
  // Header dropdown menus (About Us / Information / Plan Your Visit).
  var groups=[].slice.call(document.querySelectorAll('.nav-group'));
  if(!groups.length) return;
  function closeAll(except){
    groups.forEach(function(g){
      var b=g.querySelector('.nav-top');
      if(b&&b!==except) b.setAttribute('aria-expanded','false');
    });
  }
  groups.forEach(function(g){
    var btn=g.querySelector('.nav-top'); if(!btn) return;
    btn.addEventListener('click',function(){
      var open=btn.getAttribute('aria-expanded')==='true';
      closeAll(btn);
      btn.setAttribute('aria-expanded', open?'false':'true');
    });
    g.addEventListener('focusout',function(e){ if(!g.contains(e.relatedTarget)) btn.setAttribute('aria-expanded','false'); });
  });
  document.addEventListener('click',function(e){ if(!e.target.closest('.nav-group')) closeAll(null); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ closeAll(null); var a=document.activeElement; if(a&&a.closest&&a.closest('.nav-group')) a.blur(); } });
})();
