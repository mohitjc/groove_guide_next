'use client'
import { useEffect, useState ,useMemo} from "react";
import ApiClientB from "@/utils/Apiclient";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import { Tab } from "@headlessui/react";

import { useSelector } from "react-redux";
import Modal from "@/components/Modal";

import datepipeModel from "@/utils/datepipemodel";

import pipeModel from "@/utils/pipeModel";
import TakePayment from "../boxManagement/TakePayment";

import { getRandomCode } from "@/utils/shared";
import environment from "@/envirnment";
import Table from "../Table";
import Image from "next/image";


function classNames(...classes:any) {
  return classes.filter(Boolean).join(" ");
}

const Dashboard = () => {
  const history = useRouter()
  const user = useSelector((state:any) => state.user?.data);
  const [total, setTotal] = useState(0);
  const [currentSubscription, setCurrentSubscription] = useState([]);
  const [, setActive] = useState("current");
  const [filters, setFilter] = useState<any>({ page: 1, count: 10 });
  const [activeSubscription, setActiveSubscription] = useState<any>();
  const [activeLoading, setActiveLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);
  const [membership, setMembership] = useState<any>();

  const {
    get: getMembership,
    isLoading: membershipLoading,get
  } = ApiClientB();

  const shippingFee = 19.95
  const subscriptionStartDate = user?.subscriptionStartDate
  const cancelAvailable = useMemo(() => {
    if (!subscriptionStartDate) return true;
    const currentDate = new Date();
    const startDate = new Date(subscriptionStartDate).setDate(10);
    // Ensure 3 months are correctly added
    const cancelAvailableDate = new Date(startDate);
    cancelAvailableDate.setMonth(cancelAvailableDate.getMonth() + 3);
    let value = currentDate >= cancelAvailableDate;
    if (user?.isThreemembership) value = true

    return value
  }, [user?.subscriptionStartDate, user?.isThreemembership]);



  const getCurrentSubscription = (p = {}) => {
    setListLoading(true);
    const filter = {
      ...filters,
      ...p,
      userId: user?._id
    };
    get(`Subscription/all/Subscriptions`, filter).then(
      (res) => {
        if (res.success) {
          setCurrentSubscription(res?.data || []);
          setTotal(res?.total);
        }
        setListLoading(false);
      }
    );
  };

  const getActiveSubscription = () => {
    const param = {
      user_id: user?.customerId || user?.id || user?._id
    }
    setActiveLoading(true)
    get('Subscription/active/Subscriptions', param).then(res => {
      if (res.success) {
        setActiveSubscription(res.data)
      }
      setActiveLoading(false)
    })
  }

  const getMembershipDetail = () => {
    getMembership("membership/detail", { user_id: (user?.id || user?._id) }).then((res) => {
      if (res.success) {
        const data = res.data;
        data.box_preference = data.box_preference?.replaceAll("N/A", "") || "";
        data.shippingStatus =
          data.shippingStatus
            ?.toLowerCase()
            ?.replaceAll(" ", "_")
            ?.replaceAll("n/a", "")
            ?.replaceAll('flat_rate', 'shipping')
            ?.replaceAll('delivery', 'shipping') || "";

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

        craft_box = craft_box.map((itm:any) => ({
          ...itm,
          shippingStatus: itm.shippingStatus
            ?.toLowerCase()
            ?.replaceAll(' ', '_')
            ?.replaceAll('flat_rate', 'shipping')
            ?.replaceAll('delivery', 'shipping') || ''
        }))

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
    if (user?.customerId || user?.id || user?._id) getActiveSubscription()
    getCurrentSubscription()
    getMembershipDetail()
  }, [])

  const columns = [
    {
      key: "plan_name",
      name: "Membership",
      sort: true,
      render: (row:any) => {
        return (
          <span className="capitalize">
            {row?.plan_name}
          </span>
        );
      },
    },
    {
      key: "shippingStatus",
      name: "Receiving Method",
      render: (row:any) => {
        return (
          <span className="capitalize shrink-0">
            {row.shippingStatus.replace("_", ' ')}
          </span>
        );
      },
    },
    {
      key: "startDate",
      name: "Last Payment Date",
      sort: true,
      render: (row:any) => {
        return (
          <span className="">
            {datepipeModel.date(row.startDate)}
          </span>
        );
      },
    },
    {
      key: "next_payment_date",
      name: "Next Payment Date",
      sort: true,
      render: (row:any) => {
        return (
          <span className="shrink-0">
            {datepipeModel.date(row.next_payment_date)}
          </span>
        );
      },
    },
    {
      key: "total",
      name: "Total Amount",
      sort: true,
      render: (row:any) => {
        return (
          <span className="capitalize shrink-0">
            ${pipeModel.number(row?.total / 100)}
          </span>
        );
      },
    },
    {
      key: "status",
      name: "Status",
      render: (row:any) => {
        return (
          <>
            <div className="">
              <span
                className={`bg-[#EEE] cursor-pointer text-sm !px-3 h-[30px] w-[100px] flex items-center justify-center border border-[#EBEBEB] text-[#3C3E49A3] !rounded capitalize 
                          bg-${row.status != "cancelled" ? "[#ee695e]" : "gray-400"
                  } text-white`}
              >
                {row.status}
              </span>
            </div>
          </>
        );
      },
    },
  ];

  const pageChange = (e:any) => {
    setFilter({ ...filters, page: e });
    getCurrentSubscription({ page: e });
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
    getCurrentSubscription({ sortBy, key, sorder });
  };


  const cancelSubscription = () => {
    if (!cancelAvailable) {
      toast.error("This subscription requires a three-month minimum commitment before cancellation is allowed.")
      return
    }
    history.push('/cs')
  }


  const shippingStatus = activeSubscription?.shippingStatus?.toLowerCase()?.replace(' ', '_')?.replace('delivery', 'shipping')?.replace('flat_rate', 'shipping')


  const ispaid = useMemo(() => {
    const m = (membership?.membership||user?.membership)?.toLowerCase() || ''
    let value = true
    const arr = ['groove group', 'craft club', 'craft group', 'guest', 'idle', 'N/A']
    arr.map(itm => {
      if (m?.includes(itm) || !m) value = false
    })
    return value
  }, [membership])

  const boxButtonText = useMemo(() => {
    let text = "Join Club";
    if (ispaid) {
      text = "Buy Bonus Box";
      if (membership?.status != 'active') text = "Renew Membership";
    }
    return text;
  }, [ispaid, membership]);

  const [buyModal, setBuyModal] = useState(false);
  const buyBox = () => {
    if (boxButtonText == "Join Club") {
      window.open(`${environment.joinUrl}?q=${user?.id || user?._id}`, "_new");
    } else {
      setBuyModal(true);
    }
  };

  return (
    <>
      {/* <Layout> */}
      {activeLoading ? <>
        <div className="shine mb-1 h-[50px]"></div>
        <div className="shine mb-1 h-[50px]"></div>
        <div className="shine mb-1 h-[50px]"></div>
        <div className="shine mb-1 h-[50px]"></div>
        <div className="shine mb-1 h-[50px]"></div>
        <div className="shine mb-1 h-[50px]"></div>
      </> : <>
        <Tab.Group>
          <div className="w-full bg-[#3a3a3a] rounded-xl py-3 px-4">
            <Tab.List className="flex gap-2 text-white font-semibold text-[18px]">
              {activeSubscription ? <>
                <Tab
                  onClick={() => {
                    setActive("history");
                  }}
                  className={({ selected }) =>
                    classNames(
                      "border-r border-white/40 pr-2 focus:outline-none",
                      "",
                      selected ? "text-white" : "text-[#d5d5d5]"
                    )
                  }
                >
                  My Membership
                </Tab>
              </> : <></>}

              <Tab
                onClick={() => {
                  setActive("current");
                }}
                className={({ selected }) =>
                  classNames(
                    "border--r border--white/40 pr-2 focus:outline-none",
                    "",
                    selected ? "text-white" : "text-[#d5d5d5]"
                  )
                }
              >
                Membership History
              </Tab>

            </Tab.List>
          </div>
          <Tab.Panels className=" pt-6 pb-6">
            {activeSubscription ? <>
              <Tab.Panel>
                <div className="">


                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-8">
                    <div className="block md:flex justify-between border-b border-gray-200 pb-4">
                      <label className="text-black   text-md">Membership</label>
                      <div className="text-gray-800 font-normal text-md">{activeSubscription?.plan_name}</div>
                    </div>
                    <div className="block md:flex justify-between border-b border-gray-200 pb-4">
                      <label className="text-black   text-md">Receiving Method</label>
                      <div className="text-gray-800 font-normal text-md capitalize">{activeSubscription?.shippingStatus?.replace('_', ' ')}</div>
                    </div>
                    {/* <div className="block md:flex justify-between border-b border-gray-200 pb-4">
                      <label className="text-black   text-md">Created At</label>
                      <div className="text-gray-800 font-normal text-md">{datepipeModel.date(activeSubscription?.createdAt)}</div>
                    </div> */}

                    <div className="block md:flex justify-between border-b border-gray-200 pb-4">
                      <label className="text-black   text-md">Last Payment Date</label>
                      <div className="text-gray-800 font-normal text-md">{datepipeModel.date(activeSubscription?.startDate)}</div>
                    </div>
                    <div className="block md:flex justify-between border-b border-gray-200 pb-4">
                      <label className="text-black   text-md">Next Payment Date</label>
                      <div className="text-gray-800 font-normal text-md">{datepipeModel.date(activeSubscription?.next_payment_date)}</div>
                    </div>




                    {shippingStatus == 'shipping' ? <>
                      <div className="block md:flex justify-between border-b border-gray-200 pb-4">
                        <label className="text-black  text-md">Shipping Free</label>
                        <div className="text-gray-800 font-normal text-md">${pipeModel.number(shippingFee)}</div>
                      </div>
                    </> : <></>}

                    <div className="block md:flex justify-between border-b border-gray-200 pb-4">
                      <label className="text-black   text-md">Total Amount</label>
                      <div className="text-gray-800 font-normal text-md">${pipeModel.number(activeSubscription?.total / 100)}</div>
                    </div>
                    <div className="block md:flex justify-between border-b border-gray-200 pb-4">
                      <label className="text-black   text-md">Membership Status</label>
                      <div className="text-gray-800 font-normal text-md capitalize">{activeSubscription?.status}</div>
                    </div>
                    {/* <div className="block md:flex justify-between border-b border-gray-200 pb-4">
                      <label className="text-black   text-md">Amount</label>
                      <div className="text-gray-800 font-normal text-md">${pipeModel.number(activeSubscription?.amount / 100)}</div>
                    </div> */}

                    {/* <div className="block md:flex justify-between border-b border-gray-200 pb-4">
                  <label className="text-gray-800 text-lg font-semibold ">Total</label>
                  <div className="text-gray-800 text-lg font-semibold">${pipeModel.number((activeSubscription?.amount) / 100)}</div>
                </div> */}




                  </div>

                  <div className="text-right mt-4 flex gap-3 justify-end">
                    {membershipLoading ? <>
                      <div className="w-[150px] h-10 shine"></div>
                    </> : <>
                       {ispaid && membership?.status?.toLowerCase() != 'cancelled' ? <>
                      <button className="bg-red-500 leading-10 h-10 inline-flex items-center shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg gap-2" onClick={() => cancelSubscription()}>Cancel Membership</button>
                    </> : <></>}
                      <button className="bg-primary leading-10 h-10 inline-flex items-center shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg gap-2" onClick={() => buyBox()}>{boxButtonText}</button>
                    </>}
                  </div>
                </div>
              </Tab.Panel>
            </> : <></>}

            <Tab.Panel>
              {listLoading ? <>
                <div className="shine mb-1 h-[50px]"></div>
                <div className="shine mb-1 h-[50px]"></div>
                <div className="shine mb-1 h-[50px]"></div>
                <div className="shine mb-1 h-[50px]"></div>
                <div className="shine mb-1 h-[50px]"></div>
                <div className="shine mb-1 h-[50px]"></div>
              </> : <>
                <Table
                  className="mb-3"
                  data={currentSubscription}
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
                          className="h-36 mx-auto"
                           width={20}
                            height={20}
                        />
                        <p className="text-gray-400 text-[18px] font-regular">
                          No Subscription.
                        </p>
                      </div>
                    </div>
                  </>}

                  result={(e) => {
                    if (e.event == "page") pageChange(e.value);
                    if (e.event == "sort") sorting(e.value);
                  }}
                />
              </>}

            </Tab.Panel>

          </Tab.Panels>
        </Tab.Group>
      </>}

      {buyModal ? (
        <>
          <Modal
            className="max-w-[800px]"
            title={`${boxButtonText}`}
            body={
              <>
                <TakePayment
                  membership={membership}
                  resultRes={(e:any) => {
                    if (e.event == 'success') {
                      setBuyModal(false);
                      getActiveSubscription()
                      getCurrentSubscription()
                      getMembershipDetail()
                    }
                  }}
                />
              </>
            }
            result={() => {
              setBuyModal(false);
            }}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Dashboard;
