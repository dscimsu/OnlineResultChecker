//service worker is event driven

self.addEventListener('install', function(event){
    console.log('sw installed');
    event.waitUntil(
        caches.open('static')
            .then(function (cache) {
                // cache.add('/');
                // cache.add('/index.html');
                // cache.add('/js/app.js');
                cache.addAll([
                    '/',
                    '../views/index.ejs',
                    '/about.ejs',
                    '/contact.ejs',
                    '/404.ejs',
                    
                ]);

            })

    );

});


self.addEventListener('activate', function (){
    console.log('sw Activated');
});

self.addEventListener('fetch', function (event){
    console.log('fetching');
    event.respondWith(
        caches.match(event.request)
        .then(function(res){
            if (res){
                return res;
            }else{
                return fetch(event.request);
            }
        })
    );
});