/* ---------- Client Intake ---------- */
const INTAKE = { step:0, data:{ service:'discovery', areas:[] }, submitted:false };
const STEPS = ['Coaching interest','About you','Goals & challenges','Expectations','Review & submit'];
const SERVICES = {
  discovery:{t:'Free Discovery Call', d:'20 minutes to see if we\'re a fit'},
  clarity:{t:'Clarity Session', d:'90 minutes · $595'},
  becoming:{t:'The Becoming Program', d:'3 months · 1:1 coaching'},
  executive:{t:'Executive Presence', d:'6 months · leadership coaching'},
  retreat:{t:'Retreats & Workshops', d:'For teams and groups'},
  unsure:{t:'Not sure yet', d:'Help me choose'}
};
function goIntake(svc){ INTAKE.data.service=svc; INTAKE.step=0; INTAKE.submitted=false; location.hash='#intake'; if(location.hash==='#intake') renderIntake(); }

function renderIntake(){
  const root=document.getElementById('page-intake');
  const d=INTAKE.data, s=INTAKE.step;
  const pct = INTAKE.submitted ? 100 : (s/STEPS.length)*100 + 6;
  const chk=(name,val)=> (Array.isArray(d[name]) ? d[name].includes(val) : d[name]===val) ? 'checked':'';
  const v=k=>esc(d[k]||'');

  root.innerHTML = `
  <section class="intake">
    <aside class="intake-side">
      <a href="#home" class="logo" style="color:var(--cream)">Maisha</a>
      <div><h2>Let's begin.</h2><p class="muted" style="margin-top:14px">A few thoughtful questions so I can arrive at our first conversation already understanding where you are.</p></div>
      <ol class="steps">${STEPS.map((n,i)=>`<li class="${INTAKE.submitted||i<s?'done':i===s?'on':''}"><i>${INTAKE.submitted||i<s?'✓':i+1}</i>${n}</li>`).join('')}</ol>
      <div class="assure"><span style="font-family:var(--serif);font-size:30px;line-height:1;color:var(--saffron)">✦</span><span>Everything you share is confidential and used only to prepare for our work together.</span></div>
    </aside>
    <div class="intake-main">
      <div class="progress"><span style="width:${pct}%"></span></div>

      ${INTAKE.submitted ? confirmHTML() : `
      <form id="intakeForm" novalidate>
      <div class="step-pane ${s===0?'on':''}">
        <span class="eyebrow">Step 1 of 5</span>
        <h3>What brings you here?</h3>
        <p class="lead">Choose the option that feels closest. You can always change course later.</p>
        <div class="choice-grid c3">
          ${Object.entries(SERVICES).map(([k,o])=>`<label class="choice"><input type="radio" name="service" value="${k}" ${chk('service',k)}><span class="box"><b>${o.t}</b><span>${o.d}</span></span></label>`).join('')}
        </div>
        <p class="flabel" style="margin:40px 0 14px">Areas you'd like to focus on <span class="muted" style="text-transform:none;letter-spacing:0">(select any)</span></p>
        <div class="pill-group">
          ${['Career transition','Leadership & influence','Confidence','Communication','Burnout & rest','Boundaries','Purpose & meaning','Relationships','Starting a business','Work–life integration'].map(a=>`<label class="pill"><input type="checkbox" name="areas" value="${a}" ${chk('areas',a)}><span>${a}</span></label>`).join('')}
        </div>
      </div>

      <div class="step-pane ${s===1?'on':''}">
        <span class="eyebrow">Step 2 of 5</span>
        <h3>A little about you.</h3>
        <p class="lead">So I know who I'm speaking with — and how best to reach you.</p>
        <div class="form-grid">
          <div class="row2">
            <div class="field"><label for="i-first">First name</label><input id="i-first" name="first" value="${v('first')}" required autocomplete="given-name"><span class="msg">Required</span></div>
            <div class="field"><label for="i-last">Last name</label><input id="i-last" name="last" value="${v('last')}" required autocomplete="family-name"><span class="msg">Required</span></div>
          </div>
          <div class="row2">
            <div class="field"><label for="i-email">Email</label><input id="i-email" type="email" name="email" value="${v('email')}" required autocomplete="email"><span class="msg">Please enter a valid email</span></div>
            <div class="field"><label for="i-phone">Phone <span class="muted" style="text-transform:none;letter-spacing:0">(optional)</span></label><input id="i-phone" type="tel" name="phone" value="${v('phone')}" autocomplete="tel"></div>
          </div>
          <div class="row2">
            <div class="field"><label for="i-role">Current role or occupation</label><input id="i-role" name="role" value="${v('role')}" placeholder="e.g. Senior Product Manager"></div>
            <div class="field"><label for="i-tz">Time zone</label><select id="i-tz" name="tz">${['Eastern (ET)','Central (CT)','Mountain (MT)','Pacific (PT)','UK / GMT','Central Europe (CET)','East Africa (EAT)','Other'].map(o=>`<option ${d.tz===o?'selected':''}>${o}</option>`).join('')}</select></div>
          </div>
          <div class="field"><label for="i-heard">How did you hear about me?</label><select id="i-heard" name="heard">${['Instagram','LinkedIn','Podcast','A friend or colleague','Google','Other'].map(o=>`<option ${d.heard===o?'selected':''}>${o}</option>`).join('')}</select></div>
        </div>
      </div>

      <div class="step-pane ${s===2?'on':''}">
        <span class="eyebrow">Step 3 of 5</span>
        <h3>Where are you now?</h3>
        <p class="lead">There are no wrong answers. Write as much or as little as feels right.</p>
        <div class="form-grid">
          <div class="field"><label for="i-now">What's happening in your life or work right now?</label><textarea id="i-now" name="now" required placeholder="The situation, the feeling, the thing that made you search for a coach…">${v('now')}</textarea><span class="msg">Just a sentence or two is perfect.</span></div>
          <div class="field"><label for="i-stuck">What feels most challenging or stuck?</label><textarea id="i-stuck" name="stuck" placeholder="What have you already tried?">${v('stuck')}</textarea></div>
          <div class="field"><label for="i-vision">Imagine it's six months from now and our work went brilliantly. What's different?</label><textarea id="i-vision" name="vision" required placeholder="How do you feel? What have you done, decided, or let go of?">${v('vision')}</textarea><span class="msg">Dream a little — even a few words helps.</span></div>
        </div>
      </div>

      <div class="step-pane ${s===3?'on':''}">
        <span class="eyebrow">Step 4 of 5</span>
        <h3>What would make this worthwhile?</h3>
        <p class="lead">This helps me tailor our approach to the way you work best.</p>
        <div class="form-grid">
          <div><p class="flabel" style="margin-bottom:12px">How ready do you feel to make a change?</p>
            <div class="scale">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<label><input type="radio" name="ready" value="${n}" ${String(d.ready)===String(n)?'checked':''}><span>${n}</span></label>`).join('')}</div>
            <div class="scale-legend"><span>Just exploring</span><span>Ready yesterday</span></div>
          </div>
          <div><p class="flabel" style="margin:14px 0 12px">I'd love a coach who is…</p>
            <div class="pill-group">${['Gently encouraging','Direct & challenging','Strategic & structured','Intuitive & reflective','Accountability-focused'].map(a=>`<label class="pill"><input type="checkbox" name="style" value="${a}" ${(d.style||[]).includes(a)?'checked':''}><span>${a}</span></label>`).join('')}</div>
          </div>
          <div class="row2">
            <div class="field"><label for="i-start">When would you like to start?</label><select id="i-start" name="start">${['As soon as possible','Within the next month','In 1–3 months','Just exploring for now'].map(o=>`<option ${d.start===o?'selected':''}>${o}</option>`).join('')}</select></div>
            <div class="field"><label for="i-fmt">Preferred format</label><select id="i-fmt" name="fmt">${['Video call','In person (Atlanta)','Either works'].map(o=>`<option ${d.fmt===o?'selected':''}>${o}</option>`).join('')}</select></div>
          </div>
          <div class="field"><label for="i-invest">Investment range you're considering</label><select id="i-invest" name="invest">${['Under $600','$600 – $2,000','$2,000 – $6,000','$6,000+','Employer is sponsoring','Prefer to discuss'].map(o=>`<option ${d.invest===o?'selected':''}>${o}</option>`).join('')}</select></div>
          <div class="field"><label for="i-else">Anything else you'd like me to know?</label><textarea id="i-else" name="else" style="min-height:90px">${v('else')}</textarea></div>
        </div>
      </div>

      <div class="step-pane ${s===4?'on':''}">
        <span class="eyebrow">Step 5 of 5</span>
        <h3>Everything look right?</h3>
        <p class="lead">Take a moment to review. You can edit any section before sending.</p>
        <dl class="review">
          <div><dt>Interested in</dt><dd>${SERVICES[d.service]?.t||'—'}${d.areas.length?`<br><span class="muted" style="font-size:14px">${d.areas.map(esc).join(' · ')}</span>`:''}</dd><button type="button" onclick="jumpStep(0)">Edit</button></div>
          <div><dt>Contact</dt><dd>${v('first')} ${v('last')}<br><span class="muted" style="font-size:14px">${v('email')}${d.phone?' · '+v('phone'):''} · ${v('tz')}</span></dd><button type="button" onclick="jumpStep(1)">Edit</button></div>
          <div><dt>Right now</dt><dd>${v('now')||'—'}</dd><button type="button" onclick="jumpStep(2)">Edit</button></div>
          <div><dt>Six months from now</dt><dd>${v('vision')||'—'}</dd><button type="button" onclick="jumpStep(2)">Edit</button></div>
          <div><dt>Readiness · Start</dt><dd>${d.ready?d.ready+' / 10':'—'} · ${v('start')} · ${v('fmt')}</dd><button type="button" onclick="jumpStep(3)">Edit</button></div>
        </dl>
        <label class="consent"><input type="checkbox" id="consent"><span>I understand coaching is not a substitute for therapy or medical care, and I agree to Maisha's <u>privacy policy</u>.</span></label>
        <p id="consentErr" style="color:#B0412E;font-size:13px;margin-top:8px;display:none">Please confirm to continue.</p>
      </div>

      <div class="step-nav">
        ${s>0?`<button type="button" class="link" onclick="prevStep()">← Back</button>`:`<a href="#services" class="link">← Back to coaching</a>`}
        <button type="submit" class="btn ${s===4?'btn-primary':'btn-dark'}">${s===4?'Submit my intake':'Continue'} <span class="arr">→</span></button>
      </div>
      </form>`}
    </div>
  </section>`;

  const form=document.getElementById('intakeForm');
  if(form){
    form.addEventListener('submit', e=>{ e.preventDefault(); nextStep(); });
    form.addEventListener('change', collect);
  }
}

function collect(){
  const form=document.getElementById('intakeForm'); if(!form) return;
  const fd=new FormData(form); const d=INTAKE.data;
  d.areas = fd.getAll('areas'); d.style = fd.getAll('style');
  ['service','first','last','email','phone','role','tz','heard','now','stuck','vision','ready','start','fmt','invest','else'].forEach(k=>{ if(fd.has(k)) d[k]=fd.get(k); });
}
function nextStep(){
  collect();
  const pane=document.querySelectorAll('.step-pane')[INTAKE.step];
  if(!validateFields(pane)) return;
  if(INTAKE.step===4){
    if(!document.getElementById('consent').checked){ document.getElementById('consentErr').style.display='block'; return; }
    INTAKE.submitted=true;
  } else INTAKE.step++;
  renderIntake(); window.scrollTo({top:0,behavior:'smooth'});
}
function prevStep(){ collect(); INTAKE.step=Math.max(0,INTAKE.step-1); renderIntake(); window.scrollTo({top:0,behavior:'smooth'}); }
function jumpStep(n){ collect(); INTAKE.step=n; renderIntake(); window.scrollTo({top:0,behavior:'smooth'}); }

function confirmHTML(){
  const d=INTAKE.data; const svc=SERVICES[d.service]?.t||'coaching';
  return `<div class="confirm">
    <div class="seal">m</div>
    <span class="eyebrow">Intake received</span>
    <h3 style="font-size:52px;margin:14px 0 16px">Thank you, ${esc(d.first||'friend')}.</h3>
    <p class="lead">I'm so glad you reached out. I read every intake personally, and I'll be in touch about your <b style="font-weight:500">${svc}</b> within one business day.</p>
    <div class="next-steps">
      <div><i>01</i><div><b>Check your inbox</b><p>A confirmation has been sent to ${esc(d.email||'your email')} with a copy of your answers.</p></div></div>
      <div><i>02</i><div><b>Choose your time</b><p>Within 24 hours you'll receive a personal scheduling link for your first conversation.</p></div></div>
      <div><i>03</i><div><b>Prepare, gently</b><p>Before we meet, take 10 quiet minutes with the free <em>Clarity Starter</em> prompts I've included in your email.</p></div></div>
    </div>
    <div style="display:flex;gap:20px;justify-content:center;flex-wrap:wrap;align-items:center">
      <a href="#shop" class="btn btn-dark">Explore the shop <span class="arr">→</span></a>
      <a href="#home" class="link">Return home</a>
    </div>
  </div>`;
}
