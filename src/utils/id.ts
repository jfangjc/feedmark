const FNV_OFFSET_BASIS = 2166136261;
const FNV_PRIME = 16777619;

export function fnv1aHash(seed: string): number {
    let hash = FNV_OFFSET_BASIS;

    for (let index = 0; index < seed.length; index += 1) {
        hash ^= seed.charCodeAt(index);
        hash = Math.imul(hash, FNV_PRIME);
    }

    return hash >>> 0;
}

export function createFnv1aId(prefix: string, seed: string): string {
    return `${prefix}_${fnv1aHash(seed).toString(36)}`;
}

export function createStableId(prefix: string, seed: string): string {
    return createFnv1aId(prefix, seed);
}

export function createTimestampId(prefix: string, date = new Date()): string {
    return `${prefix}_${date.getTime().toString(36)}`;
}
