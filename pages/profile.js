import React, { Component } from 'react';
import { Header, Icon, Image } from 'semantic-ui-react'
import Router from 'next/router'
import 'isomorphic-fetch'
import pick from 'lodash/pick'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import reverse from 'lodash/reverse'
import some from 'lodash/some'

import AuthPage from '../hoc/authPage'
import Page from '../components/page'
import Nav from '../components/nav'
import Card from '../components/card'
import Grid from '../components/grid'
import Modal from '../components/comment-modal'
import UploadFile from '../components/upload-file'
import getUserUploads from '../lib/db/readUserUploads'
import { getUploadById } from '../lib/db/readAllUploads'
import { child_add_observer, child_remove_observer } from '../lib/db/observers'


class Profile extends Component {
    static async getInitialProps({ req },user) {

        let data = []
        if (req && req.firebaseServer) {
            const { firebaseServer: { database } } = req
            data = await getUserUploads(user.uid, database)
            reverse(data)
        }
        return { data }
    }

    state = {
        data: this.props.data || [],
        displayComments: false,
        selectedCardData: {}
    }
    async componentDidMount() {
       
        const {user,ssr}=this.props
        const path = `users/${user.uid}/uploads`
        //prevent observers not to trigger before initial data load
        this.timeoutHandler = setTimeout(async () => {
            this.unsubChildAdded = await child_add_observer(path, this.onChildAdd)
            this.unsubChildRemoved = await child_remove_observer(path, this.onChildRemove)
            this.timeoutHandler = null
        }, 5000)
        if (user && !ssr) {
            const updatedData = await getUserUploads(user.uid)
            this.setState({ data: updatedData })
        }
    }
    componentWillUnmount() {
        //observers are not attached yet
        //so clear the timeout and return 
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler)
            return
        }
       
       this.unsubChildAdded()
       this.unsubChildRemoved()
    }

    onChildAdd = async (snap) => {
        const newData = await getUploadById(snap.key)
        const { data } = this.state
        //if its not in data then change state
        if (!some(data, ['key', newData.key])) {
            const updatedData = [...data, newData]
            this.setState({
                data: updatedData
            })
        }
    }
    onChildRemove = (snap) => {
        const updatedData = filter(this.state.data, (obj) => obj.key != snap.key)
        this.setState({ data: updatedData })
    }
    openCommentModal = (cardData, uploadBy) => {
        this.setState({
            displayComments: true,
            selectedCardData: { cardData, uploadBy }
        })
    }
    closeCommentModal = () => {
        this.setState({
            displayComments: false,
            selectedCardData: {}
        })
    }
    __renderCards = (data, user) => {

        return !isEmpty(data) && !isEmpty(user) ?
            data.map(upload => (
                <Card key={upload.key}
                    remove
                    user={user}
                    data={upload}
                    uploadBy={user}
                    onComment={this.openCommentModal} />

            ))
            : <Header as='h3' color='grey'>No Record Found</Header>
    }

    render() {
        const {
            data,
            displayComments,
            selectedCardData: { cardData, uploadBy }
        } = this.state
        const { user } = this.props
        return (

            <Page>
                <Nav />
                <div style={{ margin: '20px' }}>
                    <h1>{user.name}</h1>
                    <UploadFile uid={user.uid} />
                    <div style={{ marginTop: '50px' }}>
                        <Header as='h2' dividing>
                            <Icon name='photo' />
                            Gallery
                            </Header>
                        <Grid>
                            {this.__renderCards(data, user)}
                        </Grid>
                    </div>
                </div>
                {
                    displayComments
                    &&
                    <Modal
                        open={displayComments}
                        data={cardData}
                        uploadBy={uploadBy}
                        user={user}
                        onClose={this.closeCommentModal} />
                }
            </Page>
        );
    }
}

export default AuthPage(Profile);
