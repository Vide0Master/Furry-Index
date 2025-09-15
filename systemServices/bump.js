const fs = require("fs");
const path = require("path");
const cmd = require("./cmdPretty");

const configPath = path.join(__dirname, "../config.json");

let config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
let version = config.version || "0.0.1";

function printMenu() {
    cmd.log(`\nCurrent version: ${cmd.colorize(version, "cyan")}`);
    cmd.log(`Choose action:`);
    cmd.log(`${cmd.colorize("1", "yellow")} > Bump fix version`);
    cmd.log(`${cmd.colorize("2", "yellow")} > Bump patch version`);
    cmd.log(`${cmd.colorize("3", "yellow")} > Bump minor version`);
    cmd.log(`${cmd.colorize("4", "yellow")} > Bump major version`);
    cmd.log(`${cmd.colorize("x", "red")} > Exit bump tool`);
}

function incrementSuffix(suffix) {
    if (!suffix) return "A";

    const letters = suffix.split("");
    let i = letters.length - 1;

    while (i >= 0) {
        if (letters[i] === "Z") {
            letters[i] = "A";
            i--;
        } else {
            letters[i] = String.fromCharCode(letters[i].charCodeAt(0) + 1);
            return letters.join("");
        }
    }

    return "A" + letters.join("");
}

function bumpVersion(ver, choice) {
    const suffixMatch = ver.match(/-([A-Z]+)$/);
    let baseVer = ver;
    let suffix = null;

    if (suffixMatch) {
        baseVer = ver.replace(/-[A-Z]+$/, "");
        suffix = suffixMatch[1];
    }

    let [major, minor, patch] = baseVer.split(".").map(n => parseInt(n, 10));

    switch (choice) {
        case "1": {
            suffix = incrementSuffix(suffix);
            return `${baseVer}-${suffix}`;
        }
        case "2": {
            return `${major}.${minor}.${patch + 1}`;
        }
        case "3": {
            return `${major}.${minor + 1}.0`;
        }
        case "4": {
            return `${major + 1}.0.0`;
        }
        default:
            return null;
    }
}

let pendingVersion = null;
let waitingConfirm = false;

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");

printMenu();

process.stdin.on("data", (key) => {
    key = key.trim();

    if (key === "\u0003" || key === "x") {
        cmd.log("\n" + cmd.colorize("Exited.", "red"));
        process.exit(0);
    }

    if (waitingConfirm) {
        if (key === "y") {
            version = pendingVersion;
            config.version = version;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 4), "utf-8");
            cmd.log(`\n${cmd.colorize("✓ Version updated:", "green")} ${cmd.colorize(version, "cyan")}`);
            waitingConfirm = false;
            pendingVersion = null;
            printMenu();
        } else if (key === "n") {
            cmd.log("\n" + cmd.colorize("✘ Canceled.", "red"));
            waitingConfirm = false;
            pendingVersion = null;
            printMenu();
        } else if (key === "x") {
            cmd.log("\n" + cmd.colorize("Exit.", "red"));
            process.exit(0);
        }
        return;
    }

    const newVersion = bumpVersion(version, key);
    if (!newVersion) {
        cmd.log("\n" + cmd.colorize("✘ Wrong option.", "red"));
        printMenu();
    } else {
        cmd.log(`\n🛈 Version will be changed: ${cmd.colorize(version, "cyan")} → ${cmd.colorize(newVersion, "cyan")}`);
        cmd.log(cmd.colorize("Confirm? (y = yes, n = cancel, x = exit)", "yellow"));
        pendingVersion = newVersion;
        waitingConfirm = true;
    }
});
