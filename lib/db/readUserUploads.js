import loadDb from './loadDb'
import { getUploadByIds } from './readAllUploads'

export default async (uid, serverDb) => {
    const db = !serverDb ? await loadDb() : serverDb
    const rootRef = db().ref()
    const userUploadRef = rootRef.child(`users/${uid}/uploads`)
    const uploadRef = rootRef.child(`uploads`)
    const snap = await userUploadRef.once('value')
    if (!snap.exists()) return null
    const ids = Object.keys(snap.val())
    return getUploadByIds(ids, uploadRef)

}

export const child_add_observer = async (uid, onChildAdded) => {
    const db = await loadDb()
    
    const userUploadRef = db().ref(`users/${uid}/uploads`)
    userUploadRef.orderByKey()
        .limitToLast(1)
        .on('child_added', onChildAdded)
    return () => userUploadRef.off('child_added', onChildAdded)
}

export const child_remove_observer = async (uid, onChildRemoved) => {
    const db = await loadDb()
    const userUploadRef = db().ref(`users/${uid}/uploads`)
    userUploadRef.on('child_removed', onChildRemoved)
    return () => userUploadRef.off('child_removed', onChildRemoved)
}


