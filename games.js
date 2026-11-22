(function(){
var G={qs:[],i:0,ans:{},tm:null,t0:0,lock:false,res:null,played:null};
var css=`
#gm{position:fixed;inset:0;z-index:39;background:var(--bg);color:var(--ink);overflow-y:auto;padding-top:env(safe-area-inset-top,0px);font-family:inherit}
#gm[hidden]{display:none}
.gtop{display:flex;align-items:center;gap:10px;padding:12px 16px;position:sticky;top:0;background:var(--bg);z-index:2;border-bottom:1px solid var(--line)}
.gtop b{font-size:18px}
.gb{width:38px;height:38px;border-radius:50%;background:var(--chip);font-size:20px;display:grid;place-items:center}
.gbody{max-width:520px;margin:0 auto;padding:14px 16px calc(40px + env(safe-area-inset-bottom,0px))}
.gcard{background:var(--chip);border-radius:20px;padding:16px;margin-bottom:12px}
.gc{text-align:center}
.gscore{font-size:56px;font-weight:800;line-height:1}
.gscore small{font-size:22px;color:var(--mute)}
.gm{color:var(--mute);font-size:13px}
.gsec{font-weight:800;font-size:17px;margin:18px 0 8px}
.gbtn{display:block;width:100%;margin-top:12px;padding:13px;border-radius:14px;background:var(--btn);color:var(--btn-ink);font-weight:800;text-align:center}
.gbtn.alt{background:var(--bg);color:var(--ink);border:1px solid var(--line)}
.gbar{height:7px;background:var(--chip);border-radius:7px;overflow:hidden;margin:6px 0 18px}
.gbar i{display:block;height:100%;width:100%;background:var(--gold,#e8a917)}
.gq{font-size:20px;font-weight:800;line-height:1.35;margin-bottom:16px}
.gopt{display:flex;gap:12px;align-items:flex-start;width:100%;text-align:left;padding:14px;margin-bottom:10px;border:1.5px solid var(--line);border-radius:14px;background:var(--bg);font-size:15.5px}
.gopt b{flex:none;width:26px;height:26px;border-radius:50%;background:var(--chip);display:grid;place-items:center;font-size:13px}
.gopt.sel{border-color:var(--gold,#e8a917);background:var(--annbg,#fff3d1)}
.grev{border-left:4px solid var(--line);padding:10px 12px;margin-bottom:10px;background:var(--chip);border-radius:10px;font-size:14px}
.grev.ok{border-color:#18a975}
.grev.bad{border-color:var(--red,#c62f23)}
.gqs{font-weight:700;margin:2px 0 6px}
.glv{display:flex;align-items:center;gap:10px;margin:8px 0}
.glv b{width:42px}
.gbar2{flex:1;height:12px;background:var(--bg);border-radius:12px;overflow:hidden}
.gbar2 i{display:block;height:100%;background:var(--gold,#e8a917);border-radius:12px}
.glv span{min-width:64px;text-align:right;font-weight:700}
.gtp{display:flex;align-items:center;gap:10px;padding:8px 6px;border-radius:12px}
.gtp.me{background:var(--annbg,#fff3d1)}
.gn{width:22px;font-weight:800;color:var(--mute)}
.gav{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:800;overflow:hidden;flex:none}
.gav img{width:100%;height:100%;object-fit:cover}
.gnm{flex:1;display:flex;flex-direction:column;line-height:1.2}
.gnm small{color:var(--mute)}
.gsc{font-weight:800}
@media (prefers-reduced-motion:no-preference){.gopt:active,.gbtn:active{transform:scale(.97)}}
`;
var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
if(window.P&&!P.game)P.game='<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10v5M4.5 12.5h5M16 11.5h.01M18.5 13.5h.01"/>';
function g(i){return document.getElementById(i)}
function ov(){var o=g("gm");if(!o){o=document.createElement("div");o.id="gm";o.hidden=true;document.body.appendChild(o)}return o}
function today(){return new Date().toLocaleDateString("en-CA",{timeZone:"Africa/Lagos"})}
function weekStart(){var d=new Date(today()+"T00:00:00Z");d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));return d.toISOString().slice(0,10)}
function shell(inner,title,back){var o=ov();o.hidden=false;o.innerHTML='<div class="gtop"><button class="gb" data-gx="'+(back||"close")+'" aria-label="Back">‹</button><b>'+title+'</b></div><div class="gbody">'+inner+'</div>'}
function msg(t){shell('<div class="gcard"><p>'+esc(t)+'</p><button class="gbtn" data-gx="home">Back to Games</button></div>',"Daily History Quiz","home")}
function rows(d){if(!d)return[];if(typeof d==="string"){try{d=JSON.parse(d)}catch(e){return[]}}if(Array.isArray(d))return d;if(d.questions)return rows(d.questions);return[]}
function norm(r){var o={},src=r.options||r.choices;
if(typeof src==="string"){try{src=JSON.parse(src)}catch(e){src=null}}
["a","b","c","d"].forEach(function(k,i){var v=r[k]!=null?r[k]:r["option_"+k]!=null?r["option_"+k]:r["opt_"+k]!=null?r["opt_"+k]:r["choice_"+k];
if(v==null&&src)v=Array.isArray(src)?src[i]:(src[k]!=null?src[k]:src[k.toUpperCase()]);
if(v!=null)o[k]=v});
return{id:r.id!=null?r.id:(r.question_id!=null?r.question_id:r.qid),text:r.question||r.q||r.text||r.body||r.prompt||r.stem,opts:o}}
function corr(ans,id){if(!ans)return null;var a=Array.isArray(ans)?ans.filter(function(x){return String(x.id||x.question_id||x.qid)===String(id)})[0]:ans[id];if(a==null)return null;if(typeof a==="string")return a.toLowerCase();var c=a.correct||a.correct_answer||a.answer||a.right||"";return c?String(c).toLowerCase():null}
function cheer(s,t){var r=t?s/t:0;return r>=.9?"Outstanding. A true historian!":r>=.7?"Strong work. Keep it up!":r>=.5?"Not bad. Check the review below.":"Good try. Read the review and come back tomorrow."}
async function boards(){
var r=await sb.from("quiz_scores").select("user_id,score,total,points,played_on").gte("played_on",weekStart());
if(r.error)return'<div class="gsec">This week</div><div class="gm">Boards are not available right now.</div>';
var rs=r.data||[];
if(!rs.length)return'<div class="gsec">This week</div><div class="gcard gm">No scores yet this week. Be the first to play.</div>';
var tot={};
rs.forEach(function(x){var t=tot[x.user_id]||(tot[x.user_id]={points:0,score:0,total:0});t.points+=+x.points||0;t.score+=+x.score||0;t.total+=+x.total||0});
var ids=Object.keys(tot),pr=await sb.from("profiles").select("id,display_name,level,avatar_url").in("id",ids),pm={};
(pr.data||[]).forEach(function(p){pm[p.id]=p});
var lv={"100L":[0,0],"200L":[0,0],"300L":[0,0],"400L":[0,0]};
ids.forEach(function(id){var p=pm[id];if(p&&lv[p.level]){lv[p.level][0]+=tot[id].points;lv[p.level][1]++}});
var avg=Object.keys(lv).map(function(k){return{k:k,n:lv[k][1],a:lv[k][1]?Math.round(lv[k][0]/lv[k][1]):0}});
var mx=Math.max.apply(null,avg.map(function(x){return x.a}))||1;
var A='<div class="gsec">Level vs Level</div><div class="gcard"><div class="gm" style="margin-bottom:10px">Average points per player this week</div>'+avg.map(function(x){return'<div class="glv"><b>'+x.k+'</b><div class="gbar2"><i style="width:'+Math.round(x.a/mx*100)+'%"></i></div><span>'+x.a+' <small>('+x.n+')</small></span></div>'}).join("")+'</div>';
var top=ids.filter(function(id){return pm[id]}).sort(function(a,b){return tot[b].score-tot[a].score||tot[b].points-tot[a].points}).slice(0,10);
var B='<div class="gsec">Top players this week</div><div class="gcard">'+top.map(function(id,i){var p=pm[id];return'<div class="gtp'+(id===me.id?" me":"")+'"><span class="gn">'+(i+1)+'</span><span class="gav" style="background:'+col(id)+'">'+(p.avatar_url?'<img src="'+esc(p.avatar_url)+'" alt="">':esc((p.display_name||"?")[0].toUpperCase()))+'</span><span class="gnm"><b>'+esc(p.display_name)+'</b><small>'+esc(p.level)+'</small></span><span class="gsc">'+tot[id].score+' correct</span></div>'}).join("")+'</div>';
return A+B}
async function home(){
clearInterval(G.tm);
shell('<div class="gcard gm">Loading…</div>',"Games","close");
var p=await sb.from("quiz_scores").select("score,total,points").eq("user_id",me.id).eq("played_on",today()).maybeSingle();
G.played=(p&&p.data)||null;
var card='<div class="gcard"><div style="font-weight:800;font-size:19px">Daily History Quiz</div><p class="gm" style="margin:6px 0 0">20 questions · 15 seconds each · 50 points for finishing. One scored try a day.</p>'+(G.played?'<p>You scored <b>'+G.played.score+'/'+G.played.total+'</b> today (+'+G.played.points+' pts). Come back tomorrow for a new quiz.</p><button class="gbtn alt" data-gshare="1">Share my score</button>':'<button class="gbtn" data-gs="1">Start today’s quiz</button>')+'</div>';
shell(card+'<div id="gbd"><div class="gm">Loading boards…</div></div>',"Games","close");
var h=await boards(),b=g("gbd");if(b)b.innerHTML=h}
async function start(){
shell('<div class="gcard gm">Getting today’s questions…</div>',"Daily History Quiz","home");
var r=await sb.rpc("quiz_start");
if(r.error){var m=r.error.message||"";return msg(/already|played|once|limit/i.test(m)?"You have already played today. Come back tomorrow for a new quiz.":"Could not start the quiz: "+m)}
var qs=rows(r.data).map(norm).filter(function(q){return q.id!=null&&q.text&&Object.keys(q.opts).length>=2});
if(!qs.length)return msg("No quiz available right now. You may have already played today, or your time ran out. Come back tomorrow.");
G.qs=qs;G.i=0;G.ans={};G.lock=false;showQ()}
function showQ(){var q=G.qs[G.i];G.lock=false;
var opts=["a","b","c","d"].filter(function(k){return q.opts[k]!=null}).map(function(k){return'<button class="gopt" data-gp="'+k+'"><b>'+k.toUpperCase()+'</b><span>'+esc(q.opts[k])+'</span></button>'}).join("");
var o=ov();o.hidden=false;
o.innerHTML='<div class="gtop"><button class="gb" data-gx="quit" aria-label="Quit">✕</button><b>Question '+(G.i+1)+' of '+G.qs.length+'</b></div><div class="gbody"><div class="gbar"><i id="gmf"></i></div><div class="gq">'+esc(q.text)+'</div>'+opts+'</div>';
startTimer()}
function startTimer(keep){clearInterval(G.tm);if(!keep)G.t0=Date.now();
G.tm=setInterval(function(){var left=15000-(Date.now()-G.t0),f=g("gmf");
if(f){f.style.width=Math.max(0,left/150)+"%";if(left<5000)f.style.background="var(--red)"}
if(left<=0)pick(null)},100)}
function pick(k){if(G.lock)return;G.lock=true;clearInterval(G.tm);var q=G.qs[G.i];
if(k){G.ans[q.id]=k;var b=document.querySelector('[data-gp="'+k+'"]');if(b)b.classList.add("sel")}
setTimeout(function(){G.i++;if(G.i>=G.qs.length)submit();else showQ()},k?350:150)}
async function submit(){
clearInterval(G.tm);
shell('<div class="gcard gm">Marking your answers…</div>',"Daily History Quiz","home");
var r=await sb.rpc("quiz_submit",{p:G.ans});
if(r.error){return shell('<div class="gcard"><p>'+esc(r.error.message)+'</p><button class="gbtn" data-gretry="1">Try again</button></div>',"Daily History Quiz","home")}
var d=r.data;if(typeof d==="string"){try{d=JSON.parse(d)}catch(e){}}
if(Array.isArray(d))d=d[0];
G.res=d||{};result()}
function result(){var d=G.res,sc=+d.score||0,tot=+d.total||G.qs.length,pts=+d.points||0,late=!!d.late;
var rev=G.qs.map(function(q,n){var mine=G.ans[q.id],c=corr(d.answers,q.id),ok=c&&mine===c;
return'<div class="grev '+(c?(ok?"ok":"bad"):"")+'"><div class="gm">Question '+(n+1)+'</div><div class="gqs">'+esc(q.text)+'</div><div>Your answer: <b>'+(mine?esc(mine.toUpperCase()+". "+(q.opts[mine]||"")):"No answer")+'</b></div>'+(c&&!ok?'<div>Correct answer: <b>'+esc(c.toUpperCase()+". "+(q.opts[c]||""))+'</b></div>':"")+'</div>'}).join("");
shell('<div class="gcard gc"><div class="gscore">'+sc+'<small>/'+tot+'</small></div><div class="gm">'+(late?"Time ran out before you submitted, so no points this time.":"+"+pts+" points")+'</div><p>'+cheer(sc,tot)+'</p><button class="gbtn" data-gshare="1">Share my score</button><button class="gbtn alt" data-gx="home">View boards</button></div><div class="gsec">Review</div>'+rev,"Your result","home");
G.played={score:sc,total:tot,points:pts}}
function share(){var d=G.res||G.played||{},t="I scored "+(+d.score||0)+"/"+(+d.total||20)+" on today’s History Quiz on HIS Unical Hub"+(d.late?"":" and earned "+(+d.points||0)+" points")+". Can you beat me?\n"+location.origin+location.pathname;
if(navigator.share){navigator.share({text:t}).catch(function(){})}else{window.open("https://wa.me/?text="+encodeURIComponent(t),"_blank")}}
document.addEventListener("click",function(e){var b=e.target.closest("[data-games],[data-gx],[data-gp],[data-gs],[data-gshare],[data-gretry]");if(!b)return;var d=b.dataset;
if(d.games!=null){if(!me)return;if(typeof menu==="function")menu(false);home()}
else if(d.gp){pick(d.gp)}
else if(d.gs){start()}
else if(d.gshare){share()}
else if(d.gretry){submit()}
else if(d.gx==="close"){ov().hidden=true}
else if(d.gx==="home"){clearInterval(G.tm);home()}
else if(d.gx==="quit"){var el=Date.now()-G.t0;clearInterval(G.tm);
if(confirm("Quit the quiz? Your try for today may be lost.")){G.lock=true;home()}
else{G.t0=Date.now()-el;if(!G.lock)startTimer(true)}}});
function inject(){var d=g("drw");if(!d||d.querySelector("[data-games]"))return;
var btn=document.createElement("button");btn.className="mi";btn.setAttribute("data-games","1");btn.innerHTML=ic("game",0,24)+"Games";
var old=[].slice.call(d.querySelectorAll(".mi")).filter(function(x){return /Games/.test(x.textContent)})[0];
if(old){old.replaceWith(btn)}else{var out=d.querySelector("[data-out]");if(out)out.parentNode.insertBefore(btn,out);else d.appendChild(btn)}}
if(typeof window.drw==="function"){var od=window.drw;window.drw=function(){od.apply(this,arguments);inject()}}
setInterval(function(){inject();if(!me){var o=g("gm");if(o&&!o.hidden){clearInterval(G.tm);o.hidden=true}}},1500);
})();
