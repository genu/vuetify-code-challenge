import type { App, Plugin } from "vue"
import { openDB } from "idb"
import type { Schema } from "@/types/schema"

const idbPlugin: Plugin = {
  install: (app: App) => {
    const $db = openDB<Schema>("App", 1, {
      upgrade(db) {
        db.createObjectStore("posts", { keyPath: "id", autoIncrement: true })
        db.createObjectStore("authors", { keyPath: "id", autoIncrement: true })
      },
    })

    app.provide("$db", $db)
  },
}

export default idbPlugin
