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

    if (!res.ok) 
        throw new Error(`Api call failed! Endpoint: ${url}, Method: ${method}, Body: ${body}, Erorr: ${res.status} - ${res.statusText}`);

    const data = await res.json() as T;

    console.log("API call success", { url, method, body, data });

    return await data;
}