(() => {
  if (window.top !== window) return;
  const host = location.hostname;
  const source =
    /chatgpt\.com|chat\.openai\.com/.test(host) ? "chatgpt" :
    /gemini\.google\.com/.test(host) ? "gemini" :
    /aistudio\.google\.com/.test(host) ? "aistudio" :
    /claude\.ai/.test(host) ? "claude" : "web";

  const excluded = [
    "mail.google.com","drive.google.com","docs.google.com",
    "web.whatsapp.com","bankhapoalim.co.il","leumi.co.il"
  ];
  if (source === "web" && excluded.some(x => host === x || host.endsWith("." + x))) return;

  let last="";
  function mainText() {
    const selectors = ["main","article","[role=main]"];
    for (const s of selectors) {
      const el=document.querySelector(s);
      if (el?.innerText?.trim()) return el.innerText.trim();
    }
    return document.body?.innerText?.trim() || "";
  }
  function collect() {
    const text=mainText();
    const title=document.title || location.hostname;
    if (!text || text === last) return;
    last=text;
    chrome.runtime.sendMessage({
      type:"saveDoc",
      incognito: location.protocol === "chrome-extension:" ? false : undefined,
      source,
      doc:{
        source,title,url:location.href,text:text.slice(0,180000),
        visitedAt:Date.now()
      }
    });
  }
  setTimeout(collect,1800);
  let timer;
  new MutationObserver(()=>{ clearTimeout(timer); timer=setTimeout(collect,2500); })
    .observe(document.documentElement,{subtree:true,childList:true,characterData:true});
})();