import LoadAuth from './loadAuth'
export default async ()=>{
    const auth=await LoadAuth()
    auth().signOut()
}