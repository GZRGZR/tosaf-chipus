const DEFAULTS = {
  docs: {},
  settings: {
    indexWeb: true,
    indexAi: true,
    privateMode: true,
    geminiEnabled: false,
    geminiKey: ""
  }
};

async function getState() {
  const s = await chrome.storage.local.get(DEFAULTS);
  return { docs: s.docs || {}, settings: { ...DEFAULTS.settings, ...(s.settings || {}) } };
}
async function saveDocs(docs) { await chrome.storage.local.set({ docs }); }

function sourceFor(url="") {
  try {
    const h = new URL(url).hostname;
    if (h.includes("chatgpt.com") || h.includes("chat.openai.com")) return "chatgpt";
    if (h.includes("gemini.google.com")) return "gemini";
    if (h.includes("aistudio.google.com")) return "aistudio";
    if (h.includes("claude.ai")) return "claude";
  } catch {}
  return "web";
}

chrome.runtime.onInstalled.addListener(async () => {
  const cur = await chrome.storage.local.get(DEFAULTS);
  await chrome.storage.local.set({
    settings: { ...DEFAULTS.settings, ...(cur.settings || {}) },
    docs: cur.docs || {}
  });
});

chrome.commands.onCommand.addListener(async command => {
  if (command !== "open-search") return;
  try { await chrome.sidePanel.open({ windowId: (await chrome.windows.getCurrent()).id }); } catch {}
});

chrome.history.onVisited.addListener(async item => {
  const { settings } = await getState();
  if (!settings.indexWeb || !item.url) return;
  const source = sourceFor(item.url);
  if (source !== "web" && !settings.indexAi) return;
  const docs = (await getState()).docs;
  const id = "history:" + item.id + ":" + item.lastVisitTime;
  docs[id] = {
    id, source, title: item.title || item.url, url: item.url,
    text: "", visitedAt: item.lastVisitTime || Date.now(), imported: true
  };
  await saveDocs(docs);
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    if (msg.type === "saveDoc") {
      const { settings } = await getState();
      if (sender.tab?.incognito || msg.incognito) return { ok:false, reason:"incognito" };
      if (msg.source !== "web" && !settings.indexAi) return { ok:false };
      if (msg.source === "web" && !settings.indexWeb) return { ok:false };
      const docs = (await getState()).docs;
      const id = msg.doc.id || (msg.source + ":" + msg.doc.url);
      docs[id] = { ...msg.doc, id, updatedAt: Date.now() };
      await saveDocs(docs);
      return { ok:true };
    }
    if (msg.type === "getState") return await getState();
    if (msg.type === "saveSettings") {
      const cur = await getState();
      await chrome.storage.local.set({ settings:{...cur.settings,...msg.settings} });
      return { ok:true };
    }
    if (msg.type === "deleteDoc") {
      const st = await getState(); delete st.docs[msg.id]; await saveDocs(st.docs); return {ok:true};
    }
    if (msg.type === "clear") {
      await chrome.storage.local.set({docs:{}}); return {ok:true};
    }
    if (msg.type === "searchHistory") {
      const items = await chrome.history.search({text: msg.text || "", startTime: msg.startTime, endTime: msg.endTime, maxResults: 10000});
      return {ok:true, items};
    }
    if (msg.type === "deleteHistory") {
      await chrome.history.deleteUrl({url: msg.url}); return {ok:true};
    }
    return {ok:false};
  })().then(sendResponse).catch(e=>sendResponse({ok:false,error:String(e)}));
  return true;
});