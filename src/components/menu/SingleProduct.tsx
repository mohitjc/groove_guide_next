import { useSelector } from "react-redux";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import TooltipHtml from "../TooltipHtml";
import pipeModel from "@/utils/pipeModel";
import { noImg } from "@/utils/shared";
import { useRouter } from "next/navigation";
import Image from "next/image";

function SingleProduct({
  isBox,
  item,
  outerdivClass,
  imgClass,
  imgHeight,
  tagsToDisplay=3,
  onClick=(_:any)=>{},
  viewProduct=(_:any)=>{},
  filter = {}
}: any) {
  const user = useSelector((state: any) => state.user);
  const router=useRouter()
  const history = (p = '') => {
    router.push(p)
  }
  const handleOnClick = () => {
    onClick(item._id);
  };

  const categoryName = item?.categoryName?.trim()?.toLowerCase()
  let price = item.price
  let gram = item.gram

  const view = (id: any) => {
    // if (isBox) return
    if (viewProduct) {
      viewProduct(id)
    } else {
      history(`/product-detail/${id}`)
    }
  }

  const variants = item.sub_products || []
  if (categoryName == 'dried') {
    const ext = variants.find((itm: any) => itm.gram == '3.5')
    if (ext) {
      price = ext.price
      gram = ext.gram
    }
  }

  if (filter.startPrice || filter.endPrice) {
    const ext = [...variants, {
      price: item.price,
      gram: item.gram
    }].find((itm: any) => {
      const price = Number(itm.price || 0) || 0
      let value = false
      if (filter.startPrice && !filter.endPrice) {
        if (price >= filter.startPrice) {
          value = true
        }
      } else if (filter.startPrice && filter.endPrice) {
        if ((price >= filter.startPrice) && (price <= filter.endPrice)) {
          value = true
        }
      } else if (!filter.startPrice && filter.endPrice) {
        if ((price <= filter.endPrice)) {
          value = true
        }
      }
      return value
    })

    if (ext) {
      price = ext.price
      gram = ext.gram
    }
  }


  return (
    <>
      <div className={`imgtext border border-gray-300  hover:shadow-xl  ${outerdivClass}`}>
        <div className="overflow-hidden relative">
          {user.loggedIn && !isBox && (
            <a
              onClick={handleOnClick}
              className="h-10 w-10 bg-[#E0D5CE] rounded-full absolute right-5 top-3 flex items-center justify-center cursor-pointer shadow-md z-10"
            >
              {/* <FaHeart
                className={` text-lg 2xl:text-xl ${(item?.isFav || item?.isFlavour) ? "text-[#540C0F]" : "text-[#E0D5CE]"
                  } `}
              /> */}

              {item?.isFav || item?.isFlavour ? (
                <IoMdHeart className="text-[25px] text-primary" />
              ) : (
                <IoMdHeartEmpty className="text-[25px] text-primary" />
              )}
            </a>
          )}

          <span className="cursor-pointer relative" onClick={() => view(item?.product_slug)}>



            {item?.images && (
              <Image
              height={250}
              width={300}
                alt={item?.product_slug}
                src={noImg(item?.images?.[0])}
                className={`w-full shadow-lg object-contain relative bg-[#a1282f24] ${imgClass}`}
              />
            )}


          </span>




        </div>
        <div className="p-2 2xl:p-4 rounded-b-xl bg-white relative text-left h-full">

          <p className="font-bold text-[18px] xl:text-[24px] text-[#181A2A] line-clamp-1 cursor-pointer" onClick={() => view(item?.product_slug)}>{item.name}</p>


          <div className="flex  justify-between">
            {price ? <>
              <p
                className="flex items-center gap-2 space-x-2  cursor-pointer"
                onClick={() => view(item?.product_slug)}
              >
                {/* <span className="text-[10px] sm:text-[12px] lg:text-[14px] font-medium uppercase text-gray-700">
                {gram}
                {item.quantity_type || 'g'}
              </span> */}
                <div className="font-bold text-[18px] xl:text-[24px] text-[#1C1C1C]">
                  {pipeModel.currency(price)}
                </div>

                {/* <div className="font-bold text-[18px] xl:text-[24px] text-[#8B96A5] line-through">
                  {pipeModel.currency(price + 10)}

                </div> */}
              </p>
            </> : <></>}


            <div className={`flex flex-wrap items-end justify-end ${(!item.isBox && !item.earlyRelease && !item?.boxExclusive) ? 'h-10 lg:h-9 xl:h-12 2xl:h-14' : ''}`}>
              {item.isBox && (
                <img src="/assets/img/star.png" className=" object-contain h-10 lg:h-9 xl:h-12 2xl:h-14 isBox" />
              )}
              {item.earlyRelease && (
                <img src="/assets/img/early.png" className=" object-contain h-10 lg:h-9 xl:h-12 2xl:h-14 earlyRelease" />
              )}
              {item?.boxExclusive && (
                <img src="/assets/img/BoxExclusive.png" className=" object-contain h-10 lg:h-9 xl:h-12 2xl:h-14 boxExclusive" />
              )}
            </div>

          </div>


          <div className="flex flex-col ">

            <div
              className={`coinsimg flex flex-col gap-1 ${item?.product_tags?.length > 2 ? "h-auto" : "h-[76px] lg:h-[105px]"
                }`}
            >
              {!isBox ? <>
                {item?.product_tags ? (
                  <>
                    {item?.product_tags
                      .slice(0, tagsToDisplay)
                      .map((titm: any, index: any) => {
                        return (
                          <div className="" key={index}>
                            <TooltipHtml title={titm.description} placement="top" key={index}>
                              <span className="flex items-center gap-2 ">

                                <Image
                                height={48}
                                width={48}
                                  alt={titm.name}
                                  src={noImg(titm.image)}
                                  title={titm.name}
                                  className="h-6 lg:h-8 rounded-full  object-contain"
                                />
                                <span style={{ fontFamily: 'Arial, sans-serif' }} className="text-[10px]  leading-4 text-[#828282]  md:text-[12px]   2xl:text-[12px] font-medium capitalize   ">{titm.name}</span>

                              </span>
                            </TooltipHtml>

                          </div>
                        );
                      })}

                  </>
                ) : (
                  <>
                  </>
                )}
              </> : <></>}
            </div>
            <div className="flex flex-col gap-2 xl:gap-2 justify-between">

              {!isBox ? <>
                <div className="flex gap-1 items-center">
                  {/* <p
                    className="text-[#2C2C2C] ml-auto font-semibold hover:underline hover:text-[#540C0F]  text-[10px] md:text-[12px] inline-flex items-center  shrink-0 relative cursor-pointer"
                    onClick={() => view(item?.product_slug)}
                  >
                    View Details
                    <MdChevronRight className="text-lg mt-1 chevron-animation" />
                  </p> */}
                  {/* <SocialShare shareUrl={`${environment.frontUrl}menu/${item?.product_slug}`} /> */}
                </div>
              </> : <></>}
            </div>
          </div>




          {/* <div
              className={`coinsimg flex flex-wrap  gap-3 mt-4 ${
                item?.product_tags?.length ? "h-auto" : "h-14"
              }`}
            >
            {item?.product_tags ? (
              <>
                {item?.product_tags
                  .slice(0, tagsToDisplay)
                  .map((titm: any, index: any) => {
                    return (
                      <>
                       <TooltipHtml Id={index} title={titm.description} placement="top" key={index}>
                        <span className="flex gap-2 items-center">
                        <ImageHtml
                            src={methodModel.noImg(titm.image)}
                            title={titm.name}
                            className="h-10 w-10   rounded-full object-contain"
                          />
                          <span className="text-[10px] 2xl:text-[12px] block break-all ">{titm.name}</span>
                        </span>
                       </TooltipHtml>
                       
                      </>
                    );
                  })}
               
              </>
            ) : (
              <>
              </>
            )}
          </div> */}
          {/* <div className="mt-4 flex justify-between">
          
              
              </div> */}

        </div>
      </div>
    </>
  );
}

SingleProduct.defaultProps = {
  imgHeight: 52,
  tagsToDisplay: 3,
};

export default SingleProduct;
