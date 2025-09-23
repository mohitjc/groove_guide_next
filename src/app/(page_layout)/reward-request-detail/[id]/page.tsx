"use client";
import { useEffect, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import Breadcrumb from "@/components/Breadcrumb";
import { useParams } from "next/navigation";
import methodModel from "@/utils/methodModel";
import AudioHtml from"@/components/AudioHtml";
import VideoHtml from "@/components/VideoHtml";


function RewardRequest() {
    const {get}=ApiClientB()
  const { id } = useParams()
  const [rewardDetail, setRewardDetail] = useState<any>();
  const [loading, setLoader] = useState(false);


  const getRewards = (p = {}) => {
    setLoader(true);
    let filter = {
      id: id
    };

     get(`review/reviewDetail`, filter).then(
      (res) => {
        setLoader(false);
        if (res.success) {
          setRewardDetail(res?.data);
        }
      }
    );
  };

  useEffect(() => {
    getRewards();
  }, []);

  return (
    <>
      <div className="2xl:container mx-auto">

        <Breadcrumb
          className="px-4"
          links={[
            {  name: "Home" ,link: "/"},
            { name: "Reward Requests", link: "/rewards/requests"  },
          ]}
          currentPage={"Reward Request Detail"}
        />

        <div className="px-4  pt-3">
          <div className="">

            <div className="mt-4">

              <div className="flex mb-4 items-center gap-4 justify-between">
                <p className=" text-lg lg:text-2xl font-semibold text-[#111827]">
                  Reward Request Detail
                </p>
                <p className="flex gap-2 items-center">

                </p>
              </div>

              {loading ? <>
                <div className="text-center py-3">
                  Loading... <i className="fa fa-spinner fa-spin"></i>
                </div>
              </> : <>
                <div className="grid grid-cols-2 gap-4 p-4 bg-white shadow-md rounded-xl">
                  <div>
                    <label className="text-gray-600 font-medium">Reward Type</label>
                    <div className="capitalize text-lg font-semibold">{rewardDetail?.type || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">Notes</label>
                    <div className="text-gray-700">{rewardDetail?.notes || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">Status</label>
                    <div className="capitalize text-lg font-semibold">
                      {rewardDetail?.isApproved ? `${rewardDetail?.isApproved}${rewardDetail?.isApproved !== 'pending' ? 'ed' : ''}` : 'N/A'}
                    </div>
                  </div>
                  {rewardDetail?.reason && (
                    <div className="col-span-2">
                      <label className="text-gray-600 font-medium">Reason</label>
                      <div className="text-gray-700">{rewardDetail?.reason}</div>
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="text-gray-600 font-medium capitalize">
                      {rewardDetail?.uploadType || 'Image'}
                    </label>
                    <div className="mt-2 flex justify-start">
                      {rewardDetail?.uploadType === 'audio' ? (
                        <AudioHtml
                          src={methodModel.noImg(rewardDetail?.image)}
                          className="w-[200px]"
                          controls
                        />
                      ) : rewardDetail?.uploadType === 'video' ? (
                        <VideoHtml
                          src={methodModel.noImg(rewardDetail?.image)}
                          className="w-[200px] rounded-lg"
                          controls
                        />
                      ) : (
                        <img
                          src={methodModel.noImg(rewardDetail?.image)}
                          className="w-64 max-w-64 rounded-lg border"
                          alt="Reward"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </>}

            </div>


          </div>
        </div>
      </div>
    </>
  );
}

export default RewardRequest;
