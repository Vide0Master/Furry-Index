const fs = require('fs').promises;

module.exports = async function removeFile(filePath, maxAttempts = 10, delayMs = 500) {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            const result = await fs.unlink(filePath);
            return true;
        } catch (err) {
            if (!['EBUSY', 'EPERM', 'EACCES'].includes(err.code) || i === maxAttempts - 1) {
                return false
            }
            await new Promise(res => setTimeout(res, delayMs));
        }
    }
}
