/* ---------- Shop / Cart / Checkout ---------- */
const A=k=>document.getElementById('asset-'+k).src;
const BGS=['#EADFCF','#F1DCCF','#E4E2D6','#EFE6DA'];
const money=n=>'$'+n.toFixed(2).replace(/\.00$/,'');
const P=id=>PRODUCTS.find(p=>p.id===id);
let CART=[]; try{ CART=JSON.parse(localStorage.getItem('maisha.cart')||'[]'); }catch(e){}
let ORDER=null;

function mockHTML(p){
  const cls = p.shape==='book'?'':p.shape;
  return `<div class="mock ${cls}" style="background:${p.color}">
    <span class="mk-top">${p.top}</span>
    ${p.shape==='book'?'<span class="mk-shape"></span>':''}
    <span class="mk-title">${p.title}</span>
    <span class="mk-foot">${p.foot}</span>
  </div>`;
}
function bgFor(p){ return BGS[PRODUCTS.indexOf(p)%BGS.length]; }

let shopFilter='all';
function renderShop(){
  const list = PRODUCTS.filter(p=>shopFilter==='all'||p.type===shopFilter);
  document.getElementById('prodCount').textContent = list.length+' items';
  document.getElementById('prodGrid').innerHTML = list.map(p=>`
    <article class="prod" onclick="location.hash='#product/${p.id}'">
      <div class="prod-cover" style="background:${bgFor(p)}">
        ${p.badge?`<span class="prod-badge">${p.badge}</span>`:''}
        ${mockHTML(p)}
        <div class="quick"><button class="btn btn-dark" onclick="event.stopPropagation();addToCart('${p.id}')">Add to bag — ${money(p.price)}</button></div>
      </div>
      <div class="prod-info"><h4>${p.name}</h4><span class="p">${p.compare?`<s class="muted" style="font-size:16px;margin-right:6px">${money(p.compare)}</s>`:''}${money(p.price)}</span></div>
      <span class="prod-type">${p.kind}</span>
    </article>`).join('');
  document.querySelectorAll('#filters button').forEach(b=>{
    b.classList.toggle('on', b.dataset.f===shopFilter);
    b.onclick=()=>{ shopFilter=b.dataset.f; renderShop(); };
  });
}

/* Product detail */
let pdpOpt=0, pdpQty=1;
function renderProduct(id){
  const p=P(id)||PRODUCTS[0]; pdpOpt=0; pdpQty=1;
  const root=document.getElementById('page-product');
  const related=PRODUCTS.filter(x=>x.id!==p.id).slice(0,3);
  root.innerHTML = `
  <div class="wrap">
    <div class="pdp">
      <div class="pdp-gallery">
        <div class="pdp-main" id="pdpMain" style="background:${bgFor(p)}">${mockHTML(p)}</div>
        <div class="pdp-thumbs">
          <div class="on" style="background:${bgFor(p)};display:grid;place-items:center" onclick="pdpShow(0,this)"><div style="width:38%;aspect-ratio:3/4;background:${p.color};box-shadow:4px 6px 10px -4px rgba(0,0,0,.4)"></div></div>
          <div onclick="pdpShow(1,this)"><img src="${A('journal')}" alt=""></div>
          <div onclick="pdpShow(2,this)"><img src="${A('cafe')}" alt=""></div>
          <div onclick="pdpShow(3,this)"><img src="${A('vase')}" alt=""></div>
        </div>
      </div>
      <div class="pdp-info">
        <p class="crumbs"><a href="#shop">Shop</a> / ${p.type} / ${p.name}</p>
        <div><span class="eyebrow">${p.kind}</span><h1 style="font-size:clamp(40px,4vw,58px);margin-top:12px">${p.name}</h1></div>
        <div style="display:flex;align-items:center;gap:16px"><span class="pdp-price" id="pdpPrice">${money(p.price)}${p.compare?`<s>${money(p.compare)}</s>`:''}</span><span class="stars">★★★★★</span><span class="muted" style="font-size:14px">(${40+p.price%73} reviews)</span></div>
        <p class="lead" style="font-size:18px">${p.blurb}</p>
        ${p.options?`<div><p class="opt-label">${p.options.label}</p><div class="opts" id="pdpOpts">${p.options.values.map((o,i)=>`<button class="${i===0?'on':''}" onclick="pdpPick(${i})">${o}</button>`).join('')}</div></div>`:''}
        <div class="buy-row">
          <div class="qty"><button onclick="pdpQ(-1)" aria-label="Decrease">−</button><span id="pdpQty">1</span><button onclick="pdpQ(1)" aria-label="Increase">+</button></div>
          <button class="btn btn-primary" onclick="addToCart('${p.id}', pdpOpt, pdpQty)">Add to bag <span class="arr">→</span></button>
        </div>
        <div class="perks"><div>${p.type==='Print'?'Free shipping over $75':'Instant digital delivery'}</div><div>Secure checkout</div><div>30-day happiness guarantee</div><div>10% funds scholarships</div></div>
        <div class="acc">
          <details open><summary>What's included</summary><ul>${p.includes.map(i=>`<li>${i}</li>`).join('')}</ul></details>
          <details><summary>Who it's for</summary><p>For anyone who wants to keep growing between sessions — or begin the work on their own, at their own pace. Pairs beautifully with the Clarity Session.</p></details>
          <details><summary>Delivery &amp; returns</summary><p>${p.type==='Print'?'Ships in 2–4 business days from Atlanta. Free U.S. shipping over $75; international available.':'Access is emailed immediately after purchase. Lifetime access, including future updates.'} Not the right fit? Full refund within 30 days.</p></details>
        </div>
      </div>
    </div>
  </div>
  <section class="pad-sm bg-paper">
    <div class="wrap">
      <div style="display:flex;justify-content:space-between;align-items:end;margin-bottom:44px"><h2 style="font-size:44px">You may also love</h2><a href="#shop" class="link">View all</a></div>
      <div class="prod-grid">${related.map(r=>`<article class="prod" onclick="location.hash='#product/${r.id}'"><div class="prod-cover" style="background:${bgFor(r)}">${mockHTML(r)}<div class="quick"><button class="btn btn-dark" onclick="event.stopPropagation();addToCart('${r.id}')">Add to bag — ${money(r.price)}</button></div></div><div class="prod-info"><h4>${r.name}</h4><span class="p">${money(r.price)}</span></div><span class="prod-type">${r.kind}</span></article>`).join('')}</div>
    </div>
  </section>`;
  root.dataset.pid=p.id;
}
function pdpShow(i, el){
  document.querySelectorAll('.pdp-thumbs div').forEach(d=>d.classList.remove('on')); el.classList.add('on');
  const p=P(document.getElementById('page-product').dataset.pid); const main=document.getElementById('pdpMain');
  const imgs=[null,A('journal'),A('cafe'),A('vase')];
  main.innerHTML = i===0 ? mockHTML(p) : `<img src="${imgs[i]}" alt="" style="width:100%;height:100%;object-fit:cover">`;
}
function pdpPick(i){
  pdpOpt=i; const p=P(document.getElementById('page-product').dataset.pid);
  document.querySelectorAll('#pdpOpts button').forEach((b,k)=>b.classList.toggle('on',k===i));
  document.getElementById('pdpPrice').innerHTML = money(unitPrice(p,i)) + (p.compare&&i===0?`<s>${money(p.compare)}</s>`:'');
}
function pdpQ(n){ pdpQty=Math.max(1,pdpQty+n); document.getElementById('pdpQty').textContent=pdpQty; }

/* Cart model */
function unitPrice(p,opt){ return p.price + ((p.optionPrice||[])[opt]||0); }
function saveCart(){ try{ localStorage.setItem('maisha.cart', JSON.stringify(CART)); }catch(e){} }
function addToCart(id,opt=0,qty=1){
  const ex=CART.find(l=>l.id===id && l.opt===opt);
  if(ex) ex.qty+=qty; else CART.push({id,opt,qty});
  saveCart(); updateCartUI(); toast(P(id).name+' added to your bag');
}
function setQty(i,n){ CART[i].qty+=n; if(CART[i].qty<1) CART.splice(i,1); saveCart(); updateCartUI(); if(document.getElementById('page-checkout').classList.contains('on')) renderCheckout(); }
function removeLine(i){ CART.splice(i,1); saveCart(); updateCartUI(); }
function totals(){
  const sub=CART.reduce((s,l)=>s+unitPrice(P(l.id),l.opt)*l.qty,0);
  const physical=CART.some(l=>P(l.id).type==='Print');
  const ship = !physical?0: sub>=75?0:8;
  const disc = window.PROMO? Math.round(sub*.15*100)/100 : 0;
  const tax = Math.round((sub-disc)*0.07*100)/100;
  return {sub,ship,disc,tax,total:sub-disc+ship+tax,physical};
}
function updateCartUI(){
  const n=CART.reduce((s,l)=>s+l.qty,0);
  const c=document.getElementById('cartCount'); c.textContent=n; c.dataset.n=n;
  const body=document.getElementById('drawerBody'), foot=document.getElementById('drawerFoot');
  if(!CART.length){
    body.innerHTML=`<div class="empty"><p class="serif">Your bag is empty.</p><p>Start with something small for yourself.</p><a href="#shop" class="btn btn-dark" style="margin-top:26px">Visit the shop</a></div>`;
    foot.style.display='none'; return;
  }
  foot.style.display='';
  body.innerHTML = CART.map((l,i)=>{ const p=P(l.id); return `
    <div class="line-item">
      <div class="li-thumb" style="background:${bgFor(p)}">${mockHTML(p)}</div>
      <div><h5>${p.name}</h5><div class="v">${p.options?p.options.values[l.opt]:p.kind}</div>
        <div style="display:flex;align-items:center"><div class="mini-qty"><button onclick="setQty(${i},-1)" aria-label="Decrease">−</button><span>${l.qty}</span><button onclick="setQty(${i},1)" aria-label="Increase">+</button></div><button class="rm" onclick="removeLine(${i})">Remove</button></div>
      </div>
      <span class="lp">${money(unitPrice(p,l.opt)*l.qty)}</span>
    </div>`; }).join('');
  const t=totals();
  const left=Math.max(0,75-t.sub);
  foot.innerHTML = `
    ${t.physical?`<div class="ship-bar">${left>0?`You're <b style="font-weight:500">${money(left)}</b> away from free shipping`:'You\'ve unlocked <b style="font-weight:500">free shipping</b>'}<div class="bar"><span style="width:${Math.min(100,t.sub/75*100)}%"></span></div></div>`:''}
    <div class="tot big"><span>Subtotal</span><span>${money(t.sub)}</span></div>
    <p class="muted" style="font-size:13px;margin-top:-8px">Taxes and shipping calculated at checkout.</p>
    <a href="#checkout" class="btn btn-primary" style="justify-content:center">Secure checkout <span class="arr">→</span></a>
    <button class="link" style="align-self:center" onclick="closeCart()">Continue shopping</button>`;
}
function openCart(){ document.getElementById('drawer').classList.add('open'); document.getElementById('scrim').classList.add('open'); document.getElementById('toast').classList.remove('show'); }
function closeCart(){ document.getElementById('drawer').classList.remove('open'); document.getElementById('scrim').classList.remove('open'); }

/* Checkout */
function renderCheckout(){
  const root=document.getElementById('page-checkout');
  if(!CART.length){
    root.innerHTML=`<section class="page-head"><div class="wrap"><span class="eyebrow">Checkout</span><h1>Your bag is <em>empty.</em></h1><a href="#shop" class="btn btn-dark" style="margin-top:20px">Visit the shop</a></div></section>`; return;
  }
  const t=totals();
  root.innerHTML = `
  <section class="checkout">
    <div class="co-main">
      <a href="#home" class="logo" style="margin-bottom:26px;display:inline-flex">Maisha</a>
      <div class="co-steps"><a href="#shop">Bag</a><span>›</span><span class="on">Details &amp; payment</span><span>›</span><span>Confirmation</span></div>
      <div class="express"><button style="background:#000;color:#fff" onclick="placeOrder(true)">Apple Pay</button><button style="background:#FFC439;color:#111" onclick="placeOrder(true)">PayPal</button></div>
      <div class="or">or pay with card</div>
      <form id="coForm" novalidate>
        <div class="co-block"><h4>Contact <span class="muted" style="font-family:var(--sans);font-size:14px">Have an account? <u>Log in</u></span></h4>
          <div class="form-grid">
            <div class="field"><label for="co-email">Email</label><input id="co-email" type="email" required autocomplete="email"><span class="msg">Enter a valid email for your receipt &amp; downloads</span></div>
            <label class="consent" style="margin-top:0"><input type="checkbox" checked><span>Send me Sunday Letters &amp; occasional offers</span></label>
          </div>
        </div>
        ${t.physical?`<div class="co-block"><h4>Shipping</h4><div class="form-grid">
          <div class="row2"><div class="field"><label for="co-fn">First name</label><input id="co-fn" required><span class="msg">Required</span></div><div class="field"><label for="co-ln">Last name</label><input id="co-ln" required><span class="msg">Required</span></div></div>
          <div class="field"><label for="co-addr">Address</label><input id="co-addr" required autocomplete="street-address"><span class="msg">Required</span></div>
          <div class="row2"><div class="field"><label for="co-city">City</label><input id="co-city" required><span class="msg">Required</span></div><div class="field"><label for="co-zip">ZIP / Postal code</label><input id="co-zip" required><span class="msg">Required</span></div></div>
        </div></div>`:`<div class="co-block"><h4>Name on order</h4><div class="row2"><div class="field"><label for="co-fn">First name</label><input id="co-fn" required><span class="msg">Required</span></div><div class="field"><label for="co-ln">Last name</label><input id="co-ln" required><span class="msg">Required</span></div></div><p class="muted" style="font-size:14px;margin-top:14px">Digital items only — no shipping needed. Access arrives by email instantly.</p></div>`}
        <div class="co-block"><h4>Payment</h4>
          <div class="pay-box">
            <label class="pay-opt"><input type="radio" name="pay" checked> Credit or debit card <span class="cards"><i>VISA</i><i>MC</i><i>AMEX</i></span></label>
            <div class="pay-fields">
              <div class="field"><label for="co-card">Card number</label><input id="co-card" inputmode="numeric" placeholder="1234 1234 1234 1234" required oninput="this.value=this.value.replace(/\\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()"><span class="msg">Enter your card number</span></div>
              <div class="row2"><div class="field"><label for="co-exp">Expiry</label><input id="co-exp" placeholder="MM / YY" required><span class="msg">Required</span></div><div class="field"><label for="co-cvc">CVC</label><input id="co-cvc" placeholder="123" required><span class="msg">Required</span></div></div>
            </div>
            <label class="pay-opt"><input type="radio" name="pay"> Pay in 4 interest-free installments</label>
          </div>
          <p class="secure">Payments are encrypted and processed securely. Maisha never stores your card details.</p>
        </div>
        <button class="btn btn-primary" style="width:100%;justify-content:center;height:60px">Pay ${money(t.total)} <span class="arr">→</span></button>
      </form>
    </div>
    <aside class="co-side"><div class="co-side-in">
      <h4 style="font-size:28px;margin-bottom:10px">Order summary</h4>
      ${CART.map((l,i)=>{const p=P(l.id);return `<div class="line-item" style="grid-template-columns:70px 1fr auto"><div class="li-thumb" style="background:${bgFor(p)};position:relative">${mockHTML(p)}<span style="position:absolute;top:-8px;right:-8px;background:var(--ink-2);color:#fff;border-radius:50%;width:22px;height:22px;font-size:12px;display:grid;place-items:center">${l.qty}</span></div><div><h5>${p.name}</h5><div class="v">${p.options?p.options.values[l.opt]:p.kind}</div></div><span class="lp">${money(unitPrice(p,l.opt)*l.qty)}</span></div>`}).join('')}
      <div class="promo"><input id="promo" placeholder="Gift card or discount code" value="${window.PROMO?'WELCOME15':''}"><button onclick="applyPromo()">Apply</button></div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div class="tot"><span>Subtotal</span><span>${money(t.sub)}</span></div>
        ${t.disc?`<div class="tot" style="color:var(--sage)"><span>Discount · WELCOME15</span><span>−${money(t.disc)}</span></div>`:''}
        <div class="tot"><span>Shipping</span><span>${t.physical?(t.ship?money(t.ship):'Free'):'Digital — free'}</span></div>
        <div class="tot"><span>Estimated tax</span><span>${money(t.tax)}</span></div>
        <div class="tot big" style="padding-top:16px;border-top:1px solid var(--line);margin-top:6px"><span>Total</span><span>${money(t.total)}</span></div>
      </div>
      <p class="muted" style="font-size:13px;margin-top:22px">Try code <b>WELCOME15</b> for 15% off.</p>
    </div></aside>
  </section>`;
  document.getElementById('coForm').addEventListener('submit', e=>{ e.preventDefault(); placeOrder(false); });
}
function applyPromo(){ const v=document.getElementById('promo').value.trim().toUpperCase(); if(v==='WELCOME15'){ window.PROMO=true; renderCheckout(); toast('Code applied — 15% off', false);} else toast('That code isn\'t valid', false); }
function placeOrder(express){
  if(!express && !validateFields(document.getElementById('coForm'))) return;
  const email = (document.getElementById('co-email')||{}).value || 'you@email.com';
  const name = (document.getElementById('co-fn')||{}).value || '';
  ORDER = { items: CART.slice(), t: totals(), email, name, no: 'M-' + (10400 + Math.floor(Math.random()*900)) };
  CART=[]; window.PROMO=false; saveCart(); updateCartUI();
  location.hash='#order';
}
function renderOrder(){
  const root=document.getElementById('page-order');
  if(!ORDER){ root.innerHTML=`<section class="page-head"><div class="wrap"><h1>No recent order.</h1><a href="#shop" class="btn btn-dark">Visit the shop</a></div></section>`; return; }
  const o=ORDER;
  root.innerHTML = `<section class="pad"><div class="wrap"><div class="confirm" style="max-width:760px">
    <div class="seal">m</div>
    <span class="eyebrow">Order ${o.no} confirmed</span>
    <h3 style="font-size:52px;margin:14px 0 16px">Thank you${o.name?', '+esc(o.name):''}.</h3>
    <p class="lead">A receipt is on its way to ${esc(o.email)}. ${o.t.physical?'Physical items ship within 2–4 business days.':''} Digital items are ready now.</p>
    <div class="review" style="text-align:left;margin:44px 0">
      ${o.items.map(l=>{const p=P(l.id);return `<div style="grid-template-columns:1fr auto auto"><dd>${p.name} <span class="muted">× ${l.qty}</span></dd><span class="serif" style="font-size:19px">${money(unitPrice(p,l.opt)*l.qty)}</span>${p.type!=='Print'?'<button>Download</button>':'<span class="muted" style="font-size:12px;letter-spacing:.14em;text-transform:uppercase">Ships soon</span>'}</div>`}).join('')}
      <div style="grid-template-columns:1fr auto"><dt style="padding-top:8px">Total paid</dt><span class="serif" style="font-size:26px">${money(o.t.total)}</span></div>
    </div>
    <div style="background:var(--blush);padding:40px;text-align:left;display:grid;grid-template-columns:1fr auto;gap:30px;align-items:center" class="book-band">
      <div><span class="eyebrow">Ready to go deeper?</span><h4 style="font-size:30px;margin-top:10px">Pair your purchase with a Clarity Session.</h4></div>
      <button class="btn btn-dark" onclick="goIntake('clarity')">Start intake →</button>
    </div>
  </div></div></section>`;
}
