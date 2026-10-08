var e=()=>window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,t=()=>{let t=document.querySelector(`[data-states]`),n=t?.querySelector(`[data-state-badge]`),r=t?.querySelector(`[data-state-line]`),i=t?.querySelector(`[data-state-desc]`),a=[...t?.querySelectorAll(`[data-state]`)??[]];if(!t||!n||!r||a.length===0)return;let o=0,s=!1,c=(t,o)=>{let s=a[(t+a.length)%a.length];s&&(a.forEach(e=>{let t=e===s;e.setAttribute(`aria-checked`,String(t)),e.tabIndex=t?0:-1}),n.className=`badge ${s.dataset.state??``}`,n.textContent=s.dataset.label??``,r.textContent=s.dataset.line??``,i&&(i.textContent=s.dataset.text??``),e()||r.animate([{opacity:0,transform:`translateY(6px)`},{opacity:1,transform:`none`}],{duration:380,easing:`cubic-bezier(0.23, 1, 0.32, 1)`}),o&&s.focus())},l=()=>a.findIndex(e=>e.getAttribute(`aria-checked`)===`true`);a.forEach((e,t)=>{e.addEventListener(`click`,()=>{s=!0,window.clearInterval(o),c(t,!1)}),e.addEventListener(`keydown`,e=>{let t=e.key===`ArrowDown`||e.key===`ArrowRight`?1:e.key===`ArrowUp`||e.key===`ArrowLeft`?-1:0;t!==0&&(e.preventDefault(),s=!0,window.clearInterval(o),c(l()+t,!0))})}),!e()&&new IntersectionObserver(([e])=>{window.clearInterval(o),e?.isIntersecting&&!s&&(o=window.setInterval(()=>c(l()+1,!1),2600))}).observe(t)},n=()=>{let e=document.querySelector(`[data-approve]`),t=e?.querySelector(`[data-mini-status]`),n=e?.querySelector(`[data-mini-actions]`);if(!e||!t||!n)return;let r=n.innerHTML,i=0,a=0;new IntersectionObserver(([e])=>{e?.isIntersecting&&i===0&&(i=Date.now())}).observe(e);let o=(r,i)=>{e.dataset.state=r,t.textContent=i,n.innerHTML=``;let o=document.createElement(`button`);o.type=`button`,o.className=`c-btn`,o.textContent=`Ask again`,o.addEventListener(`click`,s);let c=document.createElement(`span`);c.className=`c-rule`,c.style.margin=`0`,c.textContent=r===`allowed`?`Claude Code carries on editing totals.ts.`:`Claude Code is told, and tries another way.`;let l=document.createElement(`span`);l.className=`grow`,n.append(c,l,o),window.clearTimeout(a),a=window.setTimeout(s,6e3)};function s(){window.clearTimeout(a),e.dataset.state=`waiting`,t.textContent=`1 needs you`,n.innerHTML=r,i=Date.now()}n.addEventListener(`click`,e=>{let t=e.target instanceof Element?e.target.closest(`[data-mini]`):null;if(!t)return;let r=t.dataset.mini;if((r===`allow`||r===`always`)&&Date.now()-i<500||(r===`allow`&&o(`allowed`,`Allowed`),r===`always`&&o(`allowed`,`Always allowed: edits in storefront`),r===`deny`&&o(`denied`,`Denied`),r!==`why`))return;let a=document.createElement(`form`),s=document.createElement(`input`);s.className=`c-input`,s.placeholder=`Tell it why, then Return`,s.setAttribute(`aria-label`,`Why you are denying`),a.append(s),a.addEventListener(`submit`,e=>{e.preventDefault(),o(`denied`,s.value.trim()?`Denied, with your reason`:`Denied`)}),n.replaceChildren(a),s.focus()})},r=()=>{let t=document.querySelectorAll(`[data-count-scope]`),n=t=>{let n=Number(t.dataset.countTo??0),r=Number(t.dataset.decimals??0),i=t.dataset.suffix??``,a=e=>{t.textContent=`${e.toFixed(r)}${i}`};if(e()){a(n);return}let o=performance.now(),s=e=>{let t=Math.min(1,(e-o)/1100);a(n*(1-(1-t)**4)),t<1&&requestAnimationFrame(s)};requestAnimationFrame(s)},r=new IntersectionObserver(e=>{for(let t of e)t.isIntersecting&&(t.target.querySelectorAll(`[data-count-to]`).forEach(n),r.unobserve(t.target))},{rootMargin:`0px 0px -10% 0px`});t.forEach(e=>r.observe(e))},i=()=>{document.querySelectorAll(`[data-copy]`).forEach(e=>{e.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(e.dataset.copy??``),e.textContent=`Copied`}catch{e.textContent=`Select it`}window.setTimeout(()=>{e.textContent=`Copy`},1600)})})},a=()=>{let t=document.querySelector(`[data-gallery]`),n=t?.querySelector(`[data-track]`),r=[...n?.querySelectorAll(`[data-item]`)??[]],i=[...document.querySelectorAll(`[data-dot]`)],a=document.querySelector(`[data-play]`);if(!t||!n||r.length===0)return;let o=0,s=0,c=!e(),l=!1,u=0,d=e=>{o=e,i.forEach((t,n)=>{n===e?t.setAttribute(`aria-current`,`true`):t.removeAttribute(`aria-current`)})},f=t=>{let i=r[(t+r.length)%r.length];if(!i)return;let a=r[0]?.offsetLeft??0;u=Date.now(),n.scrollTo({left:i.offsetLeft-a,behavior:e()?`auto`:`smooth`}),d(r.indexOf(i))},p=e=>{c=e,a?.classList.toggle(`paused`,!e),a?.setAttribute(`aria-label`,e?`Pause the highlights`:`Play the highlights`),m()};function m(){window.clearInterval(s),c&&l&&(s=window.setInterval(()=>f(o+1),5e3))}let h=!1;n.addEventListener(`scroll`,()=>{h||(h=!0,requestAnimationFrame(()=>{h=!1;let e=r[0]?.offsetLeft??0,t=r.reduce((t,i,a)=>Math.abs(i.offsetLeft-e-n.scrollLeft)<Math.abs((r[t]?.offsetLeft??0)-e-n.scrollLeft)?a:t,0);d(t)}))},{passive:!0});let g=()=>{Date.now()-u<900||c&&p(!1)};n.addEventListener(`pointerdown`,g),n.addEventListener(`wheel`,e=>{Math.abs(e.deltaX)>Math.abs(e.deltaY)&&g()},{passive:!0}),n.addEventListener(`touchstart`,g,{passive:!0}),i.forEach((e,t)=>{e.addEventListener(`click`,()=>{p(!1),f(t)})}),a?.addEventListener(`click`,()=>p(!c)),new IntersectionObserver(([e])=>{l=e?.isIntersecting??!1,m()},{threshold:.4}).observe(t),p(c)},o=()=>{let t=document.querySelector(`[data-words]`),n=[...t?.querySelectorAll(`.w`)??[]];if(!t||n.length===0)return;if(e()){n.forEach(e=>e.classList.add(`on`));return}let r=-1,i=()=>{let e=t.getBoundingClientRect(),i=window.innerHeight*.85,a=window.innerHeight*.35,o=Math.min(1,Math.max(0,(i-e.top)/(i-a+e.height*.6))),s=Math.round(o*n.length);s!==r&&(r=s,n.forEach((e,t)=>e.classList.toggle(`on`,t<s)))},a=!1;window.addEventListener(`scroll`,()=>{a||(a=!0,requestAnimationFrame(()=>{a=!1,i()}))},{passive:!0}),i()},s=()=>{let e=document.querySelector(`[data-approve]`),t=[...document.querySelectorAll(`[data-step-at]`)];if(!e||t.length===0)return;let n=new IntersectionObserver(n=>{for(let r of n){if(!r.isIntersecting)continue;let n=r.target;t.forEach(e=>{e===n?e.setAttribute(`aria-current`,`step`):e.removeAttribute(`aria-current`)}),e.dataset.step=n.dataset.stepAt??`0`}},{rootMargin:`-45% 0px -45% 0px`});t.forEach(e=>n.observe(e))},c=()=>{a(),o(),s(),t(),n(),r(),i()},l=`
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`,u=`
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uOpen;
uniform float uWarm;
uniform vec3 uSource;
uniform float uFade;

float hash(vec2 p) {
	p = fract(p * vec2(123.34, 456.21));
	p += dot(p, p + 45.32);
	return fract(p.x * p.y);
}

float noise(float x) {
	float i = floor(x);
	float f = fract(x);
	return mix(hash(vec2(i, 1.7)), hash(vec2(i + 1.0, 1.7)), f * f * (3.0 - 2.0 * f));
}

float noise2(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	vec2 u = f * f * (3.0 - 2.0 * f);
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));
	return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
	vec2 frag = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
	float unit = max(uRes.y, 1.0);
	vec2 src = uSource.xy;
	vec2 d = (frag - src) / unit;
	vec2 ptr = (uPointer - src) / unit;

	// The fan leans a little towards the pointer, the way a lamp seems to follow your eye.
	float lean = clamp(ptr.x, -1.2, 1.2) * 0.22;
	float down = max(d.y, 0.0005);
	float ang = atan(d.x - lean * down, down);
	float r = length(d);

	float halfWidth = uSource.z / unit;
	float spread = 0.5 + 0.28 * uOpen + halfWidth * 0.9;
	float fan = smoothstep(spread, 0.0, abs(ang));

	float t = uTime * 0.05;
	float rays = noise(ang * 8.0 + t * 3.0) * 0.55 + noise(ang * 21.0 - t * 4.0 + 9.0) * 0.3 + noise(ang * 47.0 + t * 6.0 + 31.0) * 0.15;
	rays = pow(rays, 1.7);

	// The source sits behind the notch, so the light has to carry past it: a slow falloff, not a bright core.
	float fall = exp(-r * (1.35 - 0.45 * uOpen));
	float near = exp(-r * r * (16.0 - 7.0 * uOpen));
	float above = smoothstep(-0.015, 0.01, d.y);
	float light = (fan * (rays * 1.25 + 0.16) * fall + near * 0.4) * above;

	float haze = noise2(frag / unit * 2.6 + vec2(t, -t * 0.7)) * 0.07 * fall;

	vec3 accent = vec3(0.180, 0.106, 0.612);
	vec3 warm = vec3(1.0, 0.62, 0.04);
	vec3 tint = mix(accent, warm, uWarm * 0.5);
	vec3 col = tint * (light * 1.55 + haze);
	col += vec3(0.78, 0.76, 1.0) * near * 0.05 * (0.5 + uOpen) * above;

	float pd = length((frag - uPointer) / unit);
	col += tint * exp(-pd * pd * 26.0) * 0.12;

	vec2 v = frag / uRes - vec2(0.5, 0.28);
	col *= smoothstep(1.15, 0.15, length(v * vec2(1.0, 1.25)));
	col *= uFade;
	col += (hash(frag + fract(uTime) * 97.0) - 0.5) * (2.5 / 255.0);
	gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`,d=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},f=e=>{let t=d(e,e.VERTEX_SHADER,l),n=d(e,e.FRAGMENT_SHADER,u),r=e.createProgram();return!t||!n||!r||(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))?null:r},p=32,m=118,h=(e,t,n,r)=>e+(t-e)*(1-Math.exp(-n*r)),g=e=>{let t=e.getContext(`webgl`,{antialias:!1,alpha:!1,depth:!1,stencil:!1,powerPreference:`low-power`,preserveDrawingBuffer:!1});if(!t)return;let n=f(t);if(!n)return;t.useProgram(n);let r=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,r),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW);let i=t.getAttribLocation(n,`position`);t.enableVertexAttribArray(i),t.vertexAttribPointer(i,2,t.FLOAT,!1,0,0);let a={res:t.getUniformLocation(n,`uRes`),time:t.getUniformLocation(n,`uTime`),pointer:t.getUniformLocation(n,`uPointer`),open:t.getUniformLocation(n,`uOpen`),warm:t.getUniformLocation(n,`uWarm`),source:t.getUniformLocation(n,`uSource`),fade:t.getUniformLocation(n,`uFade`)},o=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,s=1,c=0,l=0,u=0,d=.5,g=.2,_=.5,v=.2,y=0,b=0,x=0,S=0,C=+!!o,w=!0,T=0,E=0,D=performance.now(),O=()=>{let n=e.getBoundingClientRect();c=n.width,l=n.height,u=n.top+window.scrollY,s=Math.min(window.devicePixelRatio||1,1)*.66,e.width=Math.max(1,Math.round(c*s)),e.height=Math.max(1,Math.round(l*s)),t.viewport(0,0,e.width,e.height)},k=n=>{let r=Math.min(.05,(n-E)/1e3||.016);E=n,d=h(d,_,3.5,r),g=h(g,v,3.5,r),y=h(y,b,3,r),x=h(x,S,2.2,r),o||(C=Math.min(1,(n-D)/1400)),t.uniform2f(a.res,e.width,e.height),t.uniform1f(a.time,o?12:(n-D)/1e3),t.uniform2f(a.pointer,d*e.width,g*e.height),t.uniform1f(a.open,y),t.uniform1f(a.warm,x),t.uniform3f(a.source,e.width/2,p*s,m*s),t.uniform1f(a.fade,C*(.55+.45*y)),t.drawArrays(t.TRIANGLES,0,3)},A=e=>{k(e),T=w&&!document.hidden?requestAnimationFrame(A):0},j=()=>{if(o){k(performance.now());return}T||!w||document.hidden||(E=performance.now(),T=requestAnimationFrame(A))};window.addEventListener(`pointermove`,e=>{c!==0&&(_=e.clientX/c,v=(e.clientY-(u-window.scrollY))/l,o&&j())},{passive:!0}),window.addEventListener(`notch:change`,e=>{let t=e.detail;b=+!!t.open,S=+!!t.waiting,o&&(y=b,x=S),j()}),new IntersectionObserver(([e])=>{w=e?.isIntersecting??!1,j()}).observe(e),document.addEventListener(`visibilitychange`,j),new ResizeObserver(()=>{O(),j()}).observe(e),O(),e.classList.add(`is-live`),j()},_=document.querySelector(`[data-light]`);_&&g(_),c();