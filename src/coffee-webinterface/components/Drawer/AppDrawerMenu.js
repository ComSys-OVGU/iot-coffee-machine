// This file is shared across the demos.

import React from 'react'
import DeveloperBoardIcon from 'material-ui-icons/DeveloperBoard'
import StarIcon from 'material-ui-icons/Star'
import ListIcon from 'material-ui-icons/List'

import AppDrawerNavItem from './AppDrawerNavItem'

export const menuItems = (
  <React.Fragment>
    <AppDrawerNavItem title='Order' href='/order' icon={StarIcon} />
    <AppDrawerNavItem title='History' href='/history' icon={ListIcon} />
    {/*<AppDrawerNavItem title='Control' href='/control' icon={StarIcon} />
    <AppDrawerNavItem title='Develop' href='/test' icon={DeveloperBoardIcon} />*/}
  </React.Fragment>
)
