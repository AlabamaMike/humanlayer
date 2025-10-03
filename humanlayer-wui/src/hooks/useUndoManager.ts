import { create } from 'zustand'

export type UndoAction = {
  id: string
  type: 'archive' | 'unarchive' | 'discard_draft' | 'bulk_archive' | 'bulk_discard_draft'
  toastId: string | number
  description: string // e.g., "Session archived", "3 drafts deleted"
  undo: () => Promise<void>
  createdAt: number
}

interface UndoStore {
  actions: UndoAction[]
  addAction: (action: Omit<UndoAction, 'id' | 'createdAt'>) => string
  removeAction: (id: string) => void
  removeByToastId: (toastId: string | number) => void
  getMostRecentAction: () => UndoAction | undefined
  clearAll: () => void
  setupToastCleanup: () => void
}

export const useUndoManager = create<UndoStore>((set, get) => ({
  actions: [],

  addAction: action => {
    const id = `undo-${Date.now()}-${Math.random()}`
    const newAction: UndoAction = {
      ...action,
      id,
      createdAt: Date.now(),
    }

    console.log('[UNDO-DEBUG] Adding action:', newAction.type, '-', newAction.description)

    set(state => ({
      actions: [...state.actions, newAction],
    }))

    return id
  },

  removeAction: id => {
    set(state => ({
      actions: state.actions.filter(a => a.id !== id),
    }))
  },

  removeByToastId: toastId => {
    set(state => ({
      actions: state.actions.filter(a => a.toastId !== toastId),
    }))
  },

  getMostRecentAction: () => {
    const actions = get().actions
    if (actions.length === 0) return undefined

    // Return the most recent action (last in array)
    return actions[actions.length - 1]
  },

  clearAll: () => {
    set({ actions: [] })
  },

  setupToastCleanup: () => {
    // Set up a periodic cleanup (every 10 seconds) to remove stale actions
    setInterval(() => {
      const now = Date.now()
      set(state => ({
        actions: state.actions.filter(action => {
          // Remove actions older than 10 seconds
          // (5s toast duration + 5s buffer)
          return now - action.createdAt < 10000
        }),
      }))
    }, 10000)
  },
}))
