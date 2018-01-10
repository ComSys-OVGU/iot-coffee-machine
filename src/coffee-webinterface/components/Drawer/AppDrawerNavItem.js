import NextLink from 'next/link'
import { withRouter } from 'next/router'

import { ListItemIcon, ListItemText } from 'material-ui/List'
import { MenuItem } from 'material-ui/Menu'
import DeveloperBoardIcon from 'material-ui-icons/DeveloperBoard'

const NavItem = ({href, title, icon: Icon = DeveloperBoardIcon, router, ...rest}) => (
  <NextLink href={href} {...rest}>
    <MenuItem {...(router.pathname === href ? {selected: true} : null)}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={title} />
    </MenuItem>
  </NextLink>
)

export default withRouter(NavItem)
