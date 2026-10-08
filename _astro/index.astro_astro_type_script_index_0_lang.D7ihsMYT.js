var e=()=>window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,t=()=>{let t=document.querySelector(`[data-states]`),n=t?.querySelector(`[data-state-badge]`),r=t?.querySelector(`[data-state-line]`),i=[...t?.querySelectorAll(`[data-state]`)??[]];if(!t||!n||!r||i.length===0)return;let a=0,o=!1,s=(t,a)=>{let o=i[(t+i.length)%i.length];o&&(i.forEach(e=>{let t=e===o;e.setAttribute(`aria-checked`,String(t)),e.tabIndex=t?0:-1}),n.className=`badge ${o.dataset.state??``}`,n.textContent=o.dataset.label??``,r.textContent=o.dataset.line??``,e()||r.animate([{opacity:0,transform:`translateY(6px)`},{opacity:1,transform:`none`}],{duration:380,easing:`cubic-bezier(0.23, 1, 0.32, 1)`}),a&&o.focus())},c=()=>i.findIndex(e=>e.getAttribute(`aria-checked`)===`true`);i.forEach((e,t)=>{e.addEventListener(`click`,()=>{o=!0,window.clearInterval(a),s(t,!1)}),e.addEventListener(`keydown`,e=>{let t=e.key===`ArrowDown`||e.key===`ArrowRight`?1:e.key===`ArrowUp`||e.key===`ArrowLeft`?-1:0;t!==0&&(e.preventDefault(),o=!0,window.clearInterval(a),s(c()+t,!0))})}),!e()&&new IntersectionObserver(([e])=>{window.clearInterval(a),e?.isIntersecting&&!o&&(a=window.setInterval(()=>s(c()+1,!1),2600))}).observe(t)},n=()=>{let e=document.querySelector(`[data-approve]`),t=e?.querySelector(`[data-mini-status]`),n=e?.querySelector(`[data-mini-actions]`);if(!e||!t||!n)return;let r=n.innerHTML,i=0,a=0;new IntersectionObserver(([e])=>{e?.isIntersecting&&i===0&&(i=Date.now())}).observe(e);let o=(r,i)=>{e.dataset.state=r,t.textContent=i,n.innerHTML=``;let o=document.createElement(`button`);o.type=`button`,o.className=`c-btn`,o.textContent=`Ask again`,o.addEventListener(`click`,s);let c=document.createElement(`span`);c.className=`c-rule`,c.style.margin=`0`,c.textContent=r===`allowed`?`Claude Code carries on editing totals.ts.`:`Claude Code is told, and tries another way.`;let l=document.createElement(`span`);l.className=`grow`,n.append(c,l,o),window.clearTimeout(a),a=window.setTimeout(s,6e3)};function s(){window.clearTimeout(a),e.dataset.state=`waiting`,t.textContent=`1 needs you`,n.innerHTML=r,i=Date.now()}n.addEventListener(`click`,e=>{let t=e.target instanceof Element?e.target.closest(`[data-mini]`):null;if(!t)return;let r=t.dataset.mini;if((r===`allow`||r===`always`)&&Date.now()-i<500||(r===`allow`&&o(`allowed`,`Allowed`),r===`always`&&o(`allowed`,`Always allowed: edits in storefront`),r===`deny`&&o(`denied`,`Denied`),r!==`why`))return;let a=document.createElement(`form`),s=document.createElement(`input`);s.className=`c-input`,s.placeholder=`Tell it why, then Return`,s.setAttribute(`aria-label`,`Why you are denying`),a.append(s),a.addEventListener(`submit`,e=>{e.preventDefault(),o(`denied`,s.value.trim()?`Denied, with your reason`:`Denied`)}),n.replaceChildren(a),s.focus()})},r=()=>{let t=document.querySelectorAll(`[data-count-scope]`),n=t=>{let n=Number(t.dataset.countTo??0),r=Number(t.dataset.decimals??0),i=t.dataset.suffix??``,a=e=>{t.textContent=`${e.toFixed(r)}${i}`};if(e()){a(n);return}let o=performance.now(),s=e=>{let t=Math.min(1,(e-o)/1100);a(n*(1-(1-t)**4)),t<1&&requestAnimationFrame(s)};requestAnimationFrame(s)},r=new IntersectionObserver(e=>{for(let t of e)t.isIntersecting&&(t.target.querySelectorAll(`[data-count-to]`).forEach(n),r.unobserve(t.target))},{rootMargin:`0px 0px -10% 0px`});t.forEach(e=>r.observe(e))},i=()=>{document.querySelectorAll(`[data-copy]`).forEach(e=>{e.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(e.dataset.copy??``),e.textContent=`Copied`}catch{e.textContent=`Select it`}window.setTimeout(()=>{e.textContent=`Copy`},1600)})})},a=()=>{t(),n(),r(),i()},o=`
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`,s=`
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

	float fall = exp(-r * (2.3 - 0.8 * uOpen));
	float near = exp(-r * r * (16.0 - 7.0 * uOpen));
	float above = smoothstep(-0.015, 0.01, d.y);
	float light = (fan * (rays * 0.95 + 0.18) * fall + near * 0.4) * above;

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
`,c=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},l=e=>{let t=c(e,e.VERTEX_SHADER,o),n=c(e,e.FRAGMENT_SHADER,s),r=e.createProgram();return!t||!n||!r||(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))?null:r},u=(e,t,n,r)=>e+(t-e)*(1-Math.exp(-n*r)),d=e=>{let t=e.getContext(`webgl`,{antialias:!1,alpha:!1,depth:!1,stencil:!1,powerPreference:`low-power`,preserveDrawingBuffer:!1});if(!t)return;let n=l(t);if(!n)return;t.useProgram(n);let r=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,r),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW);let i=t.getAttribLocation(n,`position`);t.enableVertexAttribArray(i),t.vertexAttribPointer(i,2,t.FLOAT,!1,0,0);let a={res:t.getUniformLocation(n,`uRes`),time:t.getUniformLocation(n,`uTime`),pointer:t.getUniformLocation(n,`uPointer`),open:t.getUniformLocation(n,`uOpen`),warm:t.getUniformLocation(n,`uWarm`),source:t.getUniformLocation(n,`uSource`),fade:t.getUniformLocation(n,`uFade`)},o=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,s=1,c=0,d=0,f=0,p=.5,m=.2,h=.5,g=.2,_=0,v=0,y=0,b=0,x=236,S=236,C=32,w=32,T=+!!o,E=!0,D=0,O=0,k=performance.now(),A=()=>{let n=e.getBoundingClientRect();c=n.width,d=n.height,f=n.top+window.scrollY,s=Math.min(window.devicePixelRatio||1,1)*.66,e.width=Math.max(1,Math.round(c*s)),e.height=Math.max(1,Math.round(d*s)),t.viewport(0,0,e.width,e.height)},j=n=>{let r=Math.min(.05,(n-O)/1e3||.016);O=n,p=u(p,h,3.5,r),m=u(m,g,3.5,r),_=u(_,v,3,r),y=u(y,b,2.2,r),x=u(x,S,6,r),C=u(C,w,6,r),o||(T=Math.min(1,(n-k)/1400));let i=f-window.scrollY;t.uniform2f(a.res,e.width,e.height),t.uniform1f(a.time,o?12:(n-k)/1e3),t.uniform2f(a.pointer,p*e.width,m*e.height),t.uniform1f(a.open,_),t.uniform1f(a.warm,y),t.uniform3f(a.source,e.width/2,(C-i)*s,x/2*s),t.uniform1f(a.fade,T*(.55+.45*_)),t.drawArrays(t.TRIANGLES,0,3)},M=e=>{j(e),D=E&&!document.hidden?requestAnimationFrame(M):0},N=()=>{if(o){j(performance.now());return}D||!E||document.hidden||(O=performance.now(),D=requestAnimationFrame(M))};window.addEventListener(`pointermove`,e=>{c!==0&&(h=e.clientX/c,g=(e.clientY-(f-window.scrollY))/d,o&&N())},{passive:!0}),window.addEventListener(`notch:change`,e=>{let t=e.detail;v=+!!t.open,b=+!!t.waiting,w=t.height||32;let n=document.querySelector(`[data-notch]`);S=t.open?Math.min(620,window.innerWidth-16):n?.offsetWidth||236,o&&(_=v,y=b,C=w,x=S),N()}),new IntersectionObserver(([e])=>{E=e?.isIntersecting??!1,N()}).observe(e),document.addEventListener(`visibilitychange`,N),new ResizeObserver(()=>{A(),N()}).observe(e),A(),e.classList.add(`is-live`),N()},f=document.querySelector(`[data-light]`);f&&d(f),a();