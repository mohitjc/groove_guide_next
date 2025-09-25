import React, { useEffect, useState } from "react";
import FromNow from "@/components/Time/FromNow";
import methodModel from "@/utils/methodModel";
import Image from "next/image";

export default function User({ user, userId, isActive, onChatClick }:any) {
  const sender = user?.user_details?.find((_user:any) => _user._id !== userId);
  const _count = user.user_chat_count;
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(_count);
  }, [_count]);

  return (
    <>
      <div
        onClick={() => {
          onChatClick(user?.room_id);
        }}
        className={`bg-${isActive ? "[#540C0F]" : "white"} text-${
          isActive ? "white" : "black"
        } hover:bg-[#540C0F] hover:text-white  p-2 mb-3`}
      >
        <div className="flex items-center w-full justify-between  cursor-pointer">
          <div className="flex items-center gap-2 ">
            <div className="shrink-0">
              <Image
                className="h-6 w-6  xl:h-10 xl:w-10 rounded-full object-cover"
                src={methodModel.noImg(user?.admin_details?.image)}
                alt=""
              />
            </div>
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="xl:text-[15px] text-[12px] font-semibold">
                  {user?.admin_details?.fullName}
                </p>

                <p className="xl:text-[12px] text-[10px] w-20 xl:w-32 line-clamp-1  ">
                  {user?.room_details?.subject}
                </p>
              </div>
            </div>
          </div>
          {count != null && count > 0 && !isActive && (
            <div className="text-[12px]">{count}</div>
          )}
        </div>
        <div className="flex justify-end text-[10px] shrink-0">
          <FromNow date={user.room_details?.createdAt} />
        </div>
      </div>
    </>
  );
}
