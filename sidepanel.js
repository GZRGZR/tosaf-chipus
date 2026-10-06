const $=id=>document.getElementById(id);
let docs={}; let settings={};
chrome.runtime.sendMessage({type:"getState"}).then(s=>{docs=s.docs;settings=s.settings; renderCount();});
$("settings").onclick=()=>chrome.runtime.openOptionsPage();
$("clear").onclick=async()=>{if(confirm("למחוק את כל האינדקס המקומי?")){await chrome.runtime.sendMessage({type:"clear"});docs={};render([]);}};
$("go").onclick=search; $("q").onkeydown=e=>{if(e.key==="Enter")search();};
function terms(q){return q.toLowerCase().replace(/[\u0590-\u05ff]/g," $& ").split(/\s+/).filter(x=>x.length>1);}
function parse(q){const phrases=[...q.matchAll(/"([^"]+)"/g)].map(x=>x[1].toLowerCase());const clean=q.replace(/"[^"]+"/g," ");const neg=clean.match(/-\S+/g)?.map(x=>x.slice(1).toLowerCase())||[];return {phrases,neg,terms:terms(clean).filter(x=>!x.startsWith("-")&& !/^(in|after|before):/.test(x))};}
function score(d,p){const hay=(d.title+"\n"+d.text+"\n"+d.url).toLowerCase(); if(p.phrases.some(x=>!hay.includes(x)))return -1;if(p.neg.some(x=>hay.includes(x)))return -1;let n=0;for(const t of p.terms)if(hay.includes(t))n+=t.length>4?2:1;if(d.title.toLowerCase().includes(p.terms.join(" ")))n+=5;return n;}
async function search(){let q=$("q").value.trim();if(!q)return;let query=q;
if($("smart").checked){const s=await chrome.runtime.sendMessage({type:"getState"});if(s.settings.geminiEnabled&&s.settings.geminiKey){try{query=await expandWithGemini(q,s.settings.geminiKey)}catch(e){console.warn(e)}}}
const p=parse(query), f=$("filter").value;
const arr=Object.values(docs).filter(d=>!f||d.source===f).map(d=>({...d,_score:score(d,p)})).filter(d=>d._score>=0).sort((a,b)=>b._score-a._score||b.visitedAt-a.visitedAt).slice(0,100);
render(arr,q);
}
async function expandWithGemini(q,key){const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":key},body:JSON.stringify({contents:[{parts:[{text:"Return JSON only: {\"queries\":[string]}. Expand this search query with Hebrew/English synonyms and related technical terms. Do not answer the question. Query: "+q}]}],generationConfig:{responseMimeType:"application/json"}})});if(!r.ok)throw Error("Gemini "+r.status);const j=await r.json();const x=JSON.parse(j.candidates?.[0]?.content?.parts?.[0]?.text||"{}");return [q,...(x.queries||[])].join(" "); }
function render(arr,q=""){const root=$("results");root.innerHTML="";if(!arr.length){root.innerHTML='<div class="empty">לא נמצאו תוצאות</div>';return}for(const d of arr){const el=document.createElement("div");el.className="result";const snippet=(d.text||"").replace(/\s+/g," ").slice(0,500);el.innerHTML='<div class="meta">'+esc(d.source)+' · '+new Date(d.visitedAt||d.updatedAt||Date.now()).toLocaleString("he-IL")+'</div><div class="title">'+esc(d.title)+'</div><div class="snippet">'+esc(snippet)+'</div><div class="row"><button class="open">פתח</button><button class="del">הסר</button></div>';el.querySelector(".open").onclick=()=>chrome.tabs.create({url:d.url});el.querySelector(".del").onclick=async()=>{await chrome.runtime.sendMessage({type:"deleteDoc",id:d.id});delete docs[d.id];search()};root.appendChild(el)}}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function renderCount(){ $("q").placeholder="חיפוש ב-"+Object.keys(docs).length+" פריטים…"; }