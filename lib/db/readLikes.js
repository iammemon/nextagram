import loadDb from './loadDb'

//to check if the login user already liked the photo or not
//for initial render
export default async(photoId,uid)=>{
    const db=await loadDb()
    const likeRef=db().ref(`likes/${photoId}/users/${uid}`)
    const snap =await likeRef.once('value')
    return snap.exists()
}