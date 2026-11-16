"use strict";
const slides=[...document.querySelectorAll('.page')];
const select=document.querySelector('#page-select');
const prev=document.querySelector('#prev'),next=document.querySelector('#next');
const motion=document.querySelector('#motion'),dialog=document.querySelector('#text-dialog');
const indexDialog=document.querySelector('#index-dialog');
const preference=matchMedia('(prefers-reduced-motion: reduce)');
let current=1,enabled=!preference.matches,scheduled=false;
function setMotion(value){enabled=value;document.body.classList.toggle('no-motion',!value);motion.setAttribute('aria-pressed',String(value));motion.textContent=value?'Хөдөлгөөн ✓':'Хөдөлгөөн —';}
setMotion(enabled);
motion.addEventListener('click',()=>setMotion(!enabled));
preference.addEventListener('change',e=>setMotion(!e.matches));
if('IntersectionObserver' in window){
 const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');reveal.unobserve(e.target);}}),{threshold:0,rootMargin:'0px 0px -35px 0px'});
 document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el));
 document.body.classList.add('animated');
}
function sync(n){current=n;select.value=String(n);prev.disabled=n===1;next.disabled=n===slides.length;document.body.style.setProperty('--reading-progress',String(n/slides.length));}
function go(n){n=Math.max(1,Math.min(slides.length,n));sync(n);slides[n-1].scrollIntoView({behavior:enabled?'smooth':'instant',block:'start'});history.replaceState(null,'','#page-'+n);}
select.addEventListener('change',()=>go(Number(select.value)));
prev.addEventListener('click',()=>go(current-1));next.addEventListener('click',()=>go(current+1));
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;let best=0,distance=Infinity;slides.forEach((s,i)=>{const r=s.getBoundingClientRect();const d=r.top<=innerHeight*.4&&r.bottom>innerHeight*.4?0:Math.abs(r.top-innerHeight*.4);if(d<distance){best=i;distance=d;}});sync(best+1);});}},{passive:true});
document.querySelectorAll('a[href^="#page-"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();if(indexDialog.open)indexDialog.close();go(Number(a.hash.slice(6)));}));
document.addEventListener('keydown',e=>{if(dialog.open||indexDialog.open||['SELECT','BUTTON','INPUT','TEXTAREA','A'].includes(document.activeElement.tagName)||e.altKey||e.ctrlKey||e.metaKey)return;const action={ArrowRight:current+1,PageDown:current+1,ArrowLeft:current-1,PageUp:current-1,Home:1,End:slides.length}[e.key];if(action!==undefined){e.preventDefault();go(action);}});
document.querySelector('#text-open').addEventListener('click',()=>{document.querySelector('#text-title').textContent=current+'-р хуудасны эх бичвэр';document.querySelector('#source-text').textContent=window.sourcePages[current-1];dialog.showModal();});
document.querySelector('#text-close').addEventListener('click',()=>dialog.close());
document.querySelector('#menu-open').addEventListener('click',()=>indexDialog.showModal());
document.querySelector('#menu-close').addEventListener('click',()=>indexDialog.close());
[dialog,indexDialog].forEach(el=>el.addEventListener('click',e=>{if(e.target===el){const r=el.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)el.close();}}));
const initial=Number(location.hash.replace('#page-',''));
sync(initial>=1&&initial<=slides.length?initial:1);
