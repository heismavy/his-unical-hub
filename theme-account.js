(function(){
var el=document.documentElement,last=null;
function key(id){return "hub-theme-"+id}
function apply(id){
  var v=null;
  try{v=localStorage.getItem(key(id))}catch(e){}
  if(v)el.setAttribute("data-theme",v);else el.removeAttribute("data-theme");
}
document.addEventListener("click",function(e){
  if(!e.target.closest("[data-thm]")||!me)return;
  try{localStorage.setItem(key(me.id),el.getAttribute("data-theme")||"")}catch(x){}
});
setInterval(function(){
  if(!me){if(last){last=null;el.removeAttribute("data-theme")}return}
  if(me.id!==last){last=me.id;apply(me.id);if(typeof drw==="function")drw()}
},500);
})();
