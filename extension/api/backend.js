export async function sendBrowserData(browserData) {

    const response = await fetch("http://127.0.0.1:8000/api/browser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(browserData)
    });
    if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
    }
    return await response.json();
}