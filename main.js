async function loadShader(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Could not load shader at ${url}`);
    }
    return await response.text();
}
