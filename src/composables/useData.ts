import type { DBKey, Schema } from "@/types/schema"
import type { IDBPDatabase } from "idb"
import { inject, ref } from "vue"

interface QueryOptions {
  paused?: boolean
}

export const useData = () => {
  // Get the database connection
  const $db = inject<Promise<IDBPDatabase<Schema>>>("$db")

  if (!$db) throw new Error("Database connection not provided. Make sure the IDB plugin is installed.")

  const all = <T extends DBKey>(key: T) => {
    const data = ref<Schema[T]["value"][]>([])
    const isLoading = ref(false)
    const error = ref<Error | null>(null)

    const fetchData = async () => {
      isLoading.value = true
      error.value = null

      try {
        const db = await $db
        data.value = await db.getAll(key)
      } catch (e) {
        error.value = e as Error
      } finally {
        isLoading.value = false
      }
    }

    fetchData()

    return { data, isLoading, error, refetch: fetchData }
  }

  /**
   * Fetch a single record from the store
   *
   * @param key The key of the store (e.g. table name)
   * @param id The ID of the record to fetch
   * @param options Options for the query
   * @param options.paused Whether to pause the query
   */
  const one = <T extends DBKey>(key: T, id?: Schema[T]["key"], options?: QueryOptions) => {
    const data = ref<Schema[T]["value"] | undefined>()
    const isLoading = ref(false)
    const isPaused = ref(!!options?.paused)
    const error = ref<Error | null>(null)

    const setPaused = (paused: boolean) => {
      isPaused.value = paused
    }

    const fetchData = async (_id?: Schema[T]["key"]) => {
      const resolvedId = _id || id

      if (!resolvedId || isPaused.value) return

      isLoading.value = true
      error.value = null

      try {
        const db = await $db
        data.value = await db.get(key, resolvedId)

        return data.value
      } catch (e) {
        error.value = e as Error
      } finally {
        isLoading.value = false
      }
    }

    fetchData()

    return { data, isLoading, error, setPaused, refetch: fetchData }
  }

  /**
   * Remove a record from the store
   *
   * @param key The key of the store (e.g. table name)
   * @param id The ID of the record to remove
   * @returns A promise that resolves when the record is removed
   */
  const remove = async <T extends DBKey>(key: T, id: Schema[T]["key"]) => {
    const db = await $db

    return await db.delete(key, id)
  }

  /**
   * Update a record in the store
   * @param key The key of the store (e.g. table name)
   * @param value The new value of the record
   * @returns A promise that resolves when the record is updated
   */
  const update = async <T extends DBKey>(key: T, value: Schema[T]["value"]) => {
    const db = await $db

    return await db.put(key, value)
  }

  /**
   * Create a new record in the store
   *
   * @param key The key of the store (e.g. table name)
   * @param value The value of the record to create
   * @returns A promise that resolves when the record is created
   */
  const create = async <T extends DBKey>(key: T, value: Omit<Schema[T]["value"], "id">) => {
    const db = await $db

    return await db.add(key, value)
  }

  return { all, one, remove, update, create }
}
