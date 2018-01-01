import {Button,ButtonContent,Icon} from 'semantic-ui-react'

export default ({onUpload})=>(
    <div>
        <Button color="instagram" size="big" animated="vertical" onClick={onUpload}>
            <ButtonContent visible>Upload</ButtonContent>
            <ButtonContent hidden><Icon name="cloud upload"/></ButtonContent>
        </Button>
    </div>
)