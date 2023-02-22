import localForage from 'localforage';

const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000

export class LocalCache<T> {
    private _key: string;

    constructor(key: string) {
        this._key = key
    }

    public async fetch(url: string): Promise<T> {
        const contentFromCache = await localForage.getItem(this._key) as (T | null)
        const contentUpdatedAt = await localForage.getItem(`${this._key}_updated_at`) as (Date | null)

        // has been cached
        if (contentFromCache !== null && contentUpdatedAt !== null) {
            const now = new Date().getTime()
            const delta = now - contentUpdatedAt.getTime()
            
            // data is valid, return
            if (delta < TWO_DAYS_IN_MS) return contentFromCache as T

            // expired, continue
        }

        // get content
        const response = await fetch(url)
        const content = await response.text() // as string for now
        const updatedAt = new Date()

        await localForage.setItem(this._key, content)
        await localForage.setItem(`${this._key}_updated_at`, updatedAt)
        return content as T
    }

    public async clear() {
        await localForage.removeItem(this._key)
        await localForage.removeItem(`${this._key}_updated_at`)
    }
}
