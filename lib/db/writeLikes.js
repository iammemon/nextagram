import loadDb from './loadDb'
export default async (uid, photoId, toggle) => {
    const db = await loadDb()
    const rootRef = db().ref()
    const totalLikesURL = `likes/${photoId}/totalLikes`
    const usersURL = `likes/${photoId}/users/${uid}`
    const uploadTotalLikesURL = `uploads/${photoId}/totalLikes`
    // first read
    let likesCounter = await rootRef.child(uploadTotalLikesURL).once('value')
    likesCounter = likesCounter.exists() ? likesCounter.val() : 0
    //then write
    let dataToBeUpdated = {}
    switch (toggle) {
        case 'inc':
            dataToBeUpdated[totalLikesURL] = likesCounter + 1
            dataToBeUpdated[usersURL] = true
            dataToBeUpdated[uploadTotalLikesURL] = likesCounter + 1
            break;
        case 'dec':
            dataToBeUpdated[totalLikesURL] = likesCounter - 1
            dataToBeUpdated[usersURL] = null
            dataToBeUpdated[uploadTotalLikesURL] = likesCounter - 1
            break;
    }
    return rootRef.update(dataToBeUpdated)
}