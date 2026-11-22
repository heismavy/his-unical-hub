(function(){
var REASONS=["Spam","Harassment or hate","False information","Exam malpractice","Other"];

var st=document.createElement("style");
st.textContent=`
#rpb{position:fixed;inset:0;z-index:60;background:rgba(10,8,4,.55)}
#rpp{position:fixed;left:0;right:0;bottom:0;z-index:61;max-width:520px;margin:0 auto;background:var(--bg);color:var(--ink);border-radius:24px 24px 0 0;padding:14px 20px calc(env(safe-area-inset-bottom,0px) + 22px);animation:rpu .25s ease}
@keyframes rpu{from{transform:translateY(100%)}}
#rpp .gr{width:40px;height:5px;border-radius:3px;background:var(--line);margin:0 auto 14px}
#rpp h2{margin:0 0 2px;font-size:22px;font-weight:800}
.rpo{display:block;width:100%;text-align:left;padding:14px 0;font-size:16px;font-weight:600;border-bottom:1px solid var(--line)}
#rpv{position:fixed;inset:0;z-index:38;background:var(--bg);overflow-y:auto;padding-top:env(safe-area-inset-top,0px);padding-bottom:calc(40px + env(safe-area-inset-bottom,0px))}
#rpv .rh{display:flex;align-items:center;gap:12px;padding:10px 14px;position:sticky;top:0;background:var(--bg);border-bottom:1px solid var(--line);z-index:2}
#rpv .rh b{font-size:18px;flex:1}
#rpv .xb{width:36px;height:36px;display:grid;place-items:center}
.rc{padding:14px 18px;border-bottom:1px solid var(--line)}
.rc .pimg{max-height:180px}
`;
document.head.appendChild(st);

P.flag='<path d="M4 22V4M4 4h13l-2 4 2 4H4"/>';

var repCount=0,aid=null,groups=[],pid=null;

/* ---------- Report button on other people's posts ---------- */
function decorate(){
  if(!me)return;
  document.querySelectorAll("#feed article.post").forEach(function(a){
    if(a.querySelector(".rp"))return;
    var l=a.querySelector("[data-like]");if(!l)return;
    var id=l.getAttribute("data-like");
    var p=posts.filter(function(x){return String(x.id)===id})[0];
    if(!p||p.user_id===me.id)return;
    var ac=a.querySelector(".ac");if(!ac)return;
    var b=document.createElement("button");
    b.className="rp";b.setAttribute("data-rp",id);b.setAttribute("aria-label","Report post");
    b.style.color="var(--mute)";
    b.innerHTML=ic("flag",0,16)+"Report";
    if(!ac.querySelector(".sp"))b.style.marginLeft="auto";
    ac.appendChild(b);
  });
}
var or=window.render;
if(typeof or==="function"){
  window.render=function(){
    var r=or.apply(this,arguments);
    decorate();
    return r;
  };
}

/* ---------- report sheet ---------- */
function closeSheet(){
  ["rpb","rpp"].forEach(function(i){var e=$(i);if(e)e.remove()});
  pid=null;
}
function openSheet(id){
  closeSheet();pid=id;
  var bd=document.createElement("div");
  bd.id="rpb";bd.setAttribute("data-rpx","1");
  var p=document.createElement("div");
  p.id="rpp";
  p.innerHTML='<div class="gr"></div><h2>Report this post</h2><div class="mt" style="margin-bottom:6px">Why are you reporting it? Only admins will see this.</div>'+
    REASONS.map(function(r,i){return '<button class="rpo" data-rpr="'+i+'">'+r+'</button>'}).join("")+
    '<button class="btn alt" data-rpx="1">Cancel</button>';
  document.body.appendChild(bd);
  document.body.appendChild(p);
}
async function sendReport(i){
  var id=pid;if(!id)return;
  var r=await sb.from("reports").insert({reporter_id:me.id,post_id:/^\d+$/.test(id)?+id:id,reason:REASONS[i]});
  var p=$("rpp");if(!p)return;
  var msg=!r.error?"Thanks. An admin will review this post.":(r.error.code==="23505"?"You already reported this post.":r.error.message);
  p.innerHTML='<div class="gr"></div><h2>Report</h2><div class="mt" style="margin:6px 0 14px">'+esc(msg)+'</div><button class="btn" data-rpx="1">Close</button>';
}

/* ---------- admin: reports screen ---------- */
var ov=document.createElement("div");
ov.id="rpv";ov.hidden=true;
document.body.appendChild(ov);

function head(){return '<div class="rh"><button class="xb" data-rpc="1" aria-label="Close">'+ic("x",0,24)+'</button><b>Reports</b></div>'}

async function loadView(){
  ov.innerHTML=head()+'<div class="empty">Loading...</div>';
  var r=await sb.from("reports").select("id,reason,created_at,post_id,reporter:profiles!reporter_id(display_name),post:posts!post_id(id,body,image_url,category,author:profiles!user_id(display_name,username))").order("created_at",{ascending:false}).limit(200);
  if(r.error){ov.innerHTML=head()+'<div class="err">'+esc(r.error.message)+'</div>';return}
  var map={};groups=[];
  (r.data||[]).forEach(function(x){
    if(!x.post)return;
    var g=map[x.post_id];
    if(!g){g=map[x.post_id]={post_id:x.post_id,post:x.post,ids:[],reasons:[],names:[],latest:x.created_at};groups.push(g)}
    g.ids.push(x.id);
    if(g.reasons.indexOf(x.reason)<0)g.reasons.push(x.reason);
    var n=(x.reporter||{}).display_name||"Someone";
    if(g.names.indexOf(n)<0)g.names.push(n);
  });
  draw();
}

function draw(){
  ov.innerHTML=head()+(groups.length?groups.map(function(g,i){
    var a=g.post.author||{display_name:"?",username:""};
    return '<div class="rc"><div class="mt"><b style="color:var(--red)">'+g.ids.length+' report'+(g.ids.length>1?"s":"")+'</b> · '+esc(g.reasons.join(", "))+' · '+ago(g.latest)+'</div>'+
      '<div class="nm" style="margin-top:6px">'+esc(a.display_name)+' <span class="mt">@'+esc(a.username)+'</span></div>'+
      (g.post.body?'<div class="txt">'+esc(g.post.body)+'</div>':"")+
      (g.post.image_url?'<img class="pimg" src="'+esc(g.post.image_url)+'" alt="Post photo" loading="lazy">':"")+
      '<div class="mt">Reported by '+esc(g.names.join(", "))+'</div>'+
      '<div style="display:flex;gap:8px;margin-top:10px"><button class="btn sm" data-rpd="'+i+'" style="background:var(--red);color:#fff">Delete post</button><button class="btn sm alt" data-rpk="'+i+'">Dismiss</button></div></div>';
  }).join(""):'<div class="empty">No reports. All clear.</div>');
}

async function delPost(i){
  var g=groups[i];if(!g)return;
  if(!confirm("Delete this post for everyone?"))return;
  var r=await sb.from("posts").delete().eq("id",g.post_id);
  if(r.error){alert(r.error.message);return}
  await loadView();loadCount();
  if(typeof refresh==="function")refresh();
}
async function dismiss(i){
  var g=groups[i];if(!g)return;
  var r=await sb.from("reports").delete().in("id",g.ids);
  if(r.error){alert(r.error.message);return}
  await loadView();loadCount();
}

/* ---------- admin: side menu item with count ---------- */
async function loadCount(){
  if(!me||!me.is_admin){repCount=0;return}
  var r=await sb.from("reports").select("id",{count:"exact",head:true});
  if(r.error)return;
  var n=r.count||0;
  if(n!==repCount){repCount=n;if(typeof drw==="function")drw()}
}
var od=window.drw;
if(typeof od==="function"){
  window.drw=function(){
    od();
    if(!me||!me.is_admin)return;
    var items=document.querySelectorAll("#drw .mi"),out=null;
    for(var i=0;i<items.length;i++){
      if(items[i].textContent.indexOf("Log out")===0)out=items[i];
    }
    var t=document.createElement("button");
    t.className="mi";t.setAttribute("data-rpt","1");
    t.innerHTML=ic("flag",0,24)+"Reports"+(repCount?'<span class="soon">'+repCount+'</span>':"");
    if(out)out.parentNode.insertBefore(t,out);else $("drw").appendChild(t);
  };
}

document.addEventListener("click",function(e){
  var t=e.target.closest("[data-rp],[data-rpr],[data-rpx],[data-rpt],[data-rpd],[data-rpk],[data-rpc]");
  if(!t)return;
  var d=t.dataset;
  if(d.rp!==undefined)openSheet(d.rp);
  else if(d.rpr!==undefined)sendReport(+d.rpr);
  else if(d.rpx!==undefined)closeSheet();
  else if(d.rpt!==undefined){menu(false);ov.hidden=false;loadView()}
  else if(d.rpd!==undefined)delPost(+d.rpd);
  else if(d.rpk!==undefined)dismiss(+d.rpk);
  else if(d.rpc!==undefined)ov.hidden=true;
});

setInterval(function(){
  if(!me){aid=null;repCount=0;ov.hidden=true;return}
  if(me.id!==aid){aid=me.id;loadCount()}
},2000);
setInterval(loadCount,60000);
})();
