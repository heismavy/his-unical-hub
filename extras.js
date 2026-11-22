(function(){
// apply the saved theme straight away
try{var sv=localStorage.getItem("hub-theme");if(sv)document.documentElement.setAttribute("data-theme",sv)}catch(e){}

var st=document.createElement("style");
st.textContent=`
html[data-theme="light"]{--bg:#fffdf8;--ink:#17120a;--mute:#8c8372;--line:#ece4d2;--chip:#f6f0e2;--annbg:#fff3d1;--red:#c62f23;--blue:#2b78c2;--gold:#e8a917;--btn:#e8a917}
html[data-theme="dark"]{--bg:#0f0c08;--ink:#f6eedc;--mute:#a1957f;--line:#2e261a;--chip:#1c1710;--annbg:#2a2110;--red:#ee5a4c;--blue:#5aa2e6;--gold:#f2b93b;--btn:#f2b93b}
.pa{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;align-items:center}
.ib{width:34px;height:34px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;color:var(--ink);flex:none}
#asb{position:fixed;inset:0;z-index:50;background:rgba(10,8,4,.55)}
#asp{position:fixed;left:0;right:0;bottom:0;z-index:51;max-width:520px;margin:0 auto;background:var(--bg);color:var(--ink);border-radius:24px 24px 0 0;padding:14px 20px calc(env(safe-area-inset-bottom,0px) + 22px);animation:asu .25s ease}
@keyframes asu{from{transform:translateY(100%)}}
#asp .gr{width:40px;height:5px;border-radius:3px;background:var(--line);margin:0 auto 14px}
#asp h2{margin:0;font-size:22px;font-weight:800}
.ao{display:flex;align-items:center;justify-content:space-between;gap:14px;width:100%;text-align:left;padding:14px 0}
.ao b{display:block;font-size:16px}
.ao .d{display:block;color:var(--mute);font-size:13.5px}
.rd{width:24px;height:24px;border-radius:50%;border:2px solid var(--mute);flex:none;display:grid;place-items:center}
.rd.on{border-color:var(--gold)}
.rd.on::after{content:"";width:12px;height:12px;border-radius:50%;background:var(--gold)}
`;
document.head.appendChild(st);

if(!P.bell)P.bell='<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>';
P.sun='<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
P.moon='<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';

var alerts=new Set(),aid=null,sheetFor=null;

/* ---------- theme toggle ---------- */
function isDark(){
  var a=document.documentElement.getAttribute("data-theme");
  return a?a==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function toggleTheme(){
  var n=isDark()?"light":"dark";
  document.documentElement.setAttribute("data-theme",n);
  try{localStorage.setItem("hub-theme",n)}catch(e){}
  drw();
}

/* side menu: remove Messages, add theme toggle above Log out */
var od=window.drw;
if(typeof od==="function"){
  window.drw=function(){
    od();
    var items=document.querySelectorAll("#drw .mi"),out=null;
    for(var i=0;i<items.length;i++){
      var tx=items[i].textContent;
      if(tx.indexOf("Messages")===0)items[i].remove();
      else if(tx.indexOf("Log out")===0)out=items[i];
    }
    var t=document.createElement("button"),d=isDark();
    t.className="mi";t.setAttribute("data-thm","1");
    t.innerHTML=ic(d?"sun":"moon",0,24)+(d?"Light mode":"Dark mode");
    if(out)out.parentNode.insertBefore(t,out);else $("drw").appendChild(t);
  };
}

/* ---------- message button + post-alert bell on profiles ---------- */
function openChat(id){
  var o=$("mov");if(!o)return;
  o.hidden=false;
  var b=document.createElement("button");
  b.setAttribute("data-mc",id);
  o.appendChild(b);b.click();b.remove();
}

function decorate(){
  if(!me||view!=="user"||vu===me.id)return;
  var f=document.querySelector("#feed [data-follow]");
  if(!f)return;
  if(!follows.has(vu))alerts.delete(vu);
  var box=f.parentNode;
  box.querySelectorAll(".ib").forEach(function(x){x.remove()});
  box.classList.add("pa");
  var m=document.createElement("button");
  m.className="ib";m.setAttribute("data-pm",vu);m.setAttribute("aria-label","Message");
  m.innerHTML=ic("mail",0,18);
  box.insertBefore(m,f);
  if(follows.has(vu)){
    var on=alerts.has(vu),b=document.createElement("button");
    b.className="ib";b.setAttribute("data-pb",vu);b.setAttribute("aria-label","Post notifications");
    if(on)b.style.color="var(--gold)";
    b.innerHTML=ic("bell",on,18);
    box.insertBefore(b,f);
  }
}

var or=window.render;
if(typeof or==="function"){
  window.render=function(){
    var r=or.apply(this,arguments);
    decorate();
    return r;
  };
}

/* ---------- post notification sheet ---------- */
function closeSheet(){
  var a=$("asb"),p=$("asp");
  if(a)a.remove();
  if(p)p.remove();
  sheetFor=null;
}
function openSheet(id){
  closeSheet();sheetFor=id;
  var u=users[id]||{username:""},on=alerts.has(id);
  var bd=document.createElement("div");
  bd.id="asb";bd.setAttribute("data-ax","1");
  var p=document.createElement("div");
  p.id="asp";
  p.innerHTML='<div class="gr"></div><h2>Don’t miss a thing</h2><div class="mt" style="margin-bottom:6px">@'+esc(u.username)+'</div>'+
    '<button class="ao" data-ao="all"><span><b>All posts</b><span class="d">Get notified when this account posts.</span></span><span class="rd'+(on?" on":"")+'"></span></button>'+
    '<button class="ao" data-ao="off"><span><b>Off</b><span class="d">Turn off notifications for this account’s posts.</span></span><span class="rd'+(on?"":" on")+'"></span></button>';
  document.body.appendChild(bd);
  document.body.appendChild(p);
}
async function choose(mode){
  var id=sheetFor;if(!id)return;
  if(mode==="all"&&!alerts.has(id)){
    var r=await sb.from("post_alerts").insert({user_id:me.id,target_id:id});
    if(r.error&&r.error.code!=="23505"){alert(r.error.message);return}
    alerts.add(id);
  }else if(mode==="off"&&alerts.has(id)){
    var r2=await sb.from("post_alerts").delete().match({user_id:me.id,target_id:id});
    if(r2.error){alert(r2.error.message);return}
    alerts.delete(id);
  }
  closeSheet();decorate();
}

document.addEventListener("click",function(e){
  var t=e.target.closest("[data-pm],[data-pb],[data-thm],[data-ao],[data-ax]");
  if(!t)return;
  var d=t.dataset;
  if(d.pm)openChat(d.pm);
  else if(d.pb)openSheet(d.pb);
  else if(d.thm)toggleTheme();
  else if(d.ao)choose(d.ao);
  else if(d.ax)closeSheet();
});

/* ---------- load who I have alerts on ---------- */
async function loadAlerts(){
  var r=await sb.from("post_alerts").select("target_id");
  if(r.error)return;
  alerts=new Set((r.data||[]).map(function(x){return x.target_id}));
  decorate();
}
setInterval(function(){
  if(!me){aid=null;alerts=new Set();return}
  if(me.id!==aid){aid=me.id;loadAlerts()}
},2000);
})();
