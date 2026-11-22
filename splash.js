(function(){
var css='#splash{position:fixed;inset:0;z-index:999;background:radial-gradient(circle at 50% 38%,#3a2a0c 0,#120d06 62%);display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity .5s,transform .5s}'
+'#splash.out{opacity:0;transform:scale(1.04);pointer-events:none}'
+'#splash img{width:118px;height:118px;border-radius:50%;box-shadow:0 0 0 3px #e8a917,0 0 60px rgba(232,169,23,.45);animation:spin-in .9s cubic-bezier(.2,.8,.2,1) both,glow 2s ease-in-out .9s infinite}'
+'#splash .st{margin-top:22px;font:800 26px "Plus Jakarta Sans",system-ui,sans-serif;color:#f6eedc;letter-spacing:-.02em;animation:rise .7s .35s both}'
+'#splash .sf{position:absolute;bottom:calc(env(safe-area-inset-bottom,0px) + 34px);text-align:center;font:500 12px "Plus Jakarta Sans",system-ui,sans-serif;color:#a1957f;animation:rise .7s .8s both}'
+'#splash .sf b{display:block;font-size:17px;letter-spacing:.14em;text-transform:uppercase;color:#f2b93b;margin:2px 0 1px}'
+'@keyframes spin-in{from{opacity:0;transform:scale(.6) rotate(-12deg)}}'
+'@keyframes rise{from{opacity:0;transform:translateY(14px)}}'
+'@keyframes glow{50%{box-shadow:0 0 0 3px #e8a917,0 0 90px rgba(232,169,23,.7)}}'
+'@keyframes float{50%{transform:translateY(-8px)}}'
+'@keyframes drift{to{background-position:100% 100%}}'
+'.authing{background:#120d06!important}'
+'.authing::before{content:"";position:fixed;inset:0;height:auto;z-index:-1;background:radial-gradient(circle at 18% 18%,rgba(232,169,23,.6),transparent 42%),radial-gradient(circle at 85% 28%,rgba(198,47,35,.55),transparent 42%),radial-gradient(circle at 50% 90%,rgba(43,120,194,.5),transparent 45%),#120d06;background-size:140% 140%;animation:drift 14s ease-in-out infinite alternate}'
+'.authing #auth{margin:9vh auto 0;padding:30px 24px;border-radius:30px;background:rgba(255,255,255,.12);-webkit-backdrop-filter:blur(22px) saturate(140%);backdrop-filter:blur(22px) saturate(140%);border:1px solid rgba(255,255,255,.28);box-shadow:0 24px 60px rgba(0,0,0,.45);color:#fff;max-width:370px;width:calc(100% - 32px);animation:rise .7s .1s both}'
+'.authing #auth h1{color:#fff}'
+'.authing #auth .mt,.authing #auth label,.authing #auth .credit{color:rgba(255,255,255,.72)}'
+'.authing #auth input,.authing #auth select{background:rgba(255,255,255,.16);color:#fff;border:1px solid rgba(255,255,255,.22)}'
+'.authing #auth input::placeholder{color:rgba(255,255,255,.55)}'
+'.authing #auth select option{color:#17120a}'
+'.authing #auth input:focus,.authing #auth select:focus{border-color:#f2b93b;background:rgba(255,255,255,.22)}'
+'.authing #auth .btn{background:linear-gradient(135deg,#f2b93b,#e8a917);color:#1a1204;box-shadow:0 8px 22px rgba(232,169,23,.35)}'
+'.authing #auth .btn.alt{background:rgba(255,255,255,.16);color:#fff;box-shadow:none}'
+'.authing #auth .err{color:#ffb4ab}'
+'.authing #auth img{animation:float 4s ease-in-out infinite;box-shadow:0 0 0 3px #e8a917,0 12px 40px rgba(232,169,23,.4)}'
+'@media (prefers-reduced-motion:reduce){#splash,#splash *,.authing::before,.authing #auth,.authing #auth img{animation:none!important}}';
var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
var d=document.createElement("div");d.id="splash";
d.innerHTML='<img src="logo.png" alt="NAHISS-UCC logo"><div class="st">HIS Unical Hub</div><div class="sf">from<b>Vellouz Tech</b>by HEISMAVY</div>';
document.body.appendChild(d);
setTimeout(function(){d.classList.add("out")},2100);
setTimeout(function(){d.remove()},2700);
var a=document.getElementById("auth");
function sync(){document.body.classList.toggle("authing",!a.hidden)}
if(a){sync();new MutationObserver(sync).observe(a,{attributes:true,attributeFilter:["hidden"]})}
})();
