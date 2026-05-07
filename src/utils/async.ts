export async function mapWithConcurrency<TItem, TResult>(
    items: TItem[],
    concurrencyLimit: number,
    mapper: (item: TItem, index: number) => Promise<TResult>,
): Promise<TResult[]> {
    const results = new Array<TResult>(items.length);
    const workerCount = Math.min(items.length, Math.max(1, Math.floor(concurrencyLimit)));
    let nextIndex = 0;

    await Promise.all(
        Array.from({ length: workerCount }, async () => {
            while (nextIndex < items.length) {
                const index = nextIndex;

                nextIndex += 1;
                results[index] = await mapper(items[index], index);
            }
        }),
    );

    return results;
}
