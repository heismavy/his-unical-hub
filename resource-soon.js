(function(){
function g(i){return document.getElementById(i)}
if(window.P&&!P.book)P.book='<path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3zM4 17a3 3 0 0 1 3-3h12"/>';
function inject(){var d=g("drw");if(!d||d.querySelector("[data-rr]"))return;
var b=document.createElement("button");b.className="mi";b.disabled=true;b.setAttribute("data-rr","1");
b.innerHTML=ic("book",0,24)+"Resource Room<span class='soon'>Soon</span>";
var out=d.querySelector("[data-out]");if(out)out.parentNode.insertBefore(b,out);else d.appendChild(b)}
if(typeof window.drw==="function"){var od=window.drw;window.drw=function(){od.apply(this,arguments);inject()}}
setInterval(inject,1500);
})();
