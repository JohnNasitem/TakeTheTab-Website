export async function sendApiCall<T>(url: string, method: string, body?: string): Promise<T> {
    console.log("Making API call", { url, method, body });
    const options: RequestInit = {
        method,
        credentials: "include",
        headers: {} as Record<string, string>,
    };

    if (body) {
        options.body = body;
        options.headers = { "Content-Type": "application/json" };
    }

    const res = await fetch(url, options);

    if (!res.ok) {
    let errorDetails = `${res.status} - ${res.statusText}`;
    
    try {
        const errorBody = await res.json();
        errorDetails = JSON.stringify(errorBody);
    } catch {
        // response wasn't JSON, try plain text
        try {
            errorDetails = await res.text();
        } catch {
            // fall back to status only
        }
    }
    
    throw new Error(`API call failed! Endpoint: ${url}, Method: ${method}, Body: ${body}, Error: ${errorDetails}`);
}

    const data = await res.json() as T;

    console.log("API call success", { url, method, body, data });

    return await data;
}