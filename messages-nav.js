(function(){
var st=document.createElement("style");
st.textContent=`
#mbtn{display:none!important}
#nbell{margin-left:auto!important}
#nv .nbadge{position:absolute;top:4px;left:calc(50% + 6px);min-width:17px;height:17px;padding:0 4px;border-radius:9px;background:var(--red);color:#fff;font-size:10.5px;font-weight:800;display:grid;place-items:center;line-height:1}
`;
document.head.appendChild(st);

function sync(){
  var src=$("mbadge"),b=document.querySelector("#nv .nbadge");
  if(!b)return;
  if(src&&!src.hidden&&src.textContent){b.hidden=false;b.textContent=src.textContent}
  else b.hidden=true;
}

function patch(){
  var n=document.querySelector('#nv [data-v="me"]');
  if(!n)return;
  n.removeAttribute("data-v");
  n.setAttribute("data-m","1");
  n.setAttribute("aria-current","false");
  n.innerHTML=ic("mail",0,22)+'Messages<span class="nbadge" hidden></span>';
  sync();
}

var or=window.render;
if(typeof or==="function"){
  window.render=function(){
    var r=or.apply(this,arguments);
    patch();
    return r;
  };
}
setInterval(sync,1500);
patch();
})();
