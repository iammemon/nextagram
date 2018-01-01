import omit from 'lodash/omit'
import pick from 'lodash/pick'
import loadDb from './loadDb'

export default async (data, uid) => {
    const db = await loadDb()
    const { downloadURL, metadata } = data.snap
    const meta = pick(metadata, ['md5Hash', 'name', 'fullPath'])
    const withOutSnap = omit(data, 'snap')
    const md5Hash = meta.md5Hash
    const timestamp = Date.now()
    const pickData = Object.assign({},
        { uid, downloadURL, timestamp, totalLikes: 0, totalComments: 0 },
        withOutSnap)
    //some time md5hash contain forward slash which we dont want for key
    const key = md5Hash.replace(/\//g, ':')
    const fileRecord = {
        [`uploads/${key}`]: pickData,
        [`users/${uid}/uploads/${key}`]: meta
    }
    return db().ref().update(fileRecord)
}
