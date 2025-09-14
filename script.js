// Mobile drawer
const drawer = document.getElementById('drawer');
const btn = document.querySelector('.mobile-menu');
if (btn && drawer){
  btn.addEventListener('click', () => {
    const open = drawer.style.display === 'flex';
    drawer.style.display = open ? 'none' : 'flex';
    drawer.setAttribute('aria-hidden', open ? 'true' : 'false');
  });
  document.querySelectorAll('.drawer a, .drawer .drawer-sublink').forEach(a => a.addEventListener('click', () => {
    drawer.style.display = 'none'; drawer.setAttribute('aria-hidden','true');
  }));
}
// Year
const yearEl = document.getElementById('year'); if (yearEl) yearEl.textContent = new Date().getFullYear();
// AOS
const observer = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }); }, { threshold: 0.12 });
document.querySelectorAll('.aos').forEach(el => observer.observe(el));
// Dropdown click-toggle
document.querySelectorAll('.dropdown .dropbtn').forEach(btn => {
  const dd = btn.closest('.dropdown');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.dropdown.open').forEach(d => { if (d !== dd) d.classList.remove('open'); });
    dd.classList.toggle('open');
  });
});
document.addEventListener('click', () => { document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open')); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open')); });

// Header translucency -> solid after hero
(function(){
  const header = document.querySelector('.header');
  const heroHeader = document.querySelector('.hero-header');
  function updateHeader(){
    if (!header) return;
    if (heroHeader){
      const threshold = heroHeader.offsetHeight - 4;
      if (window.scrollY > threshold){ header.classList.add('solid'); }
      else { header.classList.remove('solid'); }
    } else {
      header.classList.add('solid');
    }
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, {passive:true});
  window.addEventListener('resize', updateHeader);
})();

// ES/EN toggle
(function(){
  const BTN = document.getElementById('lang-toggle');
  if (!BTN) return;
  const map = {
    "Products":"Productos",
    "App":"Aplicación",
    "Resources":"Recursos",
    "About Us":"Sobre Nosotros",
    "Get a Quote":"Solicitar Cotización",
    "Pallet Rack Repair Kits":"Kits de Reparación de Racks",
    "Guarding":"Protecciones",
    "Warehouse Safety & Rack Repair, Modernized":"Seguridad de Almacenes y Reparación de Racks, Modernizado",
    "Inspections, engineered repairs, and guarding solutions to keep every bay compliant and every team aligned.":
      "Inspecciones, reparaciones de ingeniería y soluciones de protección para mantener cada bahía conforme y a su equipo alineado.",
    "See Our Work":"Ver Nuestro Trabajo",
    "Solutions built for safety & scale":"Soluciones diseñadas para seguridad y escala",
    "Engineered Repairs":"Reparaciones de Ingeniería",
    "Protection & Guarding":"Protección y Guardas",
    "Digital Inspections":"Inspecciones Digitales",
    "Explore repair kits →":"Ver kits de reparación →",
    "Explore guarding →":"Ver protecciones →",
    "Learn more →":"Más información →",
    "Engineering & Field Services":"Servicios de Ingeniería y Campo",
    "Site Surveys":"Levantamientos en Sitio",
    "Permitting Support":"Soporte de Permisos",
    "Install & Training":"Instalación y Capacitación",
    "Talk to Elite":"Hable con Elite",
    "Tell us about your facility and we’ll reply with next steps within one business day.":
      "Cuéntenos sobre su instalación y responderemos con los próximos pasos en un día hábil.",
    "Send":"Enviar",
    "Name":"Nombre",
    "Email":"Correo",
    "Company":"Empresa",
    "Message":"Mensaje",
    "End-of-aisle, column, and impact guarding systems. Use this page to add SKUs, photos, and installation details.":
      "Sistemas de protección de extremo de pasillo, columnas e impacto. Use esta página para agregar SKUs, fotos y detalles de instalación.",
    "Explore engineered rack repair solutions. Use this page to add product names, photos, specs, and downloadable PDFs.":
      "Explore soluciones de reparación de racks. Use esta página para agregar nombres de productos, fotos, especificaciones y PDFs descargables.",
    "EZ - Frame/End of Row Guard":"EZ - Protector de Marco/Extremo de Fila",
    "EZ - Column Guards":"EZ - Protectores de Columna",
    "Description coming soon.":"Descripción próximamente."
  };
  const reverse = Object.fromEntries(Object.entries(map).map(([en,es]) => [es,en]));

  function walk(node, toES){
    if (node.nodeType === Node.TEXT_NODE){
      const raw=node.nodeValue, trimmed=raw.trim();
      if (!trimmed) return;
      if (toES && map[trimmed]) node.nodeValue = raw.replace(trimmed, map[trimmed]);
      else if (!toES && reverse[trimmed]) node.nodeValue = raw.replace(trimmed, reverse[trimmed]);
      return;
    }
    if (node.tagName && /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(node.tagName)) return;
    Array.from(node.childNodes).forEach(n=>walk(n,toES));
  }
  function translate(toES){
    walk(document.body,toES);
    document.documentElement.setAttribute('lang', toES ? 'es' : 'en');
    localStorage.setItem('elite_lang', toES ? 'es' : 'en');
    BTN.textContent = toES ? 'EN' : 'ES';
    BTN.setAttribute('aria-label', toES ? 'Switch to English' : 'Cambiar a Español');
  }
  const saved = localStorage.getItem('elite_lang');
  if (saved === 'es') translate(true);
  BTN.addEventListener('click', ()=> {
    const isES = (localStorage.getItem('elite_lang') || 'en') === 'es';
    translate(!isES);
  });
})();

// Hero carousel (4 slides)
(function(){
  const root = document.querySelector('.hero-carousel');
  if (!root) return;
  const slides = root.querySelector('.slides');
  const items = root.querySelectorAll('.slide');
  const dots = root.querySelectorAll('.dot');
  const prev = root.querySelector('.prev');
  const next = root.querySelector('.next');
  let index = 0, timer;

  function update(){
    slides.style.transform = `translateX(${-index * 100}%)`;
    dots.forEach((d,i)=>d.classList.toggle('active', i===index));
  }
  function go(i){
    index = (i + items.length) % items.length;
    update(); reset();
  }
  function reset(){
    clearInterval(timer);
    timer = setInterval(()=>go(index+1), 4000);
  }

  prev.addEventListener('click', ()=>go(index-1));
  next.addEventListener('click', ()=>go(index+1));
  dots.forEach((d,i)=>d.addEventListener('click', ()=>go(i)));

  let startX=0, dx=0;
  slides.addEventListener('touchstart',(e)=>{startX=e.touches[0].clientX; dx=0; clearInterval(timer);},{passive:true});
  slides.addEventListener('touchmove',(e)=>{dx=e.touches[0].clientX-startX;},{passive:true});
  slides.addEventListener('touchend',()=>{ if (Math.abs(dx)>40){ go(index + (dx<0?1:-1)); } else reset(); });

  update(); reset();
})();
