const routes = [
    { path: '/', module: '/pages/main/script.js' },
    { path: '/profile', module: '/pages/profile/script.js' },
    { path: '/profile/:username', module: '/pages/profile/script.js' },
    { path: '/settings', module: '/pages/settings/script.js' },
    { path: '/register', module: '/pages/register/script.js' },
    { path: '/login', module: '/pages/login/script.js' },
    { path: '/upload', module: '/pages/upload/script.js' },
    { path: '/file-manager', module: '/pages/file-manager/script.js' },
    { path: '/file-manager/:fileID', module: '/pages/file-manager/script.js' },
    { path: '/post-master', module: '/pages/postmaster/script.js' },
    { path: '/post-master/:postID', module: '/pages/postmaster/script.js' },
    { path: '/post/:postID', module: '/pages/postView/script.js' },
    { path: '/search', module: '/pages/search/script.js' },
]

export default routes