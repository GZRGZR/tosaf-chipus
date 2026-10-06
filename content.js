(()=>{if(window.top!==window)return;
const h=location.hostname;
const source=/chatgpt\.com|chat\.openai\.com/.test(h)?"chatgpt":/gemini\.google\.com/.test(h)?"gemini":/aistudio\.google\.com/.test(h)?"aistudio":/claude\.ai/.test(h)?"claude":"web";
const blocked=["mail.google.com","drive.google.com","docs.google.com","web.whatsapp.com","bankhapoalim.co.il","leumi.co.il","discountbank.co.il","mizrahi-tefahot.co.il","first-int.co.il","onezerobank.com","max.co.il","cal-online.co.il","paypal.com","btl.gov.il","clalit.co.il","maccabi4u.co.il","meuhedet.co.il","leumit.co.il"];
if(source==="web"&&blocked.some(x=>h===x||h.endsWith("."+x)))return;
let last="",timer=0,root=null,observer,lastUrl=location.href,delay=2500;
function findRoot(){for(const s of["main","article",'[role="main"]']){const e=document.querySelector(s);if(e?.innerText?.trim())return e}return document.body}
function grab(){return findRoot()?.innerText?.trim()||""}
function collect(){timer=0;if(location.href!==lastUrl){lastUrl=location.href;last=""}const text=grab();if(!text||text===last)return;last=text;chrome.runtime.sendMessage({type:"saveDoc",doc:{id:"page:"+location.origin+location.pathname,source,title:document.title||h,url:location.href,text:text.slice(0,180000),visitedAt:Date.now(),kind:"page"}}).catch(()=>{})}
function schedule(ms=delay){if(timer)return;timer=setTimeout(()=>{if(typeof requestIdleCallback==="function")requestIdleCallback(collect,{timeout:1200});else collect()},ms)}
function attach(){const next=findRoot();if(!next||next===root)return;observer?.disconnect();root=next;observer=new MutationObserver(()=>schedule());observer.observe(root,{subtree:true,childList:true,characterData:true})}
function stateAndStart(){chrome.runtime.sendMessage({type:"getIndexPolicy",source}).then(s=>{if(!s.active)return;if(source==="web")delay=Math.max(5000,Math.min(120000,Number(s.delaySec||25)*1000));else delay=2500;boot()}).catch(()=>{})}
function boot(){attach();schedule(source==="web"?delay:1800);setTimeout(attach,1200);setTimeout(attach,3000);setTimeout(attach,6000)}
stateAndStart();
setInterval(()=>{if(location.href!==lastUrl){lastUrl=location.href;last="";clearTimeout(timer);timer=0;schedule(source==="web"?delay:1800)}},3000);
chrome.runtime.onMessage.addListener((m,s,send)=>{if(m.type==="getPageContext"){send({ok:true,title:document.title||"",url:location.href,content:grab().slice(0,50000)});return true}});
})();