const fs = require("fs");
const path = require("path");


function scanFiles(dir, excludeFile = null, baseDir = dir, filesArr = []) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (excludeFile && path.resolve(fullPath) === path.resolve(excludeFile)) {
            return;
        }

        if (stat.isDirectory()) {
            scanFiles(fullPath, excludeFile, baseDir, filesArr);
        } else {
            const relativePath = path.relative(baseDir, fullPath);
            filesArr.push('/' + relativePath.replace(/\\/g, '/'));
        }
    });

    return filesArr;
}

function generateHTMLImports(files) {
    let result = "";

    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        const base = path.basename(file).toLowerCase();

        if (ext === ".js") {
            result += `<script type="module" src="${file}"></script>\n`;
        } else if (ext === ".css") {
            result += `<link rel="stylesheet" href="${file}">\n`;
        } else if (ext === ".scss" || ext === ".sass") {
            result += `<link rel="stylesheet" href="${file.replace(/\.(scss|sass)$/i, ".css")}">\n`;
        }
    });

    return result.trim();
}

function renderHTMLImports() {
    const scannedFiles = scanFiles('./webpage');
    const html = generateHTMLImports(scannedFiles);
    return html
}

module.exports = renderHTMLImports