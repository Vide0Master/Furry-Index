export default async function downloadFile(url, baseName) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);

    let ext = "";
    const cd = res.headers.get("content-disposition");
    if (cd) {
        const m = cd.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/);
        if (m) {
            const fname = decodeURIComponent(m[1] || m[2]);
            const dot = fname.lastIndexOf(".");
            if (dot !== -1) ext = fname.slice(dot);
        }
    }

    const blob = await res.blob();
    const filename = baseName + (ext || "");

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.setAttribute("external", "true")
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
}