import loadDb from './loadDb'
export default async (user,text,photoId)=>{
    const db=await loadDb()
    const rootRef=db().ref()
    //read
    const commentRef=rootRef.child('comments')
    let totalComments =await commentRef.child(`${photoId}/totalComments`).once('value')
    totalComments = totalComments.exists() ? totalComments.val():0
    //write
    const key=commentRef.child(`${photoId}/users`).push().key
    
    const dataToBeUpdated={
        [`uploads/${photoId}/totalComments`]:totalComments +1,
        [`comments/${photoId}/totalComments`]:totalComments+1,
        [`comments/${photoId}/users/${key}`]:{text,timestamp:Date.now(),...user}
    }
    return rootRef.update(dataToBeUpdated)
}