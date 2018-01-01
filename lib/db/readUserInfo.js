import loadDb from './loadDb'
export default async (uid)=>{
    const db=await loadDb()
    const snap=await db().ref(`users/${uid}/info`).once('value')
    return {uid,...snap.val()}
}