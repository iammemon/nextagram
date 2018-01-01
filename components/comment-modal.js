import React, { Component } from 'react'
import {
    Button,
    Header,
    Image,
    Input,
    Modal,
    ModalHeader,
    ModalContent,
    ModalDescription,
    ModalActions
} from 'semantic-ui-react'
import Comment from './comment-group'
import commentObserver from '../lib/db/readComments'
import writeComment from '../lib/db/writeComments'
export default class extends Component {
    state = {
        allComments: null,
        loading:false,
        text:''
    }
    async componentDidMount() {
        const {key}=this.props.data
        this.unsubComments = await commentObserver(key,this.onCommentChanged)

    }
    componentWillUnmount() {
        this.unsubComments()
    }
    onCommentChanged=(snap)=>{
        
         this.setState({
             allComments:snap.val()
         })
    }
    onTextChanged=(evt)=>{
         this.setState({
             text:evt.target.value
         })
    }
    onCommentPost=()=>{
        this.setState({
            loading:true
        })
        const {user,data:{key}}=this.props
        writeComment(user,this.state.text,key).then(()=>{
            this.setState({
                loading:false,
                text:''
            })
        })
    }
    render() {
        const {allComments,loading}=this.state
        const {
            data: { downloadURL, description },
            uploadBy: { name, picture },
            open, onClose } = this.props
        return (
            <Modal open={open} closeIcon closeOnEscape={false} closeOnDimmerClick={false} onClose={onClose}>
                <ModalHeader>
                    <Image src={picture} avatar />{name}
                </ModalHeader>
                <ModalContent image scrolling>
                    <Image src={downloadURL} size='medium' wrapped />
                    <ModalDescription>
                        <p>{description}</p>
                        <Comment  data={allComments}/>
                    </ModalDescription>
                </ModalContent>
                <ModalActions>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center', paddingTop: '5px'
                    }}>
                        <Input
                            style={{ flex: 4, margin: '0px 5px 8px 0px' }}
                            placeholder='comment...'
                            disabled={loading}
                            value={this.state.text}
                            onChange={this.onTextChanged} />
                        <Button
                            style={{ flex: 1, margin: '0px 0px 8px 5px' }}
                            primary
                            content="Post"
                            loading={loading}
                            onClick={this.onCommentPost} />
                    </div>
                </ModalActions>
            </Modal>
        )
    }
}

