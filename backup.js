import {dbAll,dbPagesAll,dbReadLaterAll,dbFixedSitesAll} from "./db.js";
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
  chrome.runtime.sendMessage({type:"backupReady"}).catch(()=>{});
  if(message?.type!=="runBackup")return;
  (async()=>{
    const [docs,pages,readLaterFromDb,fixedSitesFromDb,settingsResult]=await Promise.all([dbAll(),dbPagesAll(),dbReadLaterAll(),dbFixedSitesAll(),chrome.runtime.sendMessage({type:"getBackupSettings"})]);
    if(!settingsResult?.ok)throw new Error(settingsResult?.error||"לא ניתן לקרוא הגדרות גיבוי");
    const readLater=readLaterFromDb.length?readLaterFromDb:settingsResult.readLaterBackup;
    const fixedSites=fixedSitesFromDb.length?fixedSitesFromDb:settingsResult.fixedSitesBackup;
    const backup={format:"tosaf-chipus-backup",version:1,createdAt:new Date().toISOString(),data:{docs,pages,readLater,fixedSites},settings:settingsResult.settings};
    const blob=new Blob([JSON.stringify(backup)],{type:"application/json;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    try{
      const now=new Date(),day=[now.getFullYear(),String(now.getMonth()+1).padStart(2,"0"),String(now.getDate()).padStart(2,"0")].join("-");
      for(const filename of ["Tosaf Chipus Backups/latest.json","Tosaf Chipus Backups/daily/tosaf-chipus-"+day+".json"]){
        const result=await chrome.runtime.sendMessage({type:"downloadBackup",url,filename});
        if(!result?.ok)throw new Error(result?.error||"Chrome לא הצליח לשמור "+filename);
      }
      return {ok:true,docs:docs.length,pages:pages.length,readLater:readLater.length,fixedSites:fixedSites.length};
    }finally{URL.revokeObjectURL(url)}
  })().then(sendResponse).catch(error=>sendResponse({ok:false,error:String(error?.message||error)}));
  return true;
});