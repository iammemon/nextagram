import loadDb from './loadDb'

export const child_add_observer = async (path, onChildAdded) => {
    const db = await loadDb()
    const Ref = db().ref(path)
    Ref.orderByKey()
        .limitToLast(1)
        .on('child_added', onChildAdded)
    return () => Ref.off('child_added', onChildAdded)
}

export const child_remove_observer = async (path, onChildRemoved) => {
    const db = await loadDb()
    const Ref = db().ref(path)
    Ref.on('child_removed', onChildRemoved)
    return () => Ref.off('child_removed', onChildRemoved)
}

export const value_observer = async (path, onValue) => {
    const db = await loadDb()
    const Ref = db().ref(path)
    Ref.on('value', onValue)
    return () => Ref.off('value', onValue)
}