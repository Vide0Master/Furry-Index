import AppInfo from "./appinfo.js"

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

        if (AppInfo.appData.isDev || AppInfo.appData.isEval) {
            const styleLabel = [
                'background: #333',
                'color: #fff',
                'padding: 2px 6px',
                'border-radius: 50px 0 0 50px',
                'font-weight: bold'
            ].join(';');

            let statusColor = ''

            switch (true) {
                case data.HTTPCODE >= 200 && data.HTTPCODE < 300:
                    statusColor = '#4caf50'
                    break
                case data.HTTPCODE >= 400 && data.HTTPCODE < 500:
                    statusColor = '#ff5722'
                    break
                case data.HTTPCODE >= 500 && data.HTTPCODE < 600:
                    statusColor = '#000000'
                    break
            }

            const styleMethod = [
                `background: ${statusColor}`,
                'color: #fff',
                'padding: 2px 6px',
                'font-weight: bold'
            ].join(';');

            const styleRoute = [
                'background: #2196f3',
                'color: #fff',
                'padding: 2px 6px',
                'border-radius: 0 50px 50px 0',
                'font-weight: bold'
            ].join(';');

            console.groupCollapsed(
                '%c API %c ' + method.toUpperCase() + ' %c ' + route,
                styleLabel,
                styleMethod,
                styleRoute
            );

            console.log(data)

            console.groupEnd();
        }

        return data;
    } catch {
        return { HTTPCODE: 500 }
    }
}
