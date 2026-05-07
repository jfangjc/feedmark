import { Image, Platform } from "react-native";
import { mapWithConcurrency } from "../../utils/async";
import { normalizeFeedUrl } from "../../utils/url";
import { parseRssFeedXml } from "./parsers/parseRssFeed";
import type { RssFeed } from "./types";

const RSS_ACCEPT_HEADER = [
    "application/rss+xml",
    "application/atom+xml",
    "application/xml",
    "text/xml",
    "*/*",
].join(", ");

const MAX_PREFETCHED_IMAGES = 20;
const MAX_CONCURRENT_IMAGE_PREFETCHES = 4;
const MAX_REMEMBERED_PREFETCHED_IMAGES = 300;
const RSS_FETCH_TIMEOUT_MS = 15000;
const PREFETCHED_IMAGE_URLS: string[] = [];
const PREFETCHED_IMAGE_URL_SET = new Set<string>();

type FetchRssFeedOptions = {
    cachedFeed?: RssFeed;
};

type RssXmlResponse =
    | {
        status: "ok";
        xml: string;
        httpEtag?: string;
        httpLastModified?: string;
    }
    | {
        status: "notModified";
        httpEtag?: string;
        httpLastModified?: string;
    };

export async function fetchRssFeed(feedUrlInput: string, options: FetchRssFeedOptions = {}): Promise<RssFeed> {
    const feedUrl = normalizeFeedUrl(feedUrlInput);
    const response = await fetchRssXml(feedUrl, options.cachedFeed);

    if (response.status === "notModified") {
        if (!options.cachedFeed) {
            throw new Error("RSS feed was not modified, but no cached feed is available.");
        }

        return {
            ...options.cachedFeed,
            feedUrl,
            httpEtag: response.httpEtag ?? options.cachedFeed.httpEtag,
            httpLastModified: response.httpLastModified ?? options.cachedFeed.httpLastModified,
            lastFetchedAt: new Date().toISOString(),
        };
    }

    const feed = {
        ...parseRssFeedXml(response.xml, feedUrl),
        httpEtag: response.httpEtag,
        httpLastModified: response.httpLastModified,
    };

    void prefetchFeedImages(feed);

    return feed;
}

async function fetchRssXml(feedUrl: string, cachedFeed: RssFeed | undefined): Promise<RssXmlResponse> {
    const headers: Record<string, string> = {
        Accept: RSS_ACCEPT_HEADER,
    };

    if (shouldUseConditionalRequestHeaders() && cachedFeed?.httpEtag) {
        headers["If-None-Match"] = cachedFeed.httpEtag;
    }

    if (shouldUseConditionalRequestHeaders() && cachedFeed?.httpLastModified) {
        headers["If-Modified-Since"] = cachedFeed.httpLastModified;
    }

    const abortController = typeof AbortController === "undefined" ? undefined : new AbortController();
    const timeoutId = abortController
        ? setTimeout(() => {
            abortController.abort();
        }, RSS_FETCH_TIMEOUT_MS)
        : undefined;

    try {
        const response = await fetch(feedUrl, {
            headers,
            signal: abortController?.signal,
        });

        const httpEtag = getResponseHeader(response, "etag");
        const httpLastModified = getResponseHeader(response, "last-modified");

        if (response.status === 304) {
            return {
                status: "notModified",
                httpEtag,
                httpLastModified,
            };
        }

        if (!response.ok) {
            throw new Error(`Unable to fetch RSS feed (${response.status}).`);
        }

        return {
            status: "ok",
            xml: await response.text(),
            httpEtag,
            httpLastModified,
        };
    }
    catch (error) {
        if (isAbortError(error)) {
            throw new Error("RSS feed request timed out.");
        }

        throw error;
    }
    finally {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }
    }
}

async function prefetchFeedImages(feed: RssFeed): Promise<void> {
    const imageUrls = Array.from(
        new Set(feed.items.map((item) => item.imageUrl).filter((imageUrl): imageUrl is string => Boolean(imageUrl))),
    )
        .filter((imageUrl) => !PREFETCHED_IMAGE_URL_SET.has(imageUrl))
        .slice(0, MAX_PREFETCHED_IMAGES);

    await mapWithConcurrency(
        imageUrls,
        MAX_CONCURRENT_IMAGE_PREFETCHES,
        async (imageUrl) => {
            try {
                await Image.prefetch(imageUrl);
                rememberPrefetchedImageUrl(imageUrl);
            }
            catch {
                // Image failures should not block feed updates.
            }
        },
    );
}

function getResponseHeader(response: Response, headerName: string): string | undefined {
    return response.headers.get(headerName)?.trim() || undefined;
}

function shouldUseConditionalRequestHeaders(): boolean {
    return Platform.OS !== "web";
}

function isAbortError(error: unknown): boolean {
    return (
        (typeof DOMException !== "undefined" && error instanceof DOMException && error.name === "AbortError") ||
        (typeof error === "object" &&
            error !== null &&
            "name" in error &&
            error.name === "AbortError")
    );
}

function rememberPrefetchedImageUrl(imageUrl: string): void {
    if (PREFETCHED_IMAGE_URL_SET.has(imageUrl)) {
        return;
    }

    PREFETCHED_IMAGE_URLS.push(imageUrl);
    PREFETCHED_IMAGE_URL_SET.add(imageUrl);

    while (PREFETCHED_IMAGE_URLS.length > MAX_REMEMBERED_PREFETCHED_IMAGES) {
        const expiredImageUrl = PREFETCHED_IMAGE_URLS.shift();

        if (expiredImageUrl) {
            PREFETCHED_IMAGE_URL_SET.delete(expiredImageUrl);
        }
    }
}
