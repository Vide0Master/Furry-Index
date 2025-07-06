import staticRoutes from '../staticVariables/routerRoutes.js';

class Router {
    static routes = [...staticRoutes];
    static cache = new Map();
    static containerSelector = 'main';
    static container = null;
    static _initialized = false;

    static init() {
        if (this._initialized) return;
        this._initialized = true;

        this.container = document.querySelector(this.containerSelector);
        if (!this.container) throw new Error(`Container ${this.containerSelector} not found`);

        this._bindEvents();
        this._loadRoute(window.location.pathname + window.location.search);
    }

    static _bindEvents() {
        document.addEventListener('click', async (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const isExternal = link.hasAttribute('external');
            const isInternal = link.hasAttribute('internal') || !isExternal;

            if (isInternal) {
                const href = link.getAttribute('href');
                if (href.startsWith('http') || href.startsWith('//')) return;

                e.preventDefault();
                await this.navigate(href);
            }
        });

        document.addEventListener('mouseover', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const isExternal = link.hasAttribute('external');
            const isInternal = link.hasAttribute('internal') || !isExternal;

            if (isInternal) {
                const href = link.getAttribute('href');
                if (!href.startsWith('http') && !href.startsWith('//')) {
                    this.preload(href);
                }
            }
        });

        window.addEventListener('popstate', () => {
            this._loadRoute(window.location.pathname + window.location.search);
        });
    }

    static addRoute(path, modulePath) {
        this.init();

        const index = this.routes.findIndex(route => route.path === path);
        if (index >= 0) {
            this.routes[index].module = modulePath;
        } else {
            this.routes.push({ path, module: modulePath });
        }
    }

    static async navigate(path) {
        this.init();
        if (window.location.pathname + window.location.search !== path) {
            window.history.pushState({}, '', path);
            await this._loadRoute(path);
        }
        this.cache.clear()
    }

    static async preload(path) {
        const { pathname } = new URL(path, window.location.origin);
        const match = this._matchRoute(pathname);
        if (!match) return;

        const cached = this.cache.get(path);
        const now = Date.now();

        if (cached && now - cached.timestamp < 60000) return;

        try {
            const pageModule = await import(match.route.module);
            if (typeof pageModule.render !== 'function') {
                console.warn(`Module ${match.route.module} does not export render()`);
                return;
            }

            match.params.query = this._parseQuery(path);
            const content = await pageModule.render(match.params);
            const tag = typeof pageModule.tag === 'string' ? pageModule.tag : 'default';
            const tagLimit = typeof pageModule.tagLimit === 'number' ? pageModule.tagLimit : 3;

            this._addToCache(path, { content, tag, timestamp: now }, tagLimit);
        } catch (err) {
            console.error(`Failed to preload ${match.route.module}`, err);
        }
    }

    static _addToCache(path, pageData, tagLimit = 3) {
        const tag = pageData.tag;

        const cachedWithTag = [...this.cache.entries()]
            .filter(([_, data]) => data.tag === tag)
            .sort((a, b) => a[1].timestamp - b[1].timestamp);

        if (cachedWithTag.length >= tagLimit) {
            const oldestPath = cachedWithTag[0][0];
            this.cache.delete(oldestPath);
        }

        this.cache.set(path, pageData);
    }

    static _matchRoute(pathname) {
        for (const route of this.routes) {
            const { regex, keys } = this._parseRoute(route.path);
            const match = pathname.match(regex);
            if (match) {
                const params = {};
                keys.forEach((key, index) => {
                    params[key] = decodeURIComponent(match[index + 1]);
                });
                return { route, params };
            }
        }
        return null;
    }

    static _parseRoute(routePath) {
        const keys = [];
        const regexString = routePath.replace(/:([^/]+)/g, (_, key) => {
            keys.push(key);
            return '([^/]+)';
        });
        return { regex: new RegExp(`^${regexString}$`), keys };
    }

    static _parseQuery(fullPath) {
        const url = new URL(fullPath, window.location.origin);
        const query = {};
        for (const [key, value] of url.searchParams.entries()) {
            query[key] = value;
        }
        return query;
    }

    static async _loadRoute(fullPath) {
        const url = new URL(fullPath, window.location.origin);
        const pathname = url.pathname;
        const match = this._matchRoute(pathname);

        if (!match) {
            this.container.innerHTML = '<h2>Page not found</h2>';
            return;
        }

        match.params.query = this._parseQuery(fullPath);

        const { route, params } = match;

        try {
            if (this.cache.has(fullPath)) {
                const pageData = this.cache.get(fullPath);
                this.container.innerHTML = '';
                this.container.appendChild(pageData.content);
            } else {
                const pageModule = await import(route.module);
                if (typeof pageModule.render !== 'function') {
                    throw new Error('Module does not export a render() function');
                }

                const content = await pageModule.render(params);
                const tag = typeof pageModule.tag === 'string' ? pageModule.tag : 'default';
                const tagLimit = typeof pageModule.tagLimit === 'number' ? pageModule.tagLimit : 3;

                this.container.innerHTML = '';
                this.container.appendChild(content);

                this._addToCache(fullPath, { content, tag, timestamp: Date.now() }, tagLimit);
            }
        } catch (err) {
            console.error(`Error loading ${route.module}:`, err);
            this.container.innerHTML = `<p>Error loading page</p>`;
        }
    }
}

export default Router;
