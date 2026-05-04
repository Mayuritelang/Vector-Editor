export const createHistory = () => {
  let history = []
  let redoStack = []

  return {
    init(initialState) {
      history = [initialState]
      redoStack = []
    },

    push(state) {
      history.push(state)
      redoStack = []
    },

    undo() {
      if (history.length <= 1) return null

      const current = history.pop()
      redoStack.push(current)

      return history[history.length - 1]
    },

    redo() {
      if (!redoStack.length) return null

      const next = redoStack.pop()
      history.push(next)

      return next
    }
  }
}