const listeners = []
const state = {}
let noop = x => x

function subscribe (fn) {
  listeners.push(fn)
}

function unsubscribe (fn) {
  listeners.splice(listeners.indexOf(fn), 1)
}

function mutate (mutation) {
  mutation = mutation || noop
  let i = 0
  let l = listeners.length
  let fn
  mutation(state)
  for (i; i < l; i++) {
    fn = listeners[i]
    fn(state)
  }
}

function merge (o, n) {
  for (let prop in n) {
    o[prop] = n[prop]
  }
}

function store (initialState) {
  if (initialState) {
    merge(state, initialState)
  }
  return state
}

store.subscribe = subscribe
store.unsubscribe = unsubscribe
store.mutate = mutate

export default store
