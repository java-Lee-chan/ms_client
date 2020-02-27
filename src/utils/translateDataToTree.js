// 将一个数组转换成一棵树
export const translateDataToTree = (data) => {
  let parents = data.filter(value => value.father_id === undefined || value.father_id === null);
  let children = data.filter(value => value.father_id !== undefined && value.father_id !== null);
  let translator = (parents, children) => {
    parents.forEach(parent => {
      children.forEach((current, index) => {
        if(current.father_id === parent._id){
          let temp = JSON.parse(JSON.stringify(children));
          temp.splice(index, 1);
          translator([current], temp);
          typeof parent.children !== 'undefined' ? parent.children.push(current): parent.children = [current]
        }
      })
    })
  }
  translator(parents, children);

  return parents;
}