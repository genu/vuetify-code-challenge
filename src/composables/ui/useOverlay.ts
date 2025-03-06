import type { Component } from "vue"
import { reactive, markRaw, shallowReactive } from "vue"

import type { ComponentProps } from "vue-component-type-helpers"

export type OverlayOptions<OverlayAttrs = Record<string, unknown>> = {
  defaultOpen?: boolean
  props?: OverlayAttrs
  destroyOnClose?: boolean
  initialProps?: OverlayAttrs
}

type ManagedOverlayOptionsPrivate<T extends Component> = {
  component?: T
  id: symbol
  isMounted: boolean
  modelValue: boolean
  resolvePromise?: (value: unknown) => void
}
export type Overlay = OverlayOptions<Component> & ManagedOverlayOptionsPrivate<Component>

interface OverlayInstance<T> {
  open: (props?: ComponentProps<T>) => Promise<unknown>
  close: (value?: unknown) => void
  patch: (props: Partial<ComponentProps<T>>) => void
  replace: (props: ComponentProps<T>) => void
}

const overlays = shallowReactive<Overlay[]>([])

export const useOverlay = () => {
  const create = <T extends Component>(component: T, _options?: OverlayOptions<ComponentProps<T>>): OverlayInstance<T> => {
    const { props: props, defaultOpen, destroyOnClose } = _options || {}

    const options = reactive<Overlay>({
      id: Symbol("useOverlay"),
      modelValue: !!defaultOpen,
      component: markRaw(component!),
      isMounted: !!defaultOpen,
      destroyOnClose: !!destroyOnClose,
      props: props || {},
      initialProps: props ? { ...props } : {},
    })

    overlays.push(options)

    return {
      open: <T extends Component>(props?: ComponentProps<T>) => open(options.id, props),
      close: (value) => close(options.id, value),
      patch: <T extends Component>(props: Partial<ComponentProps<T>>) => patch(options.id, props),
      replace: <T extends Component>(props: ComponentProps<T>) => replaceProps(options.id, props),
    }
  }

  const replaceProps = <T extends Component>(id: symbol, props: ComponentProps<T>): void => {
    const overlay = getOverlay(id)

    overlay.props = props
    overlay.initialProps = { ...props }
  }

  const open = <T extends Component>(id: symbol, props?: ComponentProps<T>): Promise<unknown> => {
    const overlay = getOverlay(id)

    // If props are provided, update the overlay's props
    if (props) {
      patch(overlay.id, props)
    } else {
      // If no props are provided, reset the overlay's props to the initial props
      overlay.props = { ...overlay.initialProps }
    }

    overlay.modelValue = true
    overlay.isMounted = true

    // Return a new promise that will be resolved when close is called
    return new Promise((resolve) => {
      overlay.resolvePromise = resolve
    })
  }

  const close = (id: symbol, value?: unknown): void => {
    const overlay = getOverlay(id)

    overlay.modelValue = false

    // Resolve the promise if it exists
    if (overlay.resolvePromise) {
      overlay.resolvePromise(value)
      overlay.resolvePromise = undefined
    }
  }

  const unMount = (id: symbol): void => {
    const overlay = getOverlay(id)

    overlay.isMounted = false

    if (overlay.destroyOnClose) {
      const index = overlays.findIndex((overlay) => overlay.id === id)
      overlays.splice(index, 1)
    }
  }

  const patch = <T extends Component>(id: symbol, props: Partial<ComponentProps<T>>): void => {
    const overlay = getOverlay(id)

    Object.entries(props).forEach(([key, value]) => {
      ;(overlay.props as Record<string, unknown>)[key] = value
    })
  }

  const getOverlay = (id: symbol): Overlay => {
    const overlay = overlays.find((overlay) => overlay.id === id)

    if (!overlay) {
      throw new Error("Overlay not found")
    }

    return overlay
  }

  return {
    overlays,
    open,
    close,
    create,
    patch,
    unMount,
  }
}
