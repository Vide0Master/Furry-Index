const { text } = require("express");

process.stdout.write('\x1B[?25l');

const ANSI_COLORS = {
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37,
    brightBlack: 90,
    brightRed: 91,
    brightGreen: 92,
    brightYellow: 93,
    brightBlue: 94,
    brightMagenta: 95,
    brightCyan: 96,
    brightWhite: 97,
};

function colorize(text, color = 'white') {
    const fg = ANSI_COLORS[color] ?? ANSI_COLORS.white;
    return `\x1b[${fg}m${text}\x1b[0m`;
}

const results = {
    ok: { text: '◈ OK', color: 'green' },
    info: { text: '🛈 INFO', color: 'blue' },
    warn: { text: '◇ WARN', color: 'brightYellow' },
    bad: { text: '◈ BAD', color: 'yellow' },
    err: { text: '◆ ERROR', color: 'red' },
    ce: { text: '✤ CRITICAL ERROR', color: 'brightRed' },
    awesome: { text: '✦ AWESOME', color: 'brightCyan' },
};

function buildPrefix(preps = []) {
    if (!preps.length) return '';
    return preps
        .map(p => colorize(p.text, p.color))
        .join(' › ') + ': ';
}

function buildMain(text = '') {
    return text;
}

function buildResult(resultKey) {
    if (!resultKey || !results[resultKey]) return '';

    const { text, color } = results[resultKey];
    return ' ' + colorize(text, color);
}

function cmdLineBuilder(preps, text, resultKey) {
    return buildPrefix(preps) + buildMain(text) + buildResult(resultKey);
}

class cmd {
    static log(msg, preps) { console.log(cmdLineBuilder(preps, msg)); }
    static ok(msg, preps) { console.log(cmdLineBuilder(preps, msg, 'ok')); }
    static info(msg, preps) { console.log(cmdLineBuilder(preps, msg, 'info')); }
    static warn(msg, preps) { console.log(cmdLineBuilder(preps, msg, 'warn')); }
    static bad(msg, preps) { console.log(cmdLineBuilder(preps, msg, 'bad')); }
    static err(msg, preps) { console.log(cmdLineBuilder(preps, msg, 'err')); }
    static cerr(msg, preps) { console.log(cmdLineBuilder(preps, msg, 'ce')); }
    static awesome(msg, preps) { console.log(cmdLineBuilder(preps, msg, 'awesome')); }

    static nested(nest, preps, status = 'info') {
        console.log(cmdLineBuilder(preps, nest.label, status));

        const prepsLength = 0;

        function renderLayer(node, prefix = '', isLast = true) {
            const hasChildren = node.childs && node.childs.length > 0;
            let connector;

            if (hasChildren) {
                connector = isLast ? '╚═╦═ ' : '╠═╦═ ';
            } else {
                connector = isLast ? '╙─── ' : '╟─── ';
            }

            const line = prefix + connector + (node.label ?? '[no label]');
            console.log(' '.repeat(prepsLength) + line);

            if (!hasChildren) return;

            const newPrefix = prefix + (isLast ? '  ' : '║ ');
            node.childs.forEach((child, index) => {
                const last = index === node.childs.length - 1;
                renderLayer(child, newPrefix, last);
            });
        }

        delete nest.label;
        nest.childs?.forEach((child, index) => {
            const isLast = index === nest.childs.length - 1;
            renderLayer(child, '', isLast);
        });
    }


    static custom(text, resultKey, preps) {
        console.log(cmdLineBuilder(preps, text, resultKey));
    }

    static colorize = colorize

    static preps = {
        API: { text: "API", color: "brightYellow" },
        System: { text: "System", color: "green" },
        fs: { text: 'FS', color: "green" },
        DB: { text: "Database", color: "red" },
        Debug: { text: "Debug", color: "red" },
        http: { text: "HTTP", color: "red" },
        ws: { text: "WS", color: "cyan" },
        APIs: {
            GET: { text: "GET", color: "green" },
            POST: { text: "POST", color: "magenta" },
            PUT: { text: "PUT", color: "yellow" },
            PATCH: { text: "PATCH", color: "magenta" },
            DELETE: { text: "DELETE", color: "red" },
            WS: { text: "WS", color: "green" }
        }
    }
}

module.exports = cmd