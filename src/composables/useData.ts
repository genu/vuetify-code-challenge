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

  const one = <T extends DBKey>(key: T, id?: Schema[T]["key"], options?: QueryOptions) => {
    const data = ref<Schema[T]["value"] | undefined>()
    const isLoading = ref(false)
    const isPaused = ref(!!options?.paused)
    const error = ref<Error | null>(null)

    const setPaused = (paused: boolean) => {
      isPaused.value = paused
    }

    const fetchData = async () => {
      if (!id || isPaused.value) return

      isLoading.value = true
      error.value = null

      try {
        const db = await $db
        data.value = await db.get(key, id)

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

  const remove = async <T extends DBKey>(key: T, id: Schema[T]["key"]) => {
    const db = await $db

    return await db.delete(key, id)
  }

  const update = async <T extends DBKey>(key: T, value: Schema[T]["value"]) => {
    const db = await $db

    return await db.put(key, value)
  }

  const create = async <T extends DBKey>(key: T, value: Omit<Schema[T]["value"], "id">) => {
    const db = await $db

    return await db.add(key, value)
  }

  return { all, one, remove, update, create }
}
