const CACHE='rnf-v016';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg'];

const STOCK_URL='https://docs.google.com/spreadsheets/d/1xk117VgTqn1DrLXwZocTwLzudUaIwsGLVlK439uywxg/edit#gid=2034337610';

function enhanceCockpit(html){
  if(!html || html.includes('<b>Stock CFA</b>')) return html;

  const athenaTile='<button onclick="toggleAthena()"><span>A</span><b>Athéna</b></button>';
  const stockTile='<button onclick="open(\''+STOCK_URL+'\')"><span>📦</span><b>Stock CFA</b><div class="muted small">Carcasses · QR · photos</div></button>';

  html=html.replace(athenaTile,stockTile+athenaTile);
  html=html.replace('v0.15 web','v0.16 web');
  html=html.replace('v0.15 web : suivi de budget BTM en lecture de synthèse.','v0.16 web : suivi de budget BTM + accès Stock CFA.');
  return html;
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const isNavigation = event.request.mode === 'navigate' || event.request.destination === 'document';

  if(isNavigation){
    event.respondWith(
      fetch(event.request,{cache:'no-store'})
        .then(async response => {
          const html=enhanceCockpit(await response.text());
          const transformed=new Response(html,{
            status:response.status,
            statusText:response.statusText,
            headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}
          });
          const copy=transformed.clone();
          caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
          return transformed;
        })
        .catch(async()=>{
          const cached=await caches.match(event.request)||await caches.match('./index.html');
          if(!cached) return new Response('Cockpit indisponible',{status:503});
          const html=enhanceCockpit(await cached.text());
          return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8'}});
        })
    );
    return;
  }

  event.respondWith(
    fetch(event.request,{cache:'no-store'})
      .then(response=>{
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
        return response;
      })
      .catch(()=>caches.match(event.request))
  );
});