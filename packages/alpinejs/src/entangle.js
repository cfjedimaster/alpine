import { effect, release } from './reactivity'

export function entangle({ get: outerGet, set: outerSet }, { get: innerGet, set: innerSet }) {
    let firstRun = true
    let outerHash, innerHash

    let reference = effect(() => {
        let outer, inner

        if (firstRun) {
            outer = outerGet()
            innerSet(outer)
            inner = innerGet()
            firstRun = false
        } else {
            outer = outerGet()
            inner = innerGet()

            outerHashLatest = JSON.stringify(outer)
            innerHashLatest = JSON.stringify(inner)

            if (outerHashLatest !== outerHash) { // If outer changed...
                inner = innerGet()
                innerSet(outer)
                inner = outer // Assign inner to outer so that it can be serialized for diffing...
            } else { // If inner changed...
                outerSet(inner)
                outer = inner // Assign outer to inner so that it can be serialized for diffing...
            }
        }

        // Re serialize values...
        outerHash = JSON.stringify(outer)
        innerHash = JSON.stringify(inner)
    })

    return () => {
        release(reference)
    }
}
