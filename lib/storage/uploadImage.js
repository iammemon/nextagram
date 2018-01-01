import loadStorage from './loadStorage'

export default async (path,img,listener) => {
    const storage = await loadStorage()
    const uploadTask=storage().ref(path).putString(img,'data_url')
    listener(uploadTask)
}