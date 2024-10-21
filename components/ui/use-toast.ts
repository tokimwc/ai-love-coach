import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast"
import { useState, useCallback } from "react"

type ToastOptions = Omit<ToastProps, "id"> & {
  id?: string
  title?: string
  description?: string
  action?: ToastActionElement
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastOptions[]>([])

  const addToast = useCallback((options: ToastOptions) => {
    const id = options.id || Date.now().toString()
    setToasts((currentToasts) => [
      ...currentToasts,
      { ...options, id },
    ])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    )
  }, [])

  return {
    toasts,
    addToast,
    dismissToast,
    toast: addToast
  }
}

export { Toast }