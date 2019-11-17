import axios from 'axios';

export default function downloadExcel(url){
  return new Promise((resolve, reject) => {
    const promise = axios.get(url, {
      Accept: 'application/octet-stream',
      responseType: 'blob'
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