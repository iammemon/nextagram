import React, { Component } from 'react';
import pick from 'lodash/pick'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import reverse from 'lodash/reverse'
import some from 'lodash/some'
import { Header, Icon, Image } from 'semantic-ui-react'

import readUploads from '../lib/db/readAllUploads'
import { child_add_observer, child_remove_observer } from '../lib/db/observers'
import AuthPage from '../hoc/authPage'
import Page from '../components/page'
import Nav from '../components/nav'
import Card from '../components/card'
import Grid from '../components/grid'
import Modal from '../components/comment-modal'

class Home extends Component {
    static async getInitialProps({ req }, user) {

        let data = []
        if (req && req.firebaseServer) {
            const { firebaseServer: { database } } = req
            data = await readUploads(database)
            reverse(data)
        }
        return { data }
    }

    state = {
        data: this.props.data,
        displayComments: false,
        selectedCardData: {}
    }
    async componentDidMount() {

        const { user, ssr } = this.props
        const path = `uploads`
        //prevent observers not to trigger before initial data load
        this.timeoutHandler = setTimeout(async () => {
            this.unsubChildAdded = await child_add_observer(path, this.onChildAdd)
            this.unsubChildRemoved = await child_remove_observer(path, this.onChildRemove)
            this.timeoutHandler = null
        }, 1000*30)
        if (user && !ssr) {
            const updatedData = await readUploads()
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
        const newData = { key: snap.key, ...snap.val() }
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
                    user={user}
                    data={upload}
                    onComment={this.openCommentModal} />
            ))
            : <Header as='h3' color='grey'>No Record Found</Header>

    }
    render() {
        const { user } = this.props
        const { data,
            displayComments,
            selectedCardData: { cardData, uploadBy } } = this.state
        return (
            <Page>
                <Nav />
                <div style={{ margin: '20px' }}>
                    {/* <Image src={user.picture} avatar size='tiny' /> */}
                    <h1>{user.name}</h1>
                    <div style={{ marginTop: '50px' }}>
                        <Header as='h2' dividing>
                            <Icon name='image' />
                            NewsFeed
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

export default AuthPage(Home);