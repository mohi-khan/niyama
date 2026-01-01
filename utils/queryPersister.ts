import { openDB } from 'idb'
import type { PersistedClient } from '@tanstack/react-query-persist-client'

const dbPromise = openDB('rq-cache-db', 1, {
  upgrade(db) {
    db.createObjectStore('reactQuery')
  },
})

export const indexedDBPersister = {
  persistClient: async (client: PersistedClient) => {
    const db = await dbPromise
    await db.put('reactQuery', client, 'cache')
  },

  restoreClient: async (): Promise<PersistedClient | undefined> => {
    const db = await dbPromise
    return (await db.get('reactQuery', 'cache')) || undefined
  },

  removeClient: async () => {
    const db = await dbPromise
    await db.delete('reactQuery', 'cache')
  },
}
