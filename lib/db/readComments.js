import loadDb from './loadDb'
export default async(photoId,onCommentValue)=>{
    const db= await loadDb()
    const userCommentRef = db().ref(`comments/${photoId}/users`)
    userCommentRef.on('value',onCommentValue)
    return ()=>userCommentRef.off('value',onCommentValue)   
}