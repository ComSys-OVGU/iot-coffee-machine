// This file is shared across the demos.

import React from 'react'
import DeveloperBoardIcon from 'material-ui-icons/DeveloperBoard'
import StarIcon from 'material-ui-icons/Star'

import AppDrawerNavItem from './AppDrawerNavItem'

export const menuItems = (
  <React.Fragment>
    <AppDrawerNavItem title='Control' href='/test.1' icon={StarIcon} />
    <AppDrawerNavItem title='Develop' href='/test' icon={DeveloperBoardIcon} />
  </React.Fragment>
)
