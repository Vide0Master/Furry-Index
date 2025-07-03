export default async function API(method, route, body, credentials = false) {
    try {
        const headers = {}

        let fetchBody = undefined

        if (body) {
            if (body instanceof FormData) {
                fetchBody = body
            } else {
                headers['Content-Type'] = 'application/json'
                fetchBody = JSON.stringify(body)
            }
        }

        const response = await fetch(route, {
            method,
            headers,
            body: fetchBody,
            credentials: credentials ? 'include' : 'same-origin',
        });

        if (!response.ok) {
            console.warn(`Request ${route} returned with error: ${response.status}`);
        }

        const data = {}

        try {
            const responseData = await response.json()
            for (const key in responseData) {
                data[key] = responseData[key]
            }
        } catch (err) { }

        try {
            const responseData = await response.text()
            data.TEXT = responseData
        } catch (err) { }

        data.HTTPCODE = response.status

        return data;
    } catch {
        return { HTTPCODE: 500 }
    }
}
