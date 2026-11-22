(function(){
P.doc='<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6"/>';

var od=window.drw;
if(typeof od==="function"){
  window.drw=function(){
    od();
    var items=document.querySelectorAll("#drw .mi"),out=null;
    for(var i=0;i<items.length;i++){
      if(items[i].textContent.indexOf("Log out")===0)out=items[i];
    }
    var t=document.createElement("button");
    t.className="mi";
    t.setAttribute("data-terms","1");
    t.innerHTML=ic("doc",0,24)+"Terms and Rules";
    if(out)out.parentNode.insertBefore(t,out);else $("drw").appendChild(t);
  };
}

document.addEventListener("click",function(e){
  if(!e.target.closest("[data-terms]"))return;
  menu(false);
  var l=$("tlink");
  if(l)l.click();
});
})();
