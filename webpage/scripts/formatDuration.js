export default function formatDuration(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const paddedHrs = String(hrs).padStart(2, "0");
    const paddedMins = String(mins).padStart(2, "0");
    const paddedSecs = String(secs).padStart(2, "0");

    return `${paddedHrs}:${paddedMins}:${paddedSecs}`;
}