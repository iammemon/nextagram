import firebaseInit from '../init'

export default async (cb) => {
    const app = await firebaseInit()
    await import('firebase/storage')
    return app.storage
}