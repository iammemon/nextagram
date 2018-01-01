import loadStorage from './loadStorage'

export default async (path)=>{
    const storage =await loadStorage()
    return storage().ref(path).delete()
}