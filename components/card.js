import React, { Component } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardMeta,
    CardDescription,
    Image,
    Button,
    Confirm
} from 'semantic-ui-react'
import removeUserImage from '../lib/db/removeUserUpload'
import { value_observer } from '../lib/db/observers'
import checkLikeState from '../lib/db/readLikes'
import timeAgo from '../lib/helpers/time-ago'
import getUser from '../lib/db/readUserInfo'
import writeLike from '../lib/db/writeLikes'


export default class extends Component {
    state = {
        remove: this.props.remove || false,
        data: this.props.data,
        user: this.props.user,
        likeBtnActive: false,
        uploadBy: this.props.uploadBy || '',
        confirm: false
    }
    async componentDidMount() {
        let { uploadBy, data, user } = this.state
        const photoId = data.key
        const likeState = await checkLikeState(photoId, user.uid)
        const path = `uploads/${photoId}`
        this.unsubscribeLike = await value_observer(
            `${path}/totalLikes`,
            this.onLikeChanged
        )
        this.unsubscribeComment = await value_observer(
            `${path}/totalComments`,
            this.onCommentChanged
        )
        if (!uploadBy) {
            uploadBy = await getUser(data.uid)
            this.setState({
                likeBtnActive: likeState,
                uploadBy
            })
        }
        else {
            this.setState({ likeBtnActive: likeState })
        }

    }
    componentWillUnmount() {
        if(!this.unsubscribeLike) return
        this.unsubscribeLike()
        this.unsubscribeComment()
    }
    onLikeChanged = (snap) => {
        const updatedData = Object.assign({}, this.state.data, { totalLikes: snap.val() })
        this.setState({
            data: updatedData
        })
    }
    onCommentChanged = (snap) => {
        const updatedData = Object.assign({}, this.state.data, { totalComments: snap.val() })
        this.setState({
            data: updatedData
        })
    }

    onRemove = () => {
        this.setState({
            confirm: true
        })

    }
    onConfirm = () => {
        const { user: { uid }, data: { key } } = this.state
        removeUserImage(uid, key)
    }
    onCofirmCancel = () => {
        this.setState({
            confirm: false
        })
    }
    onLikeHandler = () => {

        const { user: { uid }, data: { key }, likeBtnActive } = this.state
        const toggle = likeBtnActive ? 'dec' : 'inc'
        this.setState({
            likeBtnActive: !likeBtnActive
        })
        writeLike(uid, key, toggle).catch(() => {
            this.setState({
                likeBtnActive: likeBtnActive
            })
        })


    }

    render() {
        const { data,
            likeBtnActive,
            uploadBy: { name, picture },
            user,
            remove,
            confirm } = this.state
        const { downloadURL,
            description,
            totalLikes,
            totalComments,
            timestamp } = data

        return (
            <div>
                <Card className={remove ? 'card-hack' : ''}>
                    {
                        remove && <Button icon="delete"
                            className="btn-hack"
                            onClick={this.onRemove}
                            color="youtube" />
                    }
                    {
                        remove && <Confirm
                            open={confirm}
                            onCancel={this.onCofirmCancel}
                            onConfirm={this.onConfirm} />
                    }

                    <Image src={downloadURL} size='medium' shape='rounded' />
                    <CardContent>
                        <CardHeader>
                            <Image avatar src={picture} />
                            <span>{name}</span>
                        </CardHeader>
                        <CardMeta>
                            <p>{timeAgo(new Date(timestamp))}</p>
                        </CardMeta>
                        <CardDescription>
                            {
                                description.length > 100 ?
                                    `${description.substring(0, 100)}...` :
                                    description
                            }
                        </CardDescription>
                    </CardContent>
                    <CardContent extra>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Button
                                style={{ margin: '10px 10px' }}
                                icon='heart'
                                color={likeBtnActive ? 'youtube' : 'grey'}
                                active={likeBtnActive}
                                label={{ as: 'a', basic: true, content: totalLikes }}
                                labelPosition='right'
                                onClick={this.onLikeHandler}
                            />
                            <Button
                                style={{ margin: '0px 15px' }}
                                icon='comments outline'
                                color='instagram'
                                label={{ as: 'a', basic: true, content: totalComments }}
                                labelPosition='right'
                                onClick={() => this.props.onComment(data, this.state.uploadBy)}
                            />
                        </div>
                    </CardContent>

                </Card>
                <style jsx global>{`
                .card-hack{
                    overflow:hidden;
                }
                .card-hack .btn-hack{
                    position:absolute
                    top:-40px;
                    z-index:1;
                    transition:all 0.3s ease;
                }
                .card-hack:hover{
                    cursor:pointer
                }
                .card-hack:hover .btn-hack{
                    top:0px
                }
                `}</style>
            </div>
        );
    }
}
