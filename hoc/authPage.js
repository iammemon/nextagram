import React, { Component } from 'react';
import Router from 'next/router'
import 'isomorphic-fetch'
import pick from 'lodash/pick'

import authListener from '../lib/auth/authListener'

export default Page => class AuthPage extends Component {

    static async getInitialProps(ctx) {
        let user = null, ssr = false
        if (ctx.req && ctx.req.session) {
            const { decodedToken } = ctx.req.session
            user = pick(decodedToken, ['name', 'picture', 'uid'])
            ssr = true
        }
        const pageProps = Page.getInitialProps && await Page.getInitialProps(ctx,user)

        return {
            ...pageProps,
            user,
            ssr
        }
    }
    state = {
        ...this.props
    }
    async componentDidMount() {
        this.unsubAuth = await authListener(this.onAuthChange)
        
    }
    componentWillUnmount() {
        this.unsubAuth()
    }

    onAuthChange = async (user) => {
        if (user) {
            if (!this.state.ssr) {
                const userFromToken = {
                    name: user.displayName,
                    picture: user.photoURL,
                    uid: user.uid
                }
                this.setState({ user: userFromToken })

            }
        }
        else {
            this.setState({ user: null })
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'same-origin'
            })
            response.status && Router.push('/')
        }
    }

    render() {
        return (
            <div>
                {
                    this.state.user && <Page {...this.state} />
                }

            </div>
        );
    }
}

