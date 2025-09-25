import React, { Fragment, useEffect, useRef, useState } from "react";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import ApiClientB from "@/utils/Apiclient";
import { useSelector } from "react-redux";
import socketModel from "@/utils/socketModel";
import moment from "moment";
import methodModel from "@/utils/methodModel";
import User from "./User";
import { Dialog, Transition } from "@headlessui/react";
import FormControl from "@/components/FormControl";
import { loaderHtml } from "@/utils/shared";
import EmojiPicker from "emoji-picker-react";
import { PiSmileyBold } from "react-icons/pi";
import { BsChatSquareDots } from "react-icons/bs";
import { RiChatOffLine } from "react-icons/ri";
import localStorage from "redux-persist/es/storage";
import Image from "next/image";



function Chats() {
  const user = useSelector((state:any) => state.user.data);
  const [img, setImg] = useState("");
  const [message, setMessage] = useState<any>({
    type: "",
    message: "",
  });
  const [chatMessages, setChatMessages] = useState<any>([]);
  const [InitialChatCount, setInitialChatCount] = useState(0);
  const [chatRooms, setChatRooms] = useState<any>([]);
  const [chatRoomId, setChatRoomId] = useState("");
  const [activeChat, setActiveChat] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [search, setSearch] = useState("");
  const [cLoader, setCLoader] = useState(false);
  const [chatEnabled, setChatEnabled] = useState();
  const [adminAvailableTime, setAdminAvailableTime] = useState<any>()
 const {get,post,put,allApi,multiImageUpload}=ApiClientB()
  const isEmitted = localStorage.getItem("UserOnline");

  const ar = sessionStorage.getItem("activeRooms");
  const activeRooms = useRef(ar ? JSON.parse(ar) : []);
  const currectChat = useRef('');
  const messages = useRef<any>([]);

  const [form, setForm] = useState<any>({
    subject: "",
    chat_by: "",
  });
  const formValidation = [
    {
      key: "subject",
      required: true,
    },
  ];

  const handleEmojiClick = ({ emoji }:any) => {
    const _value = message.message;
    const _message =
      message.message.length > 0 ? `${_value} ${emoji}` : `${emoji}`;
    setMessage({ message: _message, type: "TEXT" });
    // setShowEmojis(false);
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    setSubmitted(true);
    const url = "chat/join-group";

    const invalid = methodModel.getFormError(formValidation, form);

    if (invalid) return;
    const method = "post";

    const value = {
      ...form,
      chat_by: user?._id,
    };

    loaderHtml(true);
    allApi(url, value, method).then((res) => {
      if (res.success) {
        setSubmitted(false);
        setInitialChatCount(1);
        getChatRoomsList();
        closeModal();
      }
      loaderHtml(false);
    });
  };

  const closeModal = () => {
    setIsOpen(!isOpen);
    setForm({});
  };

  const handleSendMessage = () => {
    let value = {};
    if (message) {
      value = {
        room_id: chatRoomId,
        type: message.type,
        content: message.message || img,
        user_id: user?._id,
      };
      socketModel.emit("send-message", value);
      setMessage({ message: "", type: "" });
      setImg("");
      setShowEmojis(false);
    }
  };

  const chatScroll = () => {
    // Scroll to the bottom after sending a message
    const chatBox = document.getElementById("chat-box");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  };

  const initialChatRoomList = (p = {}) => {
    const f = { user_id: user?._id, quickChat: false, ...p };
    loaderHtml(true);
    get("chat/room-members", f).then((res) => {
      if (res.success) {
        setInitialChatCount(res.data.data.length);
      }
      loaderHtml(false);
    });
  };

  const getChatRoomsList = (p = {}) => {
    let f:any = { user_id: user?._id, quickChat: false, ...p };
    if (search) {
      f = { ...f, search: search, ...p };
    }
    if (search) setCLoader(true);
    get("chat/room-members", f).then((res) => {
      if (res.success) {
        setChatRooms(res.data.data);
      }
      setCLoader(false);
    });
  };

  const getChatMessages = (id:any) => {
    // loaderHtml(true);
    get("chat/messages", { room_id: id }).then((res) => {
      if (res.success) {
        const data = res.data.data;
        setChatMessages(data);
        messages.current = data;
        setTimeout(() => {
          chatScroll();
        }, 100);
      }
      // loaderHtml(false);
    });
  };

  const getActiveChat = () => {
    get("chat/room-members", { room_id: chatRoomId }).then((res) => {
      if (res.success) {
        setActiveChat(res.data.data?.[0]);
      }
    });
  };




  useEffect(() => {
    if (chatRoomId != "") {
      const value = {
        room_id: chatRoomId,
        user_id: user?._id,
      };
      if (!activeRooms.current.includes(chatRoomId)) {
        activeRooms.current.push(chatRoomId);
        sessionStorage.setItem(
          "activeRooms",
          JSON.stringify(activeRooms.current)
        );
        socketModel.emit("join-room", value);
      }
      socketModel.emit("unread-count", value);
      socketModel.emit("read-all-message", value);

      getChatMessages(chatRoomId);
      getActiveChat();
    }
  }, [chatRoomId]);

  useEffect(() => {
    socketModel.on("receive-message", (data) => {
      if (currectChat.current == data.data.room_id) {
        messages.current.push({ ...data.data });

        const uniqueMessages = Array.from(
          new Set(messages.current.map((message:any) => message._id))
        ).map((id) => {
          return messages.current.find((message:any) => message._id === id);
        });

        setChatMessages([...uniqueMessages]);
        setTimeout(() => {
          chatScroll();
        }, 100);
      }
      getChatRoomsList();
    });
    // Api to get the information about admin available time
    getAdminAvailableTime()
  }, []);

  const getAdminAvailableTime=()=>{
    get(`admin/setting-detail`).then((res:any) => {
      if (res.success) {
        setAdminAvailableTime(res?.data)
      }
    })
  }

  useEffect(() => {
    socketModel.on("user-profile", (data) => {
      const enabled = data.data.user.chat_enabled;
      setChatEnabled(enabled);
    });
  }, []);

  const uploadImage = async (e:any) => {
    let url = "upload/multiple-images";
    const files = e.target.files;
    if (files?.length > 1) {
      url = "upload/multiple-images";
    }
    let images:any = [];
    loaderHtml(true);
    multiImageUpload(url, files, {}, "files").then((res) => {
      if (res.files) {
        const image = res.files.map((itm:any) => itm.fileName);
        if (files?.length == 1) {
          setImg(image[0]);
          setMessage({ message: image[0], type: "IMAGE" });
        } else {
          images = [...images, ...image];
        }
      }
      loaderHtml(false);
    });
  };

    const handleChatClick = (id:any) => {
    if (id) {
      setChatRoomId(id);
      currectChat.current = id;
    }
  };

  const handleClearSearch = () => {
    getChatRoomsList({ search: "" });
    setSearch("");
  };

  useEffect(() => {
    getChatRoomsList();
    initialChatRoomList();
    setChatEnabled(user?.chat_enabled);
  }, []);

  useEffect(() => {
    // localStorage.setItem("UserOnline", true);

    // if (isEmitted) {
    //   socketModel.emit("user-online", { user_id: user._id });
    // }

    socketModel.on("user-online", () => {
      getChatRoomsList();
    });
    socketModel.on("user-offline", () => {
      getChatRoomsList();
    });

    return () => {
      // socketModel.emit("user-offline", { user_id: user._id });
      // localStorage.removeItem("UserOnline");
    };
  }, []);

  return (
 
 
   
    <>
      <div className="flex items-center flex-wrap gap-2 justify-between mb-3">
        <div className="font-semibold text-[24px]">Quick Chat</div>
        <div>
          <button className="flex flex-col items-center bg-[#540C0F] hover:bg-[#d35445] transition-colors duration-300 px-5 py-2 rounded-xl text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#540C0F]">
            <span className="font-medium text-lg">Chat With AI</span>
            <span className="text-xs mt-1">Coming Soon</span>
          </button>
        </div>
      </div>
      {!chatEnabled ? (
        <>
          <div className="bg-gray-100 rounded-lg  flex flex-col gap-2 px-4 items-center justify-center py-6 mt-4">
            <p className="text-[40px] bg-white mb-2 p-4 rounded-full shadow-md">
              <RiChatOffLine />
            </p>
            <p className="text-sm lg:text-md text-center"> Our operational hours are from {moment(adminAvailableTime?.availability_start).format("hh:mm A")} to {moment(adminAvailableTime?.availability_end).format("hh:mm A")} and will
            respond you back in next couple of hours.</p>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-12  ">
          {InitialChatCount == 0 && !search ? (
            <div className="col-span-12">
              <div className="h-[680px] bgs_starts flex items-center justify-center">
                <div className="w-52 mx-auto">
                  <button
                    onClick={() => {
                      setIsOpen(true);
                    }}
                    className=" flex items-center justify-center shadow-lg text-2xl border w-full border-gray-300 bg-[#540C0F] px-6 py-4 gap-x-2 text-center  items-center text-white"
                  >
                    <BsChatSquareDots /> Start Chat
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
                <div className="bg-gray-100 p-4 h-full">
                  <div className="flex items-center justify-center mb-4">
                    <form className="w-full">
                      <div className="border border-black/23 bg-white flex items-center h-10 ">
                        <div className="flex relative w-full">
                          <input
                            type="text"
                            className="w-full bg-[#fff] px-4 placeholder:text-gray-800 pr-10"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => {
                              if (e.target.value == "") {
                                handleClearSearch();
                              }
                              setSearch(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                getChatRoomsList();
                              }
                            }}
                          />
                          {search && (
                            <i
                              className="fa fa-times absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                              aria-hidden="true"
                              onClick={handleClearSearch}
                            ></i>
                          )}
                        </div>
                        <div className="h-full 	cursor-pointer w-12 bg-[#540C0F] flex items-center justify-center">
                          <IoSearchOutline
                            onClick={() => {
                              getChatRoomsList();
                            }}
                            className="text-white cursor-pointer"
                          />
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="flex items-center justify-center mb-4">
                    <button
                      onClick={() => {
                        setIsOpen(true);
                      }}
                      className=" flex items-center justify-center  border w-full border-gray-300 bg-neutral-700 px-6 py-2 gap-x-2 text-center  items-center text-white"
                    >
                      <BsChatSquareDots /> Start Chat
                    </button>
                  </div>
                  {chatRooms?.length == 0 && !cLoader && (
                    <div className="text-center text-gray-400 py-4">
                      no chats.
                    </div>
                  )}

                  {cLoader ? (
                    <>
                      <div role="status" className="text-center">
                        <svg
                          aria-hidden="true"
                          className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    </>
                  ) : (
                    <div className="max-h-[250px] md:max-h-[500px] overflow-y-auto overflow-x-hidden pr-2">
                      {chatRooms?.length > 0 &&
                        chatRooms.map((chat:any,i:any) => {
                          const isActive = chat.room_id == chatRoomId;
                          return (
                            // <div
                            //   onClick={() => {
                            //     handleChatClick(chat?.room_id);
                            //   }}
                            //   className={`bg-${
                            //     isActive ? "[#540C0F]" : "white"
                            //   } text-${
                            //     isActive ? "white" : "black"
                            //   } hover:bg-[#540C0F] hover:text-white  p-2 mb-3`}
                            // >
                            <div className="" key={i}>
                              <User                              
                                user={chat}
                                userId={user?._id}
                                isActive={isActive}
                                onChatClick={(id:any) => {
                                  handleChatClick(id);
                                }}
                              />
                            </div>
                            // </div>
                          );
                        })}
                    </div>
                  )}

                  {/* <div className="max-h-[250px] md:max-h-[500px] overflow-y-auto overflow-x-hidden pr-2">
                  {chatRooms?.length > 0 &&
                    chatRooms.map((chat) => {
                      const isActive = chat.room_id == chatRoomId;
                      return (
                        <div
                          onClick={() => {
                            handleChatClick(chat?.room_id);
                          }}
                          className={`bg-${
                            isActive ? "[#540C0F]" : "white"
                          } text-${
                            isActive ? "white" : "black"
                          } hover:bg-[#540C0F] hover:text-white  p-2 mb-3`}
                        >
                          <div className="">
                            <User user={chat} userId={user?._id} />
                          </div>
                        </div>
                      );
                    })}
                </div> */}
                </div>
              </div>

              {chatRoomId != "" ? (
                <Message
                  user={user}
                  activeChat={activeChat}
                  onSendClick={handleSendMessage}
                  onInputChange={(e:any) => {
                    setMessage({ message: e.target.value, type: "TEXT" });
                  }}
                  uploadImage={uploadImage}
                  message={message.message}
                  hasImage={img}
                  chatMessages={chatMessages}
                  handleEmojiClick={handleEmojiClick}
                  showEmojis={showEmojis}
                  onEmojiIconClick={() => setShowEmojis(!showEmojis)}
                  onImageRemove={() => {
                    setImg("");
                    setMessage({ message: "", text: "" });
                  }}
                />
              ) : (
                <div className="col-span-12  lg:col-span-8 2xl:col-span-9">
                  <div className="flex items-center h-full mt-4 justify-center text-center">
                    <div>
                      <Image width={500} height={300}
                                                          src="/assets/img/nochats.png"
                                                          className="h-16 mb-2 mx-auto" alt={""}                        
                      />
                      <span className="text-[#E0D5CE]">No Chat</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-[40px] bg-white px-4 py-6 lg:px-10 lg:py-14 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className=" font-semibold text-[25px] leading-6 text-black mb-6 lg:mb-10"
                  >
                    Start New Chat{" "}
                  </Dialog.Title>

                  <div className="tabs_styles">
                    <form onSubmit={handleSubmit}>
                      <div className="mt-2">
                        <div className="col-span-12 md:col-span-6 mb-3">
                          <FormControl
                            type="text"
                            name="subject"
                            label="What would you like to discuss about?"
                            placeholder="Subject"
                            value={form.subject}
                            onChange={(e:any) => {
                              setForm({ ...form, subject: e });
                            }}
                          />
                          {submitted && !form.subject && (
                            <div className="text-danger small mt-1 capitalize ">
                              Subject is required.
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end gap-2 flex-wrap mt-6">
                          <div className="btns flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={closeModal}
                              className="bg-[#263238] py-2 px-2 w-24 text-white text-[14px] font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="bg-[#263238] py-2 px-2 w-24 text-white text-[14px] font-medium"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      </>
  );
}

export default Chats;

const Message = ({
  onSendClick,
  onInputChange,
  uploadImage,
  message,
  chatMessages,
  user,
  activeChat,
  handleEmojiClick,
  showEmojis,
  onEmojiIconClick,
  hasImage,
  onImageRemove,
}:any) => {
  const sender = activeChat?.user_details?.find(
    (_user:any) => _user._id !== user._id
  );
  return (
    <>
      {chatMessages && (
        <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
          <div className="bg-gray-100 mt-4 md:mt-0">
            <div className=" p-4">
              <div className="flex items-center justify-between  ">
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="shrink-0">
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={methodModel.noImg(sender?.image)}
                      alt=""
                    />
                  </div>
                  <div className="">
                    <p className="text-[16px] font-semibold">
                      {sender?.fullName}
                    </p>

                    <p className="text-[12px] text-gray-600 break-all ">
                      {activeChat?.room_details?.subject}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-[auto]  lg:h-[550px] xl:h-[650px] overflow-auto">
            <div
              id="chat-box"
              className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
            >
              {chatMessages.map((message:any) => {
                return (
                  <>
                    {message.sender !== user?._id ? (
                      <div className="chat-message">
                        <div className="flex items-end">
                          <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                            <div className="">
                              {message.type == "IMAGE" && (
                                <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-primary text-white ">
                                  <img
                                    src={methodModel.noImg(message.content)}
                                    className="h-56 w-56 object-contain"
                                  />
                                </span>
                              )}
                              {message.type == "TEXT" && (
                                <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-primary text-white ">
                                  {message.content}
                                </span>
                              )}
                            </div>
                            <span className="text-gray-400 !mt-0 text-[10px] ">
                              {moment(message?.createdAt).format("LT")}
                            </span>
                          </div>
                          <img
                            src={methodModel.noImg(message.sender_image)}
                            alt="My profile"
                            className="w-8 h-8 rounded-full order-1 object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="chat-message">
                        <div className="flex items-end justify-end">
                          <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                            <div className="">
                              {message.type == "IMAGE" && (
                                <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-gray-100 text-white ">
                                  <img
                                    src={methodModel.noImg(message.content)}
                                    className="h-56 w-56 object-contain"
                                  />
                                </span>
                              )}
                              {message.type == "TEXT" && (
                                <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-gray-100 text-black ">
                                  {message.content}
                                </span>
                              )}
                            </div>
                            <label className="text-gray-400 !mt-0 text-[10px] ">
                              {moment(message?.createdAt).format("LT")}
                            </label>
                          </div>
                          <img
                            src={methodModel.noImg(message.sender_image)}
                            alt="My profile"
                            className="w-8 h-8 rounded-full object-cover order-2"
                          />
                        </div>
                      </div>
                    )}
                  </>
                );
              })}

              {/* <div class="flex items-center justify-center py-4">
                <div class="border-t border-gray-300 w-full"></div>
                <span class="px-3 text-gray-500 text-sm">Yesterday</span>
                <div class="border-t border-gray-300 w-full"></div>
              </div> */}
            </div>
            <div className="border-t-2 border-gray-200 pt-4 mb-2 sm:mb-0 relative">
              {hasImage && (
                <div className="my-2 bg-white shadow-md p-2 flex justify-between items-center rounded-lg">
                  <div className="flex gap-2 items-center">
                    <img src={methodModel.noImg(hasImage)} className="h-10" />
                    <p>{hasImage}</p>
                  </div>
                  <IoClose
                    onClick={onImageRemove}
                    title="Remove"
                    className="text-2xl cursor-pointer"
                  />
                </div>
              )}

              {showEmojis == true && (
                <EmojiPicker
                  skinTonesDisabled={true}
                  onEmojiClick={handleEmojiClick}
                  height={380}
                  className="absolute bottom-14 z-50"
                  previewConfig={{
                    showPreview: false,
                  }}
                />
              )}
              <div className="relative flex ">
                <span className="absolute inset-y-0 flex items-center">
                  <a
                    onClick={() => onEmojiIconClick(true)}
                    className={`open-emojis automation-emoji position-absolute cursor-pointer pl-2`}
                    type="button"
                  >
                    <PiSmileyBold className="text-2xl text-gray-600" />
                  </a>
                </span>
                <input
                  type="text"
                  onChange={onInputChange}
                  value={hasImage ? "" : message}
                  disabled={hasImage}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onSendClick();
                    }
                  }}
                  placeholder="Write your message!"
                  className="w-full focus:outline-none focus:placeholder-gray-400 mr-2  text-gray-600 placeholder-gray-600 pl-12 bg-gray-100 rounded-md py-3"
                />
                <div className="items-center inset-y-0 flex gap-2">
                  <label
                    onChange={(e) => {
                      uploadImage(e);
                    }}
                    className="inline-flex items-center justify-center rounded-full h-10 w-10 transition cursor-pointer duration-500 ease-in-out text-gray-500 hover:bg-gray-100 focus:outline-none"
                  >
                    <input type="file" className="hidden" accept="image/*" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6 text-gray-600"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      ></path>
                    </svg>
                  </label>

                  <button
                    type="button"
                    onClick={onSendClick}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-primary focus:outline-none"
                  >
                    <span className="font-bold">Send</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-6 w-6 ml-2 transform rotate-90"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
