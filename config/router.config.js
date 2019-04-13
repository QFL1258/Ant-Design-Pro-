export default [
  //login
  {
    path :'/login',
    component:'../layouts/UserLayout',
    routes:[
      {path:'/login',redirect:'/login/login'},
      {path:'/login/login',name:'login',component:'./Admin/LoginPage'}
    ]
  },
  //pc
  {
    path:'/',
    component:'../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin'],
    routes:[
      {path:'/',redirect:'/product/product'},
      //商品
      {
       path:'/product',
       name:'product',
       icon:'shopping',
       routes:[
         {//商品分类
           path:'/product/product',
           name:'classification',
           icon:'project',
           component:'./Product/Product'
         },
         {//商品管理
           path:'/product/productitem',
           name:'productitem',
           icon:'profile',
           component:'./Product/Productitem'
         }
       ]
      },
      //员工管理
      {
        path:'/management',
        name:'management',
        icon:'user',
        component:'./Manage/Manage'
      },
      //轮播
      {
        path:'/carousel',
        name:'carousel',
        icon:'sync',
        component:'./Carousel/Carousel'
      }
    ]
  }



];
