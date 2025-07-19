
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

function buildProgressBar(perc, width) {
    const symbols = [' ', '⡀', '⡄', '⡆', '⡇', '⣇', '⣧', '⣷', '⣿'];
    const fullUnits = Math.floor((perc / 100) * width);
    const remainder = ((perc / 100) * width) - fullUnits;
    const partialIndex = Math.floor(remainder * (symbols.length - 1));

    let bar = '';

    for (let i = 0; i < width; i++) {
        if (i < fullUnits) {
            bar += symbols[symbols.length - 1];
        } else if (i === fullUnits && partialIndex > 0) {
            bar += symbols[partialIndex];
        } else {
            bar += symbols[0];
        }
    }

    return bar;
}

function calculatePercFromProgress(current, total) {
    if (typeof current === 'number' && typeof total === 'number' && total > 0) {
        return (current / total) * 100;
    }
    return null;
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

    static progress(state = { text: '', result: null, perc: null, current: null, total: null }, preps = []) {
        const cycle = ['⠉', '⠘', '⠰', '⠤', '⠆', '⠃'];
        let idx = 0;
        let prevLen = 0;

        const timer = setInterval(() => {
            idx = (idx + 1) % cycle.length;
            render()
        }, 150);

        function render() {
            let perc = state.perc;
            if (perc == null && state.current != null && state.total != null) {
                perc = calculatePercFromProgress(state.current, state.total);
            }

            let line = buildPrefix(preps) + buildMain(state.text);

            if (typeof perc === 'number') {
                line += ' ' + colorize(buildProgressBar(perc, 30) + ' ' + `[${Math.floor(state.current)}/${Math.floor(state.total)}]`, 'brightCyan');
            }

            if (state.result) {
                line += buildResult(state.result) + '\n';
                clearInterval(timer);
            } else {
                line += ' ' + colorize(cycle[idx] + ' PROCESSING', 'magenta') + '\r';
            }

            if (prevLen > line.length) {
                process.stdout.write('\x1B[2K\r');
            }

            process.stdout.write(line);
            prevLen = line.length;
        }

        return (resultKeyOrUpdate) => {
            if (typeof resultKeyOrUpdate === 'string') {
                state.result = resultKeyOrUpdate;
            } else if (typeof resultKeyOrUpdate === 'object') {
                if ('perc' in resultKeyOrUpdate) state.perc = resultKeyOrUpdate.perc;
                if ('current' in resultKeyOrUpdate) state.current = resultKeyOrUpdate.current;
                if ('total' in resultKeyOrUpdate) state.total = resultKeyOrUpdate.total;
                if ('text' in resultKeyOrUpdate) state.text = resultKeyOrUpdate.text;
                if ('state' in resultKeyOrUpdate) state.result = resultKeyOrUpdate.result
            }
            render()
        };
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
        ws: { text: "WS", color: "cyan" }
    }
}

module.exports = cmd