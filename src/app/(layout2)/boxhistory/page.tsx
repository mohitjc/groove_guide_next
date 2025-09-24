"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import { loaderHtml } from "@/utils/shared";
import Table from "../../../components/Table";
import { useSelector } from "react-redux";
import datepipeModel from "@/utils/datepipemodel";
import FormControl from "@/components/FormControl";
import {
  boxPreferenceList,
  boxtrackUrl,
  receivingMethodList,
} from "@/utils/shared.utils";

import {
  getRandomCode
} from "@/utils/shared";
import Notes from "@/components/Notes";
import Modal from "@/components/Modal";
import OptionDropdown from "@/components/OptionDropdown";
import pipeModel from "@/utils/pipeModel";

import CardDetails from "@/components/CardDetails";
import { toast } from "react-toastify";
import { fire } from "@/components/Swal";
import TooltipHtml from "@/components/TooltipHtml";
import BoxReceipt from "@/components/Membership/BoxReceipt";

function BoxHistory() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilter] = useState<any>({ page: 1, count: 50 });
  const search=''
  const [notesModal, setNotesModal] = useState<any>();
const [recieptModal, setRecieptModal] = useState('')
  const [membershipStatus, setMembershipStatus] = useState<any>();

  const {get,post,put}=ApiClientB()
  const user = useSelector((state:any) => state.user.data);
  const active=(user.id||user._id)

    const apiRef = useRef({
      membership: { current: null },
      list: { current: null },
      detail: { current: null },
    });
      const {
      get: getList,
      isLoading: listLoading,
      controller: listController,
    } = ApiClientB(apiRef.current.list);
    const {
      get: getMembership,
      isLoading: membershipLoading,
      // controller: membershipController,
    } = ApiClientB(apiRef.current.membership);

  const [activeDropdown, setActiveDropdown] = useState<any>('');
  const [membership, setMembership] = useState<any>();
  const shippingFee = 19.95;

  const getBoxList = (p = {}) => {
    const f = {
      ...filters,
      ...p,
      email: user.email,
      search: search,
    };
    if(listController) listController.abort()
    getList(`membership/boxManagementList`, f).then((res) => {
      if (res?.success) {
        const data = res.data;
        setData(data);
        setTotal(res.total || data.length);
      }
    });
  };

  useEffect(() => {
    getBoxList();
  }, []);

   const getMembershipDetail = () => {
    getMembership("membership/detail", { user_id: active }).then((res) => {
      if (res.success) {
        const data = res.data;
        if (!data.craft_box?.length && data.box_preference) {
          data.craft_box = [
            {
              id: `craft_${getRandomCode(12)}`,
              payment_type: "recurring",
              box_preference: data.box_preference,
              shippingStatus: data?.shippingStatus
                ?.toLowerCase()
                ?.replaceAll(" ", "_"),
            },
          ];
        }

        if (data?.craft_box?.length) {
          data.box_preference = data.craft_box[0].box_preference;
        }
        if (data?.craft_box?.length && !data.shippingStatus) {
          data.shippingStatus = data.craft_box[0].shippingStatus;
        }

        data.shipping_address_1 =
          data.shipping_address_1 || data.primary_address_1;
        data.shipping_address_2 =
          data.shipping_address_2 || data.primary_address_2;
        data.shipping_city = data.shipping_city || data.primary_city;
        data.shipping_state = data.shipping_state || data.primary_state;
        data.shipping_postcode =
          data.shipping_postcode || data.primary_postcode;
        data.shipping_country = data.shipping_country || data.primary_country;

        if (!data.billing_address_1) data.billing_same_as_primary = true;

        setMembership(data);
      }
    });
  };

  useEffect(() => {
    getMembershipDetail()
  }, []);

  const pageChange = (e:any) => {
    setFilter({ ...filters, page: e });
    getBoxList({ page: e });
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
    getBoxList({ sortBy, key, sorder });
  };

  const boxtrack = (no:any) => {
    boxtrackUrl(no);
  };

const filter = (p = {}) => {
    const f = {
      page: 1,
      ...p,
    };
    setFilter((prev:any)=>({ ...prev, ...f }));
    getBoxList({ ...f });
  };
   const updateBox = async (e:any, key:any, order_id:any, id:any) => {
    const value = e.target ? e.target.value : e;

    let title='Are you sure you want to update this?'
    if(key=='box_preference') title=`Are you sure you want to update the box preference to '${value}'?`
    if(key=='receiving_method') title = `Are you sure you want to update the receiving method to '${
        receivingMethodList.find((item) => item.id == value)
          ?.name
      }'?`;
     
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
          put("membership/updateBoxManagement", {
            [key]: value,
            order_id,
            id,
          }).then(res=>{
            if (res.success) {
            setData((prev:any) =>
              prev.map((row:any) =>
                row.order_id === order_id && (row.id === id || row._id === id)
                  ? { ...row, [key]: value }
                  : row
              )
            );
            setActiveDropdown('')
          }
          }).finally(()=>{
            loaderHtml(false);
          });
      }
    });


   
  };

    const updateValue = useCallback((row:any) => {
    const payload = {
      ...row
    }
    loaderHtml(true)
    put('membership/updateBoxManagement', payload).then(res => {
      loaderHtml(false)
      if (res.success) {
        filter()
      }
    })
  }, [])


  
    const totalPayment = useMemo(() => {
      let value = 0;
      const price = 97;
  
      membershipStatus?.craftBox?.forEach((itm:any) => {
        let shipping = 0;
        let boxPrice = 0;
  
        if (
          itm.shippingStatus === "shipping" ||
          itm.shippingStatus === "only_shipping"
        ) {
          shipping = shippingFee;
        }
  
        if (itm.shippingStatus !== "only_shipping") {
          boxPrice = price;
        }
  
        value += boxPrice + shipping;
      });
  
      return value;
    }, [membershipStatus, shippingFee]);


    const viewReciept = (row:any) => {
    loaderHtml(true)
    get('orders/getOrderDetails', { orderId: row?.clover_order_id }).then(res => {
      loaderHtml(false)
      if (res.success) {
        setRecieptModal({...res.data,row:row})
      }
    })
  }

  const columns =  [
    {
      key: "order_id",
      name: "Order Id",
      sort: false,
      render: (row:any) => {
        return <span className="capitalize">{row.order_id}</span>;
      },
    },
  
    {
      key: "paid_date",
      name: "Order Completed Date",
      sort: false,
      render: (row:any) => {
        return (
          <span className="capitalize">
            {datepipeModel.datetime(row?.completePaymentDate)}
          </span>
        );
      },
    },
    {
      key: "box_preference",
      name: "Box Preference",
      tdClassName: "!px-2",
      // sort: true,
      render: (row:any) => {
        return (
          <>
            {(activeDropdown?.id==row._id&&activeDropdown?.key=='box_preference')?<>
            <div className="flex gap-3 items-center">
               <OptionDropdown
              placeholder="Please Choose"
              className="w-[330px]"
              value={row.box_preference?.replace(/\bbox\b/i, "Box")}
              onChange={(e) => {
                updateBox(
                  e,
                  "box_preference",
                  row.order_id,
                  row?.id || row?._id
                );
              }}
              options={boxPreferenceList}
            />
              <span className="material-symbols-outlined cursor-pointer text-primary text-[20px]" onClick={() => setActiveDropdown('')}>close</span>
            </div>
             
              </>:<>
               <div className="flex gap-3">
                {row.box_preference?.replace(/\bbox\b/i, "Box")||'--'}

                <TooltipHtml title={boxPreferenceList.find(itm=>itm.id==row.box_preference)?.info}>
                  <div>
                    <span className="material-symbols-outlined text-blue-500 cursor-pointer">info</span>
                  </div>
                </TooltipHtml>
               

                  {(row.box_status != 'Picked up' && row.box_status != 'Labeled' && row.box_status != 'Mailed'&& row.box_status != 'Delivered'&& row.box_status != 'Refunded') ? <>
                    <span className="material-symbols-outlined cursor-pointer text-primary text-[20px]" onClick={() => setActiveDropdown({ id: row._id, key: 'box_preference' })}>edit</span>
                  </> : <></>}
               
              </div>
              </>}
            
          </>
        );
      },
    },
    {
      key: "receiving_method",
      name: "Receiving Method",
      className: "min-w-[250px]",
      sort: false,
      render: (row:any) => {
        const formattedReceivingMethod =
          row.receiving_method
            ?.toLowerCase()
            .replace(/\s+/g, "_")
            .replace("delivery", "shipping")
            .replace("flat_rate", "shipping")
            || "local_pickup";
        return (
          <>
          {(activeDropdown?.id==row._id&&activeDropdown?.key=='receiving_method')?<>
          <div className="flex gap-3 items-center">
               <FormControl
              type="select"
              theme="option"
              className="w-[200px]"
              placeholder="Please Choose"
              value={formattedReceivingMethod}
              onChange={(e:any) => {
               
                if(e=='shipping'){
                  const craft_box = [
                      {
                        id: `craft_${getRandomCode(12)}`,
                        payment_type: "recurring",
                        shippingStatus: "only_shipping",
                        box_preference:row.box_preference,
                        
                      },
                    ];
                  setMembershipStatus({
                    modal: "takepayment",
                    rowData: row,
                    craftBox: [...craft_box],
                    postal_code:
                      membership?.billing_postcode ||
                      membership?.primary_postcode,
                  });
                }else{
                   updateBox(
                  e,
                  "receiving_method",
                  row.order_id,
                  row?.id || row?._id
                );
                }
              }}
              // disabled={(formattedReceivingMethod == 'shipping') ? true : false}
              options={receivingMethodList}
            />
              <span className="material-symbols-outlined cursor-pointer text-primary text-[20px]" onClick={() => setActiveDropdown('')}>close</span>
            </div>
              
              </>:<>
               <div className="flex gap-3">
                {receivingMethodList.find(item=>item.id==formattedReceivingMethod)?.name||formattedReceivingMethod}
                  {(row.box_status != 'Picked up' && row.box_status != 'Labeled' && row.box_status != 'Mailed'&& row.box_status != 'Delivered'&& row.box_status != 'Refunded') ? <>
                    <span className="material-symbols-outlined cursor-pointer text-primary text-[20px]" onClick={() => setActiveDropdown({ id: row._id, key: 'receiving_method' })}>edit</span>
                  </> : <></>}
              </div>
              </>}
          </>
        );
      },
    },
    {
      key: "box_status",
      name: "Box Status",
      sort: false,
      render: (row:any) => {
        return <span className="capitalize">{row.box_status}</span>;
      },
    },
     {
        key: "box_dates",
        name: "Box Status Updated Date",
        render: (row:any) => {
          return datepipeModel.datetime(row?.box_dates);
        },
      },
        {
        key: "items",
        name: "Box Order Receipt",
        className: 'min-w-[200px]',
        sort: false,
         exprender: (row:any) => {
          let text=''
          row.items?.map((itm:any)=>{
            text+=`${itm.description} - (${pipeModel.currency(itm.amount / 100)})\n`
          })
          return text
        },
        render: (row:any) => {
          return <>
            <div className="">
              {((row.clover_order_id && row.paymentMethod != 'Clover') || (row.manual_orderId && row.paymentMethod == 'Clover')) ? <>
              <div>
                <span 
                  onClick={() => {
                      viewReciept(row);
                    }}
                  className="flex gap-1 items-center text-[12px] font-bold cursor-pointer text-green-500">
                  <span className="material-symbols-outlined text-[16px]">
                    receipt
                  </span>
                  View Receipt
                </span>
              </div>
              </> : <>
               
              </>}
              <ul className="list-disc pl-3">
                {row.items?.map((itm:any) => {
                  return <li className="" key={itm.inventory_id}>{itm.description} - ({pipeModel.currency(itm.amount / 100)})</li>
                })}
              </ul>
            </div>
          </>;
        },
      },
      {
        key: "itemized_order",
        name: "Box Items Receipt",
        className: 'min-w-[200px]',
        sort: false,
        exprender: (row:any) => {
          let text = ''
          row.clover_items?.map((itm:any) => {
            text += `${itm.name} - (${pipeModel.currency(itm.price / 100)})\n`
          })
          return text
        },
        render: (row:any) => {
          return <>
            <div className="">
              {(row.items_clover_id) ? <>
                <div>
                  <span
                    onClick={() => {
                      viewReciept({ ...row, clover_order_id: row.items_clover_id });
                    }}
                    className="flex gap-1 items-center text-[12px] font-bold cursor-pointer text-green-500">
                    <span className="material-symbols-outlined text-[16px]">
                      receipt
                    </span>

                    View Receipt
                  </span>
                </div>


              </> : <>
                
              </>}
              <ul className="list-disc pl-3">
                {row.clover_items?.map((itm:any) => {
                  return <li className="" key={itm.id}>{itm.name} - ({pipeModel.currency(itm.price / 100)})</li>
                })}
              </ul>
            </div>
          </>;
        },
      },
    {
      key: "tracking_no",
      name: "Box Tracking",
      sort: false,
      render: (row:any) => {
        return row?.tracking_no ? (
          <span
            className="capitalize cursor-pointer text-primary hover:underline"
            onClick={() => boxtrack(row?.tracking_no)}
          >
            {row?.tracking_no}
          </span>
        ) : (
          <>--</>
        );
      },
    },
    {
      key: "notes",
      name: "Customization",
      sort: false,
      render: (row:any) => {
        return (
          <>
            <span
              className="material-symbols-outlined cursor-pointer"
              onClick={() => openNotes(row)}
            >
              description
            </span>
          </>
        );
      },
    },
  ];

  const openNotes = (row:any) => {
    setNotesModal(row);
  };

   const takePaymentSubmit = () => {
    setMembershipStatus((prev:any) => ({ ...prev, submitted: true }));
    if (!membershipStatus.postal_code) {
      toast.error("Postal Code is Required");
      return;
    }
    if (!membershipStatus?.cardDetail) {
      toast.error("Please choose a card first");
      return;
    }

    const invalid =
      !membershipStatus?.postal_code ||
        membershipStatus.craftBox?.find(
          (itm:any) => !itm.box_preference || !itm.shippingStatus
        )
        ? true
        : false;
    if (invalid) return;
    const currentDate = new Date();
    const end = new Date(currentDate).setMonth(currentDate.getMonth() + 1);
    let endmonth = new Date(end).getMonth() + 1;
    let endyear = new Date(currentDate).getFullYear();
    if (membershipStatus?.nextBox && currentDate.getDate() < 10) {
      endmonth = currentDate.getMonth() + 1;
      endyear = currentDate.getFullYear();
    }

   fire({
        title: "Process Shipping Only Payment?",
        description: "Are you sure you want to process shipping only payment?",
        showCancelButton: true,
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          const shippingOnlyPayload = {
            ship_status: "only_shipping",
            email: user?.email,
            userId: active,
            nextBox: membershipStatus?.nextBox ? true : false,
            startDate: datepipeModel.datetostring(currentDate),
            endDate: datepipeModel.datetostring(`${endyear}-${endmonth}-10`),
            card: {
              ...membershipStatus?.cardDetail,
              last4: membershipStatus?.cardDetail?.number?.slice(-4),
              first6: membershipStatus?.cardDetail?.number?.slice(0, 6),
              agree: membershipStatus?.cardDetail?.agree || true,
              acknowledge: membershipStatus?.cardDetail?.acknowledge || true,
              notCharge:false,
              validate:true,
            },
            IP: localStorage.getItem("IP") || "",
            tipAmount: shippingFee,
            origin:`${window.location.href}`,
            subscriptionId: membershipStatus?.rowData?.subscriptionId,
            boxId: membershipStatus?.rowData?._id,
          };

          if (!shippingOnlyPayload.card?.brand) {
            fire({
              title: "Card Brand Not Detected",
              description: "We were unable to identify the brand associated with the card number you entered. Please remove this card and add it again with the correct information.",
              icon: "error"
            });
            return
          }

          loaderHtml(true);
          post("Subscription/takePayment", shippingOnlyPayload).then(
            (res) => {
              loaderHtml(false);
              if (res.success) {
                const row=membershipStatus?.rowData
                toast.success("Shipping payment processed successfully");
                updateValue({ id: row._id, receiving_method: 'shipping', order_id: row?.order_id || null })
                 setMembershipStatus('');
              }
            }
          );
        }
      });
  };


  useEffect(()=>{
    if (membership) {
      setMembershipStatus((prev:any) => ({ ...prev, postal_code: (membership?.billing_postcode||membership?.primary_postcode)}))
    }
  },[membership])
  

  return (
    <>
      <div className="relative">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-medium">Box Orders History</h1>
          {/* <DebouncedInput
            className="border-2 border-black pl-5 py-1.5 rounded-[10px]"
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e)}
          /> */}
        </div>

{listLoading?<>
  <div className="shine h-[50px] mb-2 mt-8"></div>
  <div className="shine h-[50px] mb-2"></div>
  <div className="shine h-[50px] mb-2"></div>
  <div className="shine h-[50px] mb-2"></div>
  <div className="shine h-[50px] mb-2"></div>
  <div className="shine h-[50px] mb-2"></div>
  <div className="shine h-[50px] mb-2"></div>
  <div className="shine h-[50px] mb-2"></div>
  <div className="shine h-[50px] mb-2"></div>
</>:<>
<Table
                          className="mt-8"
                          total={total}
                          data={data}
                          columns={columns}
                          page={filters.page}
                          count={filters.count}
                          result={(e) => {
                              if (e.event == "page") pageChange(e.value);
                              if (e.event == "sort") sorting(e.value);
                              // if (e.event == "saerch") handleSearch(e.value);
                          } } nodata={undefined}        />
</>}
          
        
      </div>

      {notesModal ? (
        <>
          <Modal
            title={`Customization`}
            className="max-w-[900px]"
            body={
              <>
                <Notes
                  userId={user.id || user._id}
                  email={user?.email}
                  order_id={notesModal?.order_id}
                />
              </>
            }
            result={() => {
              setNotesModal('');
            }}
          />
        </>
      ) : (
        <></>
      )}


      {membershipStatus?.modal == "takepayment" ? (
              <>
                <Modal
                  title={"Pay for Shipping"}
                  className="max-w-[900px]"
                  body={
                    <>
                      <div className="mb-3 flex justify-between gap-2 bg-gray-200 p-4 rounded-lg items-center">
                        <h3 className="font-bold ">Billing Details</h3>
                      </div>
      
                      <div>
                        <div className="mb-3">
                          {membershipLoading ? (
                            <>
                              <div className="shine h-[40px]"></div>
                            </>
                          ) : (
                            <>
                              <FormControl
                                type="text"
                                maxlength="6"
                                label="Postal Code"
                                value={membershipStatus.postal_code}
                                onChange={(e:any) => {
                                  setMembershipStatus((prev:any) => ({
                                    ...prev,
                                    postal_code: e,
                                  }));
                                }}
                                required
                                disabled={membershipLoading}
                              />
                            </>
                          )}
      
                          {!membershipStatus.postal_code &&
                            membershipStatus.submitted ? (
                            <>
                              <div className="text-red-500 mt-1">
                                Postal Code is Required
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
      
                        <h3 className="font-bold mb-3">Order Details</h3>
      
                        {membershipLoading ? (
                          <>
                            <div className="shine h-[100px] mb-3"></div>
                            <div className="shine h-[100px] mb-3"></div>
                          </>
                        ) : (
                          <>
                            <div className="mb-3">
                              {membershipStatus.craftBox?.map((itm:any, i:any) => {
                                return (
                                  <div
                                    className="p-3 border rounded-xl shadow mb-3"
                                    key={itm.id}
                                  >
                                    <div className="flex gap-2">
                                      <div className="w-full">
                                        <div className="flex gap-2 mb-3">
                                          <span>{i + 1}. Craft Box</span>
                                          <div className="ml-auto">
                                            {itm.shippingStatus !==
                                              "only_shipping" && <div>$97.00</div>}
                                            {itm.shippingStatus == "shipping" ? (
                                              <>
                                                <div className="mt-1">
                                                  ${shippingFee}
                                                </div>
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                          <div>
                                            <FormControl
                                              type="select"
                                              theme="search"
                                              label="Box Preferences"
                                              disabled
                                              value={itm.box_preference}
                                              options={boxPreferenceList}
                                              onChange={() => {
                                               
                                              }}
                                            />
                                            {!itm.box_preference &&
                                              membershipStatus.submitted ? (
                                              <>
                                                <div className="text-red-500 mt-1">
                                                  Box Preferences is Required
                                                </div>
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                          <div>
                                            <FormControl
                                              type="radio"
                                              label="Receiving Method"
                                              value={itm.shippingStatus}
                                              disabled
                                              options={[
                                                {
                                                  id: "only_shipping",
                                                  name: "Shipping Only",
                                                },
                                              ]}
                                              onChange={() => {
                                                
                                              }}
                                            />
                                            {!itm.shippingStatus &&
                                              membershipStatus.submitted ? (
                                              <>
                                                <div className="text-red-500 mt-1">
                                                  Receiving Method is Required
                                                </div>
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}
      
                        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-lg shadow-sm bg-white mb-4">
                          <div className="text-lg font-medium">
                            Total Payable:{" "}
                            <span className="font-bold text-primary">
                              ${pipeModel.number(totalPayment)}
                            </span>
                          </div>
                          {/* <button
                            type="button"
                            disabled={membershipLoading}
                            className="flex items-center gap-2 bg-primary px-6 py-2 rounded-xl text-white text-sm font-semibold shadow-md hover:bg-opacity-90 transition-all active:scale-95"
                            onClick={() => addCraft()}
                          >
                            Add More
                          </button> */}
                        </div>
      
                        <div className="bg-white shadow-md rounded-2xl p-3 md:p-6 border">
                          <h3 className="font-bold mb-3">Card Details</h3>
                          <div className="mb-3">
                            <CardDetails
                              userId={active}
                              detail={user}
                              result={(e:any) => {
                                setMembershipStatus((prev:any) => ({
                                  ...prev,
                                  cardDetail: e.value,
                                }));
                              }}
                            />
                          </div>
                        </div>
      
                        <div className="mb-3 flex gap-3 mt-3 justify-end">
                          <button
                            type="button"
                            disabled={membershipLoading}
                            className="inline-flex items-center gap-2 bg-primary px-6 py-2 rounded-lg text-white text-sm font-medium shadow hover:bg-opacity-90 transition-all"
                            onClick={() => {
                              takePaymentSubmit();
                            }}
                          >
                            Pay
                          </button>
                        </div>
                      </div>
                    </>
                  }
                  result={() => {
                    setMembershipStatus('');
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

export default BoxHistory;
