import React, { Component } from 'react';
import Router from 'next/router'
import 'isomorphic-fetch'
import Page from '../components/page'
import Login from '../components/login'
import signIn from '../lib/auth/signIn'
import authListener from '../lib/auth/authListener'


export default class extends Component {

    state = {
        loading: false
    }
    async componentDidMount() {
        this.authUnsub =await authListener(this.onAuthChange)
    }   
    componentWillUnmount() {
         this.authUnsub()
    }
    onAuthChange = async (user) => {
        if (user) {
            const token = await user.getIdToken()
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                credentials: 'same-origin',
                body: JSON.stringify({ token })
            })
            response.status && Router.push('/profile')
        }
    }
    signInHandler = () => {
        this.setState({ loading: true })
        signIn()
    }
    render() {
        return (
            <Page>
                <div>
                    <Login onSignIn={this.signInHandler} loading={this.state.loading} />
                </div>
            </Page>
        );
    }
}

