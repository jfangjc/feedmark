import type { FeedSubscription } from "./types";
import { readJsonValue, writeJsonValue } from "../storage/jsonStore";
import { createFeedSubscription } from "./createFeedSubscription";

const STORAGE_KEY = "feedmark:rss-subscriptions:v1";

type StoredFeedSubscriptions = {
    version: 1;
    subscriptions: FeedSubscription[];
};

export async function listFeedSubscriptions(): Promise<FeedSubscription[]> {
    const storedValue = await readJsonValue<StoredFeedSubscriptions>(STORAGE_KEY, createEmptyStore());

    return normalizeSubscriptions(storedValue.subscriptions);
}

export async function saveFeedSubscription(subscription: FeedSubscription): Promise<void> {
    const subscriptions = await listFeedSubscriptions();
    const nextSubscriptions = upsertSubscription(subscriptions, subscription);

    await writeSubscriptions(nextSubscriptions);
}

export async function replaceFeedSubscriptions(subscriptions: FeedSubscription[]): Promise<void> {
    await writeSubscriptions(subscriptions);
}

export async function removeFeedSubscription(id: string): Promise<void> {
    const subscriptions = await listFeedSubscriptions();

    await writeSubscriptions(subscriptions.filter((subscription) => subscription.id !== id));
}

export async function clearFeedSubscriptions(): Promise<void> {
    await writeSubscriptions([]);
}

export function exportFeedSubscriptionsJson(subscriptions: FeedSubscription[]): string {
    const normalizedSubscriptions = normalizeSubscriptions(subscriptions);

    return JSON.stringify(
        {
            version: 1,
            urls: normalizedSubscriptions.map((subscription) => subscription.feedUrl),
            subscriptions: normalizedSubscriptions,
        },
        null,
        4,
    );
}

export function parseFeedSubscriptionsJson(json: string): FeedSubscription[] {
    const parsedValue = JSON.parse(json) as unknown;

    return normalizeImportedSubscriptions(parsedValue);
}

async function writeSubscriptions(subscriptions: FeedSubscription[]): Promise<void> {
    await writeJsonValue<StoredFeedSubscriptions>(STORAGE_KEY, {
        version: 1,
        subscriptions: normalizeSubscriptions(subscriptions),
    });
}

function createEmptyStore(): StoredFeedSubscriptions {
    return {
        version: 1,
        subscriptions: [],
    };
}

function upsertSubscription(subscriptions: FeedSubscription[], subscription: FeedSubscription): FeedSubscription[] {
    const nextSubscriptions = subscriptions.filter(
        (existingSubscription) => existingSubscription.id !== subscription.id,
    );

    nextSubscriptions.push(subscription);

    return normalizeSubscriptions(nextSubscriptions);
}

function normalizeImportedSubscriptions(value: unknown): FeedSubscription[] {
    if (Array.isArray(value)) {
        return normalizeSubscriptions(value.map(normalizeImportedSubscription));
    }

    if (isObject(value) && Array.isArray(value.subscriptions)) {
        return normalizeSubscriptions(value.subscriptions.map(normalizeImportedSubscription));
    }

    if (isObject(value) && Array.isArray(value.urls)) {
        return normalizeSubscriptions(value.urls.map(normalizeImportedSubscription));
    }

    throw new Error("Subscription JSON must contain a subscriptions or urls array.");
}

function normalizeImportedSubscription(value: unknown): FeedSubscription {
    if (typeof value === "string") {
        return createFeedSubscription({ feedUrl: value });
    }

    if (!isObject(value) || typeof value.feedUrl !== "string") {
        throw new Error("Each subscription must include a feedUrl.");
    }

    return createFeedSubscription({
        feedUrl: value.feedUrl,
        siteUrl: typeof value.siteUrl === "string" ? value.siteUrl : undefined,
        title: typeof value.title === "string" ? value.title : undefined,
        now: typeof value.createdAt === "string" ? new Date(value.createdAt) : undefined,
    });
}

function normalizeSubscriptions(subscriptions: FeedSubscription[] | undefined): FeedSubscription[] {
    const byId = new Map<string, FeedSubscription>();

    for (const subscription of subscriptions ?? []) {
        if (!subscription?.id || subscription.type !== "rss" || !subscription.feedUrl) {
            continue;
        }

        byId.set(subscription.id, subscription);
    }

    return Array.from(byId.values()).sort(
        (firstSubscription, secondSubscription) =>
            getTime(firstSubscription.createdAt) - getTime(secondSubscription.createdAt),
    );
}

function getTime(value: string): number {
    const time = new Date(value).getTime();

    return Number.isNaN(time) ? 0 : time;
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}
