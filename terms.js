(function(){
var TERMS=[
["About this app","HIS Unical Hub is an independent community app built for students and members of the Department of History and International Studies, University of Calabar. It is built and run by Vellouz Tech (HEISMAVY) and is not an official website of the University of Calabar."],
["You are responsible for what you post","Everything you post, comment or send is your own responsibility. Vellouz Tech and HEISMAVY do not write or approve what users post, and are not responsible for any slander, libel or false statements made by users, including statements about lecturers, departmental officials or other students."],
["Respect others","No harassment, bullying, threats or hate speech. Do not target anyone because of their tribe, religion, gender, level or background. No sexual or violent content."],
["Be truthful, do not impersonate","Do not spread rumours or false claims about people. Do not pretend to be someone else, especially a lecturer, an official or an exco member."],
["No exam malpractice","Do not share leaked exam questions or answers, or help anyone cheat. Notes and past questions meant for studying are welcome."],
["Keep sensitive information off the app","Do not share passwords, bank or ATM details, BVN, NIN, ID numbers, your home address or other private information, yours or anyone else. We take reasonable care, but no online service is completely safe. Vellouz Tech and HEISMAVY cannot promise there will never be a security breach, so do not post or send anything that would harm you if it leaked."],
["Your account","Choose a username and password and keep the password safe. There is no email recovery. If you forget your password, ask an admin to remove the account so you can register again. Your old posts may be lost."],
["What we keep","To make the app work we store your name, level, username, bio, photos you upload, posts, comments, likes, follows and messages. We do not collect your email or phone number and we do not sell your data."],
["Moderation","Admins can remove any post, comment or account that breaks these rules, with or without warning. If you see something that breaks the rules, tell an admin."],
["Notices","Posts under Notices come from admin or official accounts. Official accounts may be managed by the app admin."],
["Changes","These terms may be updated. By continuing to use the app you accept the updated terms."]
];

var st=document.createElement("style");
st.textContent=`
#tbox{display:flex;gap:10px;align-items:flex-start;margin-top:14px;text-align:left;font-size:13.5px;line-height:1.4;color:inherit}
#tbox input{width:20px;height:20px;padding:0;margin:1px 0 0;flex:none;accent-color:#e8a917}
#tbox label{display:inline;margin:0;font-size:13.5px;color:inherit}
#tlink{color:#e8a917;font-weight:800;text-decoration:underline;background:none;border:0;padding:0;font:inherit;cursor:pointer}
#tov{position:fixed;inset:0;z-index:200;background:var(--bg);color:var(--ink);overflow-y:auto;padding:calc(env(safe-area-inset-top,0px) + 16px) 20px calc(env(safe-area-inset-bottom,0px) + 30px)}
#tov .tw{max-width:520px;margin:0 auto;text-align:left}
#tov h2{font-size:22px;margin:0 0 4px;font-weight:800}
#tov h3{font-size:15px;margin:18px 0 4px;font-weight:800}
#tov p{margin:0;font-size:14.5px;line-height:1.5}
#tov .mute{color:var(--mute);font-size:12.5px}
`;
document.head.appendChild(st);

var box=document.createElement("div");
box.id="tbox";
box.innerHTML='<input type="checkbox" id="tchk"><span><label for="tchk">I agree to the </label><button type="button" id="tlink">Terms and Community Rules</button></span>';
var ab=$("ab");
ab.parentNode.insertBefore(box,ab);
box.hidden=!signup;

var oa=window.authMode;
if(typeof oa==="function"){
  window.authMode=function(){
    oa();
    box.hidden=!signup;
    if(!signup)$("tchk").checked=false;
  };
}

function showTerms(){
  var o=document.createElement("div");
  o.id="tov";
  o.innerHTML='<div class="tw"><h2>Terms and Community Rules</h2><div class="mute">HIS Unical Hub · Updated November 2026</div>'+
    TERMS.map(function(t,i){return '<h3>'+(i+1)+'. '+t[0]+'</h3><p>'+t[1]+'</p>'}).join("")+
    '<button type="button" class="btn" id="tclose">I understand</button></div>';
  document.body.appendChild(o);
  o.scrollTop=0;
}

document.addEventListener("click",function(e){
  if(e.target.id==="tlink")showTerms();
  else if(e.target.id==="tclose"){var o=$("tov");if(o)o.remove()}
});

document.addEventListener("submit",function(e){
  if(e.target.id!=="af"||!signup)return;
  if(!$("tchk").checked){
    e.preventDefault();
    e.stopPropagation();
    $("ar").textContent="Please tick the box to agree to the Terms and Community Rules.";
  }
},true);
})();
