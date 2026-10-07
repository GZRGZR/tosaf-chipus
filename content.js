(()=>{if(window.top!==window)return;if(window.__AI_SEARCH_INJECTED__)return;window.__AI_SEARCH_INJECTED__=true;
const h=location.hostname;
const source=/chatgpt\.com|chat\.openai\.com/.test(h)?"chatgpt":/gemini\.google\.com/.test(h)?"gemini":/aistudio\.google\.com/.test(h)?"aistudio":/claude\.ai/.test(h)?"claude":"web";
const AI_PREFIX={chatgpt:"GPT",gemini:"GEMINI",aistudio:"AISTUDIO",claude:"CLAUDE"};
function decorateAiTitle(){if(!AI_PREFIX[source])return;let t=String(document.title||"").trim();if(!t)return;const p=AI_PREFIX[source];const re=source==="chatgpt"?/^(?:GPT|CHATGPT)\s*-\s*/i:new RegExp("^"+p+"\\s*-\\s*","i");t=t.replace(re,"").trim();document.title=p+"- "+t;}
let last="",timer=0,root=null,observer,lastUrl=location.href,delay=2500;
const CANDIDATES=["article","main",'[role="main"]','[itemprop="articleBody"]',"#content",".p-body-main",".article-body",".entry-content",".post-content"];
const REMOVE="nav,header,footer,aside,form,script,style,noscript,svg,button,[role=navigation],[role=banner],[role=contentinfo],[role=complementary]";
function rootScore(e){let t="";try{t=(e.innerText||"").trim()}catch{return-1}if(t.length<200)return-1;let links=0;try{for(const a of e.querySelectorAll("a"))links+=(a.innerText||"").trim().length}catch{}const ratio=Math.min(1,links/Math.max(1,t.length));let bonus=e.tagName==="ARTICLE"?7000:e.tagName==="MAIN"?5000:0;return Math.min(t.length,60000)*(1-ratio*.7)+bonus}
function findRoot(){let best=null,bestScore=-1;for(const sel of CANDIDATES){for(const e of document.querySelectorAll(sel)){const s=rootScore(e);if(s>bestScore){best=e;bestScore=s}}}return best||document.body}
function cleanedBodyText(){const clone=document.body.cloneNode(true);clone.querySelectorAll(REMOVE).forEach(e=>e.remove());return(clone.innerText||"").trim()}
function grab(){if(!root)root=findRoot();if(root===document.body)return cleanedBodyText();return(root.innerText||"").trim()}
function collect(){timer=0;decorateAiTitle();if(location.href!==lastUrl){lastUrl=location.href;last=""}const text=grab();if(!text||text===last)return;last=text;chrome.runtime.sendMessage({type:"saveDoc",doc:{id:"page:"+location.origin+location.pathname+location.search,source,title:document.title||h,url:location.href,text:text.slice(0,180000),visitedAt:Date.now(),kind:"page"}}).catch(()=>{})}
function schedule(ms=delay){if(timer)return;timer=setTimeout(()=>{if(typeof requestIdleCallback==="function")requestIdleCallback(collect,{timeout:1200});else collect()},ms)}
function attach(){const next=findRoot();if(!next||next===root)return;observer?.disconnect();root=next;observer=new MutationObserver(()=>schedule());observer.observe(root,{subtree:true,childList:true,characterData:true})}
function stateAndStart(){chrome.runtime.sendMessage({type:"getIndexPolicy",source,url:location.href}).then(s=>{if(!s.active||s.blocked)return;if(source==="web")delay=Math.max(5000,Math.min(120000,Number(s.delaySec||25)*1000));else delay=2500;boot()}).catch(()=>{})}
function boot(){decorateAiTitle();attach();schedule(source==="web"?delay:1800);setTimeout(attach,1200);setTimeout(attach,3000);setTimeout(attach,6000)}
stateAndStart();
setInterval(()=>{decorateAiTitle();if(location.href!==lastUrl){lastUrl=location.href;last="";clearTimeout(timer);timer=0;attach();schedule(source==="web"?delay:1800)}},3000);
chrome.runtime.onMessage.addListener((m,s,send)=>{if(m.type==="getPageContext"){send({ok:true,title:document.title||"",url:location.href,content:grab().slice(0,50000)});return true}});
})();