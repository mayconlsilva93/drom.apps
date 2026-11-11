/* DROM · DJ Cenoura — cache offline + notificações push */
var C="drom-cenoura173-v4";
self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
 e.respondWith(fetch(e.request).then(r=>{if(r.ok){var c=r.clone();caches.open(C).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})))});
self.addEventListener("push",e=>{var d={};try{d=e.data.json()}catch(x){d={t:"DROM",b:e.data?e.data.text():""}}
 if(d.close){e.waitUntil(self.registration.getNotifications({tag:d.close}).then(l=>l.forEach(n=>n.close())));return}
 e.waitUntil(self.registration.showNotification(d.t||"DROM",{body:d.b||"",icon:"icon-192.png",badge:"badge.png",tag:d.tag||undefined,data:{url:"./"}}).then(()=>self.registration.getNotifications()).then(l=>{l.sort((a,b)=>(a.timestamp||0)-(b.timestamp||0));l.slice(0,Math.max(0,l.length-10)).forEach(n=>n.close())}))});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(l=>{for(var c of l){if(c.url.includes(self.registration.scope))return c.focus()}return clients.openWindow("./")}))});
