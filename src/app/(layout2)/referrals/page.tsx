"use client";
import { useEffect, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import { loaderHtml } from "@/utils/shared";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MdCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import Link from "next/link";
import { FiSend } from "react-icons/fi";
import { HiMiniUserPlus } from "react-icons/hi2";
import { IoMdCopy } from "react-icons/io";
import Table from "../../../components/Table";
import Image from "next/image";

function ReferalList() {
  const user = useSelector((state:any) => state.user?.data);
  const {get,post,put}=ApiClientB()
  const [data, setData] = useState();
  const [filters, setFilter] = useState<any>({ page: 1, count: 10 });
  const [total, setTotal] = useState(0);
  const [copy, setCopy] = useState(false);

  const getReferalsList = (p = {}) => {
    loaderHtml(true);
    const f = {
      ...filters,
      ...p,
      addedBy: user?._id,
    };
    get("referal/list", f).then((res) => {
      if (res.success) {
        setData(res.data);
        loaderHtml(false);
        setTotal(res.total);
      }
    });
  };

  const resendInvite = (user:any) => {
    const payload = {
      fullName: user?.fullName,
      email: user?.email,
    };
    loaderHtml(true);
    post("referal/add", { ...payload }).then((res) => {
      if (res.success) {
        toast.success("User re-invited successfully");
        loaderHtml(false);
      }
    });
  };

  const handleCopyClick = async () => {
    setCopy(true);
    await navigator.clipboard.writeText(
      `https://shroom.jcsoftwaresolution.in/signup?refer_code=${user?.referal_code}`
    );
    setTimeout(() => {
      setCopy(false);
    }, 1000);
  };

  useEffect(() => {
    getReferalsList();
  }, []);

  const pageChange = (e:any) => {
    setFilter({ ...filters, page: e });
    getReferalsList({ page: e });
  };

  const sorting = (key:any) => {
    let sorder = "asc";
    if (filters.key == key) {
      if (filters.sorder == "asc") {
        sorder = "desc";
      } else {
        sorder = "asc";
      }
    }

    const sortBy = `${key} ${sorder}`;
    setFilter({ ...filters, sortBy, key, sorder });
    getReferalsList({ sortBy, key, sorder });
  };

  const columns = [
    {
      key: "fullName",
      name: "Name",
      sort: true,
      render: (row:any) => {
        return (
          <>
            <div className=" cursor-pointer">
              <span className="capitalize">{row?.fullName} </span>
            </div>
          </>
        );
      },
    },
    {
      key: "email",
      name: "Email",
      sort: true,
      render: (row:any) => {
        return (
          <>
            <div className=" cursor-pointer">
              <span className="">{row?.email} </span>
            </div>
          </>
        );
      },
    },
    {
      key: "Status",
      name: "Status",
      sort: false,
      render: (user:any) => {
        return (
          <div className="bg-gray-100 inline-flex rounded-xl">
            <p className="inline-flex text-white bg-primary items-center rounded-l-xl  px-2 py-1 gap-1 shrink-0">
              <MdCheckBox /> Invited
            </p>
            <p
              className={`inline-flex ${
                user?.is_register || user?.isVerified
                  ? "text-white  bg-primary"
                  : "text-black"
              } items-center px-2 py-1 gap-1 shrink-0`}
            >
              {user?.is_register || user?.isVerified ? (
                <MdCheckBox />
              ) : (
                <MdOutlineCheckBoxOutlineBlank />
              )}
              Registered
            </p>
            <p
              className={`inline-flex ${
                user?.checkIn ? "text-white  bg-primary" : "text-black"
              } items-center px-2 py-1 gap-1 shrink-0 rounded-r-xl`}
            >
              {user?.checkIn ? (
                <MdCheckBox />
              ) : (
                <MdOutlineCheckBoxOutlineBlank />
              )}
              Check In
            </p>
          </div>
        );
      },
    },
    {
      key: "",
      name: "Action",
      sort: false,
      render: (row:any) => {
        return (
          <>
            {!row?.is_register ? (
              <>
                <button
                  onClick={() => resendInvite(row)}
                  className="bg-primary py-2 flex items-center shadow-btn px-4 hover:opacity-80 text-sm text-white rounded-lg gap-2"
                >
                  <FiSend />
                  Resend Invite
                </button>
              </>
            ) : (
              <></>
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="pt-4 px-4  ">
        <div className="container mx-auto">
          <div className="flex items-center justify-between w-full mb-4 ">
            <h6 className="text-[30px] text-black font-semibold">
              Referrals List
            </h6>
            <div className="flex gap-2 items-center">
              {user?.referal_code && (
                <div className="flex items-center gap-2">
                  My referral code:
                  <div className="bg-gray-100 border-1 rounded-lg border-gray-100 flex ">
                    <p className="px-6 py-2">{user?.referal_code}</p>
                    <button
                      onClick={handleCopyClick}
                      className="bg-primary flex  items-center  rounded-r-lg gap-2 text-xs text-white px-2 py-1"
                    >
                      <IoMdCopy />
                      {copy ? "copied" : "copy"}
                    </button>
                  </div>
                </div>
              )}
              <Link className="" href={"/invite-a-member"}>
                <button
                  type="button"
                  className="px-6 py-2 bg-primary  flex items-center gap-2 rounded-xl text-white text-md"
                >
                  <HiMiniUserPlus />
                  Invite
                </button>
              </Link>
            </div>
          </div>
          <Table
            className="mb-3"
            data={data}
            columns={columns}
            page={filters.page}
            count={filters.count}
            total={total}
            nodata={
              <div className="text-center text-gray-400  flex flex-col items-center justify-center">
                <Image
                  src="/assets/img/noproducts.png"
                  alt=""
                  className="h-16 mx-auto"
                  width={20}height={20}
                />
                <p className="text-gray-400 text-[18px] font-regular">
                  No referals.
                </p>
              </div>
            }
            result={(e) => {
              if (e.event == "page") pageChange(e.value);
              if (e.event == "sort") sorting(e.value);
              //   if (e.event == "count") count(e.value);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default ReferalList;
