(function(){
var st=document.createElement("style");
st.textContent=`
#mbtn{margin-left:auto;position:relative;width:38px;height:38px;display:grid;place-items:center;color:var(--ink)}
#nbell{margin-left:0!important}
#mbadge{position:absolute;top:1px;right:0;min-width:17px;height:17px;padding:0 4px;border-radius:9px;background:var(--red);color:#fff;font-size:10.5px;font-weight:800;display:grid;place-items:center;line-height:1}
#mov{position:fixed;inset:0;z-index:37;background:var(--bg);display:flex;flex-direction:column;padding-top:env(safe-area-inset-top,0px)}
#mov .mh{display:flex;align-items:center;gap:12px;padding:10px 14px;border-bottom:1px solid var(--line)}
#mov .mh b{font-size:18px;flex:1}
#mov .xb{width:36px;height:36px;display:grid;place-items:center}
#mov .mwho{display:flex;align-items:center;gap:10px;flex:1;text-align:left}
#mb{flex:1;overflow-y:auto;padding:8px 0}
.mr{display:flex;gap:12px;align-items:center;width:100%;text-align:left;padding:12px 18px;border-bottom:1px solid var(--line)}
.mr.un{background:var(--annbg)}
.mr .g{flex:1;min-width:0}
.mr .dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--gold)}
.bb{max-width:78%;padding:8px 12px;border-radius:16px;margin:3px 14px;overflow-wrap:anywhere;white-space:pre-wrap;width:fit-content}
.bb.me{margin-left:auto;background:var(--btn);color:var(--btn-ink);border-bottom-right-radius:4px}
.bb.th{background:var(--chip);border-bottom-left-radius:4px}
.bb small{display:block;font-size:10.5px;opacity:.65;margin-top:2px;text-align:right}
#mov .mf{display:flex;gap:8px;padding:10px 14px calc(env(safe-area-inset-bottom,0px) + 12px);border-top:1px solid var(--line)}
`;
document.head.appendChild(st);

P.send='<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>';
P.back='<path d="M15 18l-6-6 6-6"/>';

var COLS="id,sender_id,recipient_id,body,read,created_at";
var mode="",other=null,thread=[],people={},ch=null,lastId=null,tmr=null;

var btn=document.createElement("button");
btn.id="mbtn";btn.setAttribute("aria-label","Messages");
btn.innerHTML=ic("mail",0,24)+'<span id="mbadge" hidden></span>';
var anchor=$("nbell")||document.querySelector(".top .lg");
anchor.parentNode.insertBefore(btn,anchor);

var ov=document.createElement("div");
ov.id="mov";ov.hidden=true;
ov.innerHTML='<div id="mh"></div><div id="mb"></div><div id="mf"></div>';
document.body.appendChild(ov);
var H=$("mh"),B=$("mb"),F=$("mf");

function pic(u,sz){
  return '<div class="av" style="background:'+col(String(u.id))+';width:'+sz+'px;height:'+sz+'px;font-size:'+Math.round(sz*.4)+'px">'+(u.avatar_url?'<img src="'+esc(u.avatar_url)+'" alt="">':esc((u.display_name||"?")[0].toUpperCase()))+'</div>';
}
function clock(t){return new Date(t).toLocaleTimeString("en",{hour:"numeric",minute:"2-digit"})}

async function loadPeople(ids){
  var need=ids.filter(function(i){return !people[i]});
  if(!need.length)return;
  var r=await sb.from("profiles").select("id,display_name,username,level,avatar_url").in("id",need);
  (r.data||[]).forEach(function(u){people[u.id]=u});
}

async function count(){
  if(!me)return;
  var r=await sb.from("messages").select("id",{count:"exact",head:true}).eq("recipient_id",me.id).eq("read",false);
  if(r.error)return;
  var n=r.count||0,b=$("mbadge");
  b.hidden=!n;b.textContent=n>99?"99+":n;
}

async function inbox(quiet){
  mode="inbox";other=null;
  H.innerHTML='<div class="mh"><button class="xb" data-mx="1" aria-label="Close">'+ic("x",0,24)+'</button><b>Messages</b><button class="btn sm" data-mnew="1">New</button></div>';
  F.innerHTML="";
  if(!quiet)B.innerHTML='<div class="empty">Loading...</div>';
  var r=await sb.from("messages").select(COLS).or("sender_id.eq."+me.id+",recipient_id.eq."+me.id).order("created_at",{ascending:false}).limit(300);
  if(mode!=="inbox")return;
  if(r.error){B.innerHTML='<div class="err">'+esc(r.error.message)+'</div>';return}
  var seen={},convs=[];
  (r.data||[]).forEach(function(m){
    var o=m.sender_id===me.id?m.recipient_id:m.sender_id;
    if(!seen[o]){seen[o]={id:o,last:m,unread:0};convs.push(seen[o])}
    if(m.recipient_id===me.id&&!m.read)seen[o].unread++;
  });
  await loadPeople(convs.map(function(c){return c.id}));
  if(mode!=="inbox")return;
  B.innerHTML=convs.length?convs.map(function(c){
    var u=people[c.id]||{id:c.id,display_name:"Unknown"};
    return '<button class="mr'+(c.unread?" un":"")+'" data-mc="'+c.id+'">'+pic(u,46)+'<div class="g"><b>'+esc(u.display_name)+'</b><div class="mt" style="flex-wrap:nowrap"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:55vw">'+(c.last.sender_id===me.id?"You: ":"")+esc(c.last.body)+'</span></div></div><div class="mt">'+ago(c.last.created_at)+(c.unread?' <span class="dot"></span>':"")+'</div></button>';
  }).join(""):'<div class="empty">No messages yet. Tap New to start a chat.</div>';
  count();
}

function newMsg(){
  mode="new";other=null;
  H.innerHTML='<div class="mh"><button class="xb" data-mback="1" aria-label="Back">'+ic("back",0,24)+'</button><b>New message</b></div>';
  F.innerHTML="";
  B.innerHTML='<div style="padding:12px 18px"><input id="mq" placeholder="Search for a person" aria-label="Search people"></div><div id="mres"><div class="empty">Type a name or username.</div></div>';
  $("mq").focus();
}

async function find(s){
  s=s.trim();var res=$("mres");if(!res)return;
  if(!s){res.innerHTML='<div class="empty">Type a name or username.</div>';return}
  var r=await sb.from("profiles").select("id,display_name,username,level,avatar_url").or("display_name.ilike.%"+s.replace(/[^a-zA-Z0-9 ]/g,"")+"%,username.ilike.%"+s.replace(/[^a-zA-Z0-9]/g,"")+"%").neq("id",me.id).limit(20);
  var d=r.data||[];
  d.forEach(function(u){people[u.id]=u});
  if(!$("mres"))return;
  $("mres").innerHTML=d.length?d.map(function(u){
    return '<button class="mr" data-mc="'+u.id+'">'+pic(u,42)+'<div class="g"><b>'+esc(u.display_name)+'</b><div class="mt">'+esc(u.level)+" · @"+esc(u.username)+'</div></div></button>';
  }).join(""):'<div class="empty">No one found.</div>';
}

function query(id){
  return sb.from("messages").select(COLS).or("and(sender_id.eq."+me.id+",recipient_id.eq."+id+"),and(sender_id.eq."+id+",recipient_id.eq."+me.id+")").order("created_at",{ascending:true}).limit(200);
}

function drawThread(){
  B.innerHTML=thread.length?thread.map(function(m){
    return '<div class="bb '+(m.sender_id===me.id?"me":"th")+'">'+esc(m.body)+'<small>'+clock(m.created_at)+'</small></div>';
  }).join(""):'<div class="empty">Say hi.</div>';
  B.scrollTop=B.scrollHeight;
}

async function markRead(){
  if(!other)return;
  await sb.from("messages").update({read:true}).eq("recipient_id",me.id).eq("sender_id",other).eq("read",false);
  count();
}

async function chat(id){
  mode="chat";other=id;thread=[];
  await loadPeople([id]);
  var u=people[id]||{id:id,display_name:"Unknown"};
  H.innerHTML='<div class="mh"><button class="xb" data-mback="1" aria-label="Back">'+ic("back",0,24)+'</button><button class="mwho" data-mp="'+id+'">'+pic(u,34)+'<b>'+esc(u.display_name)+'</b></button></div>';
  F.innerHTML='<div class="mf"><input id="mi" maxlength="1000" placeholder="Message" aria-label="Message" autocomplete="off"><button class="btn sm" data-msend="1">Send</button></div>';
  B.innerHTML='<div class="empty">Loading...</div>';
  var r=await query(id);
  if(mode!=="chat"||other!==id)return;
  if(r.error){B.innerHTML='<div class="err">'+esc(r.error.message)+'</div>';return}
  thread=r.data||[];drawThread();markRead();
}

function add(m){
  if(thread.some(function(x){return x.id===m.id}))return;
  thread.push(m);drawThread();
}

async function send(){
  var i=$("mi");if(!i||!other)return;
  var v=i.value.trim();if(!v)return;
  i.value="";
  var r=await sb.from("messages").insert({sender_id:me.id,recipient_id:other,body:v.slice(0,1000)}).select(COLS).single();
  if(r.error){i.value=v;alert(r.error.message);return}
  add(r.data);
}

function onIns(p){
  var m=p.new;
  if(!m||(m.sender_id!==me.id&&m.recipient_id!==me.id))return;
  if(mode==="chat"&&(m.sender_id===other||m.recipient_id===other)){
    add(m);
    if(m.recipient_id===me.id)markRead();
  }else if(mode==="inbox"&&!ov.hidden){inbox(true)}
  count();
}

function openM(){ov.hidden=false;inbox()}
function closeM(){ov.hidden=true;mode="";other=null;count()}

btn.addEventListener("click",openM);

ov.addEventListener("click",function(e){
  var t=e.target.closest("[data-mx],[data-mnew],[data-mback],[data-mc],[data-msend],[data-mp]");
  if(!t)return;
  var d=t.dataset;
  if(d.mx)closeM();
  else if(d.mnew)newMsg();
  else if(d.mback)inbox();
  else if(d.mc)chat(d.mc);
  else if(d.msend)send();
  else if(d.mp){closeM();openUser(d.mp)}
});
ov.addEventListener("input",function(e){
  if(e.target.id==="mq"){var v=e.target.value;clearTimeout(tmr);tmr=setTimeout(function(){find(v)},250)}
});
ov.addEventListener("keydown",function(e){
  if(e.target.id==="mi"&&e.key==="Enter"){e.preventDefault();send()}
});

// make the side-menu "Messages" item work
var od=window.drw;
if(typeof od==="function"){
  window.drw=function(){
    od();
    var items=document.querySelectorAll("#drw .mi");
    for(var i=0;i<items.length;i++){
      if(items[i].textContent.indexOf("Messages")===0){
        items[i].disabled=false;
        items[i].setAttribute("data-m","1");
        var s=items[i].querySelector(".soon");if(s)s.remove();
      }
    }
  };
}
document.addEventListener("click",function(e){
  if(e.target.closest("[data-m]")){menu(false);openM()}
});

function subscribe(){
  if(ch){sb.removeChannel(ch);ch=null}
  ch=sb.channel("dm-"+me.id).on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},onIns).subscribe();
}

setInterval(function(){
  if(!me){
    if(ch){sb.removeChannel(ch);ch=null}
    lastId=null;ov.hidden=true;mode="";return;
  }
  if(me.id!==lastId){lastId=me.id;count();subscribe()}
},2000);

// backup in case live updates fail
setInterval(async function(){
  if(!me)return;
  if(ov.hidden){count();return}
  if(mode==="inbox")inbox(true);
  else if(mode==="chat"&&other){
    var r=await query(other);
    if(r.data&&mode==="chat"&&r.data.length!==thread.length){thread=r.data;drawThread();markRead()}
  }
},10000);
})();
