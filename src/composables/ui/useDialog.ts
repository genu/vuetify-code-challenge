import { useOverlay } from "./useOverlay"
import DialogConfirm from "@/components/dialogs/Confirm.vue"

type CallbackFn = () => void | Promise<void>
interface DialogInstance {
  onConfirm: (fn: CallbackFn) => DialogInstance
  onDismiss: (fn: CallbackFn) => DialogInstance
  open: () => DialogInstance
}

export const useDialog = () => {
  const overlay = useOverlay()

  const confirm = (options: Omit<InstanceType<typeof DialogConfirm>["$props"], "onDismiss" | "onConfirm">) => {
    let confirmCallback: CallbackFn = () => {}
    let dismissCallback: CallbackFn = () => {}

    const dialog = overlay.create(DialogConfirm, { props: options })

    const dialogInstance: DialogInstance = {
      onConfirm: (fn: CallbackFn) => {
        confirmCallback = fn
        return dialogInstance
      },
      onDismiss: (fn: CallbackFn) => {
        dismissCallback = fn
        return dialogInstance
      },
      open: () => {
        dialog.open()
        return dialogInstance
      },
    }

    // Add default handlers
    dialog.replace({
      ...options,
      onConfirm: async () => {
        await confirmCallback()
        dialog.close()
      },
      onDismiss: async () => {
        await dismissCallback()
        dialog.close()
      },
    })

    return dialogInstance
  }

  const alert = () => {}

  return { confirm, alert }
}
