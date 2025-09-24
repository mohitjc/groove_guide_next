"use client";

import { useEffect, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import { useParams } from "next/navigation";

import FormControl from "@/components/FormControl";
import Table from "../../../components/Table";
import { useSelector } from "react-redux";
import { GrEmoji } from "react-icons/gr";
import Breadcrumb from "@/components/Breadcrumb";
import pipeModel from "@/utils/pipeModel";

import ClaimReward from "../ClaimReward/page";
import RewardRequest from "./RewardRequest";
import Image from "next/image";

function Rewards() {
 const {get}=ApiClientB()
  const user = useSelector((state:any) => state.user.data);
  const [total, setTotal] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [totalPoints, setTotalPoints] = useState(null);
  const [loading, setLoader] = useState(false);
  const [tab, setTab] = useState<any>("points");
  const [types, setTypes] = useState([]);
  const [filters, setFilter] = useState({ page: 1, count: 10, type: '', reward_type: '' });


  const {id}=useParams()
    useEffect(()=>{
    setTab(id||'points')
  },[id])

  const pageChange = (e:any) => {
    setFilter(prev => ({ ...prev, page: e }))
  };

  const columns = [
    {
      key: "type",
      name: "Type",
      render: (row:any) => {
        return (
          <span className="capitalize">
            {row?.type || "N/A"}{" "}
          </span>
        );
      },
    },
    {
      key: "transaction_for",
      name: "Reward Type",
      // sort:true,
      render: (row:any) => {
        return (
          <span className="capitalize">
            {row?.transaction_for || "N/A"}{" "}
          </span>
        );
      },
    },
    {
      key: "notes",
      name: "Notes",
      render: (row:any) => {
        return <span className="">{row?.notes || "N/A"} </span>;
      },
    },
    {
      key: "amount",
      name: "Amount",
      render: (row:any) => {
        return (
          <span className="capitalize shrink-0">
            <span className="capitalize">${row?.amount || ""} </span>
          </span>
        );
      },
    },
  ];

  const getRewards = (p = {}) => {
    setLoader(true);
    const filter = {
      ...filters,
      email: user?.email,
    };
    get(`Rewards/rewardPoints`, filter).then(
      (res) => {
        setLoader(false);
        if (res.success) {
          setRewards(res?.data.reward_history);
          setTotal(res?.data.total);
          setTotalPoints(res?.data?.wallet);
        }
      }
    );
  };

  const getTypes = (p = {}) => {
    const filter = {
      status: 'active'
    };
    get(`settings/list`, filter).then(
      (res) => {
        if (res.success) {
          setTypes(res?.data.map((itm:any) => {
            return {
              ...itm,
              id: itm.transaction_for,
              name: itm.transaction_for,
            }
          }));
        }
      }
    );
  }

  const clear = () => {
    const f = {
      page: 1,
      reward_type: '',
      type: ''
    }
    setFilter(prev => ({ ...prev, ...f }))
  }

  useEffect(() => {
    getTypes()
  }, [])

  useEffect(() => {
    getRewards();
  }, [filters.page, filters.type, filters.reward_type]);

  return (
    <>
      <div className="">
        <Breadcrumb links={[{ link: "/", name: "Home" }]} currentPage={"Rewards"} />
        <div className="pt-[30px] md:pt-[50px] lg:pt-[70px] xl:pt-[100px] px-4 lg:px-10 2xl:px-16">
          <div className="text-sm font-medium  text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 ">
            <ul className="inline-flex  gap-3 flex-wrap bg-black mb-4 rounded-xl">
              <li className="">
                <span onClick={() => { setTab('points'); }} className={`cursor-pointer ${tab == 'points' ? 'inline-block px-4 py-3 text-[#d5d5d5] bg-primary rounded-l-xl  active ' : 'inline-block px-4 py-3  text-[#fff] hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}>Reward History</span>
              </li>
                <li className="">
                <span onClick={() => { setTab('requests'); }} className={`cursor-pointer ${tab == 'requests' ? 'inline-block px-4 py-3 text-[#d5d5d5] bg-primary rounded-l-xl  active ' : 'inline-block px-4 py-3  text-[#fff] hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}>Reward Requests</span>
              </li>
              <li className="">
                <span onClick={() => setTab('claim')} className={`cursor-pointer ${tab == 'claim' ? 'inline-block px-4 py-3 text-[#d5d5d5] bg-primary rounded-r-xl  active ' : 'inline-block px-4 py-3  hover:text-gray-600 text-[#fff] hover:border-gray-300 dark:hover:text-gray-300'}`}>Claim Rewards</span>
              </li>
            </ul>
          </div>
          <div className="">
            {user.is_extra_referd_product ? <>
              <p className="text-black mb-6 bg-yellow-100 text-sm  rounded-lg flex gap-2 items-center shadow-sm"><span className="h-full rounded-l-lg p-3 bg-primary text-lg text-white mr-2"><GrEmoji />        </span> Great! you are eligible for one complimentry product and you will get that in subscribed box. </p>
            </> : <></>}
            <div className="mt-4">
              {tab == 'points' ? <>
                <div className="flex mb-4 items-center gap-4 justify-between flex-wrap lg:flex-nowrap">
                  <p className=" text-lg lg:text-2xl font-semibold text-[#111827]">
                    Reward History
                  </p>
                  <div className="flex gap-3 flex-wrap md:flex-nowrap ">
                    <p className="flex gap-2 items-center min-w-[230px]">
                      Total Rewards Balance:{" "}
                      <span className="bg-primary px-3 text-white rounded py-2">
                        {pipeModel.currency(totalPoints || 0)}
                      </span>
                    </p>

                    <div className="flex gap-2 flex-wrap lg:flex-nowrap">


                      <FormControl
                        type="select"
                        value={filters.type}
                        placeholder="Type"
                        options={[
                          { name: 'Earned', id: 'earned' },
                          { name: 'Redeemed', id: 'redeemed' },
                        ]}
                        onChange={(e:any) => {
                          setFilter(prev => ({ ...prev, type: e, page: 1 }))
                        }}
                        theme="search"
                      />
                      <div className="min-w-[200px]">
                        <FormControl
                          type="select"
                          theme="search"
                          placeholder="Reward Type"
                          options={types}
                          value={filters.reward_type}
                          onChange={(e:any) => {
                            setFilter(prev => ({ ...prev, reward_type: e, page: 1 }))
                          }}
                        />
                      </div>
                    </div>

                    {filters.type || filters.reward_type ? <>
                      <button type="button" className="btn btn-primary" onClick={() => clear()}>Reset</button>
                    </> : <></>}
                  </div>

                </div>

                {loading ? <>
                  <div className="text-center py-3 h-52 flex items-center gap-2 justify-center">
                    Loading... <i className="fa fa-spinner fa-spin"></i>
                  </div>
                </> : <>
                  <Table
                                          className="mb-3"
                                          data={rewards}
                                          columns={columns}
                                          page={filters.page}
                                          count={filters.count}
                                          total={total}
                                          nodata={<>
                                              <div className="col-span-12 text-center h-[300px] flex items-center justify-center">
                                                  <div className="flex flex-col gap-6">
                                                      <Image
                                                          src="/assets/img/noproducts.png"
                                                          alt=""
                                                          className="h-36 mx-auto" />
                                                      <p className="text-gray-400 text-[18px] font-regular">
                                                          No Rewards.
                                                      </p>
                                                  </div>
                                              </div>
                                          </>}
                                          result={(e) => {
                                              if (e.event == "page") pageChange(e.value);
                                              // if (e.event == "sort") sorting(e.value);
                                              // if (e.event == "count") count(e.value);
                                          } }   />
                </>}

              </> : <></>}
               {tab == 'requests' ? <>
                <RewardRequest />
              </> : null}
              {tab == 'claim' ? <>
                <ClaimReward result={()=>{
                  setTab('requests')
                }}  />
              </> : null}
             
              
            </div>
            {/* <div className="flex flex-col gap-6">
              <Image src="/assets/img/noproducts.png" alt="" className="h-36 mx-auto" />
              <p className="text-center text-gray-400 text-[18px] font-regular">
                No Rewards.
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Rewards;
