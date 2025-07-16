const fs = require('fs');
const path = require('path');

const LANG_DIR = path.join(__dirname, '../webpage', 'languages');

const LANGUAGE_CODES = ['ENG', 'RU', 'UA'];

const BASE_LANG_CODE = 'ENG';
const BASE_LANG_FILE = `${BASE_LANG_CODE}.js`;
const BASE_LANG_PATH = path.join(LANG_DIR, BASE_LANG_FILE);

function parseLangFile(filePath) {
    let code = fs.readFileSync(filePath, 'utf-8');

    code = code.replace(/export\s+default\s+LANG\s*;?/g, '');
    code = code.replace(/module\.exports\s*=\s*LANG\s*;?/g, '');

    const wrapped = new Function(`${code}; return LANG;`);
    return wrapped();
}

function addMissing(base, target) {
    const result = {};
    for (const key in base) {
        if (typeof base[key] === 'object' && base[key] !== null && !Array.isArray(base[key])) {
            result[key] = addMissing(base[key], target?.[key] || {});
        } else {
            result[key] = key in target ? target[key] : base[key];
        }
    }
    return result;
}

function removeExtra(base, target) {
    const result = {};
    for (const key in target) {
        if (key in base) {
            if (typeof base[key] === 'object' && base[key] !== null && !Array.isArray(base[key])) {
                result[key] = removeExtra(base[key], target[key]);
            } else {
                result[key] = target[key];
            }
        }
    }
    return result;
}

function syncLang(base, target) {
    const withMissing = addMissing(base, target || {});
    return removeExtra(base, withMissing);
}

function isValidIdentifier(key) {
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
}

function stringifyJS(obj, indent = 0) {
    const pad = ' '.repeat(indent);
    const nextPad = ' '.repeat(indent + 4);

    if (Array.isArray(obj)) {
        if (obj.length === 0) return '[]';
        return '[\n' + obj.map(item => nextPad + stringifyJS(item, indent + 4)).join(',\n') + '\n' + pad + ']';
    }

    if (obj && typeof obj === 'object') {
        const keys = Object.keys(obj);
        if (keys.length === 0) return '{}';
        return '{\n' + keys.map(key => {
            const safeKey = isValidIdentifier(key) ? key : JSON.stringify(key);
            return `${nextPad}${safeKey}: ${stringifyJS(obj[key], indent + 4)}`;
        }).join(',\n') + '\n' + pad + '}';
    }

    return JSON.stringify(obj);
}

function generateLangFile(langObj) {
    return `const LANG = ${stringifyJS(langObj, 0)};\n\nexport default LANG\n`;
}

const baseLang = parseLangFile(BASE_LANG_PATH);

for (const code of LANGUAGE_CODES) {
    const fileName = `${code}.js`;
    const filePath = path.join(LANG_DIR, fileName);

    if (code === BASE_LANG_CODE) continue;

    let targetLang = {};
    if (fs.existsSync(filePath)) {
        targetLang = parseLangFile(filePath);
    } else {
        console.log(`⚠ Язык ${code} отсутствует — будет создан`);
    }

    const synced = syncLang(baseLang, targetLang);
    const output = generateLangFile(synced);
    fs.writeFileSync(filePath, output, 'utf-8');

    console.log(`✔ Синхронизирован: ${fileName}`);
}
