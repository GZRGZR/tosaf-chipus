(()=>{if(window.top!==window)return;const SOURCE="AI";const h=location.hostname;
const source=SOURCE==="AI"?(/chatgpt\.com|chat\.openai\.com/.test(h)?"chatgpt":/gemini\.google\.com/.test(h)?"gemini":/aistudio\.google\.com/.test(h)?"aistudio":/claude\.ai/.test(h)?"claude":"web"):"web";
const bad=["mail.google.com","drive.google.com","docs.google.com","web.whatsapp.com","bankhapoalim.co.il","leumi.co.il"];if(bad.some(x=>h===x||h.endsWith("."+x)))return;
let last="",timer,root=null,observer=null,lastUrl=location.href;
function findRoot(){for(const s of["main","article",'[role="main"]']){const e=document.querySelector(s);if(e?.innerText?.trim())return e}return document.body}
function grab(){const e=findRoot();return e?.innerText?.trim()||""}
function collect(){timer=0;if(location.href!==lastUrl){lastUrl=location.href;last=""}const text=grab();if(!text||text===last)return;last=text;chrome.runtime.sendMessage({type:"saveDoc",doc:{id:"page:"+location.origin+location.pathname,source,title:document.title||h,url:location.href,text:text.slice(0,180000),visitedAt:Date.now(),kind:"page"}}).catch(()=>{})}
function schedule(){if(timer)return;timer=setTimeout(()=>{requestIdleCallback?requestIdleCallback(collect,{timeout:1200}):collect()},3000)}
function attach(){const next=findRoot();if(!next||next===root)return;observer?.disconnect();root=next;observer=new MutationObserver(schedule);observer.observe(root,{subtree:true,childList:true,characterData:true})}
function boot(){attach();collect();setTimeout(attach,1200);setTimeout(attach,3000);setTimeout(attach,6000)}
boot();
})();