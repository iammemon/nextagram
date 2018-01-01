import firebaseInit from '../init'

export default async (cb)=>{
    const app = await firebaseInit()
    await import('firebase/auth')
    return app.auth
}