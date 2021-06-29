//install
self.addEventListener('install', event => {
        console.log('installing...');
});
self.addEventListener('activate', event => {
        console.log('now ready to handle fetches!');
});
self.addEventListener('fetch', event => {
        console.log('now fetch');
});
