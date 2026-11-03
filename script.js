(function(){
  var root=document.documentElement,reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $=function(i){return document.getElementById(i)};
  var NS="http://www.w3.org/2000/svg";

  /* boot */
  var boot=$("boot"),bl=$("bl"),lines=["> initialising ashlesha.dhungel","> loading networking modules... ok","> loading security modules... ok","> loading diplomacy modules... ok","> system online"],bi=0,bt;
  function typeLine(){if(bi<lines.length){var d=document.createElement("div");d.textContent=lines[bi++];bl.appendChild(d);bt=setTimeout(typeLine,reduce?0:330)}else{bt=setTimeout(enter,2600)}}
  function enter(){clearTimeout(bt);boot.classList.add("off");document.removeEventListener("keydown",enter)}
  boot.addEventListener("click",enter);document.addEventListener("keydown",enter);typeLine();

  /* hero canvas */
  var cv=$("bg"),cx=cv.getContext("2d"),W,H,pts=[],mouse={x:-999,y:-999},acc="#3ec6ff";
  function size(){var r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);var n=Math.round(Math.min(70,W*H/16000));pts=[];for(var i=0;i<n;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35})}
  function hex(a){return a}
  function draw(){
    var cs=getComputedStyle(root);acc=cs.getPropertyValue("--a").trim();var ln=cs.getPropertyValue("--line").trim();
    cx.clearRect(0,0,W,H);
    for(var i=0;i<pts.length;i++){var p=pts[i];if(!reduce){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1}
      for(var j=i+1;j<pts.length;j++){var q=pts[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy);if(d<130){cx.strokeStyle=ln;cx.globalAlpha=1-d/130;cx.lineWidth=1;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}}
      var mx=p.x-mouse.x,my=p.y-mouse.y,md=Math.sqrt(mx*mx+my*my);
      if(md<170){cx.strokeStyle=acc;cx.globalAlpha=1-md/170;cx.lineWidth=1.2;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(mouse.x,mouse.y);cx.stroke()}
      cx.globalAlpha=1;cx.fillStyle=md<170?acc:ln;cx.beginPath();cx.arc(p.x,p.y,md<170?3:2,0,6.3);cx.fill()}
    cx.globalAlpha=1;if(!reduce)requestAnimationFrame(draw)}
  size();draw();addEventListener("resize",function(){size();if(reduce)draw()});
  cv.parentNode.addEventListener("pointermove",function(e){var r=cv.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;if(reduce)draw()});
  cv.parentNode.addEventListener("pointerleave",function(){mouse.x=mouse.y=-999});

  /* project map */
  var P=[
    {n:"Network",t:"Small office network",d:"Routers, switches and end devices, designed and simulated.",g:["Cisco Packet Tracer","TCP/IP","LAN"],x:120,y:70},
    {n:"Gym app",t:"Gym attendance system",d:"Records check-ins and tracks attendance.",g:["Java","OOP"],x:120,y:350},
    {n:"Inventory",t:"Product management system",d:"Product records and inventory operations.",g:["Python"],x:320,y:40},
    {n:"Websites",t:"Websites",d:"Built from scratch with HTML, CSS and JavaScript.",g:["HTML","CSS","JavaScript"],x:520,y:70},
    {n:"GCMUN",t:"GCMUN content strategy",d:"Instagram content guided by basic analytics.",g:["Content","Analytics"],x:520,y:350}
  ];
  var L=$("links"),N=$("nodes"),pkt=$("pkt"),sel=-1,els=[];
  P.forEach(function(p,i){
    var l=document.createElementNS(NS,"line");l.setAttribute("x1",320);l.setAttribute("y1",210);l.setAttribute("x2",p.x);l.setAttribute("y2",p.y);l.setAttribute("class","link");L.appendChild(l);
    var g=document.createElementNS(NS,"g");g.setAttribute("class","node");g.setAttribute("tabindex","0");g.setAttribute("role","button");g.setAttribute("aria-label",p.t);
    g.innerHTML='<rect x="'+(p.x-62)+'" y="'+(p.y-24)+'" width="124" height="48" rx="8"/><text x="'+p.x+'" y="'+(p.y+5)+'">'+p.n+"</text>";
    g.addEventListener("click",function(){pick(i)});
    g.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();pick(i)}});
    N.appendChild(g);els.push({g:g,l:l})});
  function send(p){if(reduce)return;var t0=null;pkt.style.opacity=1;(function f(ts){if(!t0)t0=ts;var k=Math.min((ts-t0)/600,1);pkt.setAttribute("cx",320+(p.x-320)*k);pkt.setAttribute("cy",210+(p.y-210)*k);if(k<1)requestAnimationFrame(f);else pkt.style.opacity=0})(performance.now())}
  function pick(i){
    sel=i;var p=P[i];els.forEach(function(e,j){e.g.classList.toggle("on",j===i);e.l.classList.toggle("on",j===i)});
    $("dn").textContent="connected: "+p.n.toLowerCase();$("dt").textContent=p.t;$("dd").textContent=p.d;
    $("dg").innerHTML=p.g.map(function(x){return"<span>"+x+"</span>"}).join("");send(p)}
  pick(0);

  /* modes */
  var words={engineer:"engineering",diplomat:"diplomacy"};
  function setMode(m){
    root.dataset.mode=m;$("word").textContent=words[m];
    document.querySelectorAll(".seg button").forEach(function(b){b.setAttribute("aria-selected",b.dataset.m===m)});
    ["engineer","diplomat"].forEach(function(k){$("p-"+k).hidden=k!==m});if(reduce)draw()}
  document.querySelectorAll(".seg button").forEach(function(b){b.addEventListener("click",function(){setMode(b.dataset.m)})});

  /* terminal */
  var term=$("term"),out=$("out"),cmd=$("cmd"),hist=[],hi=0;
  function print(t,c){var d=document.createElement("div");if(c)d.className=c;d.textContent=t;out.appendChild(d);out.scrollTop=out.scrollHeight}
  function toggle(open){var o=open===undefined?!term.classList.contains("open"):open;term.classList.toggle("open",o);term.setAttribute("aria-hidden",!o);$("tbtn").setAttribute("aria-expanded",o);if(o){if(!out.children.length)print("Type help to see commands.");setTimeout(function(){cmd.focus()},50)}else cmd.blur()}
  var C={
    help:function(){return"whoami  skills  projects  edu  certs  contact\nmode engineer | mode diplomat\nclear  exit"},
    whoami:function(){return"Ashlesha Dhungel. Networking & IT Security student at Islington College. I lead debates, conferences and teams."},
    skills:function(){return"TCP/IP, LAN/WAN, Cisco Packet Tracer, Java, Python, C, HTML/CSS/JS, Windows, Linux"},
    projects:function(){return P.map(function(p){return"- "+p.t}).join("\n")},
    edu:function(){return"Islington College, BSc Networking & IT Security (2024 – present)\nGlobal College of Management, +2 (2022 – 2024)"},
    certs:function(){return"AWS Academy Cloud Foundations (2026)\nLinkedIn Learning Java OOP (2025)\nGoogle Digital Garage (2022)"},
    contact:function(){return"ashlesha.dhun@gmail.com\n+977 9848801802"},
    clear:function(){out.innerHTML="";return null},
    exit:function(){toggle(false);return null}
  };
  $("tf").addEventListener("submit",function(e){
    e.preventDefault();var v=cmd.value.trim();cmd.value="";if(!v)return;hist.push(v);hi=hist.length;print("$ "+v,"c");
    var l=v.toLowerCase(),r;
    if(l.indexOf("mode ")===0){var m=l.slice(5);if(words[m]){setMode(m);r="mode: "+m}else r="usage: mode engineer | mode diplomat"}
    else if(C[l])r=C[l]();else r="command not found: "+v+". Type help.";
    if(r)print(r)});
  cmd.addEventListener("keydown",function(e){if(e.key==="ArrowUp"&&hist.length){hi=Math.max(0,hi-1);cmd.value=hist[hi];e.preventDefault()}else if(e.key==="ArrowDown"){hi=Math.min(hist.length,hi+1);cmd.value=hist[hi]||"";e.preventDefault()}});
  $("tbtn").addEventListener("click",function(){toggle()});$("tbtn2").addEventListener("click",function(){toggle(true)});
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"&&term.classList.contains("open"))toggle(false);
    else if(e.key==="`"&&e.target!==cmd&&boot.classList.contains("off")){e.preventDefault();toggle()}});

  /* layout + theme controls */
  function store(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  function load(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function setView(m){
    root.classList.toggle("m",m==="mobile");
    $("vpc").setAttribute("aria-pressed",m!=="mobile");$("vmo").setAttribute("aria-pressed",m==="mobile");
    store("view",m);dispatchEvent(new Event("resize"))}
  $("vpc").addEventListener("click",function(){setView("pc")});
  $("vmo").addEventListener("click",function(){setView("mobile")});
  var lightMQ=matchMedia("(prefers-color-scheme: light)");
  function curTheme(){return root.dataset.theme||(lightMQ.matches?"light":"dark")}
  function themeBtn(){var t=curTheme();$("thbtn").textContent=t==="light"?"\u263E":"\u2600";$("thbtn").setAttribute("aria-label","Switch to "+(t==="light"?"dark":"light")+" mode")}
  function setTheme(t){root.dataset.theme=t;store("theme",t);themeBtn();if(reduce)draw()}
  $("thbtn").addEventListener("click",function(){setTheme(curTheme()==="light"?"dark":"light")});
  var st=load("theme");if(st==="light"||st==="dark")root.dataset.theme=st;
  themeBtn();
  if(load("view")==="mobile")setView("mobile");
})();