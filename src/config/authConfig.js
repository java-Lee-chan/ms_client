const authList = [
  {
    title: '测量仪器',
    key: 'measure',
    children: [
      {
        title: '查看测量仪器',
        key: 'getMeasureDetail'
      },
      {
        title: '修改测量仪器',
        key: 'updateMeasure'
      }
    ]
  }, 
  {
    title: '备件采购',
    key: 'spare-part',
    children: [
      {
        title: '查看，编辑所有人的备件申请',
        key: 'getAllSpareParts'
      },
      {
        title: '查看，编辑自己的备件申请',
        key: 'getOwnSpareParts'
      }
    ]
  },
  {
    title: '添加用户',
    key: 'addUser'
  },
  {
    title: '授权角色',
    key: 'authRole'
  }
];
export default authList;