export default (stateObserver, errorObserver, completeObserver) => {
    //currying 
    return (uploadTask) => {
        uploadTask.on('state_changed', stateObserver, errorObserver, () => {
            completeObserver(uploadTask)
        })
    }
}