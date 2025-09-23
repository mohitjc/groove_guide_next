import { useEffect, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import methodModel from "@/utils/methodModel";
import { loaderHtml, noImg } from "@/utils/shared";
import { useRouter, useParams } from "next/navigation";
import Table from "@/components/Table";
import { useSelector } from "react-redux";
import TooltipHtml from "@/components/TooltipHtml";
import { PiEyeLight } from "react-icons/pi";
import SelectDropdown from "@/components/SelectDropdown/page";

function RewardRequest() {
    const {get, post}=ApiClientB()
  const navigate = useRouter();
  const user = useSelector((state:any) => state.user.data);
  const [total, setTotal] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [rewardTypes, setRewardTypes] = useState([]);
  const { get: getRewardTypes, isLoading: isRewardTypeLoading } = ApiClientB();
  const [filters, setFilter] = useState<any>({
    page: 1,
    count: 10,
  });

  const [loading, setLoader] = useState(false);

  const pageChange = (e:any) => {
    setFilter((prev:any) => ({ ...prev, page: e }));
  };

  const view = (id:any) => {
    navigate.push(`/reward-request-detail/${id}`);
  };

  const columns = [
    {
      key: "rewardtype",
      name: "Reward Type",
      render: (row:any) => {
        return (
          <span className="capitalize">
            {row?.type || row?.transaction_for || "N/A"}{" "}
          </span>
        );
      },
    },
    {
      key: "notes",
      name: "Notes",
      render: (row:any) => {
        return <span className="capitalize">{row?.notes || "N/A"} </span>;
      },
    },
    {
      key: "isApproved",
      name: "Status",
      render: (row:any) => {
        return (
          <span className="capitalize">
            {row?.isApproved}
            {row?.isApproved != "pending" ? "ed" : ""}
          </span>
        );
      },
    },
    {
      key: "",
      name: "Action",
      render: (row:any) => {
        return (
          <>
            <TooltipHtml placement="top" title="View">
              <a
                className="border cursor-pointer  hover:opacity-70 rounded-lg bg-[#540C0F14] w-10 h-10 !text-primary flex items-center justify-center text-lg"
                onClick={(e) => view(row.id)}
              >
                <PiEyeLight />
              </a>
            </TooltipHtml>
          </>
        );
      },
    },
  ];

  const getRewards = (p = {}) => {
    setLoader(true);
    let filter = {
      ...filters,
      ...p,
      userId: user.id || user._id,
    };

    get(`review/googleReviewList`, filter).then((res) => {
      setLoader(false);
      if (res.success) {
        setRewards(
          res.data.map((itm:any) => {
            itm.id = itm._id;
            return itm;
          })
        );
        setTotal(res.total);
      }
    });
  };

  useEffect(() => {
    getRewards();
  }, [filters.page]);

  const changestatus = (e:any) => {
    setFilter({ ...filters, isApproved: e, page: 1 });
    getRewards({ isApproved: e, page: 1 });
  };

  const filter = (p = {}) => {
    let f = {
      page: 1,
      isApproved: "",
      type: "",
      ...p,
    };
    setFilter({ ...filters, ...f });
    getRewards({ ...f });
  };

  const clear = () => {
    let f = {
      // search: "",
      type: "",
      isApproved: "",
      page: 1,
    };
    setFilter({ ...filters, ...f });
    getRewards({ ...f });
  };
  useEffect(() => {
    getRewardTypes("settings/list", { status: "active" }).then((res) => {
      if (res.success) {
        setRewardTypes(
          res.data.map((itm:any) => ({
            id: itm.transaction_for,
            name: itm.transaction_for,
          }))
        );
      }
    });
  }, []);

  return (
    <>
      <div className="2xl:container mx-auto px-3">
        <div className="flex justify-between items-center">
          <p className=" text-lg lg:text-2xl font-semibold text-[#111827] mb-3">
            Reward Requests
          </p>
          <div className="flex gap-2 lg:ml-auto flex-wrap">
            <SelectDropdown
              displayValue="name"
              placeholder="All Status"
              intialValue={filters.isApproved}
              result={(e:any) => {
                changestatus(e.value);
              }}
              options={[
                { id: "pending", name: "Pending" },
                { id: "accept", name: "Accepted" },
                { id: "reject", name: "Rejected" },
              ]}
            />
            <div className="min-w-[200px]">
              <SelectDropdown
                displayValue="name"
                placeholder="All Reward Type"
                intialValue={filters.type}
                result={(e:any) => {
                  filter({ type: e.value });
                }}
                theme="search"
                isLoading={isRewardTypeLoading}
                options={[...rewardTypes]}
              />
            </div>
            {filters.isApproved || filters.type ? (
              <>
                <button
                  className="bg-primary leading-10 h-10 inline-block shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg"
                  onClick={() => clear()}
                >
                  Reset
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        {loading ? (
          <>
            <div className="text-center py-3">
              Loading... <i className="fa fa-spinner fa-spin"></i>
            </div>
          </>
        ) : (
          <>
            <Table
              className="mb-3"
              data={rewards}
              columns={columns}
              page={filters.page}
              count={filters.count}
              total={total}
              nodata={
                <div className="flex flex-col gap-6">
                  <img
                    src="/assets/img/noproducts.png"
                    alt=""
                    className="h-36 mx-auto"
                  />
                  <p className="text-center text-gray-400 text-[18px] font-regular">
                    No Reward Requests.
                  </p>
                </div>
              }
              result={(e) => {
                if (e.event == "page") pageChange(e.value);
                // if (e.event == "sort") sorting(e.value);
                // if (e.event == "count") count(e.value);
              }}
            />
          </>
        )}
      </div>
    </>
  );
}

export default RewardRequest;
