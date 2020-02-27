// 用户权限配置
const authList = [
  {
    title: '测量仪器',
    key: 'measure',
    children: [
      {
        title: '查看界面',
        key: 'measure-into'
      },
      {
        title: '上传测量仪器',
        key: 'measure-upload'
      },
      {
        title: '导出测量仪器',
        key: 'measure-download'
      },
      {
        title: '添加测量仪器',
        key: 'measure-add'
      },
      {
        title: '查看测量仪器',
        key: 'measure-detail'
      },
      {
        title: '编辑测量仪器',
        key: 'measure-update'
      }
    ]
  }, 
  {
    title: '备件采购',
    key: 'spare-part',
    children: [
      {
        title: '查看界面',
        key: 'spare-part-into'
      },
      {
        title: '上传备件',
        key: 'spare-part-upload'
      },
      {
        title: '导出备件',
        key: 'spare-part-download'
      },
      {
        title: '查看全部备件申请',
        key: 'spare-part-all-detail'
      },
      {
        title: '编辑全部备件申请',
        key: 'spare-part-all-update'
      },
      {
        title: '查看自己备件申请',
        key: 'spare-part-own-detail'
      },
      {
        title: '编辑自己备件申请',
        key: 'spare-part-own-update'
      },
      {
        title: '审批全部备件申请',
        key: 'spare-part-all-pass'
      },
    ]
  },
  {
    title: '能源管理',
    key: 'energy',
    children: [
      {
        title: '查看界面',
        key: 'energy-into'
      },
      {
        title: '导出数据',
        key: 'energy-download'
      },
      {
        title: '管理配置',
        key: 'energy-settings'
      }
    ]
  },
  {
    title: '用户管理',
    key: 'user',
    children: [
      {
        title: '查看界面',
        key: 'user-into'
      },
      {
        title: '创建用户',
        key: 'user-create'
      },
      {
        title: '修改用户',
        key: 'user-update'
      },
      {
        title: '删除用户',
        key: 'user-delete'
      },
    ]
  },
  {
    title: '角色管理',
    key: 'role',
    children: [
      {
        title: '查看界面',
        key: 'role-into'
      },
      {
        title: '创建角色',
        key: 'role-create'
      },
      {
        title: '设置角色权限',
        key: 'role-auth'
      },
    ]
  }
];
export default authList;