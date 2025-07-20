import Elem from '../components/elem/script.js';
import Overlay from '../features/overlay/script.js';
import staticRoutes from '../staticVariables/routerRoutes.js';

class Router {
    static routes = [...staticRoutes];
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

                await this.navigate(href, e.target.tagName == 'A' ? e.target : e.target.parentNode);
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



    static async navigate(path, initElem) {
        Overlay.clearOverlays()

        this.init();
        if (window.location.pathname + window.location.search !== path) {
            function getGlobalElementMetrics(el) {
                const rect = el.getBoundingClientRect();
                return {
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                    height: rect.height
                };
            }

            const triggerPos = getGlobalElementMetrics(initElem)
            const navzonePos = getGlobalElementMetrics(this.container)

            const overlayStyle = []

            for (const val in triggerPos) {
                overlayStyle.push(`--trigger-${val}: ${triggerPos[val]}px`)
            }

            for (const val in navzonePos) {
                overlayStyle.push(`--target-${val}: ${navzonePos[val]}px`)
            }

            const overlayElem = new Elem('internal-transition-block', document.querySelector('main'))
            overlayElem.element.style = overlayStyle.join('; ')

            overlayElem.onAnimationEnd(async () => {
                window.history.pushState({}, '', path);
                await this._loadRoute(path);

                overlayElem.element.classList.add('internal-page-switch-overlay-kill')
                overlayElem.onAnimationEnd(() => {
                    overlayElem.kill()
                })

            })
        }
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
            const pageModule = await import(route.module);
            if (typeof pageModule.render !== 'function') {
                throw new Error('Module does not export a render() function');
            }

            const content = await pageModule.render(params);

            const children = Array.from(this.container.children);
            for (const child of children) {
                if (!child.matches('.internal-transition-block')) {
                    // maybe some killer for event listeners? 
                    // tf i'm talkin bout, nothing!!! xdddddddddddddd
                    child.remove();
                }
            }

            this.container.appendChild(content);
        } catch (err) {
            console.error(`Error loading ${route.module}:`, err);
            this.container.innerHTML = `<p>Error loading page</p>`;
        }
    }
}

export default Router;
