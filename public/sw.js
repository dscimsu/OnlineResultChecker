//service worker is event driven

self.addEventListener('install', function (event) {
    console.log('sw installed');
    event.waitUntil(
        caches.open('static')
            .then(function (cache) {
                // cache.add('/');
                // cache.add('/index.html');
                // cache.add('/js/app.js');
                cache.addAll([
                    '/',
                    '/contact',
                    '/about',
                    '/university/signup',
                    '/university/signin',
                    '/university/app',
                    '/manifest.json',
                    '/img/result.png',
                    '/img/404.png',
                    '/img/index.svg',
                    '/img/intro-img.svg',
                    '/img/intro-bg.png',
                    '/img/about-img.svg',
                    '/js/app.js',
                    '/css/style.css',
                    '/img/icons/app-icon-144X144.png',
                    '/img/logo.png',
                    '/lib/bootstrap/css/bootstrap.css',
                    '/lib/font-awesome/css/font-awesome.min.css',
                    '/lib/animate/animate.min.css',
                    '/lib/ionicons/css/ionicons.min.css',
                    '/lib/owlcarousel/assets/owl.carousel.min.css',
                    '/lib/lightbox/css/lightbox.min.css',
                    'https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,700,700i|Montserrat:300,400,500,700',
                    '/lib/jquery/jquery.min.js',
                    '/lib/jquery/jquery-migrate.min.js',
                    '/lib/bootstrap/js/bootstrap.bundle.min.js',
                    '/lib/easing/easing.min.js',
                    '/lib/mobile-nav/mobile-nav.js',
                    '/lib/wow/wow.min.js',
                    '/lib/waypoints/waypoints.min.js',
                    '/lib/counterup/counterup.min.js',
                    '/lib/owlcarousel/owl.carousel.min.js',
                    '/lib/isotope/isotope.pkgd.min.js',
                    '/lib/lightbox/js/lightbox.min.js',
                    '/js/main.js',
                    '/js/contactform.js'

                ]);

            })

    );

});


self.addEventListener('activate', function () {
    console.log('sw Activated');
});

self.addEventListener('fetch', function (event) {
    console.log('fetching');
    event.respondWith(
        caches.match(event.request)
            .then(function (res) {
                if (res) {
                    return res;
                } else {
                    return fetch(event.request);
                }
            })
    );
});