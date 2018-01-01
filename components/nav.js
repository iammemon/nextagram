import Link from 'next/link'
import { Menu, MenuItem, MenuMenu } from 'semantic-ui-react'
import Title from '../components/title'
import signOut from '../lib/auth/signOut'

export default () => (
    <div>
        <Menu size='massive'>
            <MenuItem header><Title small text="Nextagram" /></MenuItem>
            <Link prefetch href="/home"><MenuItem name="home" /></Link>
            <Link prefetch href="/profile"><MenuItem name="profile" /></Link>
            <MenuMenu position='right'>
                <MenuItem name="logout" onClick={signOut} />
            </MenuMenu>
        </Menu>
    </div>
)