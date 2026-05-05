import { resolveUrl } from "../../../utils/url";

const HTML_IMAGE_PATTERN = /<img\b[^>]*\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i;
const HTML_TAG_PATTERN = /<[^>]+>/g;
const WHITESPACE_PATTERN = /\s+/g;

const XML_ENTITIES: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    quote: '"',
};

export function normalizeText(value: string | undefined): string | undefined {
    const normalizedValue = decodeXmlEntities(stripCdata(value ?? ""))
        .replace(HTML_TAG_PATTERN, " ")
        .replace(WHITESPACE_PATTERN, " ")
        .trim();

    return normalizedValue || undefined;
}

export function normalizeHtmlSummary(value: string | undefined): string | undefined {
    return normalizeText(value);
}

export function extractImageUrlFromHtml(value: string | undefined, baseUrl: string): string | undefined {
    const match = HTML_IMAGE_PATTERN.exec(stripCdata(value ?? ""));
    const imageUrl = match?.[1] ?? match?.[2] ?? match?.[3];

    return resolveUrl(decodeXmlEntities(imageUrl ?? ""), baseUrl);
}

export function decodeXmlEntities(value: string): string {
    return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (_match, entity: string) => {
        const normalizedEntity = entity.toLowerCase();

        if (normalizedEntity.startsWith("#x")) {
            return decodeCodePoint(Number.parseInt(normalizedEntity.slice(2), 16));
        }

        if (normalizedEntity.startsWith("#")) {
            return decodeCodePoint(Number.parseInt(normalizedEntity.slice(1), 10));
        }

        return XML_ENTITIES[normalizedEntity] ?? `&${entity};`;
    });
}

export function stripCdata(value: string): string {
    return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1");
}

function decodeCodePoint(value: number): string {
    if (!Number.isFinite(value)) {
        return "";
    }

    try {
        return String.fromCodePoint(value);
    }
    catch {
        return "";
    }
}
