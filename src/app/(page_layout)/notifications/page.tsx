"use client";
import { useEffect, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import { IoClose } from "react-icons/io5";
import socketModel from "@/utils/socketModel";
import { useSelector } from "react-redux";
import Table from "../../../components/Table";
import moment from "moment";
import { loaderHtml } from "@/utils/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiBox, FiTrash } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { CiVideoOn } from "react-icons/ci";
import { AiOutlineAudio } from "react-icons/ai";
import { TfiLayoutMediaCenterAlt } from "react-icons/tfi";
import { fire } from "@/components/Swal";

function Notifications() {
  const user = useSelector((state:any) => state.user.data);
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilter] = useState({ page: 1, count: 50, search: "" });
 const {get,deleteApi}=ApiClientB()
  const handleReadAllNotifications = () => {
    socketModel.emit("read-all-noti", { user_id: user?._id });
  };

  const getNotificationsList = (p = {}) => {
    const filter = { ...filters, ...p, userId: user?._id };

    get("notification/list", filter).then((res) => {
      if (res.success) {
        setNotifications(res.data);
        setTotal(res.total);
      }
    });
  };

  const deleteAllNotifications = () => {
    loaderHtml(true);
    deleteApi("notification/remove", {
      id: user?._id,
    }).then((res) => {
      if (res.success) {
        toast.success("Notifications deleted successfully");
        getNotificationsList();
      }
    });
    loaderHtml(false);
  };

  const pageChange = (e:any) => {
    setFilter({ ...filters, page: e });
    getNotificationsList({ page: e });
  };

  const count = (e:any) => {
    setFilter({ ...filters, count: e });
    getNotificationsList({ count: e });
  };

  //for grouped data
  const _notifications:any = [];
  const dateLabels:any = {};

  notifications?.forEach((notification:any) => {
    let label = "";
    const currentDate = moment().format("LL");
    const date = moment(notification.createdAt).format("LL");

    if (date == currentDate) {
      label = "Most Recent";
    } else {
      label = "Earlier";
    }

    if (!_notifications[label]) {
      _notifications[label] = [];
    }
    _notifications[label].push(notification);

    if (!dateLabels[label]) dateLabels[label] = label;
  });

  const groupedNotifications = Object.keys(dateLabels).map((level) => ({
    label: dateLabels[level],
    data: _notifications[level].map((notification:any) => {
      return { notification };
    }),
  }));

  useEffect(() => {
    getNotificationsList();
  }, []);

  const ListHtml = ({ row }:any) => {
    const user = useSelector((state:any) => state.user);
    const history = useRouter();
    const [notification, setNotification] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const {get,post,deleteApi}=ApiClientB()

    const getNotificationIcon = (type:any) => {
      let icon:any = "";
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

    const getURL = (notification:any) => {
      let url = "";
      switch (notification.type) {
        case "audio":
          url = `/audio-detail/${notification.audioId}`;
          break;
        case "video":
          url = `/video-detail/${notification.videoId}`;
          break;
        // case "product":
        //   url = `/product-detail/${notification.productId}`;
        //   break;
        case "product":
          url = notification.productUrl;
          break;
        case "blog":
          url = `/blog/${notification.blogSlug}`;
          break;
      }

      return url;
    };

    const hasUrl = (notification:any) => {
      if (
        notification.blogSlug ||
        notification.videoId ||
        notification.audioId
      ) {
        return true;
      }
      return false;
    };

    const readNotification = (id:any) => {
      socketModel.emit("read-noti", { notification_id: id });
    };

    const handleReplyClick = (id:any) => {
      loaderHtml(true);
      socketModel.emit("read-noti", { notification_id: id });
      post("notification/reply", { notification_id: id }).then(
        (res) => {
          if (res.success) {
            history.push(`/chats?room_id=${res.data.room_id}`);
          }
        }
      );
      loaderHtml(false);
    };

    const deleteNotification = (id:any) => {
      loaderHtml(true);
      deleteApi("notification/remove", {
        id: user?._id,
        notification_id: id,
      }).then((res) => {
        if (res.success) {
          toast.success("Notification deleted successfully");
          getNotificationsList();
        }
      });
      loaderHtml(false);
    };

    return (
      <>
        <div key={row.id} className="mb-4 mt-4">
          <div className="text-gray-700 mb-4 text-xl">{row.label}</div>
          {row.data.map(({ notification,i }:any) => (
            <div key={i} className="bg-white px-4 shadow-md  py-4 border-b mb-6 border-[#540C0F]">
              <div className="">
                <div className="flex items-center justify-between gap-2">
                  <a
                    onClick={() => {
                      setNotificationOpen(true);
                      setNotification(notification);
                      readNotification(notification.id);
                    }}
                    className="flex items-center gap-4"
                  >
                    <div>
                      <div className="text-xl rounded-full">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div>
                      <h6 className="text-sm capitalize font-semibold line-clamp-2  text-gray-800 pr-10 break-all">
                        <span className="hover:text-[#540C0F] ">
                          {" "}
                          {notification.title}
                        </span>
                      </h6>
                      <p className="text-gray-600 text-sm mt-1 mb-2 ">
                        {notification.message}
                      </p>
                    </div>
                  </a>
                  {/* </div> */}
                  <div className="flex items-center gap-6">
                    {notification.type == "product" &&
                      notification.productUrl != "" && (
                        <a
                          href={getURL(notification)}
                          target="_blank"
                          rel="noreffer"
                          className="text-sm border border-primary shadow-sm px-4 py-2 hover:!bg-[#540C0F] hover:text-white text-black rounded-md cursor-pointer"
                        >
                          Link
                        </a>
                      )}
                    {(notification.type == "audio" ||
                      notification.type == "video" ||
                      notification.type == "blog") &&
                      hasUrl(notification) && (
                        <Link
                          href={getURL(notification)}
                          target="_blank"
                          className="text-sm border border-primary shadow-sm px-4 py-2 hover:!bg-[#540C0F] hover:text-white text-black rounded-md cursor-pointer"
                        >
                          Link
                        </Link>
                      )}
                    {!notification.replied && (
                      <a
                        onClick={() => {
                          setIsOpen(true);
                          handleReplyClick(notification.id);
                        }}
                        className="text-sm border border-primary shadow-sm px-4 py-2 hover:!bg-[#540C0F] hover:text-white text-black rounded-md cursor-pointer"
                      >
                        Reply
                      </a>
                    )}
                    <a
                      title="Delete"
                      onClick={() => deleteNotification(notification.id)}
                      className="text-2xl text-gray-500 hover:text-red-500 cursor-pointer"
                    >
                      <IoClose />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="container mx-auto px-4 lg:px-10 2xl:px-16 py-10 w-full max-w-[800px]">
        <div className="mb-6 flex flex-wrap items-center justify-between">
          <h5 className="text-2xl font-bold text-gray-900">Messages</h5>
          <div className="flex items-center justify-center gap-2">

            {groupedNotifications?.length > 0 && (
              <a
                className="border-primary border text-black px-4 hover:text-[#540C0F] py-2  text-sm flex items-center gap-2"
                onClick={handleReadAllNotifications}
              >
                Read All
              </a>
            )}
            {groupedNotifications?.length > 0 && (
              <a
                className="bg-primary px-4 py-2 text-white text-sm flex items-center gap-2"
                onClick={() => {
                  fire({
                    title: "Are you sure?",
                    description: `Do you want to delete all messages?`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    // cancelButtonColor: "#d33",
                    confirmButtonText: "Yes",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      deleteAllNotifications();
                    }
                  });
                }}
              >
                <FiTrash /> Delete All
              </a>
            )}
          </div>
        </div>
        <div className="">
          

          <Table
                      theme={"list"}
                      ListHtml={ListHtml}
                      data={groupedNotifications}
                      total={total}
                      page={filters.page}
                      count={filters.count}
                      nodata="No Messages."
                      result={(e) => {
                          if (e.event == "page") pageChange(e.value);
                          if (e.event == "count") count(e.value);
                      } } className={""} columns={undefined}          />
        </div>
      </div>
    </>
  );
}

export default Notifications;
