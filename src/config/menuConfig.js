const menuList = [
  {
    title: '首页',
    key: '/home',
    icon: 'home',
  },
  {
    title: '测量仪器',
    key: '/measure',
    icon: 'appstore',
  },
  {
    title: '备件采购',
    key: '/spare-part',
    icon: 'appstore',
  },
  {
    title: '能源管理',
    key: '/energy',
    icon: 'appstore',
    children: [
      {
        title: '科室用气',
        key:'/energy/gas',
        icon: 'bar-chart'
      },
      {
        title: '科室用电',
        key:'/energy/elec',
        icon: 'line-chart'
      },
      {
        title: '科室用水',
        key:'/energy/water',
        icon: 'pie-chart'
      }
    ]
  },
  {
    title: '用户管理',
    key: '/user',
    icon: 'user'
  },
  {
    title: '角色管理',
    key: '/role',
    icon: 'safety'
  }
]

export default menuList;