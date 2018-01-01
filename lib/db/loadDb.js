import firebaseInit from '../init'

export default async () => {
    const app = await firebaseInit()
    await import('firebase/database')
    return app.database;   
}