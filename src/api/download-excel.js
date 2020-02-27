import axios from 'axios';

// 下载excel模板
export default function downloadExcel(url, data){
  return new Promise((resolve, reject) => {
    const promise = axios.get(url, {
      Accept: 'application/octet-stream',
      responseType: 'blob',
      params: data
    });
    promise.then(response => {
      if(!response) return
      resolve(response.data);
      // console.log(response);
    }).catch(error => {
      console.log(error.message);
    });
  })
}