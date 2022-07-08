import { CoreMenu } from '@core/types';
import { Role } from 'app/auth/models';

export const menu: CoreMenu[] = [
  //  Menus
  //myaccount
  /*{
`    id:'myaccount',
    title: 'My Account',
    translate: 'MENU.MYACC.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'user',
    children: [
      {
        id: 'profile',
        title: 'Profile',
        translate: 'MENU.MYACC.PROFILE',
        type: 'item',
        icon: 'tool',
        url: 'my-account/profile'
      },
      {
        id: 'security',
        title: 'Security',
        translate: 'MENU.MYACC.SECURITY',
        type: 'item',
        icon: 'lock',
        url: 'my-account/security'
      },
      {
        id: 'emailContact',
        title: 'Email and Contact',
        translate: 'MENU.MYACC.EMAILCONTACT',
        type: 'item',
        icon: 'mail',
        url: 'my-account/email-contact'
      },
    ]
  }, */
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    icon: 'mail',
    url: 'dashboard',
  },
  {
    id: 'community',
    title: 'Communities',
    type: 'item',
    icon: 'users',
    url: 'community',
    role : [Role.Admin, Role.SuperAdmin]

  },
  {
    id: 'agency',
    title: 'Agency',
    type: 'item',
    icon: 'codesandbox',
    url: 'agency',
    role : [Role.Community,Role.SuperAdmin,Role.Admin]

  },

  {
    id: 'user',
    title: 'User',
    type: 'item',
    icon: 'user',
    url: 'user',
    role : [Role.Community, Role.SuperAdmin,Role.Admin]

  },

  {
    id: 'user',
    title: 'Agency Personnel ',
    type: 'item',
    icon: 'user',
    url: 'user',
    role : [Role.Agency ]

  },
  // {
  //   id: 'project',
  //   title: 'Project',
  //   type: 'item',
  //   icon: 'pie-chart',
  //   url: 'project',
  //   role : [Role.Admin, Role.SuperAdmin,Role.Community]


  // },
  // {
  //   id: 'contracts',
  //   title: 'Contracts',
  //   type: 'item',
  //   icon: 'clipboard',
  //   url: 'contracts',
  //   role : [Role.Admin, Role.SuperAdmin,Role.User]
  // },
 
  {
    id: 'shift',
    title: 'Shifts',
    type: 'item',
    icon: 'layers',
    url: 'shift',
    role:[Role.Admin, Role.Community,Role.User,Role.Agency,Role.SuperAdmin]
  },
  {
    id: 'management',
    title: 'Management <br> Company',
    type: 'item',
    icon: 'grid',
    url: 'management',
    role:[ Role.SuperAdmin]
  },
  
  // {
  //   id: 'user',
  //   title: 'user',
  //   type: 'item',
  //   icon: 'codesandbox',
  //   url: 'user'
  // }
    
  // {
  //   id: 'settings',
  //   title: 'Settings',
  //   type: 'item',
  //   fontAwesomeIcon: ' fa fa-cogs',   
  //   url: 'settings',
    
  // },
  
];


