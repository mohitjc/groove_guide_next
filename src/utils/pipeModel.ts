function currency(num:number,cf=',') {
   // let currency=c
   const currency=''
    let value='0'
    if(num){
      value=Number(num).toFixed(2)
      if(value.split('.')[1]=='00'){
         value=value.split('.')[0]
      }
      if(cf==','){
         value=value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }else if(cf=='.'){
         value=value.replace('.',',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
      } else{
         value=value.replace('.',',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
      }
    } 
    
    return currency?`${value} ${currency}`:`$${value}  `
 }

 function number(num:number,nofloat=false) {
    let value=''
    if(num){
      value=Number(num).toFixed(2)
      if(value.split('.')[1]=='00'){
         value=value.split('.')[0]
      }
      value=String(value).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
   
    return (value||'0')
 }

 function NoFloatnumber(num:number,nofloat=false) {
   let value=''
   if(num){
     if(nofloat==false){
        value=String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }else{
        value=Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }
   }
  
   return value||'0'
}

 const capitalizeFirstLetter=(str:string)=> {
   return str.charAt(0).toUpperCase() + str.slice(1);
 }

 const pipeModel={currency,number,capitalizeFirstLetter,NoFloatnumber}
 export default pipeModel