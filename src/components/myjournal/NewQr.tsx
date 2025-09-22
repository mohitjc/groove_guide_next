import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useRouter } from 'next/navigation';

function NewQR() {
  const history=useRouter()
  const [content,setContent]=useState()
  const handleScan = (data:any) => {
    if (data) {
      let value=data[0]?.rawValue;
      setContent(value)
      window.open(value);
    }
  };

  const handleError = (err:any) => {
    console.error(err);
  };

  const continueBtn=()=>{
    let str=content || ''
    if(str) str=str.split('/').filter((itm:any)=>itm)?.[2] 
    history.push(`/${str}`);
  }

  return (
    <div className=" svg_scrns mt-6">
      <Scanner
        onError={handleError}
        onScan={handleScan}
        components={{torch:false}}
      />
      
        {content?<>
          <div className="text-center "> 
            <button onClick={()=>{continueBtn()}} className="px-4 py-2 bg-[#540C0F] text-white">Click to Continue</button>
          </div>
        </>:<></>}
     
    </div>
  );
}

export default NewQR;
