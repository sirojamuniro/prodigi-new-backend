require('dotenv').config();


exports.count = async (objectArray) => {
   let output= objectArray.reduce((acc, curr) => {
        curr.count = 1;
        const exists = acc.find(o => o.product_id === curr.product_id);
        // console.log('ini curr',curr.product_id)
        // console.log('ini exists',exists)
        
        exists ? exists.count++ : acc.push(({ product_id, count } = curr));
        
        return acc;
      }, []);
      console.log('ini output',output)
    return output
};