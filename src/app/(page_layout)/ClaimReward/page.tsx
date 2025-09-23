"use client";

import { useEffect, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import Modal from "@/components/Modal";
import FormControl from "@/components/FormControl";
import ImageUpload from "@/components/ImageUpload/page";
import { isNumber, loaderHtml, noImg } from "@/utils/shared";
import { useRouter, useParams } from "next/navigation";
import VideoRecorder from "@/components/VideoRecording";
import { useSelector } from "react-redux";
import AudoRecording from "@/components/AudoRecording";
import { getRandomCode } from "@/utils/shared";

function ClaimReward({ result = (e:any) => {} }) {
    let {get ,post,postFormData }=ApiClientB()
  const user = useSelector((state:any) => state.user.data);
  const navigate = useRouter();
  const [rewardModal, setRewardModal] = useState<any>();
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<any>();
  const [videoBlob, setVideoBlob] = useState<any>();
  console.log(rewardModal, "rewardModal");

  const rewardTypes = [
    { id: "Join Groove Group", name: "Join Groove Group", key: "groove" },
    {
      id: "Follow Us On IG",
      name: "Follow Us On IG",
      imageRequired: true,
      key: "instagram",
    },
    {
      id: "Save WhatsApp Contact",
      name: "Save WhatsApp Contact",
      imageRequired: true,
      key: "whatsapp",
    },
    {
      id: "Google Review",
      name: "Google Review",
      imageRequired: true,
      key: "googleReviews",
    },
    {
      id: "Tag Us Selfie Wall Photo",
      name: "Tag Us Selfie Wall Photo",
      imageRequired: true,
      key: "selfie",
    },
    {
      id: "First Experience Share",
      name: "First Experience Share",
      key: "firstExperience",
    },
    {
      id: "Subscribe YT Channel",
      name: "Subscribe YT Channel",
      imageRequired: true,
      key: "youtube",
    },
    {
      id: "Share Your Journey",
      name: "Share Your Journey",
      imageRequired: true,
      key: "video",
    },
    { id: "Bring a Friend", name: "Bring a Friend" },
     {
      id: "Special Reward",
      name: "Special Reward",
      imageRequired: true,
      key: "specialReward",
    },
  ];

  const getStatus = () => {
    loaderHtml(true);
    get("review/appliedClaimedReward", {
      userId: user.id || user._id,
    }).then((res) => {
      loaderHtml(false);
      if (res.success) {
        let data = res.data;
        data.groove = true;
        setStatus(res.data);
      }
    });
  };

  const addReward = (type:any) => {
    let ext:any = rewardTypes.find((itm) => itm.id == type);

    if (status[ext?.key]) return;

    if (type == "Bring a Friend") {
      navigate.push("/invite-a-member");
      return;
    }
    if (type == "First Experience Share") {
      navigate.push("/myjournal");
      return;
    }
    setRewardModal({
      type: type,
      image: "",
      notes: "",
      imageRequired: ext.imageRequired ? true : false,
      contentType: "",
      uploadType: "",
      // uploadType:type=='Share Your Journey'?'audio':''
    });
  };

  const onSubmit = async () => {
    setSubmitted(true);
    const filename = `share_journey_${getRandomCode(10)}.webm`;

    let payload = {
      ...rewardModal,
    };

    if (payload.contentType == "recording" && videoBlob) {
      // Send the Blob to the server using fetch (POST request)
      const formData:any = new FormData();
      formData.append("file", videoBlob, filename);
      loaderHtml(true);
      const res = await postFormData("upload/video", formData);
      //    console.log("res",res)
      payload.image = filename;
    }
    if (!payload?.image && payload?.imageRequired) return;
    delete payload.imageRequired;
    loaderHtml(true);
    post("review/addGoogleReview", payload).then((res) => {
      loaderHtml(false);
      if (res.success) {
        result({ event: "submit" });
      }
    });
  };

  useEffect(() => {
    getStatus();
  }, []);

  return (
    <>
      <div className="max-w-lg mx-auto bg-white shadow-xl p-4 mt-6 rounded-xl">
        <img
          src="/assets/img/logo.png"
          className="object-contain h-24 w-full"
        />

        <div className="text-xl font-[600] text-center leading-8 mt-6">
          <p>
            Earn $15 for Every Stamp Collected and $1 for{" "}
            <span className="block">Each Check-In or Shared Experience!</span>{" "}
          </p>

          {/* <p className="mt-4 text-[#eb6e5e] text-2xl">Save up to $135 !</p> */}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {rewardTypes.map((type:any) => {
            return (
              <div
                className={`images_circles relative cursor-pointer ${
                  status?.[type.key] ? "disabled opacity-50" : ""
                }`}
                key={type}
                onClick={() => addReward(type.id)}
              >
                <img
                  src="/assets/img/cliam/circle.png"
                  className="object-contain h-28 w-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-xs sm:text-sm lg:text-lg leading-6">
                    {/* {type.split(' ').map(itm=>{
                        return <p key={itm}>{itm}</p>
                    })} */}
                    <p className="w-full max-w-[100px] mx-auto">{type.name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="">
          <div className="text-center mt-10 text-gray-700">
            <p className="text-primary font-bold mt-2">
              <span className="text-primary text-base">Tag us</span>{" "}
              @theshroomgroove
            </p>
            <a
              href="https://youtube.com/@CraftTherapyNetwork"
              target="_blank"
              className="text-blue-500 underline hover:text-blue-700 transition-all duration-200"
            >
              Youtube.com/@crafttherapynetwork
            </a>
            <p className="text-sm mt-4">Redeem one stamp per visit</p>
            <p className="text-lg mt-2 font-semibold">
              Call us: <span className="text-primary">313-858-3371</span>
            </p>
          </div>
        </div>
      </div>

      {/* </PageLayout> */}
      {rewardModal ? (
        <>
          <Modal
            title="Claim Reward"
            body={
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                  }}
                >
                  <div className="relative flex items-center justify-between p-4 border rounded-2xl shadow-sm bg-gray-100 text-primary mb-4">
                    <div className="text-lg font-bold">Reward Type</div>
                    <div className="text-2xl font-extrabold">
                      <span className=" text-sm bg-white text-primary px-4 py-2 rounded-full font-semibold">
                        {rewardTypes.find((itm) => itm.id == rewardModal.type)
                          ?.name || rewardModal.type}
                      </span>
                    </div>
                  </div>

                  <FormControl
                    type="textarea"
                    label="Text"
                    value={rewardModal.notes}
                    onChange={(e:any) => {
                      setRewardModal((prev:any) => ({ ...prev, notes: e }));
                    }}
                  />

                  {rewardModal.type == "Share Your Journey" ? (
                    <>
                      {/* <div className="mt-3">
                                    <FormControl
                                        type="radio"
                                        label="Audio/Video"
                                        value={rewardModal.contentType}
                                        options={[
                                            { id: 'upload', name: 'Upload from Gallary' },
                                            { id: 'recording', name: 'Recording' },
                                        ]}
                                        join={<span>Or</span>}
                                        onChange={e => {
                                            setRewardModal(prev => ({
                                                ...prev, contentType: e,
                                                uploadType: '',
                                                image: ''
                                            }))
                                            setVideoBlob('')
                                        }}
                                    />
                                </div> */}

                      <div className="mt-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="">
                            <p className="text-base font-normal">Audio/Video</p>
                          </div>

                          <ul className="inline-flex gap-3 flex-wrap bg-black rounded-lg">
                            {[
                              { id: "upload", name: "Upload from Gallery" },
                              { id: "recording", name: "Recording" },
                            ].map((option) => (
                              <li key={option.id}>
                                <label
                                  className={`cursor-pointer inline-block px-4 py-3 rounded-lg ${
                                    rewardModal.contentType === option.id
                                      ? "bg-primary text-white"
                                      : "bg-transparent text-[#fff]"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="contentType"
                                    value={option.id}
                                    checked={
                                      rewardModal.contentType === option.id
                                    }
                                    onChange={() => {
                                      setRewardModal((prev:any) => ({
                                        ...prev,
                                        contentType: option.id,
                                        uploadType: "",
                                        image: "",
                                      }));
                                      setVideoBlob("");
                                    }}
                                    className="hidden"
                                  />
                                  {option.name}
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {rewardModal.contentType == "upload" ? (
                        <>
                          <div className="mt-4">
                            <FormControl
                              type="radio"
                              value={rewardModal.uploadType}
                              options={[
                                { id: "audio", name: "Audio" },
                                { id: "video", name: "Video" },
                              ]}
                              join={<span>Or</span>}
                              onChange={(e:any) => {
                                setRewardModal((prev:any) => ({
                                  ...prev,
                                  uploadType: e,
                                  image: "",
                                }));
                              }}
                            />

                            <div className="mt-3">
                              {rewardModal.uploadType ? (
                                <>
                                  <ImageUpload
                                    value={rewardModal.image || ""}
                                    result={(e:any) => {
                                      setRewardModal((prev:any) => ({
                                        ...prev,
                                        image: e.value,
                                      }));
                                    }}
                                    accept={`${rewardModal.uploadType}/*`}
                                    content={rewardModal.uploadType}
                                    apiUrl={
                                      rewardModal.uploadType == "audio"
                                        ? "upload/audio"
                                        : "upload/video"
                                    }
                                    label={`Upload ${rewardModal.uploadType}`}
                                  />
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        </>
                      ) : rewardModal.contentType == "recording" ? (
                        <>
                          <div className="mt-3">
                            <FormControl
                              type="radio"
                              value={rewardModal.uploadType}
                              options={[
                                { id: "audio", name: "Audio Recording" },
                                { id: "video", name: "Video Recording" },
                              ]}
                              join={<span>Or</span>}
                              onChange={(e:any) => {
                                setRewardModal((prev:any) => ({
                                  ...prev,
                                  uploadType: e,
                                  image: "",
                                }));
                                setVideoBlob("");
                              }}
                            />
                          </div>
                          {/*  */}

                          {rewardModal.uploadType == "video" ? (
                            <>
                              <VideoRecorder
                                result={(e:any) => {
                                  setSubmitted(false);
                                  setVideoBlob(e.blob);
                                }}
                              />
                            </>
                          ) : (
                            <></>
                          )}

                          {rewardModal.uploadType == "audio" ? (
                            <>
                              <AudoRecording
                                result={(e:any) => {
                                  setSubmitted(false);
                                  setVideoBlob(e.blob);
                                }}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <></>
                      )}

                      {submitted && !rewardModal.image ? (
                        <>
                          <div className="text-red-600 mt-1">
                            <span className="capitalize">
                              {rewardModal.uploadType || "Audio/Video"}
                            </span>{" "}
                            is Required
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <></>
                  )}

                  {rewardModal?.imageRequired &&
                  rewardModal.type != "Share Your Journey" ? (
                    <>
                      <div className="mt-3">
                        <label>Image</label>
                        <div>
                          <ImageUpload
                            value={rewardModal.image || ""}
                            result={(e:any) => {
                              setRewardModal((prev:any) => ({
                                ...prev,
                                image: e.value,
                              }));
                            }}
                          />
                        </div>
                        {submitted && !rewardModal.image ? (
                          <>
                            <div className="text-red-600 mt-1">
                              Image is Required
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  <div className="mt-3 text-right">
                    <button className="btn btn-primary">Submit</button>
                  </div>
                </form>
              </>
            }
            result={() => setRewardModal("")}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default ClaimReward;
