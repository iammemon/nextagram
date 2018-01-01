import { CommentGroup, Header } from 'semantic-ui-react'
import CommentItem from './comment-item'

export default ({ data }) => (
    <CommentGroup size='large'>
        <Header as='h3' dividing>Comments</Header>
        {
            data ?
            Object.keys(data).map(key => {
                const { name, picture, timestamp, text } = data[key]
                return <CommentItem
                    key={key}
                    avatar={picture}
                    author={name}
                    text={text}
                    timestamp={timestamp} />
            })
            :
            <Header as='h5' color='grey'>0 Comment</Header>
        }
    </CommentGroup>
)

