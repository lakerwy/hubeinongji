
import request from '@/request/index'

const baseUrl = window.globalUrl.HOME_API + 'agri-web/maintenance';


//运维资料分页查询
export function query(params) {
    return request.post(`${baseUrl}/page`,params,)
}

//运维资料删除
export function delet(params) {
  return request.patch(`${baseUrl}/delete`,params)
}

//运维资料保存
export function save(params){
  return request.post(`${baseUrl}/save`,params)
}

//运维资料修改
export function update(params){
  return request.patch(`${baseUrl}/update`,params)
}

//上传运维资料
export function uploadFile(params){
  return request.patch(`${baseUrl}/uploadFile`,params)
}

//运维资料详情
export function detail(params){
  return request.get(`${baseUrl}/${params}`)
}

//导出报表
export function exportExcel(params){
   return request.get(`${baseUrl}/export`,{params})
}

//附件下载
export function download(params){
  return request({
    url:`${baseUrl}/download?fileName=${params}`,
    method:'get',
    responseType:'blob'
  })
  // .get(`${baseUrl}/download`,{params},{responseType: 'blob'})
}

export function solve(params){
  return request.get(`${baseUrl}/solve/${params}`)
}