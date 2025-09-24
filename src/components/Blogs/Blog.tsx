import React, { useEffect, useState } from "react";
import { FaHeart } from 'react-icons/fa';
import { BiSolidStopwatch } from "react-icons/bi";
import methodModel from "@/utils/methodModel";
import moment from "moment";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageHtml from "@/components/ImageHtml";

function Blog({id, title, image, time, onClick, isFav, link, isLoggedIn,itemClick }: any) {
  const [favourite, setFavourite] = useState(isFav);
  const minutes = moment().diff(time, "minutes");
  const hours = Math.floor(moment.duration(minutes, "minutes").asHours());
  const formattedTime = moment(time).format("LL");
  const history=useRouter()

  const view=()=>{
    if(itemClick){
      itemClick({id:id,content:'blog'})
    }else{
      if(link.includes('https')){
        window.open(link,'_parent')
      }else{
        history.push(link)
      }
    }
  }

  return (
    <>
      <div className="bg-[#fff] p-4 group flex flex-col gap-2 border border-black/10 rounded-lg   hover:shadow-xl">
        <div className="mb-2 relative overflow-hidden">
          <span onClick={()=>view()} className="cursor-pointer">
            <ImageHtml
                          src={image ? methodModel.noImg(image) : "/assets/img/thumbnail/Blog.jpg"}
                          className="w-full object-cover h-48   bg-[#a1282f24]" alt={""} height={329} width={390}/>
          </span>
          {isLoggedIn ? (
            <>
              <a
                onClick={() => {
                  onClick();
                  setFavourite(!favourite);
                }}
                className={`h-10 w-10 bg-white rounded-full absolute right-5 top-5 flex items-center justify-center cursor-pointer shadow-md ${
                  !isLoggedIn ? "disabled" : ""
                }`}
              >
                <FaHeart
                  className={`drop-shadow-md text-xl ${
                    isFav ? "text-red-500" : "text-[#E0D5CE]"
                  } `}
                />
              </a>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="">
          <span onClick={()=>view()} className="cursor-pointer">
            <h6 className="text-[18px] font-semibold capitalize line-clamp-1 text-left">
              {title}
            </h6>
          </span>
        </div>

        <div className="flex justify-between gap-2 flex-wrap mt-4">
          <div className="flex items-center gap-1">
            <BiSolidStopwatch className="text-[20px]" />
            <span className=" text-black/60 font-medium text-[14px]">
              {formattedTime}
            </span>
          </div>
          <span onClick={()=>view()} className="cursor-pointer">
            <p className="shrink-0 text-[#540C0F] font-medium text-[14px] cursor-pointer">
              Read More
            </p>
          </span>
        </div>
      </div>
    </>
  );
}

export default Blog;
