import React, { useEffect, useRef } from 'react'
import { CodeLayerToastButtons } from './CodeLayerToastButtons'
import { toast } from 'sonner'

interface UndoToastProps {
  message: string
  title?: string
  onUndo: () => void | Promise<void>
  onDismiss: () => void
  toastId?: string | number
}

export const UndoToast: React.FC<UndoToastProps> = ({ message, title, onUndo, onDismiss, toastId }) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    // Store a reference to this toast's button for the z hotkey to access
    if (toastId && buttonRef.current) {
      // Store in a global map so the z hotkey can find it
      const toastButtons = (window as any).__undoToastButtons || {}
      toastButtons[toastId] = buttonRef.current
      ;(window as any).__undoToastButtons = toastButtons

      // Cleanup on unmount
      return () => {
        delete toastButtons[toastId]
      }
    }
  }, [toastId])
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm">{message}</div>
      {title && <div className="text-xs opacity-75 mt-1">{title}</div>}
      <CodeLayerToastButtons
        actionRef={buttonRef}
        action={{
          label: (
            <span className="flex items-center gap-1">
              Undo
              <kbd className="ml-1 px-1.5 py-0.5 text-sm font-medium bg-background/50 rounded border border-border">
                Z
              </kbd>
            </span>
          ),
          onClick: async () => {
            console.log('[UNDO-DEBUG] UndoToast onClick triggered')
            console.log('[UNDO-DEBUG] Message:', message)
            try {
              console.log('[UNDO-DEBUG] Calling onUndo function...')
              await onUndo()
              console.log('[UNDO-DEBUG] onUndo completed successfully')

              // Dismiss the toast after successful undo
              if (toastId) {
                toast.dismiss(toastId)
              }

              onDismiss()
            } catch (error) {
              console.error('[UNDO-DEBUG] Failed to execute undo:', error)
              console.error('[UNDO-DEBUG] Error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
              })
            }
          },
        }}
        variant="default"
      />
    </div>
  )
}
