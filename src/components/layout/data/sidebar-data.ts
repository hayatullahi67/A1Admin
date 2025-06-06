import {
  // IconBarrierBlock,
  // IconBrowserCheck,
  // IconBug,
  // IconChecklist,
  // IconError404,
  // IconHelp,
  IconLayoutDashboard,
  // IconLock,
  IconLockAccess,
  // IconMessages,
  // IconNotification,
  // IconPackages,
  // IconPalette,
  // IconServerOff,
  // IconSettings,
  // IconTool,
  // IconUserCog,
  // IconUserOff,
  // IconUsers,
} from '@tabler/icons-react'
// import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData } from '../types'
import a1logo from '@/assets/a1logo.png'
const userData = JSON.parse(localStorage.getItem("user") || "{}");
const user = userData;
export const sidebarData: SidebarData = {
  user: {
    name: user.fullname,
    email: user.email,
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'A1 Schools',
      logo: a1logo,
    },
    {
      name: 'A1 Schools',
      logo: a1logo,
     
    },
    {
      name: 'A1 Schools',
      logo: a1logo,
     
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        // {
        //   title: 'Tasks',
        //   url: '/tasks',
        //   icon: IconChecklist,
        // },
        // {
        //   title: 'Apps',
        //   url: '/apps',
        //   icon: IconPackages,
        // },
        // {
        //   title: 'Chats',
        //   url: '/chats',
        //   badge: '3',
        //   icon: IconMessages,
        // },
        // {
        //   title: 'Users',
        //   url: '/users',
        //   icon: IconUsers,
        // },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: IconLockAccess,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            // {
            //   title: 'Sign In (2 Col)',
            //   url: '/sign-in-2',
            // },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            // {
            //   title: 'OTP',
            //   url: '/otp',
            // },
          ],
        },
      
      ],
    },
    // {
    //   title: 'Other',
    //   items: [
    //     {
    //       title: 'Settings',
    //       icon: IconSettings,
    //       items: [
    //         {
    //           title: 'Profile',
    //           url: '/settings',
    //           icon: IconUserCog,
    //         },
    //         {
    //           title: 'Account',
    //           url: '/settings/account',
    //           icon: IconTool,
    //         },
    //         {
    //           title: 'Appearance',
    //           url: '/settings/appearance',
    //           icon: IconPalette,
    //         },
    //         {
    //           title: 'Notifications',
    //           url: '/settings/notifications',
    //           icon: IconNotification,
    //         },
    //         {
    //           title: 'Display',
    //           url: '/settings/display',
    //           icon: IconBrowserCheck,
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Help Center',
    //       url: '/help-center',
    //       icon: IconHelp,
    //     },
    //   ],
    // },
  ],
}
