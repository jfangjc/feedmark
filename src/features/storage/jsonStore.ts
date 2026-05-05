import { requireOptionalNativeModule } from "expo-modules-core";
import { Platform } from "react-native";

type FileInfo = {
    exists: boolean;
};

type ExponentFileSystemModule = {
    documentDirectory?: string | null;
    getInfoAsync?: (fileUri: string, options?: Record<string, unknown>) => Promise<FileInfo>;
    makeDirectoryAsync?: (fileUri: string, options?: Record<string, unknown>) => Promise<void>;
    readAsStringAsync?: (fileUri: string, options?: Record<string, unknown>) => Promise<string>;
    writeAsStringAsync?: (
        fileUri: string,
        contents: string,
        options?: Record<string, unknown>,
    ) => Promise<void>;
};

const FILE_SYSTEM = Platform.OS === "web"
    ? null
    : requireOptionalNativeModule<ExponentFileSystemModule>("ExponentFileSystem");

const STORE_DIRECTORY = "feedmark/";
const MEMORY_STORE = new Map<string, string>();

export async function readJsonValue<T>(key: string, fallbackValue: T): Promise<T> {
    const rawValue = await readStringValue(key);

    if (!rawValue) {
        return fallbackValue;
    }

    try {
        return JSON.parse(rawValue) as T;
    }
    catch {
        return fallbackValue;
    }
}

export async function writeJsonValue<T>(key: string, value: T): Promise<void> {
    await writeStringValue(key, JSON.stringify(value));
}

async function readStringValue(key: string): Promise<string | undefined> {
    const webStorage = getWebStorage();

    if (webStorage) {
        return webStorage.getItem(key) ?? undefined;
    }

    const fileUri = getNativeFileUri(key);

    if (!fileUri || !FILE_SYSTEM?.getInfoAsync || !FILE_SYSTEM.readAsStringAsync) {
        return MEMORY_STORE.get(key);
    }

    try {
        const info = await FILE_SYSTEM.getInfoAsync(fileUri);

        if (!info.exists) {
            return MEMORY_STORE.get(key);
        }

        return await FILE_SYSTEM.readAsStringAsync(fileUri);
    }
    catch {
        return MEMORY_STORE.get(key);
    }
}

async function writeStringValue(key: string, value: string): Promise<void> {
    MEMORY_STORE.set(key, value);

    const webStorage = getWebStorage();

    if (webStorage) {
        webStorage.setItem(key, value);
        return;
    }

    const fileUri = getNativeFileUri(key);

    if (!fileUri || !FILE_SYSTEM?.writeAsStringAsync) {
        return;
    }

    try {
        await ensureNativeStoreDirectory();
        await FILE_SYSTEM.writeAsStringAsync(fileUri, value);
    }
    catch {
        // The in-memory write above keeps the current session usable if native persistence is unavailable.
    }
}

function getWebStorage(): Storage | undefined {
    if (Platform.OS !== "web" || typeof globalThis.localStorage === "undefined") {
        return undefined;
    }

    return globalThis.localStorage;
}

function getNativeFileUri(key: string): string | undefined {
    const documentDirectory = FILE_SYSTEM?.documentDirectory;

    if (!documentDirectory) {
        return undefined;
    }

    return `${documentDirectory}${STORE_DIRECTORY}${toFileName(key)}.json`;
}

async function ensureNativeStoreDirectory(): Promise<void> {
    const documentDirectory = FILE_SYSTEM?.documentDirectory;

    if (!documentDirectory || !FILE_SYSTEM?.makeDirectoryAsync) {
        return;
    }

    await FILE_SYSTEM.makeDirectoryAsync(`${documentDirectory}${STORE_DIRECTORY}`, { intermediates: true });
}

function toFileName(key: string): string {
    return key.replace(/[^a-z0-9._-]+/gi, "_").replace(/^_+|_+$/g, "") || "store";
}
