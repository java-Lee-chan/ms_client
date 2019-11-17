import XLSX from 'xlsx';


// 读取本地excel文件
export default {
  readWorkbookFromLocalFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, {type: 'binary'});
        if(callback) callback(readWorkbook(workbook));
    };
    reader.readAsBinaryString(file);
  },
  exportWorkbookFromServerFile(measuresJSON){
    const worksheet= XLSX.utils.json_to_sheet(measuresJSON);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "测量仪器");
    XLSX.writeFile(workbook, "科室测量仪器台账.xlsx",{
      bookSST: false,
      type: 'utf8'
    });
  }
}


function readWorkbook(workbook){
  const sheetNames = workbook.SheetNames;
  const worksheet = workbook.Sheets[sheetNames[0]];
  const json = XLSX.utils.sheet_to_json(worksheet);
  console.log(json);
  return json;
}