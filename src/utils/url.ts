const ABSOLUTE_URL_PATTERN = /^[a-z][a-z\d+\-.]*:\/\//i;

export function normalizeFeedUrl(input: string): string {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
        throw new Error("RSS feed URL is required.");
    }

    const candidate = ABSOLUTE_URL_PATTERN.test(trimmedInput) ? trimmedInput : `https://${trimmedInput}`;
    const url = new URL(candidate);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("RSS feed URL must use HTTP or HTTPS.");
    }

    url.hash = "";

    if (!url.pathname) {
        url.pathname = "/";
    }

    return url.toString();
}

export function isHttpUrl(input: string): boolean {
    try {
        normalizeFeedUrl(input);
        return true;
    }
    catch {
        return false;
    }
}

export function getHostnameLabel(input: string): string {
    try {
        return new URL(normalizeFeedUrl(input)).hostname.replace(/^www\./, "");
    }
    catch {
        return input.trim();
    }
}
