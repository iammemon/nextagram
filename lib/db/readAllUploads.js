import loadDb from './loadDb'

export default async (serverDb) => {
    const db = !serverDb ? await loadDb() : serverDb
    const rootRef = db().ref()
    const uploadRef = rootRef.child('uploads')
    const snap = await uploadRef.once('value')
    const data = snap.exists() && snap.val()
    return transform(data)
}

export const getUploadByIds = async (ids, ref) => {
    const uploads = await Promise.all(ids.map(id =>
        ref.child(id).once('value')
    ))
    return uploads.map(obj => {
        return { key: obj.key, ...obj.val() }
    })
}

export const getUploadById = async (id) => {
    const db = await loadDb()
    const rootRef = db().ref()
    const uploadRef = rootRef.child(`uploads/${id}`)
    const snap = await uploadRef.once('value')
    return { key: snap.key, ...snap.val() }
}

export const transform =(data)=>{
    return data && Object.keys(data).map(key => {
        return { key, ...data[key] }
    })
}

export const likeCountObserver = async (id, onLike) => {
    const db = await loadDb()
    const rootRef = db().ref()
    const likeRef = rootRef.child(`uploads/${id}/totalLikes`)
    likeRef.on('value', onLike)
    return () => likeRef.off('value', onLike)
}
export const commentCountObserver = async (id, onComment) => {
    const db = await loadDb()
    const rootRef = db().ref()
    const commentRef = rootRef.child(`uploads/${id}/totalComments`)
    commentRef.on('value', onComment)
    return () => commentRef.off('value', onComment)
}