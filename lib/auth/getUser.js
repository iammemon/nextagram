import loadAuth from './loadAuth'

export default async () => {
    const auth = await loadAuth()
    return auth().currentUser
}