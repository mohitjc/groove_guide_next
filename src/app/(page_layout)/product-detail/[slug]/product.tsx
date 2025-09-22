import React, { Fragment, useEffect, useState } from "react";
import methodModel from "@/utils/methodModel";

import pipeModel from "@/utils/pipeModel";
import ImageHtml from "@/components/ImageHtml";
import TooltipHtml from "@/components/TooltipHtml";
import SocialShare from "@/components/menu/SocialShare";
import environment from "@/envirnment";


function Product({ product, tags, onImageClick, selectedVariant, sub_products }: any) {
  const theraTag = tags?.filter((itm: any) => itm.type == 'Therapeutic Use') || []
  const fucTag = tags?.filter((itm: any) => itm.type != 'Therapeutic Use') || []
  const [showFullText, setShowFullText] = useState(false);
  const [checked, setchecked] = useState(selectedVariant?.id);
  const maxLength = 500;
  const truncatedText =
    selectedVariant?.description?.length > maxLength
      ? selectedVariant?.description?.slice(0, maxLength) + "..."
      : selectedVariant?.description;

  const description = () => {
    return {
      __html: !showFullText ? truncatedText : selectedVariant?.description,
    };
  };

  const handleReadMoreClick = () => {
    setShowFullText(!showFullText);
  };

  const handleSubProductClick = (itm: any) => {
    onImageClick(itm);
    setchecked(itm.id);
  };

  useEffect(() => {
    if (!checked) {
      setchecked(selectedVariant?.id)
    }
  }, [selectedVariant])


  return (
    <>
      <div className="col-span-12 lg:col-span-5 2xl:col-span-6 md:pl-6">
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-4">
            <div className="flex">
              <p className="text-xl xl:text-3xl hidden  font-bold">
                {product?.name}
              </p>
              {/* <button onClick={()=>reserve()} disabled={isReserved()} className="lg:px-8 px-[15px] py-[8px] inline-block text-white bg-[#540C0F] text-[14px] ml-auto">{isReserved()?'Reserved':'Reserve'} </button> */}
            </div>



            <div>
              <div className="flex justify-between">
                <label className="text-[22px] font-bold capitalize">Price</label>
                <div>
                  <SocialShare shareUrl={`${environment.frontUrl}menu/${product?.product_slug}`} />
                </div>
              </div>

              <div className="mt-4 flex items-center flex-wrap gap-3">
                {sub_products?.map((itm: any, i: any) => {
                  return (
                    <label
                      onClick={() => {
                        handleSubProductClick(itm);
                      }}
                      key={i}
                      className={`group relative rounded-md border flex items-center justify-center text-sm font-medium hover:bg-gray-50 focus:outline-none cursor-pointer bg-white text-gray-900 shadow-sm h-10 min-w-10 px-4  border-2 ${checked == itm?.id ? "border-primary" : ""
                        }`}
                    >
                      <span className="uppercase">  {itm?.name} {itm.gram}{itm.quantity_type || 'g'}</span>
                      <input
                        type="radio"
                        name="weight"
                        className={`absolute opacity-0 peer `}
                      />

                      <div className=" block pl-2 font-semibold text-lg shrink-0 ">
                        / {pipeModel.currency(itm?.price)}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>




            <p className="text-[22px] font-bold capitalize">
              {product.category?.name}

              {/* <p className="flex items-center text-2xl gap-1">
                {pipeModel.currency(price)} <span className="">- ({quantity} {quantity ? 'G' : 'Piece'})</span>
              </p> */}
            </p>
            <span className="h-1 w-12 bg-[#540C0F] inline-flex"></span>
          </div>


          {theraTag?.length ? <>
            <h6 className="text-[22px] font-bold">Top Experiences</h6>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4`}
            >
              {theraTag?.slice(0, 3)?.map((itm: any, i: any) => {
                return (
                  <Fragment key={itm.name}>
                    <TooltipHtml title={itm.description} placement="top" >
                      <div className="flex gap-2 items-center">
                        <ImageHtml src={methodModel.noImg(itm.image)} className="h-10 w-10 lg:h-12 lg:w-12 rounded-full object-cover" alt="" 

                                        height={''}
                                        width={''}
                                        errSrc="/assets/img/placeholder.jpg"                                      
                                        id=""
                                        title=""
                        
                        />
                        <p>{itm.name}</p>
                      </div>
                    </TooltipHtml>
                  </Fragment>
                );
              })}
            </div>
          </> : <></>}


          {fucTag?.length ? <>
            <h6 className="text-[22px] font-bold">Health Benefits</h6>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4`}
            >

              {fucTag?.slice(0, 3)?.map((itm: any, i: any) => {
                return (
                  <Fragment key={itm.name}>
                    <TooltipHtml title={itm.description} placement="top" >
                      <div className="flex gap-2 items-center">
                        <ImageHtml src={methodModel.noImg(itm.image)} className="h-10 w-10 lg:h-12 lg:w-12 rounded-full object-cover" alt=""  height={''}
                                        width={''}
                                        errSrc="/assets/img/placeholder.jpg"                                      
                                        id=""
                                        title=""/>
                        <p>{itm.name}</p>
                      </div>
                    </TooltipHtml>
                  </Fragment>
                );
              })}
            </div>
          </> : <></>}



          <div>
            <label className="text-[22px] font-bold capitalize">Images</label>
            <div className="mt-4 flex items-center flex-wrap space-x-3">

              {sub_products.map((itm: any) => {
                if (itm?.images?.length == 0) return;
                return (
                  <label
                    onClick={() => {
                      handleSubProductClick(itm);
                    }}
                    className="relative  flex cursor-pointer items-center  justify-center rounded-full p-0.5 focus:outline-none"
                  >
                    <ImageHtml
                     src={methodModel.noImg(itm.image)} className="h-10 w-10 lg:h-12 lg:w-12 rounded-full object-cover" alt="" 

                                        height={''}
                                        width={''}
                                        errSrc="/assets/img/placeholder.jpg"                                      
                                        id=""
                                        title=""
                    />
                  </label>
                );
              })}
            </div>
          </div>


          <div>
            <h6 className=" text-[20px] lg:text-[22px] font-bold">Description</h6>

            <p
              className="text-[16px] lg:text-[20px] font-light mt-2"
              dangerouslySetInnerHTML={description()}
            ></p>
            {selectedVariant?.description?.length > maxLength && (
              <a
                onClick={handleReadMoreClick}
                className="shrink-0 text-[#540C0F] font-medium text-[14px] cursor-pointer"
              >
                {!showFullText ? "Read More" : "Read Less"}
              </a>
            )}
          </div>

          {/* {product?.dealsInfo?.length?<>
            <div>
            <h6 className=" text-[20px] lg:text-[22px] font-bold mb-3">Deals</h6>

            {product?.dealsInfo?.map((itm:any)=>{
              return <Fragment key={itm._id}>
                <p className="mb-2">{itm.name}</p>
              </Fragment>
            })}
           
          </div>
          </>:<></>} */}

        </div>
      </div>
    </>
  );
}

export default Product;
