import request_new from '@/utils/request_new';


//登录

export async function postAccount(params) {
  return request_new(`/api/admin/login/`, {
    method: 'POST',
    body: params,
  });
}

//商品分类 获取数据
export async function product(){
  return request_new (`/api/add/get/procls/`)
}
//商品分类 添加
export async function addproduct(params){
  return request_new (`/api/add/get/procls/`,{
    method:'POST',
    body: params,
  })
}
//商品分类 编辑
export async function saveredact(params){
  let {row,key}=params;
  return request_new(`/api/put/procls/${key}/`,{
    method:'PUT',
    //body:row 要修改的参数
    body:row,
  })
}
//商品分类 删除
export async function deleteredact(params){
  return request_new(`/api/delete/procls/${params}/`,{
    method:'delete',
  })
}

//商品管理 获取
export async function getproduct(){
  return request_new (`/api/get/all/productions/`)
}
//商品管理 添加
export async function postProduct(params) {
  return request_new(`/api/productions/`, {
    method: 'POST',
    body: params,
  });
}
//商品管理 编辑
export async function saveitem(params){
  let {row,key}=params;
  return request_new(`/api/put/production/${key}/`,{
    method:'PUT',
    //body:row 要修改的参数
    body:row,
  })
}
//商品管理 删除
export async function deleteitem(params){
  return request_new(`/api/del/production/${params}/`,{
    method:'delete',
  })
}
//商品推荐
export async function changeRecommend({ id, commend }) {
  commend = commend === 1 ? 0 : 1;
  return request_new(`/api/set/production/commend/${id}/`, {
  });
}

//获取员工信息
export async function management(){
  return request_new (`/api/user/infos/`)
}
// 删除员工信息
export async function delemanage(params){
  return request_new(`/api/delete/user/${params}/`,{
    method:'delete',
  })
}
//获取轮播信息
export async function getcarousel(){
  return request_new (`/api/get/all/carousels/`)
}
//轮播信息 添加
export async function addcarousel(params) {
  return request_new(`/api/add/carousels/`, {
    method: 'POST',
    body: params,
  });
}
// 删除轮播信息
export async function delecarousel(params){
  return request_new(`/api/del/carousel/${params}/`,{
    method:'delete',
  })
}
// 编辑轮播图片
export async function updatecarousel(params){
  let {row,key}=params;
  return request_new(`/api/put/carousel/${key}/`,{
    method:'PUT',
    //body:row 要修改的参数
    body:row,
  })
}

//管理员 添加
export async function postAdmin(params) {
  return request_new(`/api/add/admin/`, {
    method: 'POST',
    body: params,
  });
}
//获取管理员信息
export async function getAdmin(){
  return request_new (`/api/get/all/admins/`)
}
//设置超级管理员
export async function setSuper({ id, is_super }) {
  is_super = is_super === 1 ? 0 : 1;
  return request_new(`/api/set/admin/manager/${id}/`, {
  });
}

// 管理员 编辑
export async function compile(params){
  let {row,key}=params;
  return request_new(`/api/put/admin/${key}/`,{
    method:'PUT',
    //body:row 要修改的参数
    body:row,
  })
}

// 删除 管理员
export async function deleAdmin(params){
  return request_new(`/api/del/admin/${params}/`,{
    method:'delete',
  })
}

//订单管理
//获取订单信息
export async function getOrder(){
  return request_new (`/api/get/add/orders/`)
}

//订单状态
export async function condition({ order_id ,is_send}) {
  //  is_send = is_send === 1 ? 0 : 1;
  // console.log(is_send)
  return request_new(`/api/order/send/${order_id}`, {
  });
}