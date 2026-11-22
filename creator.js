(function(){
var R={};
var st=document.createElement("style");
st.textContent=".role{font-size:10px;font-weight:800;padding:1px 8px;border-radius:9px;background:var(--gold,#e8a917);color:#1a1204;margin-left:4px;white-space:nowrap}";
document.head.appendChild(st);
function badge(t){var s=document.createElement("span");s.className="role";s.textContent=t;return s}
function deco(){
document.querySelectorAll("#feed .nm span[data-p]").forEach(function(s){var id=s.dataset.p,nm=s.parentNode;if(R[id]&&!nm.querySelector(".role"))nm.appendChild(badge(R[id]))});
document.querySelectorAll("#feed .row").forEach(function(r){var a=r.querySelector("[data-p]"),b=r.querySelector(".g b");if(a&&b&&R[a.dataset.p]&&!r.querySelector(".role"))b.insertAdjacentElement("afterend",badge(R[a.dataset.p]))});
if(view==="user"){
var pn=document.querySelector("#feed .pr > .nm");if(pn&&R[vu]&&!pn.querySelector(".role"))pn.appendChild(badge(R[vu]));
document.querySelectorAll("#feed .pr .mt").forEach(function(m){if(/Followers/.test(m.textContent)&&!m.dataset.pc){m.dataset.pc="1";var n=posts.filter(function(p){return p.user_id===vu}).length;m.insertAdjacentHTML("afterbegin","<span><b style=\"color:var(--ink)\">"+n+"</b> Posts</span>")}})}
document.querySelectorAll("#feed [data-out]").forEach(function(b){b.remove()});
var dn=document.querySelector("#drw .nm");if(dn&&me&&R[me.id]&&!dn.querySelector(".role"))dn.appendChild(badge(R[me.id]))}
async function load(){if(!me)return;var r=await sb.from("profiles").select("id,role").not("role","is",null);if(r.error)return;R={};(r.data||[]).forEach(function(x){if(x.role)R[x.id]=x.role});deco()}
var q=false;function sched(){if(q)return;q=true;requestAnimationFrame(function(){q=false;deco()})}
["feed","drw"].forEach(function(id){var el=document.getElementById(id);if(el)new MutationObserver(sched).observe(el,{childList:true,subtree:true})});
var t=setInterval(function(){if(me){clearInterval(t);load()}},800);
setInterval(load,30000);
})();
