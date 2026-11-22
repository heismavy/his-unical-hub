(function(){
var st=document.createElement("style");
st.textContent=`
.lg{margin-left:0!important}
#nbell{margin-left:auto;position:relative;width:38px;height:38px;display:grid;place-items:center;color:var(--ink)}
#nbadge{position:absolute;top:1px;right:0;min-width:17px;height:17px;padding:0 4px;border-radius:9px;background:var(--red);color:#fff;font-size:10.5px;font-weight:800;display:grid;place-items:center;line-height:1}
#nov{position:fixed;inset:0;z-index:35;background:var(--bg);overflow-y:auto;padding-top:env(safe-area-inset-top,0px);padding-bottom:calc(40px + env(safe-area-inset-bottom,0px))}
#nov .nh{display:flex;align-items:center;gap:12px;padding:10px 14px;position:sticky;top:0;background:var(--bg);z-index:2;border-bottom:1px solid var(--line)}
#nov .nh b{font-size:18px;flex:1}
#nov .nh .xb{width:36px;height:36px;display:grid;place-items:center}
.ni{display:flex;gap:12px;align-items:center;width:100%;text-align:left;padding:12px 18px;border-bottom:1px solid var(--line)}
.ni.un{background:var(--annbg)}
.ni .av{width:42px;height:42px;font-size:16px}
.ni .g{flex:1;min-width:0;overflow-wrap:anywhere}
.ni .dot{width:9px;height:9px;border-radius:50%;background:var(--gold);flex:none}
`;
document.head.appendChild(st);

P.bell='<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>';
var T={like:"liked your post",comment:"commented on your post",reshare:"reshared your post",follow:"started following you",notice:"posted a new notice",post:"made a new post"};
var bell=document.createElement("button");
bell.id="nbell";bell.setAttribute("aria-label","Notifications");
bell.innerHTML=ic("bell",0,24)+'<span id="nbadge" hidden></span>';
var lg=document.querySelector(".top .lg");
lg.parentNode.insertBefore(bell,lg);

var ov=document.createElement("div");
ov.id="nov";ov.hidden=true;
document.body.appendChild(ov);

async function count(){
  if(!me)return;
  var r=await sb.from("notifications").select("id",{count:"exact",head:true}).eq("read",false);
  if(r.error)return;
  var n=r.count||0,b=$("nbadge");
  b.hidden=!n;b.textContent=n>99?"99+":n;
}

function draw(){
  var h='<div class="nh"><button class="xb" id="nx" aria-label="Close">'+ic("x",0,24)+'</button><b>Notifications</b><button class="btn sm alt" id="nall">Mark all read</button></div>';
  if(!items.length){h+='<div class="empty">Nothing yet. Likes, comments, reshares, follows and new notices will show here.</div>'}
  else{
    h+=items.map(function(it,i){
      var a=it.profiles||{display_name:"Someone",id:it.actor_id||"x"};
      var pic=a.avatar_url?'<img src="'+esc(a.avatar_url)+'" alt="">':esc((a.display_name||"?")[0].toUpperCase());
      return '<button class="ni'+(it.read?"":" un")+'" data-ni="'+i+'"><div class="av" style="background:'+col(String(a.id||"x"))+'">'+pic+'</div><div class="g"><b>'+esc(a.display_name)+'</b> '+T[it.type]+'<div class="mt">'+ago(it.created_at)+'</div></div>'+(it.read?"":'<span class="dot"></span>')+'</button>';
    }).join("");
  }
  ov.innerHTML=h;
}

async function load(){
  var r=await sb.from("notifications").select("id,type,post_id,read,created_at,actor_id,profiles!actor_id(id,display_name,avatar_url)").order("created_at",{ascending:false}).limit(50);
  if(r.error){ov.innerHTML='<div class="nh"><button class="xb" id="nx">'+ic("x",0,24)+'</button><b>Notifications</b></div><div class="err">'+esc(r.error.message)+'</div>';return}
  items=r.data||[];draw();
}

async function openN(){
  ov.hidden=false;
  ov.innerHTML='<div class="nh"><button class="xb" id="nx">'+ic("x",0,24)+'</button><b>Notifications</b></div><div class="empty">Loading...</div>';
  await load();count();
}
function closeN(){ov.hidden=true}

async function pick(it){
  if(!it.read){await sb.from("notifications").update({read:true}).eq("id",it.id)}
  closeN();count();
  if(it.type==="follow"&&it.actor_id){openUser(it.actor_id);return}
  if(it.type==="notice"){view="notices";render();scrollTo(0,0);return}
  await refresh();
  if(it.type==="comment"&&it.post_id&&posts.some(function(p){return p.id==it.post_id})){
    cm=+it.post_id;$("smi").value="";sheet();$("dm").showModal();return;
  }
  view="home";render();scrollTo(0,0);
}

bell.addEventListener("click",openN);
ov.addEventListener("click",async function(e){
  if(e.target.closest("#nx")){closeN();return}
  if(e.target.closest("#nall")){
    await sb.from("notifications").update({read:true}).eq("read",false);
    await load();count();return;
  }
  var b=e.target.closest("[data-ni]");
  if(b)pick(items[+b.dataset.ni]);
});

setInterval(function(){
  if(!me){lastId=null;ov.hidden=true;return}
  if(me.id!==lastId){lastId=me.id;count()}
},2000);
setInterval(function(){if(me&&ov.hidden)count()},30000);
})();
