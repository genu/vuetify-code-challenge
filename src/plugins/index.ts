import type { App } from "vue"
import vuetify from "./vuetify"
import router from "./router"
import idbPlugin from "./idb"

export function registerPlugins(app: App) {
  app.use(vuetify)
  app.use(router)
  app.use(idbPlugin)
}
