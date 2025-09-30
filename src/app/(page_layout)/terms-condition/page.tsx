"use client";
import React, { useEffect, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import { loaderHtml } from "@/utils/shared";

function Terms() {
     const [detail,setDetail]=useState<any>()
     const {get}=ApiClientB()
useEffect(()=>{
     loaderHtml(true)
    get('content/detail',{slug:'terms'}).then(res=>{
          loaderHtml(false)
          if(res.success){
               setDetail(res.data)
          }
     })
},[])

  return (
    <>

      <div className="pt-[20px] md:pt-[40px] lg:pt-[50px] xl:pt-[60px]  px-4 lg:px-10 2xl:px-16">
      <div className="container mx-auto">
          <div className="mb-6">
            <h5 className="text-2xl font-bold">{detail?.title}</h5>
          </div>
          <div className="" dangerouslySetInnerHTML={{__html:detail?.description}}></div>
        </div>
        </div>
    </>
  );
}

export default Terms;
