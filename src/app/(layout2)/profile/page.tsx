"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ApiClientB from "@/utils/Apiclient";
import { loaderHtml } from "@/utils/shared";
// import "./profile.scss";
import methodModel from "@/utils/methodModel";
import { useDispatch, useSelector } from "react-redux";
import questionsKeys from "@/components/questions";
import { Dialog, Transition } from "@headlessui/react";
import speechModel from "@/utils/speech.model";
import { FaCamera, FaUpload } from "react-icons/fa6";
import CapturePhoto from "@/components/CapturePhoto";
import { IoClose } from "react-icons/io5";
import {
  getRandomCode
} from "@/utils/shared";
import Modal from "@/components/Modal";
import EditAddress from "@/components/EditAddress";
import FormControl from "@/components/FormControl";
import { toast } from "react-toastify";
import { login as login_success} from "@/redux/slices/userSlice";
import Image from "next/image";

const Profile = () => {
  const history = useRouter();

  const user = useSelector((state:any) => state.user.data);
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>([]);
  const [questions, setQuestions] = useState([]);
  const [detailLoader, setDetailLoadder] = useState(false);
  const [selectedValues, setSelectedValues] = useState<any>({});
  const [selectAll, setSelectAll] = useState(false);
  const [currentMedication, setCurrentMedication] = useState("");
  const [comment, setComment] = useState("");
  const [speachStart, setSpeachStart] = useState(false);
  const [isCapture, setIscapture] = useState(false);
  const [editModal, setEditModal] = useState<any>();
  const [stateId, setStateId] = useState({
    stateId: user.stateId || "",
  });

  const {get,put,multiImageUpload}=ApiClientB()
  const [membership, setMembership] = useState<any>();
  const [showEditAddress, setShowEditAddress] = useState('');
  const detail = user ;


  const apiRef = useRef({
    membership: { current: null },
    detail: { current: null },
  });
  const {
    get: getMembership,
    isLoading: membershipLoading,
    // controller: membershipController,
  } = ApiClientB(apiRef.current.membership);


  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const gallaryData = () => {
    setDetailLoadder(true);
  get(`user/profile`, { id: user._id }).then((res) => {
      setDetailLoadder(false);
      if (res.success) {
        setData(res.data);
        setStateId((prev) => ({ ...prev, stateId: res.data.stateId }));
      }
    });
  };

  const sortedQuestions:any = questions?.sort(
    (a:any, b:any) => a.order - b.order
  );

  const getQuestions = () => {
    const prm = {
      type: (user.checkInType || "Groove Group").replace(
        "Groove Group",
        "Shroom Groove"
      ),
      sortBy: "order asc",
    };
    get("onboarding-questions/list", prm).then((res) => {
      if (res.success) {
        // const filterData = res?.data?.filter((data)=>data?.title)
        setQuestions(res?.data);
      }
    });
  };

  const handleCheckboxChange = (type:any, option:any, key:any) => {
    setSelectedValues((prevValues:any) => {
      const currentValues = prevValues[key] || [];
      if (currentValues.includes(option)) {
        return {
          ...prevValues,
          [key]:
            type == "multiple"
              ? currentValues.filter((opt:any) => opt != option)
              : option,
        };
      } else {
        return {
          ...prevValues,
          [key]: type == "multiple" ? [...currentValues, option] : option,
        };
      }
    });
  };

  const handleSelectAll = (item:any, key:any) => {
    const allOptions = item?.options;
    if (selectAll) {
      // Deselect all
      setSelectedValues((prevValues:any) => {
        return {
          ...prevValues,
          [key]: [],
        };
      });
      setSelectAll(!selectAll);
    } else {
      // Select all
      setSelectedValues((prevValues:any) => {
        return {
          ...prevValues,
          [key]: allOptions.map((itm:any) => itm.name),
        };
      });
      setSelectAll(!selectAll);
    }
  };

  const handleUpdateAnswers = () => {
    const payload :any= {
      ...selectedValues,
      id: user.id || user._id,
    };

    payload.primary_interest =
      payload.primary_interest == "Health & Wellness"
        ? "Health & Wellness"
        : "Therapeutic Use";

    if (payload.current_medications) {
      payload.current_medications =
        payload.current_medications?.toLowerCase() == "yes" ? true : false;
    }

    if (payload.previous_experience) {
      payload.previous_experience =
        payload.previous_experience?.toLowerCase() == "yes" ? true : false;
    }

    if (payload.personalize_recommendation) {
      payload.personalize_recommendation =
        payload.personalize_recommendation?.toLowerCase() == "yes" ? true : false;
    }

    if (payload.privacy_consent) {
      payload.privacy_consent = payload.privacy_consent?.toLowerCase() == "yes" ? true : false;
    }


    if (payload.previous_experience == true) {
      payload.previous_experience_desc = comment;
    }
    if (payload.current_medications == true) {
      payload.current_medications_desc = currentMedication;
    }

    put("user/profile", { ...payload }).then((res) => {
      if (res.success) {
        history.push("/profile");
        closeModal();
        gallaryData();
      }
    });
  };

  const stop = () => {
    const recognition = speechModel.recognition;
    recognition.stop();
    setSpeachStart(false);
  };

  const voice = (p:any) => {
    const voiceBtn = document.getElementById("voiceBtn");
    if (speachStart) {
      stop();
      return;
    }

    setSpeachStart(true);
    // voiceBtn?.classList.add("glowing")
    const recognition = speechModel.recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    recognition.onresult = async (event:any) => {
      const transcript:any = Array.from(event.results)
        .map((result:any) => result[0])
        .map((result) => result.transcript)
        .join("\n");

      const el:any = document.getElementById("voicemessage");

      let message = comment;
      if (p == "medication") message = currentMedication;

      message = `${message}\n${transcript}`;

      if (p == "medication") {
        setCurrentMedication(message);
      } else {
        setComment(message);
      }
      if (el) {
        // el.innerHTML = `\n ${updatedMessage}`
        el.value = `\n${transcript}`;
      }
    };

    recognition.start();
    recognition.onspeechend = () => {
      // recognition.stop();
      setSpeachStart(false);
      voiceBtn?.classList.remove("glowing");
    };
  };

  useEffect(() => {
    if (user) {
      gallaryData();
      getQuestions();
    }
  }, []);

  useEffect(() => {
    const payload:any = {};
        Object.keys(questionsKeys).map((_key) => {
            payload[questionsKeys[_key]] = data?.[questionsKeys[_key]]
        })

        if (data?.current_medications_desc)
            setCurrentMedication(data?.current_medications_desc);
        if (data?.previous_experience_desc)
            setComment(data?.previous_experience_desc);

        payload.current_medications = payload.current_medications ? 'yes' : 'no'
        payload.previous_experience = payload.previous_experience ? 'yes' : 'no'
        payload.personalize_recommendation = payload.personalize_recommendation ? 'yes' : 'no'
        payload.privacy_consent = payload.privacy_consent ? 'yes' : 'no'
        setSelectedValues({ ...payload ,extra:data?.extra})
  }, [data]);

  const getMembershipDetail = () => {
    getMembership("membership/detail", { user_id: (user.id || user._id) }).then((res) => {
      if (res.success) {
        const data = res.data;
        data.box_preference = data.box_preference?.replaceAll("N/A", "") || "";
        data.shippingStatus =
          data.shippingStatus
            ?.toLowerCase()
            ?.replaceAll(" ", "_")
            ?.replaceAll("n/a", "") || "";

        let craft_box = data?.craft_box || []

        if (!craft_box?.length && data.box_preference) {
          craft_box = [
            {
              id: `craft_${getRandomCode(12)}`,
              payment_type: "recurring",
              box_preference: data.box_preference,
              shippingStatus: data?.shippingStatus,
            },
          ];
        }

        craft_box = craft_box.map((itm:any) => ({ ...itm, shippingStatus: itm.shippingStatus.toLowerCase()?.replaceAll(' ', '_') }))

        if (craft_box?.length) {
          data.box_preference = craft_box[0].box_preference;
        }
        if (craft_box?.length && !data.shippingStatus) {
          data.shippingStatus = craft_box[0].shippingStatus || "";
        }

        data.craft_box = craft_box

       data.shipping_address_1 = data.shipping_address_1 || data.primary_address_1;
        data.shipping_address_2 = data.shipping_address_2 || data.primary_address_2;
        data.shipping_city = data.shipping_city || data.primary_city;
        data.shipping_state = data.shipping_state || data.primary_state;
        data.shipping_postcode = data.shipping_postcode || data.primary_postcode;
        data.shipping_country = data.shipping_country || data.primary_country;

        data.billing_address_1 = data.billing_address_1 || data.primary_address_1;
        data.billing_address_2 = data.billing_address_2 || data.primary_address_2;
        data.billing_city = data.billing_city || data.primary_city;
        data.billing_state = data.billing_state || data.primary_state;
        data.billing_postcode = data.billing_postcode || data.primary_postcode;
        data.billing_country = data.billing_country || data.primary_country;

        setMembership(data);
      }
    });
  };

  useEffect(() => {
    getMembershipDetail();
  }, []);

  const uploadStateId = (e:any) => {
    const files = e.target.files;
    if (!files.length) return;
    loaderHtml(true);
    multiImageUpload(
      "upload/multiple-images",
      files,
      {},
      "files"
    ).then((res) => {
      if (res.success) {
        const file = res.files?.[0]?.fileName;
        setStateId((prev) => ({ ...prev, stateId: file }));
      }
      loaderHtml(false);
    });
  };

  const updateStateId = () => {
    if (!stateId.stateId) return;
    loaderHtml(true);
    put("user/profile", {
      id: user._id || user.id,
      stateId: stateId.stateId,
    }).then((res:any) => {
      loaderHtml(false);
      if (res.success) {
      }
    });
  };

  const updateAddress = (e:any) => {
    if (e.event == 'submit') {
      const payload = {
        user_id: (user.id || user._id),
        ...e.data
      }
      loaderHtml(true)
      put('membership/edit', payload).then(res => {
        if (res.success) {
          setMembership((prev:any) => ({ ...prev, ...payload }))
          setShowEditAddress('')
        }
      }).finally(() => {
        loaderHtml(false)
      })
    }
  }

  const updateProfile = () => {
    const userId = (user.id || user._id)
    const payload = {
      //   userId: userId,
      //  memberShip:{
      //   ...editModal
      //  },
      //  profile:{
      //   ...editModal
      //  },
      //  new_email:editModal?.email
      userId: userId,
      email: user.email,
      new_email: editModal?.email
    }

    if (editModal?.email == user.email) {
      toast.error("This Email is already exist")
      return
    }

    loaderHtml(true)
    put('user/updateUserEmail', payload).then(res => {
      if (res.success) {
        setMembership((prev:any) => ({ ...prev, email: payload.new_email }))
        const login:any={ email: payload.new_email }
        dispatch(login_success(login))
        setEditModal('')
      }
    }).finally(() => {
      loaderHtml(false)
    })
  }

   const hasAllOptions = (arr1:any, arr2:any) => {
        const hasAll = arr1?.every(({ name }:any) => arr2?.includes(name));
        return hasAll;
    };

  return (
    <>
      <div className="wrapper_section">
        <div className="">
          <div className="flex items-center flex-wrap lg:flex-nowrap gap-4 justify-between">
            <h3 className=" text-lg lg:text-2xl font-semibold text-[#111827]">
              My Profile{" "}
            </h3>
            <button
              onClick={openModal}
              disabled={detailLoader}
              className=" text-center flex border border-gray-300 bg-[#540C0F] px-4 text-sm py-2 gap-x-2 rounded-full  items-center text-white"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
            
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
              </svg>
              Edit Answers
            </button>
          </div>
        </div>

        <div className="mb-3 mt-3 shadow p-3 rounded">
          <div className="mb-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {membershipLoading ? (
                <>
                  <div className="shine h-[150px] rounded-lg bg-gray-200"></div>
                  <div className="shine h-[150px] rounded-lg bg-gray-200"></div>
                  <div className="shine h-[150px] rounded-lg bg-gray-200"></div>
                </>
              ) : (
                <>
                  {/* Mailing Address */}
                  <div className="bg-white border rounded-xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="material-symbols-outlined text-primary">location_on</span>
                      <h4 className="text-sm font-semibold">Mailing Address</h4>
                      <span
                        className="material-symbols-outlined text-[20px] text-primary cursor-pointer ml-auto"
                        onClick={() => setShowEditAddress('primary')}
                      >
                        edit
                      </span>
                    </div>
                    {membership?.primary_address_1 ? (
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>{membership?.primary_address_1}</p>
                        <p>
                          {membership?.primary_city}, {membership?.primary_state},{' '}
                          {membership?.primary_country}, {membership?.primary_postcode}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-red-500">No Address</p>
                    )}
                  </div>

                  {/* Billing Address */}
                  <div className="bg-white border rounded-xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="material-symbols-outlined text-primary">location_on</span>
                      <h4 className="text-sm font-semibold">Billing Address</h4>
                      <span
                        className="material-symbols-outlined text-[20px] text-primary cursor-pointer ml-auto"
                        onClick={() => setShowEditAddress('billing')}
                      >
                        edit
                      </span>
                    </div>
                    {membership?.billing_address_1 ? (
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>{membership?.billing_address_1}</p>
                        <p>
                          {membership?.billing_city}, {membership?.billing_state},{' '}
                          {membership?.billing_country}, {membership?.billing_postcode}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-red-500">No Address</p>
                    )}
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white border rounded-xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="material-symbols-outlined text-primary">location_on</span>
                      <h4 className="text-sm font-semibold">Shipping Address</h4>
                      {!detail?.isDeleted && (
                        <span
                          className="material-symbols-outlined text-[20px] text-primary cursor-pointer ml-auto"
                          onClick={() => setShowEditAddress('shipping')}
                        >
                          edit
                        </span>
                      )}
                    </div>
                    {membership?.shipping_address_1 ? (
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>{membership?.shipping_address_1}</p>
                        <p>
                          {membership?.shipping_city}, {membership?.shipping_state},{' '}
                          {membership?.shipping_country}, {membership?.shipping_postcode}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-red-500">No Address</p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="bg-white border rounded-xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="material-symbols-outlined text-primary">mail</span>
                      <h4 className="text-sm font-semibold">Email Address</h4>
                      <span
                        className="material-symbols-outlined text-[20px] text-primary cursor-pointer ml-auto"
                        onClick={() => setEditModal({ email: user.email })}
                      >
                        edit
                      </span>
                    </div>
                    {user?.email && (
                      <div className="text-xs text-gray-600">
                        <p>{user?.email}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>
          <div>
            <h3 className="mb-2 font-bold">State Id</h3>

            {stateId.stateId ? (
              <>
                <div className="text-center relative">
                  <div className="mb-3 bg-gray-50 flex justfy-center items-center w-full">
                    <button
                      type="button"
                      className=" px-6 py-2 rounded text-primary flex items-center justify-center gap-2 text-[16px] w-full"
                      onClick={() =>
                        setStateId((prev) => ({ ...prev, stateId: "" }))
                      }
                    >
                      <IoClose /> Remove State Id
                    </button>
                  </div>
                  <Image
                    src={methodModel.noImg(stateId.stateId)}
                    className="w-[120px] mx-auto block mb-3"
                    alt=""
                    width={20}
          height={20}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col xl:flex-row items-center gap-4 ">
                  <button
                    onClick={() => setIscapture(true)}
                    type="button"
                    className="flex items-center gap-2 bg-primary px-6 py-2 rounded-lg text-white text-sm font-medium shadow hover:bg-opacity-90 transition-all"
                  >
                    <FaCamera className="text-lg" /> Capture
                  </button>
                  <span className="text-gray-500 font-medium text-[14px]">
                    OR
                  </span>
                  <label
                    onClick={() => setIscapture(false)}
                    className="flex items-center gap-2 bg-primary px-6 py-2 rounded-lg text-white text-sm font-medium shadow cursor-pointer hover:bg-opacity-90 transition-all"
                  >
                    <FaUpload className="text-lg" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => uploadStateId(e)}
                    />
                  </label>
                </div>

                {isCapture ? (
                  <>
                    <div>
                      <CapturePhoto
                        result={(e) => {
                          setStateId((prev) => ({ ...prev, stateId: e.value }));
                          setIscapture(false);
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>

          {stateId.stateId ? (
            <>
              <div className="text-right mt-3">
                <button
                  type="button"
                  className="bg-primary px-6 py-2 rounded text-white text-[13px] rounded-full"
                  onClick={() => updateStateId()}
                >
                  Update
                </button>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="inner_part mt-8 overflow-hidden bg-white">
          <div className="">
            {detailLoader ? (
              <>
                <div className="shine h-[50px] mb-3"></div>
                <div className="shine h-[50px] mb-3"></div>
                <div className="shine h-[50px] mb-3"></div>
                <div className="shine h-[50px] mb-3"></div>
                <div className="shine h-[50px] mb-3"></div>
                <div className="shine h-[50px] mb-3"></div>
                <div className="shine h-[50px] mb-3"></div>
                <div className="shine h-[50px] mb-3"></div>
                <div className="shine h-[50px] mb-3"></div>
                <div className="shine h-[50px] mb-3"></div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 lg:px-4">
                  {sortedQuestions?.map((item:any, index:any) => {
                    const key = item.answereKey || questionsKeys[item.title] || questionsKeys[item.question];
                    let answer = data?.[key];
                    if (data?.[key] === true || data?.[key] === false) {
                      answer = data?.[key] == true ? "Yes" : "No";
                    } else {
                      if (!data?.[key]?.length) {
                        answer = <span className="text-red-500">Not selected any Option</span>
                      }
                    }
                    const isArray = Array.isArray(answer)
                    if (isArray) {
                      answer = answer.join(", ");
                    }

                    return (
                      <div
                        key={index}
                        className={`${index > 0
                          ? "mt-0  last:border-0 border-b border-gray-200 pb-4"
                          : "mt-0 last:border-0 border-b border-gray-200 pb-4"
                          }`}
                      >
                        <div className="text-lg lg:text-xl mb-3 font-bold mb-2 ">
                          {item.title}
                        </div>
                        <div className="flex items-start font-semibold gap-2 mb-2 text-sm lg:text-lg ">
                          <span className="h-5 w-5 text-sm lg:text-lg lg:h-6 lg:w-6 justify-center flex items-center bg-gray-200 shrink-0">
                            Q
                          </span>{" "}
                          {item.question}
                        </div>
                        <div className="flex items-start font-regular gap-2">
                          <span className="h-5 w-5 text-sm lg:text-lg lg:h-6 lg:w-6 justify-center text-white flex items-center bg-[#540C0F] shrink-0">
                            A
                          </span>
                          <span className="text-sm lg:text-lg"> {answer} {data?.extra?.[key] ? `${isArray ? ', ' : ''}(${data?.extra?.[key]})` : ''} {(key=='current_medications'&&data?.current_medications_desc)?`(${data?.current_medications_desc})`:''} {(key=='previous_experience'&&data?.previous_experience_desc)?`(${data?.previous_experience_desc})`:''}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-[40px] bg-white px-6 py-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className=" font-semibold text-[25px] leading-6 text-black mb-10"
                  >
                    Update Answers
                  </Dialog.Title>
                  {sortedQuestions?.map((item:any, index:any) => {
                    const key =
                      item.answereKey ||
                      questionsKeys[item.title] ||
                      questionsKeys[item.question];
                    let answer = data[key];
                    if (Array.isArray(answer)) {
                      answer = answer.join(", ");
                    }
                    if (data[key] === true) {
                      answer = "yes";
                    }
                    if (data[key] === false) {
                      answer = "no";
                    }

                    return (
                      <div key={index} className={"mt-4 pb-4"}>
                        <div className="text-xl mb-3 font-bold mb-2 ">
                            {item.title}
                        </div>
                        <div className="flex items-start font-semibold gap-2 mb-2 ">
                            {item.question}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {item.question_type == "multiple" && (
                                <>
                                    <label className="relative flex items-center cursor-pointer w-full rounded-[25px] border border-[#000] py-4 px-6">
                                        <input
                                            className="sr-only peer"
                                            name="futuristic-radio"
                                            type="checkbox"
                                            // checked={selectAll}
                                            checked={hasAllOptions(
                                                item.options,
                                                selectedValues[key]
                                            )}
                                            onChange={() => {
                                                handleSelectAll(item, key);
                                            }}
                                        />

                                        <div className="w-10 h-10 shrink-0 bg-transparent border border-black rounded-full overflow-hidden flex items-center justify-center transition duration-300 ease-in-out peer-checked:opacity-100 peer-checked:grayscale-0 opacity-50 grayscale">
                                            <Image
                                            width={20}
          height={20}
                                                src="/assets/img/coin/c1.svg"
                                                className="h-full w-full object-cover"
                                                alt="Coin Image"
                                            />
                                        </div>
                                        <span className="ml-3 text-black">Select All</span>
                                    </label>
                                </>
                            )}

                            {item.options.map((option:any, index:any) => {
                                const type = item.question_type;

                                let option_name=option.name
                                if(key=='current_medications'||key=='previous_experience'||key=='personalize_recommendation'||key=='privacy_consent') option_name=option_name.toLowerCase()
                                return (
                                    <>
                                        <label className="relative flex items-center cursor-pointer w-full rounded-[25px] border border-[#000] py-4 px-6">
                                            {type == "multiple" ? (
                                                <>
                                                    <input
                                                        className="sr-only peer"
                                                        name="futuristic-radio"
                                                        type="checkbox"
                                                        checked={
                                                            selectedValues[key] && selectedValues[key]?.length
                                                                ? selectedValues[key]?.includes(
                                                                    option_name
                                                                )
                                                                : answer?.includes(option_name)
                                                                    ? true
                                                                    : false
                                                        }
                                                        onChange={() => {
                                                            handleCheckboxChange(
                                                                type,
                                                                option_name,
                                                                key
                                                            );
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <input
                                                        className="sr-only peer"
                                                        type="radio"
                                                        checked={
                                                            selectedValues[key] && selectedValues[key]?.length
                                                                ? selectedValues[key]?.includes(
                                                                   option_name
                                                                )
                                                                : option_name === answer
                                                                    ? true
                                                                    : false
                                                        }
                                                        // value={answer}
                                                        onChange={() => {
                                                            handleCheckboxChange(
                                                                type,
                                                                option_name,
                                                                key
                                                            );
                                                        }}
                                                    />
                                                </>
                                            )}

                                            <div className="w-10 h-10 shrink-0 bg-transparent border border-black rounded-full overflow-hidden flex items-center justify-center transition duration-300 ease-in-out peer-checked:opacity-100 peer-checked:grayscale-0 opacity-50 grayscale">
                                                <Image
                                                    src={methodModel.noImg(option.image)}
                                                    className="h-full w-full object-cover"
                                                    alt="Coin Image"
                                                    width={20}
                                                    height={20}
                                                />
                                            </div>
                                            <span className="ml-3 text-black">
                                                {option_name}
                                            </span>
                                        </label>
                                    </>
                                );
                            })}
                        </div>
                        {key == "current_medications" &&
                            (selectedValues["current_medications"] === "yes") && (
                                <div className="mt-2">
                                    <span className="text-black font-medium text-[15px]">
                                        If &quot;Yes&quot;, please explain
                                    </span>
                                    <textarea
                                        rows={4}
                                        id="voicemessage"
                                        value={currentMedication}
                                        placeholder="Write your comments"
                                        className="block w-full mb-1 h-50 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                                        onChange={(e) => {
                                            setCurrentMedication(e.target.value);
                                        }}
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => voice("medication")}
                                            className={`btn btn-outline-dark px-3 mb-3 btnmi ${speachStart ? "glowing" : ""
                                                }`}
                                            id="voiceBtn"
                                        >
                                            <i className="fa fa-microphone mr-1"></i> Type or
                                            Speak
                                        </button>
                                    </div>
                                </div>
                            )}

                        {key == "previous_experience" &&
                            (selectedValues["previous_experience"] == "yes") && (
                                <div className="mt-2">
                                    <span className="text-black font-medium text-[15px]">
                                        If &quot;Yes&quot;, please explain
                                    </span>
                                    <textarea
                                        rows={4}
                                        id="voicemessage"
                                        value={comment}
                                        placeholder="Write your comments"
                                        className="block w-full mb-1 h-50 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                                        onChange={(e) => {
                                            setComment(e.target.value);
                                        }}
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => voice("previous_experience")}
                                            className={`btn btn-outline-dark px-3 mb-3 btnmi ${speachStart ? "glowing" : ""
                                                }`}
                                            id="voiceBtn"
                                        >
                                            <i className="fa fa-microphone mr-1"></i> Type or Speak
                                        </button>
                                    </div>
                                </div>
                            )}

                        {(sortedQuestions[index].question_type ==
                            "yes_no" &&
                            key == "previous_experience" &&
                            selectedValues["previous_experience"] == "yes") || (selectedValues?.[key]&&selectedValues?.[key]?.includes('Other')) ? (
                            <div className="mt-5">
                                <span className="text-black font-medium text-[15px]">
                                    if you are selecting{" "}
                                    <span className="text-[#540C0F]">“{sortedQuestions[index].question_type ==
                                        "yes_no" ? 'Yes' : 'Other'}“</span>{" "}
                                    please explain
                                </span>
                                <div className="d-block mt-2">
                                    <textarea
                                        rows={4}
                                        value={sortedQuestions[index].question_type ==
                                            "yes_no" ? comment : selectedValues?.extra?.[key]}
                                        placeholder="Write your comments"
                                        className="block w-full h-50 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                                        onChange={(e) => {
                                            if (sortedQuestions[index].question_type ==
                                                "yes_no") {
                                                setComment(e.target.value);
                                            } else {
                                                setSelectedValues((prev:any) => ({
                                                    ...prev,
                                                    extra: {
                                                        ...prev?.extra,
                                                        [key]: e.target.value
                                                    }
                                                }))

                                            }


                                        }}
                                    />
                                    <div className="flex items-center justify-end mt-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                voice("previous_experience")
                                            }
                                            className={`btn btn-outline-dark px-3 mb-3 btnmi ${speachStart ? "glowing" : ""
                                                }`}
                                            id="voiceBtn"
                                        >
                                            <i className="fa fa-microphone mr-1"></i> Type
                                            or Speak
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div ></div>
                        )}

                    </div>
                    );
                  })}
                  <div className="flex justify-end mt-2 gap-4">
                    <button
                      onClick={closeModal}
                      className="px-2 lg:!px-4 text-[16px] font-normal bg-gray-400 text-white h-12 flex items-center justify-center gap-2 !bg-primary rounded-lg shadow-btn hover:opacity-80 transition-all focus:ring-2 ring-[#EDEBFC] disabled:bg-[#D0CAF6] disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateAnswers}
                      className="px-2 lg:!px-4 text-[16px] font-normal bg-[#540C0F]  text-white h-12 flex items-center justify-center gap-2 !bg-primary rounded-lg shadow-btn hover:opacity-80 transition-all focus:ring-2 ring-[#EDEBFC] disabled:bg-[#D0CAF6] disabled:cursor-not-allowed"
                    >
                      Save Answers
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {showEditAddress ? <>
        <Modal
          title={`Update ${showEditAddress} Address`}
          body={<>
            <EditAddress atype={showEditAddress} membership={membership} result={updateAddress} />
          </>}
          result={e => {
            console.log(e);
            
            setShowEditAddress('')
          }}
        />
      </> : <></>}

      {editModal ? <>
        <Modal
          title={`Update Email Address`}
          body={<>
            <form onSubmit={e => { e.preventDefault(); updateProfile() }}>
              <FormControl
                label="Email"
                type="email"
                value={editModal?.email?.trim()}
                onChange={(e:any) => {
                  setEditModal((prev:any) => ({
                    ...prev,
                    email: e,
                  }))
                }}
                required
              />
              <div className="mt-3 col-span-full text-right">
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </form>
          </>}
          result={e => {
            console.log(e);
            
            setEditModal('')
          }}
        />
      </> : <></>}
    </>
  );
};

export default Profile;
