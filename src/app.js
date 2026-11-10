/* ---------- Router ---------- */
const PAGES = ['home','about','services','intake','shop','product','checkout','contact','order'];
function route(){
  let h = (location.hash || '#home').slice(1);
  let [page, arg] = h.split('/');
  if(!PAGES.includes(page)){ page = 'home'; }
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));
  if(page==='product') renderProduct(arg);
  if(page==='intake') renderIntake();
  if(page==='checkout') renderCheckout();
  if(page==='order') renderOrder();
  document.getElementById('page-'+page).classList.add('on');
  document.querySelectorAll('[data-nav]').forEach(a=>{
    const n=a.dataset.nav; a.classList.toggle('active', n===page || (n==='shop' && (page==='product'||page==='checkout')) || (n==='services' && page==='intake'));
  });
  document.querySelector('footer').style.display = (page==='intake'||page==='checkout') ? 'none':'';
  window.scrollTo(0,0);
  closeCart();
  try{ localStorage.setItem('maisha.route', location.hash); }catch(e){}
  requestAnimationFrame(observeReveal);
}
window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', ()=>{
  if(!location.hash){ try{ const r=localStorage.getItem('maisha.route'); if(r) history.replaceState(null,'',r);}catch(e){} }
  route(); renderShop(); updateCartUI(); buildCal(); initQuotes(); initContact();
});

function scrollToId(id){ const el=document.getElementById(id); if(el) window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 100, behavior:'smooth'}); }
function toggleMenu(open){ document.getElementById('mobileMenu').classList.toggle('open', open); }

/* nav border */
window.addEventListener('scroll', ()=>document.getElementById('nav').classList.toggle('scrolled', scrollY>10), {passive:true});

/* ---------- Reveal ---------- */
let io;
function observeReveal(){
  if(!io){ io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }), {threshold:.12, rootMargin:'0px 0px -40px 0px'}); }
  document.querySelectorAll('.page.on .rv:not(.in)').forEach(el=>io.observe(el));
}

/* ---------- Testimonials ---------- */
function initQuotes(){
  const slides=[...document.querySelectorAll('.quote-slide')], dots=[...document.querySelectorAll('.quote-dots button')];
  let i=0, t;
  const go=n=>{ i=n; slides.forEach((s,k)=>s.classList.toggle('on',k===i)); dots.forEach((d,k)=>d.classList.toggle('on',k===i)); };
  const auto=()=>{ clearInterval(t); t=setInterval(()=>go((i+1)%slides.length), 7000); };
  dots.forEach((d,k)=>d.onclick=()=>{ go(k); auto(); });
  auto();
}

/* ---------- Toast ---------- */
let toastT;
function toast(msg, showBtn=true){
  const t=document.getElementById('toast'); document.getElementById('toastMsg').textContent=msg;
  t.querySelector('button').style.display = showBtn?'':'none';
  t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'), 3200);
}

/* ---------- Validation helper ---------- */
function validateFields(container){
  let ok=true, first=null;
  container.querySelectorAll('[required]').forEach(inp=>{
    const f=inp.closest('.field'); if(!f) return;
    let bad = !inp.value.trim();
    if(!bad && inp.type==='email') bad = !/^\S+@\S+\.\S+$/.test(inp.value);
    f.classList.toggle('err', bad);
    if(bad){ ok=false; if(!first) first=inp; }
  });
  if(first) first.focus();
  return ok;
}
document.addEventListener('input', e=>{ const f=e.target.closest && e.target.closest('.field.err'); if(f) f.classList.remove('err'); });

/* ---------- Contact ---------- */
function initContact(){
  const f=document.getElementById('contactForm');
  f.addEventListener('submit', e=>{
    e.preventDefault();
    if(!validateFields(f)) return;
    const name=document.getElementById('c-name').value.split(' ')[0];
    f.innerHTML = `<div style="text-align:center;padding:40px 0"><div class="seal">m</div><h3>Thank you, ${esc(name)}.</h3><p class="lead" style="margin:16px auto 30px;max-width:420px">Your message is in my inbox. I'll reply personally within two business days.</p><a href="#shop" class="link">Browse the shop while you wait</a></div>`;
  });
}
function esc(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ---------- Mini booking calendar ---------- */
let pickDay=null, pickTime=null;
function buildCal(){
  const cal=document.getElementById('cal'); const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const mon=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let d=new Date(); let out=[];
  while(out.length<5){ d.setDate(d.getDate()+1); if(d.getDay()>0 && d.getDay()<5) out.push(new Date(d)); }
  cal.innerHTML = out.map((x,i)=>`<button data-i="${i}">${days[x.getDay()]}<b>${x.getDate()}</b>${mon[x.getMonth()]}</button>`).join('');
  cal.querySelectorAll('button').forEach(b=>b.onclick=()=>{
    cal.querySelectorAll('button').forEach(x=>x.classList.remove('on')); b.classList.add('on');
    pickDay=b.textContent.replace(/(\D+)(\d+)(\D+)/,'$1 $2 $3'); pickTime=null;
    const times=['9:00 am','10:30 am','1:00 pm','2:30 pm','4:00 pm'].filter((_,k)=>(k+ +b.dataset.i)%4!==0);
    document.getElementById('times').innerHTML = times.map(t=>`<button>${t}</button>`).join('');
    document.querySelectorAll('#times button').forEach(tb=>tb.onclick=()=>{ document.querySelectorAll('#times button').forEach(x=>x.classList.remove('on')); tb.classList.add('on'); pickTime=tb.textContent; document.getElementById('bookBtn').textContent='Confirm '+pickTime; });
    document.getElementById('bookBtn').textContent='Choose a time';
  });
}
function bookCall(){
  if(!pickDay){ toast('Pick a day first ↑', false); return; }
  if(!pickTime){ toast('Now choose a time ↑', false); return; }
  const band=document.querySelector('.book-band');
  band.innerHTML = `<div><span class="eyebrow">You're booked</span><h3 style="margin:12px 0 10px;font-size:38px">See you ${esc(pickDay)} at ${esc(pickTime)} ET.</h3><p style="color:var(--ink-2)">A calendar invite and video link are on their way. To make the most of our call, you can complete the short intake form now.</p></div><a href="#intake" class="btn btn-dark">Complete intake →</a>`;
}
