import loadAuth from './loadAuth'

export default async ()=>{
    const auth =await loadAuth()
    const provider=new auth.GoogleAuthProvider()
    try {
      await auth().signInWithPopup(provider)
             
    } catch (error) {
        if (error.code == 'auth/popup-blocked') {
            auth().signInWithRedirect(provider)
        }
        console.log(error.message)
    }
    
        
}