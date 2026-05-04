import type { FeedSubscription } from "./types";

export async function listFeedSubscriptions(): Promise<FeedSubscription[]> {
    throw new Error("Feed subscription storage is not implemented.");
}

export async function saveFeedSubscription(_subscription: FeedSubscription): Promise<void> {
    throw new Error("Feed subscription storage is not implemented.");
}

export async function removeFeedSubscription(_id: string): Promise<void> {
    throw new Error("Feed subscription storage is not implemented.");
}
