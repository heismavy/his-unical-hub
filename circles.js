(function(){
var C={circles:[],mem:[],counts:{},last:{},N:{},cur:null,msgs:[],ch:null,poll:null,view:"list",tab:"circles",q:"",first:false,err:null};
var css=`
#cr{position:fixed;left:0;right:0;top:0;height:100%;z-index:39;background:var(--bg);color:var(--ink);padding-top:env(safe-area-inset-top,0px)}
#cr[hidden]{display:none}
.crw{max-width:520px;margin:0 auto;height:100%;display:flex;flex-direction:column}
.crh{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--line);flex:none}
.crh b{flex:1;font-size:17px}
.crh .crg b{display:block;flex:none}
.crbk{width:38px;height:38px;border-radius:50%;background:var(--chip);font-size:20px;display:grid;place-items:center;flex:none}
.crpl{padding:8px 14px;border-radius:12px;background:var(--btn);color:var(--btn-ink);font-weight:800;font-size:14px;flex:none}
.crpl.alt{background:var(--chip);color:var(--ink)}
.crbody{flex:1;overflow-y:auto;padding:10px 16px calc(24px + env(safe-area-inset-bottom,0px))}
.crtabs{display:flex;gap:8px;margin-bottom:10px}
.crtab{padding:8px 14px;border-radius:18px;border:1px solid var(--line);font-weight:700;font-size:13.5px}
.crtab.on{background:var(--gold,#e8a917);color:#1a1204;border-color:transparent}
.crsoon{font-size:10px;font-weight:800;margin-left:4px;opacity:.7}
.crsec{font-weight:800;font-size:15px;margin:16px 0 6px}
.crrow{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--line)}
.crrow[data-cro]{cursor:pointer}
.crrow2{display:flex;gap:8px}
.cravt{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:800;font-size:17px;overflow:hidden;flex:none}
.cravt img{width:100%;height:100%;object-fit:cover}
.crg{flex:1;min-width:0}
.crg b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.crm{color:var(--mute);font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.crbadge{min-width:20px;height:20px;border-radius:10px;background:var(--red,#c62f23);color:#fff;font-size:11px;font-weight:800;display:grid;place-items:center;padding:0 6px}
.crbadge2{font-size:10.5px;font-weight:800;padding:2px 9px;border-radius:10px;background:var(--gold,#e8a917);color:#1a1204}
.crlink{color:var(--blue,#2b78c2);font-size:13px;font-weight:700}
.cre{text-align:center;color:var(--mute);padding:36px 16px}
.crmsgs{display:flex;flex-direction:column;padding:10px 12px}
.crb{max-width:80%;margin:3px 0;padding:8px 12px;border-radius:16px;background:var(--chip);align-self:flex-start;overflow-wrap:anywhere}
.crb.own{background:var(--gold,#e8a917);color:#1a1204;align-self:flex-end}
.crs{font-size:12px;font-weight:800;margin-bottom:2px}
.crtx{white-space:pre-wrap}
.crti{font-size:10.5px;opacity:.7;margin-top:2px;text-align:right}
.crti button{font-size:10.5px;text-decoration:underline}
.crd{align-self:center;font-size:11.5px;color:var(--mute);margin:10px 0 4px}
.crin{display:flex;gap:8px;padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--line);flex:none}
.crsd{padding:0 18px;border-radius:14px;background:var(--btn);color:var(--btn-ink);font-weight:800}
.crbtn{display:block;width:100%;margin-top:16px;padding:13px;border-radius:14px;background:var(--btn);color:var(--btn-ink);font-weight:800}
.crbtn.dg{background:var(--chip);color:var(--red,#c62f23)}
.crerr{color:var(--red,#c62f23);font-size:13.5px;margin-top:8px;min-height:18px}
.crabout{background:var(--chip);border-radius:16px;padding:14px}
`;
var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
if(window.P&&!P.people)P.people='<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 4a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6"/>';
function g(i){return document.getElementById(i)}
function ov(){var o=g("cr");if(!o){o=document.createElement("div");o.id="cr";o.hidden=true;document.body.appendChild(o)}return o}
function mm(cid){return C.mem.filter(function(m){return m.circle_id===cid&&m.user_id===me.id})[0]}
function isAdm(cid){var m=mm(cid);return !!m&&m.status==="approved"&&(m.role==="owner"||m.role==="admin")}
function circ(id){return C.circles.filter(function(c){return c.id===id})[0]}
function bad(r){if(r&&r.error){alert(r.error.message);return true}return false}
function av(c){return'<span class="cravt" style="background:'+col(String(c.id))+'">'+esc(c.name[0].toUpperCase())+'</span>'}
function pav(u){return'<span class="cravt" style="background:'+col(String(u.id))+'">'+(u.avatar_url?'<img src="'+esc(u.avatar_url)+'" alt="">':esc((u.display_name||"?")[0].toUpperCase()))+'</span>'}
async function names(ids){var need=[];ids.forEach(function(i){if(i&&!C.N[i]&&need.indexOf(i)<0)need.push(i)});if(!need.length)return;var r=await sb.from("profiles").select("id,display_name,username,level,avatar_url").in("id",need);(r.data||[]).forEach(function(u){C.N[u.id]=u})}
async function loadAll(){
var a=await sb.from("circles").select("*").order("created_at",{ascending:false}),b=await sb.from("circle_members").select("circle_id,user_id,role,status");
if(a.error||b.error){C.err=(a.error||b.error).message;return}
C.err=null;C.circles=a.data||[];C.mem=b.data||[];
var cn=await sb.rpc("circle_counts");C.counts={};(cn.data||[]).forEach(function(x){C.counts[x.circle_id]=+x.n});
var ids=C.mem.filter(function(m){return m.user_id===me.id&&m.status==="approved"}).map(function(m){return m.circle_id});C.last={};
if(ids.length){var r=await sb.from("circle_messages").select("circle_id,body,created_at,sender_id").in("circle_id",ids).order("created_at",{ascending:false}).limit(200);
(r.data||[]).forEach(function(x){if(!C.last[x.circle_id])C.last[x.circle_id]=x});
await names(Object.keys(C.last).map(function(k){return C.last[k].sender_id}))}}
function shell(title,body,back,right){var o=ov();o.hidden=false;o.innerHTML='<div class="crw"><div class="crh"><button class="crbk" data-crx="'+back+'" aria-label="Back">‹</button><b>'+title+'</b>'+(right||"")+'</div><div class="crbody">'+body+'</div></div>'}
function myRow(c){var l=C.last[c.id],u=l?(C.N[l.sender_id]||{}):{},pend=isAdm(c.id)?C.mem.filter(function(m){return m.circle_id===c.id&&m.status==="pending"}).length:0;
return'<div class="crrow" data-cro="'+c.id+'">'+av(c)+'<div class="crg"><b>'+esc(c.name)+'</b><div class="crm">'+(l?esc((l.sender_id===me.id?"You":(u.display_name||"Member"))+": "+l.body):"No messages yet")+'</div></div>'+(pend?'<span class="crbadge">'+pend+'</span>':"")+(l?'<span class="crm" style="flex:none">'+ago(l.created_at)+'</span>':"")+'</div>'}
function rows(){var q=C.q.trim().toLowerCase(),mine=[],req=[],disc=[];
C.circles.forEach(function(c){if(q&&(c.name+" "+(c.about||"")).toLowerCase().indexOf(q)<0)return;var m=mm(c.id);if(m&&m.status==="approved")mine.push(c);else if(m&&m.status==="pending")req.push(c);else if(c.is_listed)disc.push(c)});
mine.sort(function(a,b){var x=C.last[a.id],y=C.last[b.id];return(y?+new Date(y.created_at):0)-(x?+new Date(x.created_at):0)});
var h='<div class="crsec">Your circles</div>'+(mine.length?mine.map(myRow).join(""):'<div class="cre">You are not in any circle yet. Start one with + New, or request to join one below.</div>');
if(req.length)h+='<div class="crsec">Requested</div>'+req.map(function(c){return'<div class="crrow">'+av(c)+'<div class="crg"><b>'+esc(c.name)+'</b><div class="crm">Waiting for the admin to approve</div></div><button class="crpl alt" data-crcancel="'+c.id+'">Cancel</button></div>'}).join("");
if(disc.length)h+='<div class="crsec">Discover</div>'+disc.map(function(c){return'<div class="crrow">'+av(c)+'<div class="crg"><b>'+esc(c.name)+'</b><div class="crm">'+esc(c.about||"")+(c.about?" · ":"")+(C.counts[c.id]||0)+' members</div></div><button class="crpl" data-crreq="'+c.id+'">Request</button></div>'}).join("");
return h}
function home(){C.view="list";unsub();
var body='<div class="crtabs"><button class="crtab'+(C.tab==="circles"?" on":"")+'" data-crtab="circles">Circles</button><button class="crtab'+(C.tab==="comm"?" on":"")+'" data-crtab="comm">Communities<span class="crsoon">Soon</span></button></div>';
if(C.err)body+='<div class="cre">Circles are not set up yet: '+esc(C.err)+'</div>';
else if(C.tab==="comm")body+='<div class="cre">Communities are one-way channels where admins post and members follow. Coming soon.</div>';
else body+='<input id="crq" placeholder="Search circles" aria-label="Search circles" value="'+esc(C.q)+'"><div id="crl">'+rows()+'</div>';
shell("Circles",body,"close",'<button class="crpl" data-crnew="1">+ New</button>')}
function form(){C.view="new";shell("New circle",'<label for="crnm">Circle name</label><input id="crnm" maxlength="40" placeholder="e.g. HIS 301 Study Group"><label for="crab">About (optional)</label><input id="crab" maxlength="200" placeholder="What is this circle for?"><label for="crls">Visibility</label><select id="crls"><option value="1">Listed: anyone can find it and request to join</option><option value="0">Hidden: only people you add can join</option></select><div class="crerr" id="crer" role="alert"></div><button class="crbtn" data-crmk="1">Create circle</button>',"list")}
async function make(){var nm=g("crnm").value.trim(),e=g("crer");if(nm.length<3){e.textContent="Give the circle a name (at least 3 letters).";return}
var r=await sb.rpc("create_circle",{p_name:nm,p_about:g("crab").value.trim(),p_listed:g("crls").value==="1"});
if(r.error){e.textContent=r.error.message;return}
await loadAll();openC(+r.data)}
async function openC(id){var m=mm(id);if(!m||m.status!=="approved")return;C.cur=id;
shell(esc(circ(id).name),'<div class="cre">Loading…</div>',"list");
await loadM();chat();sub()}
async function loadM(){var r=await sb.from("circle_messages").select("id,sender_id,body,created_at").eq("circle_id",C.cur).order("created_at",{ascending:false}).limit(100);if(r.error)return;C.msgs=(r.data||[]).reverse();await names(C.msgs.map(function(m){return m.sender_id}))}
function mhtml(){var last=null,day=null,h="";
C.msgs.forEach(function(m){var d=new Date(m.created_at),dk=d.toDateString();
if(dk!==day){day=dk;last=null;h+='<div class="crd">'+d.toLocaleDateString("en",{weekday:"short",day:"numeric",month:"short"})+'</div>'}
var own=m.sender_id===me.id,u=C.N[m.sender_id]||{display_name:"Member"};
h+='<div class="crb'+(own?" own":"")+'">'+(!own&&last!==m.sender_id?'<div class="crs" style="color:'+col(m.sender_id)+'">'+esc(u.display_name)+'</div>':"")+'<div class="crtx">'+esc(m.body)+'</div><div class="crti">'+d.toLocaleTimeString("en",{hour:"2-digit",minute:"2-digit"})+((own||isAdm(C.cur))?' · <button data-crmd="'+m.id+'">Delete</button>':"")+'</div></div>';last=m.sender_id});
return h||'<div class="cre">No messages yet. Say hello.</div>'}
function renderM(stick){var el=g("crm");if(!el)return;var near=el.scrollHeight-el.scrollTop-el.clientHeight<140;el.innerHTML=mhtml();if(stick&&(near||C.first))el.scrollTop=el.scrollHeight}
function chat(){C.view="chat";var c=circ(C.cur);if(!c){home();return}var n=C.counts[c.id]||0,o=ov();o.hidden=false;
o.innerHTML='<div class="crw"><div class="crh"><button class="crbk" data-crx="list" aria-label="Back">‹</button><div class="crg" data-crinfo="1" style="cursor:pointer"><b>'+esc(c.name)+'</b><div class="crm">'+n+' member'+(n===1?"":"s")+' · tap for info</div></div></div><div class="crbody crmsgs" id="crm"></div><div class="crin"><input id="crin" maxlength="1000" placeholder="Message" aria-label="Message"><button class="crsd" data-crsend="1">Send</button></div></div>';
C.first=true;renderM(true);C.first=false}
async function send(){var i=g("crin"),v=i?i.value.trim():"";if(!v)return;i.value="";
var r=await sb.from("circle_messages").insert({circle_id:C.cur,sender_id:me.id,body:v.slice(0,1000)}).select("id,sender_id,body,created_at").single();
if(r.error){alert(r.error.message);i.value=v;return}
if(!C.msgs.some(function(x){return x.id===r.data.id}))C.msgs.push(r.data);renderM(true)}
function unsub(){if(C.ch){sb.removeChannel(C.ch);C.ch=null}clearInterval(C.poll)}
function sub(){unsub();
C.ch=sb.channel("cr"+C.cur).on("postgres_changes",{event:"INSERT",schema:"public",table:"circle_messages",filter:"circle_id=eq."+C.cur},async function(p){var m=p.new;if(C.msgs.some(function(x){return x.id===m.id}))return;await names([m.sender_id]);C.msgs.push({id:m.id,sender_id:m.sender_id,body:m.body,created_at:m.created_at});if(C.view==="chat")renderM(true)}).subscribe();
C.poll=setInterval(async function(){if(C.view!=="chat")return;var n=C.msgs.length,lid=n?C.msgs[n-1].id:0;await loadM();var k=C.msgs.length;if(k!==n||(k&&C.msgs[k-1].id!==lid))renderM(true)},8000)}
async function info(){C.view="info";var c=circ(C.cur);if(!c){home();return}
var ms=C.mem.filter(function(m){return m.circle_id===c.id});await names(ms.map(function(m){return m.user_id}));
var ap=ms.filter(function(m){return m.status==="approved"}),pe=ms.filter(function(m){return m.status==="pending"}),adm=isAdm(c.id),owner=(mm(c.id)||{}).role==="owner";
var h='<div class="crabout"><b>'+esc(c.name)+'</b><p class="crm" style="white-space:normal">'+esc(c.about||"No description")+'</p><div class="crm">'+(c.is_listed?"Listed":"Hidden")+' · '+ap.length+' member'+(ap.length===1?"":"s")+'</div></div>';
if(adm)h+='<div class="crsec">Add a member</div><div class="crrow2"><input id="cru" placeholder="Their username" autocapitalize="none" aria-label="Username"><button class="crpl" data-cradd="1">Add</button></div><div class="crerr" id="crer" role="alert"></div>';
if(adm&&pe.length)h+='<div class="crsec">Requests ('+pe.length+')</div>'+pe.map(function(m){var u=C.N[m.user_id]||{id:m.user_id,display_name:"Member"};return'<div class="crrow">'+pav(u)+'<div class="crg"><b>'+esc(u.display_name)+'</b><div class="crm">'+esc(u.level||"")+(u.username?" · @"+esc(u.username):"")+'</div></div><button class="crpl" data-crap="'+m.user_id+'">Approve</button><button class="crpl alt" data-crrm="'+m.user_id+'">Decline</button></div>'}).join("");
h+='<div class="crsec">Members</div>'+ap.map(function(m){var u=C.N[m.user_id]||{id:m.user_id,display_name:"Member"};return'<div class="crrow">'+pav(u)+'<div class="crg"><b>'+esc(u.display_name)+'</b><div class="crm">'+esc(u.level||"")+'</div></div>'+(m.role!=="member"?'<span class="crbadge2">'+(m.role==="owner"?"Owner":"Admin")+'</span>':"")+(owner&&m.role!=="owner"?'<button class="crlink" data-cradm="'+m.user_id+'" data-mk="'+(m.role==="admin"?"0":"1")+'">'+(m.role==="admin"?"Remove admin":"Make admin")+'</button>':"")+(adm&&m.role!=="owner"&&m.user_id!==me.id?'<button class="crlink" data-crrm="'+m.user_id+'">Remove</button>':"")+'</div>'}).join("");
h+=(owner||me.is_admin)?'<button class="crbtn dg" data-crdel="1">Delete circle</button>':'<button class="crbtn dg" data-crlv="1">Leave circle</button>';
shell("Circle info",h,"chat")}
async function addU(){var u=g("cru").value.trim().toLowerCase().replace(/^@/,""),e=g("crer");if(!u)return;
var p=await sb.from("profiles").select("id,display_name").eq("username",u).maybeSingle();
if(!p.data){e.textContent="No one has that username.";return}
var ex=C.mem.filter(function(m){return m.circle_id===C.cur&&m.user_id===p.data.id})[0],r;
if(ex&&ex.status==="approved"){e.textContent=p.data.display_name+" is already in this circle.";return}
if(ex)r=await sb.from("circle_members").update({status:"approved"}).match({circle_id:C.cur,user_id:p.data.id});
else r=await sb.from("circle_members").insert({circle_id:C.cur,user_id:p.data.id,role:"member",status:"approved"});
if(r.error){e.textContent=r.error.message;return}
await after()}
async function after(){await loadAll();if(C.view==="info")await info();else if(C.view==="chat")chat();else home()}
var SEL="[data-circles],[data-crx],[data-crtab],[data-cro],[data-crnew],[data-crmk],[data-crinfo],[data-crreq],[data-crcancel],[data-crap],[data-crrm],[data-cradd],[data-cradm],[data-crlv],[data-crdel],[data-crsend],[data-crmd]";
document.addEventListener("click",async function(e){var b=e.target.closest(SEL);if(!b)return;var d=b.dataset;
if(d.circles!=null){if(!me)return;if(typeof menu==="function")menu(false);C.tab="circles";C.q="";shell("Circles",'<div class="cre">Loading…</div>',"close");await loadAll();home()}
else if(d.crx==="close"){unsub();ov().hidden=true}
else if(d.crx==="list"){C.cur=null;await loadAll();home()}
else if(d.crx==="chat"){chat()}
else if(d.crtab){C.tab=d.crtab;home()}
else if(d.cro){openC(+d.cro)}
else if(d.crnew!=null){form()}
else if(d.crmk!=null){make()}
else if(d.crinfo!=null){info()}
else if(d.crreq){if(bad(await sb.from("circle_members").insert({circle_id:+d.crreq,user_id:me.id,role:"member",status:"pending"})))return;await after()}
else if(d.crcancel){if(bad(await sb.from("circle_members").delete().match({circle_id:+d.crcancel,user_id:me.id})))return;await after()}
else if(d.crap){if(bad(await sb.from("circle_members").update({status:"approved"}).match({circle_id:C.cur,user_id:d.crap})))return;await after()}
else if(d.crrm){if(bad(await sb.from("circle_members").delete().match({circle_id:C.cur,user_id:d.crrm})))return;await after()}
else if(d.cradd!=null){addU()}
else if(d.cradm){if(bad(await sb.rpc("set_circle_admin",{c:C.cur,u:d.cradm,make:d.mk==="1"})))return;await after()}
else if(d.crlv!=null){if(!confirm("Leave this circle?"))return;if(bad(await sb.from("circle_members").delete().match({circle_id:C.cur,user_id:me.id})))return;C.cur=null;await loadAll();home()}
else if(d.crdel!=null){if(!confirm("Delete this circle and all its messages?"))return;if(bad(await sb.from("circles").delete().eq("id",C.cur)))return;C.cur=null;await loadAll();home()}
else if(d.crsend!=null){send()}
else if(d.crmd){if(!confirm("Delete this message?"))return;if(bad(await sb.from("circle_messages").delete().eq("id",+d.crmd)))return;C.msgs=C.msgs.filter(function(m){return m.id!==+d.crmd});renderM(false)}});
document.addEventListener("input",function(e){if(e.target.id==="crq"){C.q=e.target.value;var l=g("crl");if(l)l.innerHTML=rows()}});
document.addEventListener("keydown",function(e){if(e.target&&e.target.id==="crin"&&e.key==="Enter"){e.preventDefault();send()}});
function inject(){var d=g("drw");if(!d||d.querySelector("[data-circles]"))return;
var btn=document.createElement("button");btn.className="mi";btn.setAttribute("data-circles","1");btn.innerHTML=ic("people",0,24)+"Circles";
var old=[].slice.call(d.querySelectorAll(".mi")).filter(function(x){return /Communities|Circles/.test(x.textContent)})[0];
if(old)old.replaceWith(btn);else{var out=d.querySelector("[data-out]");if(out)out.parentNode.insertBefore(btn,out);else d.appendChild(btn)}}
if(typeof window.drw==="function"){var od=window.drw;window.drw=function(){od.apply(this,arguments);inject()}}
if(window.visualViewport){var vv=window.visualViewport;var fit=function(){var o=g("cr");if(o&&!o.hidden){o.style.height=vv.height+"px";o.style.top=vv.offsetTop+"px"}};vv.addEventListener("resize",fit);vv.addEventListener("scroll",fit)}
setInterval(function(){inject();if(!me){var o=g("cr");if(o&&!o.hidden){unsub();o.hidden=true}}},1500);
setInterval(async function(){var o=g("cr");if(!me||!o||o.hidden||C.view!=="list")return;var a=document.activeElement;if(a&&a.tagName==="INPUT")return;await loadAll();if(C.view==="list"&&!o.hidden)home()},12000);
})();
