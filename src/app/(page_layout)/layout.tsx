"use client";

import AudioHtml from "@/components/AudioHtml";
import FormControl from "@/components/FormControl";
import GoogleLogin from "@/components/GoogleLogin";
import { LinkHtml } from "@/components/LinkHtml";
import Modal from "@/components/Modal";
import OptionDropdown from "@/components/OptionDropdown";
import { fire } from "@/components/Swal";
import TooltipHtml from "@/components/TooltipHtml";
import VideoHtml from "@/components/VideoHtml";
import envirnment from "@/envirnment";
import { subscription_success } from "@/redux/slices/subscription";
import { login, logout } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import ApiClientB from "@/utils/Apiclient";
import { isNumber, loaderHtml, noImg } from "@/utils/shared";
import { socialOptions } from "@/utils/shared.utils";
import socketModel from "@/utils/socketModel";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { AiOutlineAudio, AiOutlineUser } from "react-icons/ai";
import { BsReply } from "react-icons/bs";
import { CiVideoOn } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import { FiBox, FiEdit3 } from "react-icons/fi";
import { HiMenuAlt3 } from "react-icons/hi";
import { HiOutlineChatBubbleBottomCenter, HiOutlineEnvelope } from "react-icons/hi2";
import { IoIosSearch, IoMdClose, IoMdHeartEmpty, IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineClose, MdOutlineMail } from "react-icons/md";
import { TfiLayoutMediaCenterAlt } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  const pathname = usePathname()
  const spathname = pathname.split('/')[1]
  const query = useSearchParams()
  const user: any = useSelector((state: RootState) => state.user.data);


  const isCancel = spathname == 'cs' ? true : false
  const _query = query.get("product") || query.get("productId");



  const { get, post, put } = ApiClientB()

  const [search, setSearch] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [changedEmail, setChangedEmail] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const [notificationDetail, setNotificationDetail] = useState<any>();
  const [loginTab, setLoginTab] = useState('')
  const { code, month, year: syear } = useParams()
  const surveyId = (isCancel ? null : (code || query.get('q'))) || ''


  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [messageCount, setUnreadMessagesCount] = useState(0);

  const [submited, setSubmited] = useState(false)

  const history = (url = '') => {
    router.push(url)
  }

  const currentURL = `/${pathname}`;

  const getUserDetail = () => {
    get("user/profile", { id: (user._id || user.id) }).then(async (res) => {
      if (res.success) {
        const data = { ...user, ...res.data };
        dispatch(login(data));
      }
    });
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!user) {
    } else {
      getUserDetail()
    }
  }, []);

  const handleSearchCick = () => {
    let url = ""
    if (pathname.includes("info-library")) {
      url = `/info-library?searchQuery=${search}`;
    } else {
      url = `/menu?searchQuery=${search}`;
    }
    history(url)
  };

  const handleClearSearch = () => {
    setSearch("");
    if (pathname.includes("info-library")) {
      history("/info-library?searchQuery=");
    } else {
      history("/menu?searchQuery=");
    }
  };


  const Logout = () => {
    dispatch(logout());
    history("/login");
  };

  const isLoggedIn = user;

  const navigation = [
    { name: "Menu", href: "/menu", current: false, isAuth: true },
    { name: "My Orders", href: "/orders", current: false, isAuth: true, mobileOnly: true },
    { name: "Resource Center", href: "/resource-center", current: false, isAuth: true },
    {
      name: "Join Club",
      url: `${envirnment.joinUrl}?q=${user?.id || user?._id || ''}`,
      // href: `${localStorage.getItem('token') ? '/membership' : '/membership?noLogin=true'}`,
      isAuth: true,
    },
    { name: "My Experiences", href: "/myjournal", current: false, isAuth: true },
    { name: "My Rewards", href: "/rewards", current: false, isAuth: true },
    { name: "My Orders", href: "/orders", current: false, isAuth: true },
    { name: "Box Orders History", href: "/boxhistory", current: false, isAuth: true },

  ];

  const filteredMenu = isLoggedIn
    ? navigation
    : navigation.filter((item) => item.isAuth == false);

  filteredMenu.forEach((item: any) => {
    if (currentURL.includes(item.href)) {
      item.current = true;
    } else {
      item.current = false;
    }
  });


  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }


  const getActiveSubscription = () => {
    const param = {
      user_id: user?.customerId
    }
    if (!param.user_id) return
    get('Subscription/active/Subscriptions', param).then(res => {
      if (res.success) {
        const data = res.data;
        dispatch(subscription_success({ data: data }))
      }
    })
  }

  const getNotificationsList = () => {
    get("notification/list", {
      page: 1,
      count: 5,
      notificationStatus: "unread",
      userId: user?._id,
    }).then((res) => {
      if (res.success) {
        const filtered = res.data;
        setNotifications(filtered);
        setUnreadCount(res.total);
      }
    });
  };

  const getNotificationIcon = (type: any) => {
    let icon: any = "";
    switch (type) {
      case "audio":
        icon = <AiOutlineAudio />;
        break;
      case "video":
        icon = <CiVideoOn />;
        break;
      case "product":
        icon = <FiBox />;
        break;
      case "blog":
        icon = <TfiLayoutMediaCenterAlt />;
        break;
      case "normal":
        icon = <IoMdNotificationsOutline />;
        break;
      default:
        icon = <IoMdNotificationsOutline />;
    }
    return icon;
  };

  function filterNotifications(id: any) {
    const filtered = notifications?.filter(
      (notification: any) => notification.id !== id
    );
    setNotifications(filtered);
  }

  const handleReadNotification = (itm: any) => {
    socketModel.emit("read-noti", { notification_id: itm?.id || itm?._id });
    filterNotifications(itm.id);
    setUnreadCount(unreadCount - 1);
    setNotificationModal(true)
    setNotificationDetail(itm)
  };

  const handleNotificationClick = (itm: any) => {
    loaderHtml(true);
    post("notification/reply", { notification_id: itm.id }).then(
      (res) => {
        loaderHtml(false);
        if (res.success) {
          socketModel.emit("read-noti", { notification_id: itm.id });
          history(`/chats?room_id=${res.data.room_id}&type=messages`);
        }
      });
  };

  useEffect(() => {
    if (user) {
      const notify = sessionStorage.getItem("notify-message");
      if (!notify) {
        socketModel.emit("notify-message", { user_id: user?._id });
      }

      socketModel.on("notify-message", (data: any) => {
        const count = data.data.unread_count;
        localStorage.setItem("unreadMessages", count);
        setUnreadMessagesCount(data.data.unread_count);
      });
      sessionStorage.setItem("notify-message", "true");
    }
  }, [user]);

  const notification = notifications?.map((itm: any, index) => {

    return (
      <div key={index} className="py-2 bg-gray-100 px-2 mb-2 rounded-lg text-sm text-neutral-900 font-medium">
        <div className="flex items-center gap-2">
          <p className="text-xl">{getNotificationIcon(itm.type)}</p>
          <span
            className="break-all text-md hover:text-[#540C0F] line-clamp-2 cursor-pointer"
            onClick={() => {
              handleReadNotification(itm);
            }}
          >
            {itm.title}
          </span>
        </div>
        <span
          onClick={() => handleNotificationClick(itm)}
          className="text-xs flex text-[#540C0F] mt-2 gap-2 justify-end cursor-pointer"
        >
          <BsReply className="text-xs" /> Reply
        </span>
      </div>
    );
  });

  useEffect(() => {
    if (user) {
      const unreadCount = sessionStorage.getItem('unreadCount')
      if (!unreadCount) {
        socketModel.emit("unread-noti-count", { user_id: user?._id });

        getNotificationsList();
      }
      getActiveSubscription()
      sessionStorage.setItem('unreadCount', 'true')
      socketModel.on("unread-noti-count", (data: any) => {
        setUnreadCount(data.data?.unread_count);
      });
    }
  }, [user]);

  const [isOpen1, setIsOpen1] = useState(false)
  const [isOpen2, setIsOpen2] = useState(false)
  const [loginForm, setLoginForm] = useState<any>({ email: '', mobileNo: '', lastName: '', firstName: '', birthday: '' })
  const [isForgot, setForgot] = useState(false)
  const [signupModal, setSignupModal] = useState(false)

  const days = []
  const months = []
  const year = new Date().getFullYear()
  const years = []

  for (let i = 1; i <= 12; i++) {
    months.push({ name: i, id: i })
  }

  for (let i = 1; i <= 31; i++) {
    days.push({ name: i, id: i })
  }

  for (let i = 0; i <= 100; i++) {
    years.push({ name: year - i, id: year - i })
  }

  function closeModal() {
    setIsOpen1(false)
    setIsOpen(false)
    setIsOpen2(false)
  }

  function openModal() {
    // openModal2()
    setIsOpen1(true)
    setLoginTab('')
    const queryEmail = query.get("email") || '';
    setForgot(false)
    setLoginForm({ email: queryEmail, password: '' })
  }

  const register = (isRegister: any = false) => {
    setSubmited(true)
    if (!loginForm?.mobileNo && isRegister) return
    if (String(loginForm?.mobileNo).length < 11 && isRegister) {
      toast.error("Please enter a valid mobile number.")
      return
    }
    const url = 'user/signup'
    const payload = {
      ...loginForm,
      productId: query.get('product'),
      role: envirnment.userRoleId,
      register: isRegister ? 'Y' : 'N',
      isCancel: isCancel,
      surveyId: surveyId,
      month: String(month || new Date().getMonth() + 1),
      year: String(syear || new Date().getFullYear()),
    }
    if (isRegister) {
    }
    loaderHtml(true);
    post(url, payload).then(async (res) => {
      if (res.success == true) {
        closeModal()
        setSignupModal(false)

        const isExist = res?.regiter

        // let title = 'Almost There!'
        let title = ''

        let html = `
        <p className="mb-2 text-base font-medium">Check your email to verify your account and complete registration.</p>
        `
        //   let html = `
        //         <p className="mb-2">We’ve sent a verification email to <span className="block text-base font-bold">${payload.email}</span></p>

        //        <p className="mb-2 text-base font-medium"> Please check your inbox to verify your email.</p>

        // <p className="mb-3 text-base font-medium">Can’t find it? Check your spam folder or click below to resend the verification email.</p>

        // <p className="text-base font-medium">Once verified, you’ll return here to complete your profile and access the Groove Guide.</p>
        //       `

        let buttonText = 'Resend Verification Email'

        if (isExist) {
          // title = 'Check Your Email for a Magic Link'
          title = ''
          html = `<p class="mb-2 text-base font-medium">We’ve Found Your Profile! Let’s Get You Logged In. Check Your Email for magic link.</p>`
          // html = `<p className="mb-2 text-base font-medium">We've sent you a magic link to access your account. Please check your inbox (and your spam folder, if needed) and click the link to log in.</p>`
          buttonText = 'Got it!'
        }

        fire({
          title: title,
          icon: "success",
          description: html,
          showCancelButton: isExist ? false : true,
          confirmButtonText: buttonText,
          confirmButtonColor: "#540C0F",
          cancelButtonText: `Close`,
        }).then(result => {
          if (result.isConfirmed) {
            if (!isExist) {
              register()
            }
          }

          if (isExist) {
            history('/')
          }
        });
      }
      loaderHtml(false);
    });
  }

  const openSignup = () => {
    setSignupModal(true)
  }

  const onLogin = () => {
    const url = 'user/checkEmailExist'

    const payload = {
      email: loginForm.email
    }

    loaderHtml(true);
    post(url, payload).then(async (res) => {
      setIsOpen1(false)
      if (res.success) {
        const exist = res.exist
        if (exist) {
          register()
        } else {
          openSignup()
        }
      }
      loaderHtml(false);
    });
  }

  useEffect(() => {
    const id = query.get("id")
    if (!user) {
      if ((pathname == '/login' || spathname == 'cs' || spathname == 's' || spathname == 'cancellation-survey') && !id) {
        openModal()
      }
    }
  }, [pathname, spathname])


  useEffect(() => {
    if (user) {
      setIsOpen1(false)
      setIsOpen2(false)
    }
  }, [user])

  const notiRedirection = (itm: any) => {
    if (itm.type == 'product') {
      window.open(itm.productUrl, '_blank')
    } else {
      // history(``)
    }
  }


  const [isOpen3, setIsOpen3] = useState(false);

  const verifyOtp = () => {
    loaderHtml(true);
    post("user/verify-otp", { otp: otp }).then((res) => {
      loaderHtml(false);
      if (res.success) {
        toast.success(res.message);
        history(_query != null ? `/myjournal?product=${_query}` : "/");
        const data = {
          ...user,
          isVerified: "Y",
        };
        dispatch(login(data));
        setIsOpen(false);
      }
    });
  };

  const resentOtp = (p = {}) => {
    const f = { ...p };
    loaderHtml(true);
    post("user/vertication-otp", f).then((res) => {
      loaderHtml(false);
    });
  };

  const handleChangeEmail = () => {
    loaderHtml(true);
    put("user/profile", { email: changedEmail, id: user._id }).then(
      async (res) => {
        if (res.success) {
          loaderHtml(false);
          setUpdatedEmail(true);
          resentOtp();
          setShowChangeEmail(false);
        }
      }
    );
  };

  return (
    <>
      <div id="logoutBtn" onClick={Logout}></div>
      <div id="updateProfile" onClick={getUserDetail}></div>
      <div className="bg-white p-0 m-0">

        <header className="">
          <div className="flex flex-wrap justify-between gap-2 items-center hidden lg:flex px-4 md:px-8 bg-white  py-4 2xl:px-16">
            <div className="">
              <Link
                href="/"
                onClick={() => {
                  history('/')
                }}
                aria-label="Groove Guide Home"
              >
                <Image
                  height={47}
                  width={180}
                  className="h-[37px] xl:h-[37px] 2xl:h-[47px] object-contain"
                  src="/assets/img/v2/logo.svg"
                  alt="logo header"
                />
              </Link>
            </div>
            <div className="flex  gap-3 xl:gap-4 items-center w-full lg:w-auto">
              <div className="flex gap-3 xl:gap-4  items-center w-full lg:w-auto">
                {[...filteredMenu,
                ].map((item, i) => (
                  <Fragment key={`menu_${i}`}>
                    <LinkHtml
                      target={item.url ? "_new" : ""}
                      to={item.href}
                      href={item.url}
                      className={classNames(
                        item.current ? "text-gray-700 font-bold" : "text-gray-700 font-normal",
                        "block tracking-[-0.8px] py-2 text-[12px] xl:text-[16px]",
                        item.mobileOnly ? "lg:hidden" : "" // 👈 conditionally hide on lg and above
                      )}
                    >
                      {item.name}
                    </LinkHtml>
                  </Fragment>

                ))}
              </div>


              {user?._id ? <>
                <div className="searching_divs w-32 xl:w-52 2xl:w-72 bg-gray-100 px-3 py-1 2xl:py-2 ">
                  <form className=" flex items-center justify-between">

                    <div className="flex items-center relative w-full">
                      <input
                        type="text"
                        value={search}
                        className="w-full pr-3 bg-transparent placeholder:text-[12px] placeholder:text-gray-400"
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSearchCick();
                          }
                        }}
                        placeholder="Explore Products, Mushrooms, Mexican, Italian Etc."
                      />
                      {search && search.length > 0 && (
                        <div className="-translate-y-1/2 top-1/2 text-[12px] xl:text-[18px] right-3 cursor-pointer hover:text-[#540C0F] absolute">
                          <MdOutlineClose onClick={handleClearSearch} />
                        </div>
                      )}
                      <IoIosSearch
                        onClick={handleSearchCick}
                        className="text-black text-[14px] 2xl:text-[18px]"
                      />
                    </div>
                  </form>
                </div>
              </> : <></>}

              <div className="flex items-center space-x-4 shrink-0">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  {user ? (
                    <>
                      <Link className="inline-flex" href={"/profile"}>
                        <button className="flex items-center space-x-2 bg-[#5A0E0E] text-white px-2 md:px-4 py-2 rounded-full">
                          <FaRegCircleUser className="w-4 h-4" />
                          <span className="font-medium [@media(min-width:200px)]:hidden [@media(min-width:420px)]:block  [@media(min-width:1024px)]:hidden [@media(min-width:1090px)]:block text-[12px]">My Membership</span>
                        </button>
                      </Link>

                      <TooltipHtml placement="top" title="Chat">
                        <div className="relative" onClick={() => history('/chats')}>
                          {messageCount > 0 && (
                            <p className="text-[10px] absolute -right-3 -top-2 bg-[#540C0F] h-5 w-5 p-1 flex items-center justify-center text-white rounded-full">
                              <span>{messageCount}</span>
                            </p>
                          )}

                          <HiOutlineChatBubbleBottomCenter className="w-6 h-6 cursor-pointer " />
                        </div>
                      </TooltipHtml>

                      <TooltipHtml placement="top" title="Favorites">
                        <div className="heart_icons" onClick={() => history('/favorites')}>
                          <IoMdHeartEmpty className="w-6 h-6 cursor-pointer" />

                        </div>
                      </TooltipHtml>
                      <TooltipHtml placement="top" title="Messages">
                        <a className="relative notif">
                          <OptionDropdown
                            title={<>
                              {unreadCount > 0 ? (
                                <HiOutlineEnvelope
                                  className="w-6 h-6"
                                  onClick={() => getNotificationsList()}
                                />
                              ) : (
                                <HiOutlineEnvelope
                                  className="w-6 h-6"
                                  onClick={() => getNotificationsList()}
                                />
                              )}
                              {unreadCount > 0 && (
                                <p className="block absolute text-white -right-2 bg-[#540C0F] rounded-full h-5 w-5 flex item-center justify-center -top-1 shadow text-[12px]">
                                  {unreadCount}
                                </p>
                              )}
                            </>}
                            content={
                              <>
                                {notifications?.length == 0 && (
                                  <div className="text-center ">
                                    No Messages.
                                  </div>
                                )}
                                {notification}
                                <div className="text-center font-bold pt-3">
                                  <Link
                                    className="!hover:text-[#000] "
                                    href={"/notifications"}
                                  >
                                    See All
                                  </Link>
                                </div>
                              </>
                            }
                          />
                        </a>
                      </TooltipHtml>

                    </>
                  ) : (
                    <>
                      <div className=" flex items-center justify-center gap-2 sm:gap-4 rounded-full py-2 ">
                        <p
                          className="inline-flex bg-primary px-[30px] py-[10px] text-center rounded-full !text-white justify-center border-gray-400 text-sm font-semibold text-gray-900 cursor-pointer" onClick={openModal}
                        >
                          Login
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mobile_navbars flex flex-col lg:hidden ">


            <div className="flex items-center w-full justify-between px-4 md:px-8 bg-white  py-4">
              <div className="">
                <Link
                  href="/"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  aria-label="Groove Guide Home"
                >
                  <Image
                    height={107}
                    width={28}
                    className="h-7 md:h-8 lg:h-10 object-contain"
                    src="/assets/img/v2/logo.svg"
                    alt="logo header"
                  />
                </Link>
              </div>
              <div className="icons_listmenu flex gap-2 lg:gap-4 items-center">

                <div className="flex items-center space-x-4 shrink-0">


                  <div className="flex items-center space-x-2 md:space-x-3">
                    {user ? (
                      <>
                        <Link className="inline-flex" href={"/profile"}>
                          <button className="flex items-center space-x-2 bg-[#5A0E0E] text-white px-2 md:px-4 py-2 rounded-full">
                            <FaRegCircleUser className="w-4 h-4" />
                            <span className="font-medium [@media(min-width:200px)]:hidden [@media(min-width:420px)]:block  [@media(min-width:1024px)]:hidden [@media(min-width:1090px)]:block text-[12px]">My Membership</span>
                          </button>
                        </Link>

                        <TooltipHtml placement="top" title="Chat">
                          <div className="relative" onClick={() => history('/chats')}>
                            {messageCount > 0 && (
                              <p className="text-[10px] absolute -right-3 -top-2 bg-[#540C0F] h-5 w-5 p-1 flex items-center justify-center text-white rounded-full">
                                <span>{messageCount}</span>
                              </p>
                            )}

                            <HiOutlineChatBubbleBottomCenter className="h-4 w-4 md:w-6 md:h-6 cursor-pointer " />
                          </div>
                        </TooltipHtml>

                        <TooltipHtml placement="top" title="Favorites">
                          <div className="heart_icons" onClick={() => history('/favorites')}>
                            <IoMdHeartEmpty className="h-4 w-4 md:w-6 md:h-6 cursor-pointer" />

                          </div>
                        </TooltipHtml>
                        <TooltipHtml placement="top" title="Messages">
                          <a className="relative notif">
                            <OptionDropdown
                              title={<>
                                {unreadCount > 0 ? (
                                  <HiOutlineEnvelope
                                    className="h-4 w-4 md:w-6 md:h-6"
                                    onClick={() => getNotificationsList()}
                                  />
                                ) : (
                                  <HiOutlineEnvelope
                                    className="h-4 w-4 md:w-6 md:h-6"
                                    onClick={() => getNotificationsList()}
                                  />
                                )}
                                {unreadCount > 0 && (
                                  <p className="block absolute text-white -right-2 bg-[#540C0F] rounded-full h-5 w-5 flex item-center justify-center -top-1 shadow text-[12px]">
                                    {unreadCount}
                                  </p>
                                )}
                              </>}
                              content={
                                <>
                                  {notifications?.length == 0 && (
                                    <div className="text-center ">
                                      No Messages.
                                    </div>
                                  )}
                                  {notification}
                                  <div className="text-center font-bold pt-3">
                                    <Link
                                      className="!hover:text-[#000] "
                                      href={"/notifications"}
                                    >
                                      See All
                                    </Link>
                                  </div>
                                </>
                              }
                            />
                          </a>
                        </TooltipHtml>

                      </>
                    ) : (
                      <>

                        <div className="flex items-center justify-center gap-2 sm:gap-4 rounded-full px-2 md:px-4 py-2 w-32 sm:w-40">
                          <p
                            className="inline-flex bg-primary px-[30px] py-[10px] text-center rounded-full !text-white justify-center border-gray-400 text-sm font-semibold text-gray-900 cursor-pointer" onClick={openModal}
                          >
                            Login
                          </p>
                        </div>
                      
                      </>
                    )}
                  </div>
                </div>

                <div className="" onClick={() => setIsOpen3(true)}>
                  <HiMenuAlt3 className=" text-xl md:text-3xl" />
                </div>

              </div>
            </div>
            {user?._id ? <>
              <div className="block bg-[#F4F4F5] lg:hidden px-4 md:px-8  py-4">
                <div className="flex items-center justify-center ">
                  {user?._id ? <>
                    <form className=" w-full">

                      <div className="flex items-center relative w-full">
                        <input
                          type="text"
                          value={search}
                          className="w-full pr-3 bg-transparent placeholder:text-[12px] lg:placeholder:text-[16px] placeholder:text-gray-400"
                          onChange={(e) => {
                            setSearch(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSearchCick();
                            }
                          }}
                          placeholder="Explore Products, Mushrooms, Mexican, Italian Etc."
                        />
                        {search && search.length > 0 && (
                          <div className="-translate-y-1/2 top-1/2 text-[18px]  right-6 cursor-pointer hover:text-[#540C0F] absolute">
                            <MdOutlineClose onClick={handleClearSearch} />
                          </div>
                        )}
                        <IoIosSearch
                          onClick={handleSearchCick}
                          className="text-black text-[20px]"
                        />
                      </div>


                    </form>
                  </> : <></>}

                </div>
              </div>
            </> : <></>}



          </div>

        </header >

        {isOpen3 ? <>
          <div
            className={`fixed top-0 right-0 z-50 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ${isOpen3 ? "translate-x-0" : "translate-x-full"
              }`}
          >
            {/* Sidebar Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">
                <Link
                  href="/"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  aria-label="Groove Guide Home"
                >
                  <Image
                    height={40}
                    width={153}
                    className="h-10 object-contain"
                    src="/assets/img/v2/logo.svg"
                    alt="logo sidebar"
                  />
                </Link>
              </h2>
              <IoMdClose
                className="text-2xl cursor-pointer"
                onClick={() => setIsOpen3(false)}
              />
            </div>

            {/* Sidebar Content */}
            <div>
              <div className="flex flex-col gap-3 px-6 py-4 items-start w-full ">
                {[...filteredMenu,
                ].map((item, i) => (
                  <Fragment
                    key={`menu_${i}`}
                  >

                    <LinkHtml
                      onClick={() => setIsOpen3(false)}

                      target={item.url ? "_new" : ""}
                      to={item.href}
                      href={item.url}
                      className={classNames(
                        item.current
                          ? " text-gray-700 font-semibold"
                          : "text-gray-700 font-normal",
                        "block  py-1  text-[16px]  font-normal"
                      )}
                    >
                      {item.name}
                    </LinkHtml>
                  </Fragment>

                ))}
              </div>
            </div>
          </div>
        </> : <></>}




        <main className="pageContent bg-white">
          {children}
        </main>

        <footer className="bg-[#061522]  px-5 sm:px-6 md:px-16 lg:px-20 xl:px-30 2xl:px-40  pt-10 2xl:pt-20 mt-4">

          <div className="">
            <div className="lg:flex  lg:justify-between">
              <div className="flex flex-col gap-2 mb-6 lg:mb-0 lg:max-w-[250px] xl:max-w-[400px]">
                <div>
                  <Link
                    href="/"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    aria-label="Groove Guide Home"
                  >
                    <Image
                      height={40}
                      width={153}
                      className="h-10 lg:h-16 2xl:h-22  object-contain"
                      src="/assets/img/v2/logo.svg"
                      alt="logo footer"
                    />
                  </Link>
                </div>
                {/* <p className="text-[14px] xl:text-[16px] text-[#F9F7F5] font-[400]">
                  Would you like a few more variations depending on the vibe you're aiming for (like more energetic, professional, or friendly)?
                </p> */}
              </div>
              <div className="flex gap-2">
                <div className="w-40">
                  <h2 className="text-[#F9F7F5] block md:hidden font-bold text-[15px] lg:text-[20px] mb-4 md:mb-8">
                    Quick Link
                  </h2>
                  <ul className="list-none">
                    <li className=" text-[#F9F7F5] group font-normal text-sm lg:text-lg mb-2">
                      <span className="text-[#F9F7F5] group-hover:text-white cursor-pointer mb-2">
                        <Link href="/"> Home</Link>
                      </span>
                    </li>

                    <li className=" text-[#F9F7F5] group font-normal text-sm lg:text-lg mb-2">
                      <span className="text-[#F9F7F5] group-hover:text-white cursor-pointer mb-2">
                        <Link href="/"> Articles</Link>
                      </span>
                    </li>

                    <li className=" text-[#F9F7F5] group font-normal text-sm lg:text-lg mb-2">
                      <span className="text-[#F9F7F5] group-hover:text-white cursor-pointer mb-2">
                        <a href="https://joincraftclub.com/events/" target="_new"> Events</a>
                      </span>
                    </li>


                    <li className=" text-[#F9F7F5] group font-normal text-sm lg:text-lg mb-2">
                      <span className="text-[#F9F7F5] group-hover:text-white cursor-pointer mb-2">
                        <Link href="/resource-center"> Podcast</Link>
                      </span>
                    </li>


                    <li className=" text-[#F9F7F5] group font-normal text-sm lg:text-lg mb-2">
                      <span className="text-[#F9F7F5] group-hover:text-white cursor-pointer mb-2">
                        <a href="https://linko.page/shroomgroove" target="_new"> Contact</a>
                      </span>
                    </li>



                  </ul>
                </div>
                <div className="w-52">
                  <h2 className="text-[#F9F7F5] block md:hidden font-bold text-[15px] lg:text-[20px] mb-4 md:mb-8">
                    Our Brands
                  </h2>
                  <ul className="list-none">


                    <li className=" text-[#F9F7F5] group font-normal text-sm lg:text-lg mb-2">
                      <span className="text-[#F9F7F5] group-hover:text-white cursor-pointer mb-2">
                        <Link href="/"> Groove Guide</Link>
                      </span>
                    </li>


                    <li className=" text-[#F9F7F5] group font-normal text-sm lg:text-lg mb-2">
                      <span className="text-[#F9F7F5] group-hover:text-white cursor-pointer mb-2">
                        <a href="https://theshroomgroove.com/" target="_new"> Shroom Groove</a>
                      </span>
                    </li>


                    <li className=" text-[#F9F7F5] group font-normal text-sm lg:text-lg mb-2">
                      <span className="text-[#F9F7F5] group-hover:text-white cursor-pointer mb-2">
                        <a href="https://joincraftclub.com/" target="_new"> Craft Club</a>
                      </span>
                    </li>


                    <li className=" text-[#F9F7F5] group font-normal text-sm lg:text-lg mb-2">
                      <span className="text-[#F9F7F5] group-hover:text-white cursor-pointer mb-2">
                        <Link href="/resource-center"> Resource Center</Link>
                      </span>
                    </li>

                  </ul>
                </div>
                <div className="w-32">
                  <h2 className="text-[#F9F7F5] block md:hidden font-bold text-[15px] lg:text-[20px] mb-4">
                    Join The Club
                  </h2>
                  <ul className="list-none">
                    {!user ? <>
                      <li className=" text-[#F9F7F5] group font-normal text-sm lg:text-lg mb-2">
                        <span className="text-[#F9F7F5] group-hover:text-white cursor-pointer mb-2">
                          <Link href="/login"> Register</Link>
                        </span>
                      </li>
                    </> : <></>}

                    <li className=" text-[#F9F7F5] group font-normal text-sm lg:text-lg mb-2">
                      <span className="text-[#F9F7F5] group-hover:text-white cursor-pointer mb-2">
                        <Link href="/"> About us</Link>
                      </span>
                    </li>
                    <li className=" text-[#F9F7F5] group font-normal text-sm lg:text-lg mb-2">
                      <span className="text-[#F9F7F5] group-hover:text-white cursor-pointer mb-2">
                        <Link href="/blogs"> Blogs</Link>
                      </span>
                    </li>
                    <li className=" text-[#F9F7F5] group font-normal text-sm lg:text-lg mb-2">
                      <span className="text-[#F9F7F5] group-hover:text-white cursor-pointer mb-2">
                        <Link href="/rewards"> Rewards</Link>
                      </span>
                    </li>
                  </ul>

                </div>
              </div>
            </div>

            <div className="border-t border-[#DCDDDF] py-6 mt-6">
              <div className="md:flex  justify-between">
                <p className="text-[14px] italic text-[#F9F7F5] mb-4 md:mb-0">©Groove Guide 2025 All Rights Reserved.</p>

                <div className="flex flex-row group gap-3">
                  <Link className="text-[#F9F7F5] group-hover:text-white cursor-pointer text-[14px]" href="/terms-condition">
                    {" "}
                    Terms Of Use
                  </Link>

                  <div className="border-s border-gray-200"></div>

                  <Link className="text-[#F9F7F5] group-hover:text-white cursor-pointer text-[14px]" href="/privacy-policy">
                    {" "}
                    Privacy Policy
                  </Link>{" "}
                  <div className="border-s border-gray-200"></div>

                  <p className="text-[#F9F7F5] group-hover:text-white cursor-pointer text-[14px]">Cookie Policy</p>

                </div>

              </div>
            </div>

          </div>
        </footer>

      </div>


      {isOpen ? <>
        <Modal
          title="Verification Code"
          body={<>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                verifyOtp();
              }}
            >
              <div className="mt-2">
                <p className="text-sm text-gray-500 text-center">
                  {`We've sent code on your registered email and phone
                  number.`}
                </p>
                <div className="flex mt-1 items-center justify-center gap-1">
                  <p className="text-sm text-gray-500 text-center">
                    {updatedEmail ? changedEmail : user?.email}
                  </p>
                  <a
                    title="Edit Email"
                    className="bg-primary px-1 rounded-md text-xs py-1 text-white"
                    onClick={() => setShowChangeEmail(true)}
                  >
                    <FiEdit3 />
                  </a>
                </div>

                {showChangeEmail && (
                  <div className="flex items-center justify-between gap-2 w-full   mx-auto mt-6 ">
                    <input
                      type="text"
                      placeholder="Enter email"
                      value={changedEmail}
                      onChange={(e) => {
                        setChangedEmail(e.target.value);
                      }}
                      className="h-10 w-full border border-[#540C0F] p-2 rounded-lg "
                    />
                    <button
                      type="button"
                      onClick={handleChangeEmail}
                      disabled={!changedEmail}
                      className=" text-xs rounded-md shrink-0 border border-transparent bg-[#540C0F] px-4 py-2 text-sm font-medium text-white  "
                    >
                      Send OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowChangeEmail(false)}
                      className="inline-flex justify-end rounded-md border border-transparent bg-gray-400 px-4 py-2 text-sm font-medium text-white "
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {!showChangeEmail && (
                  <div className="flex items-center justify-between gap-2 w-full   mx-auto mt-6 ">
                    <input
                      type="text"
                      placeholder="Enter code"
                      maxLength={6}
                      minLength={6}
                      required
                      value={otp}
                      onChange={(e) =>
                        setOtp(isNumber(e))
                      }
                      className="h-10 w-full border border-[#540C0F] p-2 rounded-lg text-center"
                    />

                    <button
                      type="submit"
                      className="inline-flex justify-end rounded-md border border-transparent bg-[#540C0F] px-4 py-2 text-sm font-medium text-white "
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </form>
            {!showChangeEmail && (
              <p className="text-center mt-4  text-sm">
                <span
                  className="text-[#540C0F] font-regular cursor-pointer"
                  onClick={resentOtp}
                >
                  Resend Code?
                </span>
              </p>
            )}
          </>}
          result={() => {
            closeModal()
          }}
        />
      </> : <></>}


      {isOpen1 ? <>
        <Modal
          className="max-w-3xl"
          body={<>
            <div className="flex gap-4 w-full ">
              <div className=" relative hidden sm:block  lg:w-[600px]">
                <Image height={420} width={320} src="/assets/img/sides.png" alt="login_modal" className="w-full h-full lg:object-contain" />
              </div>


              <div className="flex flex-col justify-between w-full  px-4 py-2 lg:py-10">

                <div className="mt-4 mb-6">
                  <div className="font-inter font-semibold text-[18px] lg:text-[30px] leading-[100%] tracking-normal text-center uppercase">Login or Register</div>
                </div>

                <div className="py-4 flex-col flex gap-3 xl:gap-4 w-[100%] lg:w-[90%] mx-auto">
                  {loginTab == 'email' ? <>
                  </> : <>
                    {!isForgot ? <>
                      <GoogleLogin result={() => closeModal()} />
                    </> : <></>}

                  </>}

                  <form onSubmit={e => { e.preventDefault(); onLogin() }}>

                    <div className="inputs_signis">

                      {loginTab == 'email' ? <>
                        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden h-12">
                          <div className="px-4 text-gray-500">

                            <MdOutlineMail className="text-xl" />
                          </div>
                          <input type="email"
                            value={loginForm.email}
                            onChange={e => {
                              setLoginForm({
                                ...loginForm,
                                email: e.target.value
                              })
                            }}
                            required
                            className="flex-1 py-2  text-gray-700 focus:outline-none" placeholder="Enter your email" />
                        </div>
                      </> : <>
                        <div className="text-center pb-5">

                          <button
                            type="button"
                            onClick={() => setLoginTab('email')}
                            className="flex items-center gap-4 justify-center w-full h-12 px-4 py-2 bg-white hover:bg-gray-100 active:bg-gray-200 border border-gray-300 rounded-xl shadow-sm"
                          >
                            <div className=" text-gray-500">

                              <MdOutlineMail className="text-xl" />
                            </div>

                            <span className="text-sm font-medium text-gray-700">
                              Continue with Email
                            </span>
                          </button>



                        </div>
                      </>}

                      {loginTab == 'email' ? <>

                        <div className="mt-6 flex items-center justify-center">
                          <button
                            type="submit"
                            className="py-2  rounded-full w-full font-semibold text-center text-white h-12  hover:opacity-80 transition-all "
                          >

                            Send Link
                          </button>
                        </div>
                      </> : <></>}





                    </div>
                  </form>
                </div>

                <div>
                  <p className="text-center mt-4 text-black text-sm leading-6">By continuing, you agree to our <a className="text-[#EE7363] hover:underline" target="_new" href="/terms-condition">Terms</a> and acknowledge our <a className="text-[#EE7363] hover:underline" target="_new" href="/privacy-policy">Privacy Policy</a>.</p>

                </div>
              </div>
            </div>
          </>}
          result={() => {
            setIsOpen1(false)
            history('/')
          }}
        />
      </> : <></>}

      {signupModal ? <>
        <Modal
          className="max-w-lg"
          body={<>
            <div className="relative transform relative rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <div className="mt-2">
                <Image
                  height={80}
                  width={80}
                  src="/assets/img/logo.png" alt="logo signup" className="mx-auto h-20" />
                <div className="text-center mt-2 text-[#540C0F]">Explore. Reflect. Connect.</div>
              </div>
              <div className="mt-4">
                <div className="text-center text-xl font-medium text-gray-800">Register</div>
              </div>
              <div className="py-4 flex-col flex gap-3 xl:gap-4 w-[100%] lg:w-[80%] mx-auto">
                <form onSubmit={e => { e.preventDefault(); register(true) }}>
                  <div className="inputs_signis">
                    <div className="flex items-center border border-gray-300 rounded-full overflow-hidden mb-3">
                      <div className="px-4 text-gray-500">
                        <MdOutlineMail className="text-xl" />
                      </div>
                      <input type="email"
                        value={loginForm.email}
                        onChange={e => {
                          setLoginForm({
                            ...loginForm,
                            email: e.target.value
                          })
                        }}
                        required
                        className="flex-1 py-2  text-gray-700 focus:outline-none" placeholder="Enter your email" />
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-full overflow-hidden mb-3">
                      <div className="px-4 text-gray-500">
                        <AiOutlineUser className="text-xl" />
                      </div>
                      <input type="text"
                        value={loginForm.firstName}
                        onChange={e => {
                          setLoginForm({
                            ...loginForm,
                            firstName: e.target.value
                          })
                        }}
                        required
                        className="flex-1 py-2  text-gray-700 focus:outline-none" placeholder="Enter your First Legal Name" />
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-full overflow-hidden mb-3">
                      <div className="px-4 text-gray-500">
                        <AiOutlineUser className="text-xl" />
                      </div>
                      <input type="text"
                        value={loginForm.lastName}
                        onChange={e => {
                          setLoginForm({
                            ...loginForm,
                            lastName: e.target.value
                          })
                        }}
                        className="flex-1 py-2  text-gray-700 focus:outline-none" placeholder="Enter your Last Legal Name" />
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-full phne_input">
                      <FormControl
                        type="phone"
                        value={loginForm.mobileNo}
                        required
                        autoComplete='off'
                        className="flex-1 py-2  text-gray-700 focus:outline-none"
                        minlength="11"
                        onChange={(e: any) => setLoginForm((prev: any) => ({ ...prev, mobileNo: e }))}
                      />
                    </div>


                    {submited && !loginForm?.mobileNo ? <div className="text-red-600">Mobile number is required</div> : null}
                    <div className="mt-3 mb-3">
                      <label>Birthday</label>
                      <FormControl
                        type="dob"
                        value={loginForm.birthday}
                        required
                        className="flex-1 text-gray-700 focus:outline-none"
                        onChange={(e: any) => setLoginForm((prev: any) => ({ ...prev, birthday: e }))}
                      />
                    </div>
                    <OptionDropdown
                      options={socialOptions}
                      placeholder="How Did You Hear About Us?"
                      onChange={(value) => {
                        setLoginForm((pev: any) => ({ ...pev, how_did_you_hear_about_us: value }));
                      }}
                      value={loginForm.how_did_you_hear_about_us}
                    />
                    {loginForm?.how_did_you_hear_about_us?.includes('other') ? <>
                      <div className="flex items-center border border-gray-300 rounded-full overflow-hidden mb-3 mt-3">
                        <div className="px-4 text-gray-500">
                          <MdOutlineMail className="text-xl" />
                        </div>
                        <input type="test"
                          value={loginForm.other}
                          onChange={e => setLoginForm((pev: any) => ({ ...pev, other: e.target.value }))}
                          required
                          className="flex-1 py-2  text-gray-700 focus:outline-none" placeholder="Other" />
                      </div>
                    </> : <></>}
                    <div className="mt-6 flex items-center justify-center">
                      <button type="submit" className="py-2 rounded-full w-full font-semibold text-center text-white hover:opacity-80 transition-all">
                        Register
                      </button>
                    </div>
                    <p className="text-center mt-4 text-black text-sm leading-6">By continuing, you agree to our <a className="text-[#EE7363] hover:underline" target="_new" href="/terms-condition">Terms</a> and acknowledge our <a className="text-[#EE7363] hover:underline" target="_new" href="/privacy-policy">Privacy Policy</a>.</p>
                  </div>
                </form>
              </div>
            </div>

          </>}
          result={() => {
            history('/');
            setSignupModal(false)
          }}
        />
      </> : <></>}



      {
        notificationModal ? <>
          <Modal
            className="!max-w-xl"
            title="Notification"
            result={() => {
              setNotificationModal(false)
            }}

            body={<>

              <div>
                {notificationDetail?.type == 'video' ? <>
                  <VideoHtml src={noImg(notificationDetail?.videoDetail?.video)} className="w-full object-contain h-72" controls />
                </> : <></>}

                {notificationDetail?.type == 'audio' ? <>
                  <AudioHtml src={noImg(notificationDetail?.audioDetail?.audio)} className="w-full object-contain" controls />
                </> : <></>}
              </div>
              <h2 className="text-md font-semibold"> {notificationDetail?.title}</h2>

              {notificationDetail?.category_type?.length && (
                <div className="flex items-center gap-2 flex-wrap mt-2 flex-grow">
                  {notificationDetail?.category_type.map((tag: any, i: any) => {
                    return (
                      <span key={i} className="bg-primary px-2 py-1 rounded-full text-xs text-white">
                        {tag}
                      </span>
                    );
                  })}

                </div>
              )}
              {notificationDetail?.tags?.length && (
                <div className="flex items-center gap-2 flex-wrap mt-2 flex-grow">
                  {notificationDetail?.tags.map((tag: any, i: any) => {
                    return (
                      <span key={i} className="bg-primary px-2 py-1 rounded-full text-xs text-white">
                        {tag}
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="text-right">
                {notificationDetail?.type == 'product' ? <>
                  <span
                    onClick={() => notiRedirection(notificationDetail)}
                    rel="noreffer"
                    className="text-sm border border-primary shadow-sm px-4 py-2 hover:!bg-[#540C0F] hover:text-white text-black rounded-md cursor-pointer"
                  >
                    Link
                  </span>
                </> : <></>}

                <a
                  onClick={() => handleNotificationClick(notificationDetail)}
                  className="text-md inline-flex text-[#540C0F] mt-2 gap-2 justify-end ml-2"
                >
                  <BsReply className="text-md" /> Reply
                </a>
              </div>
            </>}
          />
        </> : <></>
      }

    </>
  );
}




