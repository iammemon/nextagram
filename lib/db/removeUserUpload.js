import loadDb from './loadDb'
import removeImage from '../storage/removeImage'

export default async (uid, photoId) => {
    const db = await loadDb()
    const rootRef = db().ref()
    const userUploadRef = rootRef.child(`users/${uid}/uploads/${photoId}`)
    const imgFullPath = await userUploadRef.child('fullPath').once('value')
    const uploadRef = rootRef.child(`uploads/${photoId}`)
    const commentRef =rootRef.child(`comments/${photoId}`)
    const likeRef=rootRef.child(`likes/${photoId}`)
    return Promise.all([
        userUploadRef.remove(),
        uploadRef.remove(),
        commentRef.remove(),
        likeRef.remove(),
        removeImage(imgFullPath.val())
    ])

}