export default function formatDate(dateString, cut = []) {
    const date = new Date(dateString);

    let time = ''

    time += String(date.getDate()).padStart(2, '0');
    time += '/' + String(date.getMonth() + 1).padStart(2, '0');
    time += '/' + date.getFullYear();

    if (!cut.includes('time')) {
        time += ' ' + String(date.getHours()).padStart(2, '0');
        time += ':' + String(date.getMinutes()).padStart(2, '0');
    }

    return time;
}
