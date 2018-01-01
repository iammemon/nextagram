import {
    Comment,
    CommentAvatar,
    CommentAuthor,
    CommentContent,
    CommentMetadata,
    CommentText
} from 'semantic-ui-react'
import timeAgo from '../lib/helpers/time-ago'


export default ({avatar,author,timestamp,text}) => (
    <Comment>
        <CommentAvatar as='a' src={avatar} />
        <CommentContent>
            <CommentAuthor as='a'>{author}</CommentAuthor>
            <CommentMetadata>
                <span>{timeAgo(new Date(timestamp))} </span>
            </CommentMetadata>
            <CommentText>{text}</CommentText>
        </CommentContent>
    </Comment>
)