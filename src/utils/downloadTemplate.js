import {reqDownloadTemplate} from '../api';

// 请求下载excel模板文件
export default async function(type) {
  const result = await reqDownloadTemplate(type);
  let blob = new Blob([result], {type: 'application/vnd.ms-excel;charset=utf8'});

  const downloadElement = document.createElement('a');
  const href = window.URL.createObjectURL(blob);
  downloadElement.href= href;
  if(type === 'measure'){
    downloadElement.download = `测量仪器模板.xlsx`;
  }else if(type === 'spare-part'){
    downloadElement.download = `备件采购模板.xlsx`;
  }
  // document.body.appendChild(downloadElement);
  downloadElement.click();
  // document.removeChild(downloadElement);
  window.URL.revokeObjectURL(downloadElement, href);
}