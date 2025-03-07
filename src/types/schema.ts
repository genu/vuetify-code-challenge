import type { DBSchema } from "idb"

export interface Schema extends DBSchema {
  authors: {
    key: number
    value: {
      id: number
      firstName: string
      lastName: string
    }
  }
  posts: {
    key: number
    value: {
      id?: number
      title?: string
      content?: string
      authorId?: number
      postedAt?: Date
    }
  }
}

export type DBKey = "authors" | "posts"

export {}
