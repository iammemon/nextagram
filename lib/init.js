import Appconfig from '../config/client'

export default async () => {
    const firebase = await import('firebase/app')

    try {
        firebase.initializeApp(Appconfig)
    } catch (err) {
        // we skip the "already exists" message which is
        // not an actual error when we're hot-reloading
        if (!/already exists/.test(err.message)) {
            console.error('Firebase initialization error', err.stack)
        }
    }

    return firebase
}