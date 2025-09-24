"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import { loaderHtml } from "@/utils/shared";
import { useSelector } from "react-redux";
import FormControl from "@/components/FormControl";
import {
  boxPreferenceList,
  receivingMethodList,
} from "@/utils/shared.utils";
import {
  getRandomCode,
} from "@/utils/shared";
import Modal from "@/components/Modal";
import { fire } from "@/components/Swal";
import EditAddress from "@/components/EditAddress";
import { useRouter } from "next/navigation";

import Link from "next/link";

import TakePayment from "@/components/boxManagement/TakePayment";
import TooltipHtml from "@/components/TooltipHtml";
import environment from "@/envirnment";
import datepipeModel from "@/utils/datepipemodel";
import { FiCheckCircle } from "react-icons/fi";
import BoxReceipt from "@/components/Membership/BoxReceipt";

function BoxManagement() {
  const user = useSelector((state:any) => state.user.data);
  const {get,put}=ApiClientB()
  const navigate=useRouter()
  const [membershipStatus, setMembershipStatus] = useState<any>();
  const [membership, setMembership] = useState<any>();
  const [showEditAddress, setShowEditAddress] = useState("");
  const [detail, setDetail] = useState({ ...user });
  const [primaryCard, setPrimaryCard] = useState<any>();
  const [buyModal, setBuyModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<any>();
  const [recieptModal, setRecieptModal] = useState<any>()
  const active = user?._id || user?.id;

    const apiRef = useRef({
    membership: { current: null },
    detail: { current: null },
    paymentStatus: { current: null },
  });
  const {
    get: getMembership,
    isLoading: membershipLoading,
    controller: membershipController,
  } = ApiClientB(apiRef.current.membership);
  const {
    get: getPaymentStatus,
    isLoading: paymentStatusLoader,
    controller: paymentStatusController,
  } = ApiClientB(apiRef.current.paymentStatus);

  const getCardDetails = () => {
    get("orders/cardDetails", { userId: active }).then((res) => {
      if (res.success) {
        const data = res.data.map((itm:any) => ({
          ...itm,
          _id: itm.token,
          isPrimary:
            JSON.parse(itm.isPrimary || "false") || itm.default || false,
        }));
        const ext = data.find((itm:any) => itm.isPrimary);
        setPrimaryCard(ext);
      }
    });
  };

  useEffect(() => {
    setDetail({...user});
  }, [user]);

 


  const getMembershipDetail = () => {
    getMembership("membership/detail", { user_id: active }).then((res) => {
      if (res.success) {
        const data = res.data;
          data.box_preference = data.box_preference?.replaceAll("N/A", "") || "";
        data.shippingStatus =
          data.shippingStatus
            ?.toLowerCase()
            ?.replaceAll(" ", "_")
            ?.replaceAll("n/a", "")
            ?.replaceAll('flat_rate','shipping')
            ?.replaceAll('delivery','shipping') || "";

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

        craft_box = craft_box.map((itm:any) => ({ ...itm, 
          shippingStatus: itm.shippingStatus
          ?.toLowerCase()
          ?.replaceAll(' ', '_')
          ?.replaceAll('flat_rate','shipping')
          ?.replaceAll('delivery','shipping')||''
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
    if (active) {
      getMembershipDetail();
    }
  }, [active]);

  useEffect(() => {
    if (membership && membershipStatus?.modal == "takepayment") {
      let craft_box = membership.craft_box[0] ? [membership.craft_box[0]] : [];
      if (!craft_box?.length) {
        craft_box = [
          {
            id: `craft_${getRandomCode(12)}`,
            payment_type: "recurring",
            shippingStatus: "local_pickup",
          },
        ];
      }
      setMembershipStatus((prev:any) => ({
        ...prev,
        craftBox: [...craft_box],
        postal_code:
          membership?.billing_postcode || membership?.primary_postcode,
      }));
    }
  }, [membership]);

  const updateAddress = (e:any) => {
    if (e.event == "submit") {
      const payload:any= {
        user_id: active,
        ...e.data,
      };
      loaderHtml(true);
      put("membership/edit", payload)
        .then((res) => {
          if (res.success) {
            setMembership((prev:any) => ({ ...prev, ...payload }));
            setShowEditAddress("");
          }
        })
        .finally(() => {
          loaderHtml(false);
        });
    }
  };

  const removeMembershipBox = (id:any) => {
    fire({
      title: "Do you want to remove this box?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        let arr = [...(membership.craft_box || [])];
        const ext = arr.find((itm) => itm.id == id);

        const payload = {
          box_token: ext.box_token,
          userId: active,
          boxId: ext.id,
        };

        // let payload = {
        //     craft_box: arr,
        //     user_id: active,
        // }

        loaderHtml(true);
        get("membership/removeRecurringBox", payload)
          .then((res) => {
            if (res.success) {
              arr = arr.filter((item) => item.id != id);
              const payload = {
                user_id: active,
                craft_box: arr,
              };
              setMembership((prev:any) => ({
                ...prev,
                craft_box: payload.craft_box,
              }));
            }
          })
          .finally(() => {
            loaderHtml(false);
          });
      }
    });
  };

  const updateMembershipCraft = (id:any, values:any = {}) => {
    const index = membership.craft_box.findIndex((itm:any) => itm.id == id);
    const arr = membership.craft_box;
    const ext = arr[index];
    let title = "Are you sure you want to update this?";

    if (values.box_preference)
      title = `Are you sure you want to update the box preference to '${values.box_preference}' for all future boxes?`;
    if (values.shippingStatus)
      title = `Are you sure you want to update the receiving method to '${
        receivingMethodList.find((item) => item.id == values.shippingStatus)
          ?.name
      }' for all future boxes?`;

    let payload = {
      ...values,
      userId: active,
      box_token: ext?.box_token,
      boxId: ext?.id,
    };

    if (values.shippingStatus) {
      payload.receiving_method = values.shippingStatus;
    }

    let url = "membership/updateExtraBoxReceivingMethod";
    if (values.box_preference) {
      url = "membership/updateExtraBoxPreference";
    }

    if (!ext.box_token) {
      url = "membership/edit";
      arr[index] = {
        ...arr[index],
        ...values,
      };
      payload = {
        ...values,
        user_id: active,
        craft_box: arr,
      };
    }

    fire({
      icon: "warning",
      title: title,
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#540C0F",
      cancelButtonText: "No",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        loaderHtml(true);
        put(url, payload)
          .then((res) => {
            if (res.success) {
              arr[index] = {
                ...arr[index],
                ...values,
              };
              setMembership((prev:any) => ({ ...prev, craft_box: arr }));
            }
          })
          .finally(() => {
            loaderHtml(false);
          });
      }
    });
  };

  const craft_box = useMemo(() => {
    const arr =
      membership?.craft_box?.filter(
        (item:any) => item.payment_type == "recurring"
      ) || [];
    return arr;
  }, [membership]);

  const buyBox = () => {
    if (boxButtonText == "Join Club") {
      window.open(`${environment.joinUrl}?q=${user.id||user._id}`, "_new");
    } else {
      setBuyModal(true);
    }
  };

   const ispaid=useMemo(()=>{
    const m=(membership?.membership || detail?.membership)?.toLowerCase()||''
    let value=true
    const arr=['groove group','craft club','craft group','guest','idle','N/A']
    arr.map(itm=>{
        if(m?.includes(itm)||!m) value=false
    })
    return value
  },[membership,detail])

   const boxButtonText = useMemo(() => {
    let text = "Join Club";
     if (ispaid) {
      text = "Buy Bonus Box";
      if (membership?.status != 'active') text = "Renew Membership";
    }
    return text;
  }, [membership,ispaid]);

   const autopayEnabled = detail?.autopay_name == "Auto Payment" ? true : false;

    const getPaymentStatusDetail = () => {
    if (paymentStatusController) paymentStatusController.abort();
    getPaymentStatus('payments/list', { page: 1, count: 1, sortBy: 'paid_date desc', userId: active }).then(res => {
      if (res.success) {
        const data = res.data?.[0]
        setPaymentStatus(data)
      }
    })
  }

   useEffect(() => {
    getCardDetails();
    getPaymentStatusDetail()
  }, []);


   const viewReciept = (row:any) => {
    loaderHtml(true)
    get('orders/getOrderDetails', { orderId: row?.clover_order_id }).then(res => {
      loaderHtml(false)
      if (res.success) {
        setRecieptModal({...res.data,row:row})
      }
    })
  }

  return (
    <>
      <div className="relative">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-medium">Box Profile</h1>
          {!membershipLoading ? (
            <>
              <button
                disabled={membershipLoading}
                onClick={buyBox}
                className="flex items-center space-x-2 bg-[#5A0E0E] text-white px-2 md:px-4 py-2 rounded-full"
              >
                {boxButtonText}
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="mt-3">
          <div className="grid grid-cols-3 gap-3 mb-3">
            {membershipLoading ? (
              <>
                <div className="shine h-[150px]"></div>
                <div className="shine h-[150px]"></div>
                <div className="shine h-[150px]"></div>
              </>
            ) : (
              <>
                {/* <div className="flex gap-2 items-center">
              <span class="material-symbols-outlined">location_on</span>
              <div className="tagesalls">
                <div className="flex gap-2">
                  <h4 className="text-sm font-regular">Mailing Address</h4>
                  <span class="material-symbols-outlined text-[20px] text-primary cursor-pointer" onClick={() => setShowEditAddress('primary')}>edit</span>

                </div>

                {membership?.primary_address_1 ? <>
                  <div>
                    <p className="text-xs mt-1">{membership?.primary_address_1}</p>
                    <p className="text-xs mt-1">{membership?.primary_city},{membership?.primary_state},{membership?.primary_country},{membership?.primary_postcode}</p>
                  </div>
                </> : <>
                  <div className="text-[12px] text-red-500">No Address</div>
                </>}


              </div>
            </div>
            <div className="flex gap-2 items-center">
              <span class="material-symbols-outlined">location_on</span>
              <div className="tagesalls">
                <div className="flex gap-2">
                  <h4 className="text-sm font-regular">Billing Address</h4>
                  {!detail?.isDeleted ? <>
                    <span class="material-symbols-outlined text-[20px] text-primary cursor-pointer" onClick={() => setShowEditAddress('billing')}>edit</span>
                  </> : <></>}
                </div>

                {membership?.billing_address_1 ? <>
                  <div>
                    <p className="text-xs mt-1">{membership?.billing_address_1}</p>
                    <p className="text-xs mt-1">{membership?.billing_city},{membership?.billing_state},{membership?.billing_country},{membership?.billing_postcode}</p>
                  </div>
                </> : <>
                  <div className="text-[12px] text-red-500">No Address</div>
                </>}
              </div>
            </div> */}
                <div className="flex gap-2 items-center bg-white border rounded-xl p-4 shadow-sm space-y-2">
                  <span className="material-symbols-outlined">location_on</span>
                  <div className="tagesalls">
                    <div className="flex gap-2">
                      <h4 className="text-sm font-regular">Card on File</h4>
                    </div>
                      {primaryCard ? <>
                        <div className="text-[12px]">
                          XXXX XXXX XXXX{" "}
                          {primaryCard?.last_four || primaryCard?.lastFourDigit}
                        </div>
                      </> : <></>}
                    
                    <div className="">
                      <Link
                        href="/cards"
                        className="text-primary cursor-pointer text-[12px]"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* <div className="flex gap-2 items-center">
                <span class="material-symbols-outlined">location_on</span>
                <div className="tagesalls">
                    <div className="flex gap-2">
                        <h4 className="text-sm font-regular">Shipping Address</h4>
                        {!detail?.isDeleted ? <>
                            <span class="material-symbols-outlined text-[20px] text-primary cursor-pointer" onClick={() => setShowEditAddress('shipping')}>edit</span>
                        </> : <></>}
                    </div>

                    {membership?.shipping_address_1 ? <>
                        <div>
                            <p className="text-xs mt-1">{membership?.shipping_address_1}</p>
                            <p className="text-xs mt-1">{membership?.shipping_city},{membership?.shipping_state},{membership?.shipping_country},{membership?.shipping_postcode}</p>
                        </div>
                    </> : <>
                        <div className="text-[12px] text-red-500">No Address</div>
                    </>}

                </div>
            </div> */}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-4">
          {membershipLoading ? (
            <>
              <div className="shine h-[200px]"></div>
              <div className="shine h-[200px]"></div>
              <div className="shine h-[200px]"></div>
            </>
          ) : (
            <>

            {ispaid?<>
              {craft_box?.map((item:any, i:any) => {
                return (
                  <Fragment key={item.id}>
                    <div className="w-full bg-gray-50 p-4  gap-4 w-full border border-gray rounded-lg shadow-sm  ">
                      {/* <div className="w-full px-[6px] py-[13px] rounded-t-lg bg-[#550b1214]">
                                          <div className="flex gap-2 items-center">
                                            <img
                                              src="/assets/img/grve-icon/m2.svg"
                                              className="h-4 2xl:h-5"
                                            />
                                            <p className="font-semibold text-sm  ">
                                              Receiving Method & Box Preference{" "}
                                              {i ? <>{i + 1}</> : <></>}
                                            </p>
                                          </div>
                                        </div> */}
                      <div className="w-full">
                        <div className="w-full">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                            <div className="">
                              <div className="grid grid-cols-12 items-center justify-between">
                                <label className="col-span-12">
                                  Box Preferences :{" "}
                                </label>
                                <div className="col-span-12 flex gap-2 items-center">
                                  <FormControl
                                    type="select"
                                    theme="search"
                                    isClearable={false}
                                    value={item.box_preference}
                                    options={boxPreferenceList}
                                    onChange={(e:any) => {
                                      updateMembershipCraft(item.id, {
                                        box_preference: e,
                                      });
                                    }}
                                    required
                                  />

                                  <TooltipHtml title={boxPreferenceList.find(itm => itm.id == item.box_preference)?.info}>
                                    <div>
                                      <span className="material-symbols-outlined text-blue-500 cursor-pointer">info</span>
                                    </div>
                                  </TooltipHtml>
                                </div>
                              </div>
                            </div>
                            <div className="">
                              <div className="grid grid-cols-12 items-center justify-between">
                                <label className="col-span-12">
                                  Receiving Method :{" "}
                                </label>
                                <div className="col-span-12">
                                  <FormControl
                                    type="radio"
                                    // label="Receiving Method"
                                    value={item.shippingStatus}
                                    options={receivingMethodList}
                                    onChange={(e:any) => {
                                      updateMembershipCraft(item.id, {
                                        shippingStatus: e,
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {!i ? (
                            <></>
                          ) : (
                            <>
                              <p
                                className="text-primary underline text-xs cursor-pointer  mt-2"
                                onClick={() => removeMembershipBox(item.id)}
                              >
                                Remove Box {i + 1}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Fragment>
                );
              })}

              <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Subscription Timeline</h3>
          <div className="space-y-4">
            <div className="flex xl:items-center justify-between flex-col xl:flex-row gap-2">
              <span className="text-gray-700 text-sm">Enrollment Date</span>
              <span className="font-medium text-sm">
                {datepipeModel.date(
                  (
                    detail?.enrollmentDate ||
                    detail?.loyalMemberData?.enrollment_date
                  )?.replace("N/A", "")
                ) || "N/A"}
              </span>
            </div>
            <div className="flex xl:items-center justify-between flex-col xl:flex-row gap-2">
              <p className="text-gray-700 text-sm ">Next Payment Date</p>
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm ">
                  {datepipeModel.date(detail?.nextPaymentDate) || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex xl:items-center justify-between flex-col xl:flex-row gap-2">
              <p className="text-gray-700 text-sm">Last Payment</p>
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">
                  {datepipeModel.date(
                    paymentStatus?.completed_payment_date
                  ) || "N/A"}
                </p>
                {paymentStatus?.completed_payment_date ? (
                  <>
                              <TooltipHtml title="View Payment History">
                                <p onClick={()=>navigate.push('/payment-history')} className={`cursor-pointer inline-flex items-center w-24 xl:w-auto px-2 py-1 rounded-full text-xs font-medium text-sm ${paymentStatus?.status != 'Completed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                  <FiCheckCircle size={12} className="mr-1" />
                                  {paymentStatus?.status}
                                </p>
                              </TooltipHtml>
                    
                  </>
                ) : (
                  <></>
                )}
                 {((paymentStatus?.clover_order_id && paymentStatus.payment_method != 'Clover') || (paymentStatus?.manual_orderId && paymentStatus?.payment_method == 'Clover')) ? <>
                            <TooltipHtml title="View Receipt">
                              <span>
                                <span
                                  className="material-symbols-outlined cursor-pointer text-green-500"
                                  onClick={() => {
                                    viewReciept(paymentStatus);
                                  }}
                                >
                                  receipt
                                </span>
                              </span>
                            </TooltipHtml>
            
            </> : <></>}
              </div>
            </div>
            <div className="flex xl:items-center justify-between flex-col xl:flex-row gap-2">
              <span className="text-gray-700 text-sm">AutoPay</span>
              {ispaid?<>
                <div className="flex items-center gap-2">
                <button
                  // onClick={() => autoPay(!autopayEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autopayEnabled ? "bg-green-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autopayEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600">
                  {autopayEnabled ? "On" : "Off"}
                </span>
              </div>
              </>:<>
              <span className="font-medium text-sm">
                  N/A
                </span>
              </>}
              
            </div>
          </div>
        </div>
            </>:<></>}
            
            </>
          )}
        </div>
      </div>

      {showEditAddress ? (
        <>
          <Modal
            title={`Update ${showEditAddress} Address`}
            body={
              <>
                <EditAddress
                  atype={showEditAddress}
                  membership={membership}
                  result={updateAddress}
                />
              </>
            }
            result={(e) => {
              setShowEditAddress("");
            }}
          />
        </>
      ) : (
        <></>
      )}

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
                      getMembershipDetail();
                      setBuyModal(false);
                    }
                    getPaymentStatusDetail()
                  }}
                />
              </>
            }
            result={(e) => {
              setBuyModal(false);
            }}
          />
        </>
      ) : (
        <></>
      )}

      {recieptModal ? <>
              <Modal
                className="max-w-xl"
                title="View Receipt"
                body={<>
                  <BoxReceipt
                    data={recieptModal}
                  // detail={detail}
                  />
                </>}
                result={() => setRecieptModal('')}
              />
            </> : <></>}
    </>
  );
}

export default BoxManagement;
