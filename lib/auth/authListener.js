import loadAuth from './loadAuth'

export default async (cb)=>{
    const auth= await loadAuth()
    return auth().onAuthStateChanged(cb)
    
}