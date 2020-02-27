import XLSX from 'xlsx';


export default {
  // 读取本地excel文件
  readWorkbookFromLocalFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, {type: 'binary'});
        if(callback) callback(readWorkbook(workbook));
    };
    reader.readAsBinaryString(file);
  },
  // 将从服务器获取的内容转换为excel文件
  exportWorkbookFromServerFile(results, type){
    const worksheet= XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    if(type === 'measure'){
      XLSX.utils.book_append_sheet(workbook, worksheet, "测量仪器");
      XLSX.writeFile(workbook, "科室测量仪器台账.xlsx",{
        bookSST: false,
        type: 'utf8'
      });
    }else if(type === 'spare-part'){
      XLSX.utils.book_append_sheet(workbook, worksheet, "备件采购");
      XLSX.writeFile(workbook, "备件采购申请.xlsx",{
        bookSST: false,
        type: 'utf8'
      });
    }
  }
}


function readWorkbook(workbook){
  const sheetNames = workbook.SheetNames;
  const worksheet = workbook.Sheets[sheetNames[0]];
  const json = XLSX.utils.sheet_to_json(worksheet);
  // console.log(json);
  return json;
}