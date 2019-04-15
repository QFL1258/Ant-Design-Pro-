const list=
    [
      {id:1,classify:'上海',img:'http://localhost:8000/my-project/public/favicon.png', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:2,classify:'上海',img:'22222', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:3,classify:'上海',img:'1111', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:4,classify:'上海',img:'1111', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:5,classify:'上海',img:'1111', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:6,classify:'上海',img:'1111', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:7,classify:'上海',img:'1111', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:8,classify:'北京',img:'1111', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:9,classify:'北京',img:'1111', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:10,classify:'北京',img:'1111', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:11,classify:'北京',img:'1111', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:12,classify:'北京',img:'1111', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:13,classify:'江苏',img:'1111', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:14,classify:'江苏',img:'1111', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:15,classify:'江苏',img:'1111', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:16,classify:'江苏',img:'1111', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:17,classify:'北京',img:'1111', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:18,classify:'北京',img:'1111', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:19,classify:'北京',img:'1111', title:'Edrward',intro:'111111111',mold:'英文'},
      {id:20,classify:'北京',img:'1111', title:'Edrward',intro:'111111111',mold:'英文'},
    ]    
const selectList=[
    {id:'1',name:'上海'},
    {id:'2',name:'北京'},
    {id:'3',name:'南京'},
    {id:'4',name:'广州'},
    {id:'5',name:'江苏'},
]
export default {
  //登录
  'POST /api/login': (req, res) => {
    const { passWord, userName} = req.body;
    if (passWord === '1' && userName === 'admin') {
      res.send({
        status: 'ok',
        currentAuthority: 'admin',
        currentUser:'admin',
        token: 'TOKEN',
      });
      return;
    }
    if (passWord === '1' && userName === 'user') {
      res.send({
        status: 'ok',
        currentUser:'user',
        currentAuthority: 'user',
      });
      return;
    }
    res.send({
      status: 'error',
      currentAuthority: 'guest',
      message:'用户名或者密码错误'
    });
  },

  //表格 数据获取
  'GET /api/personal':list,
  //表格 数据修改
 
  //表格 数据删除
 
  //表格 下拉选择框
  'GET /api/selectpersonal':selectList
}