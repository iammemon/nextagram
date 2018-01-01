import React, { Component } from 'react';
import UploadBtn from './upload-btn'
import Modal from './upload-modal'
import uploadImage from '../lib/storage/uploadImage'
import uploadListener from '../lib/storage/stateListener'
import writeFileData from '../lib/db/writeFileData'

export default class extends Component {
    state = {
        modal: false,
        img: '',
        imgDesp: '',
        progress: 0,
        loading: false,
        fileName: '',
    }

    uploadHandler = () => {
        this._file.click()
    }
    fileChange = (evt) => {
        const file = evt.target.files[0]
        const reader = new FileReader()
        reader.onload = () => this.setState({
            fileName: file.name,
            img: reader.result,
            modal: true
        })
        reader.readAsDataURL(file)

    }
    despHandler = (evt) => {
        this.setState({ imgDesp: evt.target.value })
    }
    postHandler = () => {
        this.setState({ loading: true })
        const {fileName,img}=this.state
        const path=`uploads/${this.props.uid}/images/${fileName}`
        const withObserversAttached = uploadListener(this.stateObserver,
            this.errorObserver,
            this.completeObserver)
        uploadImage(path,img,withObserversAttached)    
    }
    stateObserver = (snap) => {
        const progress = (snap.bytesTransferred / snap.totalBytes) * 100
        this.setState({ progress })
    }
    errorObserver = (error) => {
        console.log(error)
    }
    completeObserver = (task) => {
        const description=this.state.imgDesp
        this.setState({
            loading: false,
            modal: false,
            progress: 0,
            img: '',
            imgDesp: '',
            fileName: ''
        })
        const record={snap:task.snapshot,description}
        writeFileData(record,this.props.uid)
    }
    render() {
        const { img, imgDesp, progress, modal, loading } = this.state
        return (
            <div>
                <input
                    type="file"
                    accept='image/*'
                    onChange={this.fileChange}
                    ref={el => (this._file = el)}
                    hidden
                />
                <UploadBtn onUpload={this.uploadHandler} />
                <Modal
                    open={modal}
                    img={img}
                    val={imgDesp}
                    loading={loading}
                    percent={progress}
                    onDescription={this.despHandler}
                    onPost={this.postHandler}
                />
            </div>
        );
    }
}

