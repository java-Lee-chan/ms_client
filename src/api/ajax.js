import axios from 'axios';

// 用 promise 封装 axios 返回的响应，可直接得到 response.data
export default function ajax(url, data={}, method='GET'){
  return new Promise((resolve, reject) => {
    let promise;
    if(method === 'GET'){
      promise = axios.get(url, {
        params: data
      });
    }else {
      promise = axios.post(url, data);
    }
    promise.then(response => resolve(response.data))
      .catch(error => console.log(error.message));
  });
}