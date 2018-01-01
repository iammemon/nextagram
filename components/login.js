import { Button, Icon } from 'semantic-ui-react'
import Title from './title'

const SignInBtn = ({onSignIn,loading}) => (
    <Button color='google plus' size='huge' onClick={onSignIn} loading={loading} >
        <Icon name='google plus' /> SignIn With Google
    </Button>
)

export default ({onSignIn,loading}) => (
    <div className='container'>

        <div className='login-box'>
            <Title text="Nextagram" />
            <SignInBtn onSignIn={onSignIn} loading={loading} />
        </div>
        <style jsx>{`
            .container{
                display:flex;
                justify-content:center;
                align-items:center;
                height:100vh;
            }
            .login-box{
                margin-top:-200px;
                text-align:center;
            }
        `}</style>
    </div>


)