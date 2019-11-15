import XLSX from 'xlsx';


// 读取本地excel文件
export default function readWorkbookFromLocalFile(file, callback) {
  var reader = new FileReader();
  reader.onload = function(e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, {type: 'binary'});
      if(callback) callback(readWorkbook(workbook));
  };
  reader.readAsBinaryString(file);
}

function readWorkbook(workbook){
  const sheetNames = workbook.SheetNames;
  const worksheet = workbook.Sheets[sheetNames[0]];
  const json = XLSX.utils.sheet_to_json(worksheet);
  return json;
}