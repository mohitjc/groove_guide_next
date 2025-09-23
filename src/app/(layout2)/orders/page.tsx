"use client";

import { Fragment, useEffect, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import moment from "moment";
import { loaderHtml } from "@/utils/shared";
import Pagination from "react-paginate";
import { Dialog, Disclosure, Transition, } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import methodModel from "@/utils/methodModel";
import speechModel from "@/utils/speech.model";

import { Tab } from "@headlessui/react";
import Dashboard from "@/components/mySubscription/page";
import { useRouter, useSearchParams } from "next/navigation";
import datepipeModel from "@/utils/datepipemodel";
import Modal from "@/components/Modal";
import BoxReceipt from "@/components/Membership/BoxReceipt";
import TooltipHtml from "@/components/TooltipHtml";

function classNames(...classes:any) {
  return classes.filter(Boolean).join(" ");
}

function Orders() {
  const [tabs, setTabs] = useState(2);
  const Navigate=useRouter()
  const {get,post}=ApiClientB()

  const [customerID, setCustomerID] = useState("");
  const [myOrders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setform] = useState<any>({ tag: '', privacy: false, comment: '' });
  const [productTags, setProductTags] = useState([]);
const [recieptModal, setRecieptModal] = useState<any>()
  const [filters, setFilter] = useState({
    page: 1,
    count: 10,
    search: "",
  });

  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [OrderLoader,setOrderLoader]=useState(false);

  const getOrderDetails = (p = {}) => {
    let f = {
      ...filters,
      ...p,
      expand: 'credits,discounts,employee,lineItems,lineItems.discounts,lineItems.modifications,orderType,payments,refunds,serviceCharge,orderAdditionalCharges',
      filter: `customer.id IN ('${customerID}')`,
      limit: 10,
      offset: 0
    };
    setOrderLoader(true)
    let off = (f.page - 1) * 10;
    f.offset = off
    f.limit = f.count
    let url = "orders/get";
    // let url = "orders/getCustomerOrder";

    get(url, f).then((res) => {
      if (res.success) {
        let data = res.data
        if (data) {
          setOrders(res.data);
          setTotal(data.length);
        } else {
          setOrders([]);
          setTotal(0);
        }
      }
      setOrderLoader(false);
    });
  };

  const getUsers = () => {
    const url = "orders/get/users";
    const parms = `Token=2f02f294-b57b-1783-2ef6-173f1fb628bb`;
    get(url + "?" + parms).then((res) => {
      if (res.success) {
        setUsers(
          res.data.elements?.map((item:any) => {
            return { value: item?.id, label: item?.primaryDisplay };
          })
        );
      }
    });
  };

  const getUserCloverId = () => {
    let url = "orders/clover-customer-id";
    loaderHtml(true);
    get(url).then((res) => {
      if (res.success) {
        setCustomerID(res.customer_id);
      }
      loaderHtml(false);
    });
  };
  const getPrice = (amount:any) => {
    if (!amount) {
      return 0;
    }
    let price = amount / 100;
    return price;
  };

  useEffect(() => {
    getUserCloverId();
    getUsers();
  }, []);

  const pageChange = (e:any) => {
    setFilter({ ...filters, page: e });
    getOrderDetails({ page: e });
  };

  useEffect(() => {
    // if (customerID) {
    getOrderDetails();
    // }
    // getOrderDetails();
    //  Check Removed according to Mohit Node 
    // customerID
  }, []);

  const addReview = (itm:any, order:any) => {
    setIsOpen(true)

    let prm = {
      orderId: order.id,
      itemId: itm.id
    }
    loaderHtml(true)
    get('orders/getDetailOfItem', prm).then(res => {
      loaderHtml(false)
      if (res.success) {
        setform({
          tag: '',
          privacy: false,
          comment: '',
          orderId: order.id,
          product_id: res.data?.id,
          itemId: itm.id
        })
        let tags = res?.data?.tags?.map((itm:any) => {
          itm.id = itm._id
          return itm
        }) || []
        setProductTags(tags)
      }
    })
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const [speachStart, setSpeachStart] = useState(false);

  const stop = () => {
    const recognition = speechModel.recognition;
    recognition.stop();
    setSpeachStart(false);
  };

  const voice = () => {
    let voiceBtn = document.getElementById("voiceBtn");
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
      const transcript = Array.from(event.results)
        .map((result:any) => result[0])
        .map((result) => result.transcript)
        .join("\n");


      let el:any = document.getElementById("voicemessage");
      let message = form.comment;
      message = `${message}\n${transcript}`;
      setform({ ...form, comment: message });
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

  const handleSubmit = () => {
    let payload = {
      orderId: form.orderId,
      itemId: form.itemId,
      tags: form.tag ? [form.tag] : [],
      privacy: false,
      comment: form.comment,
      product_id: form.product_id || null
    }

    loaderHtml(true)
    post('review/add', payload).then(res => {
      loaderHtml(false)
      if (res.success) {
        closeModal()
        Navigate.push('/myjournal')
        getOrderDetails()
      }
    })
  }

    const viewReciept = (row:any) => {
       setRecieptModal({...row})
    }

  return (
    <>
      <div className="">
        <div className="">
          <Tab.Group defaultIndex={0}>
            <div className="inline-flex bg-[#3a3a3a] rounded-xl py-3 px-4">
              <Tab.List className="flex gap-2 text-white font-semibold text-[16px]">
                <Tab
                  onClick={(e) => setTabs(1)}
                  className={({ selected }) =>
                    classNames(
                      "border-r border-white/40 pr-2 focus:outline-none",
                      "",
                      selected ? " text-white" : " text-[#d5d5d5]"
                    )
                  }
                >
                  Product Orders
                </Tab>
                <Tab
                  onClick={(e) => setTabs(2)}
                  id="OrderClick"
                  className={({ selected }) =>
                    classNames(
                      " focus:outline-none",
                      "",
                      selected ? " text-white" : "text-[#d5d5d5]"
                    )
                  }
                >
                  Membership
                </Tab>
              </Tab.List>
            </div>
            <Tab.Panels className="pt-6 pb-6">
              <Tab.Panel>
                <div>
                  {myOrders.length == 0 && !OrderLoader && (
                    <div className="col-span-12 text-center bg-gray-100 p-4 h-[300px] flex items-center justify-center">
                      <div className="flex flex-col gap-6">
                        <img
                          src="/assets/img/noproducts.png"
                          alt=""
                          className="h-36 mx-auto"
                        />
                        <p className="text-gray-400 text-[18px] font-regular">
                          No Order.
                        </p>
                      </div>
                    </div>
                  )}
                  {OrderLoader ? (
                    <div className="text-center h-32 font-semibold text-xl flex items-center justify-center">
                      Loading ......
                    </div>
                  ) : null}
                  {!myOrders.length ? null : (
                    <>
                      <div className="grid grid-cols-12 gap-4">
                        {myOrders?.map((_order: any, index) => {
                          return (
                            <div className="col-span-12 " key={index}>
                              <div className="bg-gray-50 border hover:bg-white hover:shadow-lg  rounded-lg p-4  border-primary">
                                <Disclosure>
                                  {/* className="w-full " */}
                                  {({ open }) => (
                                    <>
                                      <Disclosure.Button
                                        className={`${
                                          index > 0 ? "" : ""
                                        } flex items-center  lg:py-2 py-2 w-full `}
                                      >
                                        <div className="flex  justify-between items-start w-full gap-4">
                                          <div className="flex items-start flex-col gap-2">
                                            <p className="flex items-center gap-2 flex-wrap">
                                              <span className="w-32 text-left">
                                                Order ID
                                              </span>{" "}
                                              <span className="bg-gray-200 px-3 py-1 rounded text-sm">
                                                {_order?.id}
                                              </span>
                                            </p>
                                            <p className="flex items-center gap-2 flex-wrap">
                                              <span className="w-32 text-left">
                                                Order Date
                                              </span>{" "}
                                              <span className="bg-gray-200 px-3 py-1 rounded text-sm">
                                                {datepipeModel.datetime(
                                                  datepipeModel.utcToDate(
                                                    _order?.createdTime
                                                  )
                                                )}
                                              </span>
                                            </p>

                                            {_order?.orderType?.label ? (
                                              <>
                                                <p className="flex items-center gap-2 flex-wrap">
                                                  <span className="w-32 text-left">
                                                    Type
                                                  </span>{" "}
                                                  <span className="bg-gray-200 px-3 py-1 rounded text-sm">
                                                    {_order?.orderType?.label}
                                                  </span>
                                                </p>
                                              </>
                                            ) : (
                                              <></>
                                            )}

                                            <p className="flex items-center gap-2 flex-wrap">
                                              <span className="w-32 text-left">
                                                Employee Name
                                              </span>{" "}
                                              <span className="bg-gray-200 px-3 py-1 rounded text-sm">
                                                {_order?.employee?.name ||
                                                  _order?.employeeName}
                                              </span>
                                            </p>
                                          </div>
                                          <div className="flex items-end flex-col gap-2">
                                            <div className="flex items-center flex-wrap gap-2">
                                              <div className="">
                                                <span className="">
                                                  {_order?.paymentState}
                                                </span>
                                              </div>
                                              <div className="bg-primary px-2 py-1 rounded text-white">
                                                <span className="mr-2">
                                                  {_order?.currency}
                                                </span>
                                                <span>
                                                  {getPrice(_order?.total)}
                                                </span>
                                              </div>
                                              <TooltipHtml title="View Receipt">
                                                <span>
                                                  <span
                                                    className="material-symbols-outlined cursor-pointer text-green-500"
                                                    onClick={() => {
                                                      viewReciept(_order);
                                                    }}
                                                  >
                                                    receipt
                                                  </span>
                                                </span>
                                              </TooltipHtml>
                                            </div>

                                            <div className=" text-md">
                                              <ChevronUpIcon
                                                className={`${
                                                  open
                                                    ? "rotate-180 transform"
                                                    : ""
                                                } h-8 w-8 text-black`}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </Disclosure.Button>
                                      <Disclosure.Panel className=" pb-6  text-[12px] lg:text-[16px] text-gray-500">
                                        <table className="w-full">
                                          <thead>
                                            <tr>
                                              <th className="text-left">
                                                Items
                                              </th>
                                              <th className="text-left">
                                                Price
                                              </th>
                                              <th className=""></th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <>
                                              {_order?.lineItems?.elements.map(
                                                (itm: any) => {
                                                  return (
                                                    <>
                                                      <tr>
                                                        <td>{itm?.name}</td>
                                                        <td>
                                                          $
                                                          {getPrice(itm?.price)}
                                                        </td>
                                                        <td className="text-end">
                                                          <button
                                                            onClick={() =>
                                                              addReview(
                                                                itm,
                                                                _order
                                                              )
                                                            }
                                                            className="bg-primary px-2 py-1 rounded text-white"
                                                          >
                                                            Leave Review
                                                          </button>
                                                        </td>
                                                      </tr>
                                                    </>
                                                  );
                                                }
                                              )}
                                            </>
                                          </tbody>
                                        </table>
                                      </Disclosure.Panel>
                                    </>
                                  )}
                                </Disclosure>
                                {/* <div className="text-right">
                      <button  className="bg-primary px-[15px] py-[5px] rounded text-white">Add Review</button>
                    </div> */}
                              </div>
                            </div>
                          );
                        })}

                        <div className="col-span-12">
                          <div className="flex items-center justify-end">
                            {total > filters.count ? (
                              <div className="paginationWrapper  mt-15">
                                <Pagination
                                  //   currentPage={filters.page}
                                  //   totalSize={total}
                                  //   sizePerPage={filters.count}
                                  //   changeCurrentPage={pageChange}

                                  breakLabel="..."
                                  nextLabel="Next >"
                                  onPageChange={pageChange}
                                  pageRangeDisplayed={filters.count}
                                  pageCount={filters.page}
                                  previousLabel="< Prev"
                                  containerClassName="flex gap-2"
                                  pageClassName="px-3 py-1 border rounded"
                                  activeClassName="bg-black text-white"
                                  previousClassName="px-3 py-1 border rounded"
                                  nextClassName="px-3 py-1 border rounded"
                                  breakClassName="px-3 py-1"
                                />
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div>
                  <Dashboard />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>

      {isOpen ? (
        <>
          <Transition appear show={true} as={Fragment}>
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
                        Add Review
                      </Dialog.Title>

                      <div className="tabs_styles">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                          }}
                        >
                          <div className="mt-2">
                            <div className="chos_modal">
                              <p className="font-semibold tet-[15px] mb-4">
                                Choose Experience/Benefits
                              </p>

                              <div className="imagses_co flex gap-4 items-center flex-wrap">
                                {productTags?.map((tag:any, index) => {
                                  return (
                                    <>
                                      <input
                                        type="radio"
                                        name="coin"
                                        id={`coin${index}`}
                                        className="hidden"
                                      />
                                      <label
                                        className="flex items-center gap-4 cursor-pointer"
                                        htmlFor={`coin${index}`}
                                        onClick={() => {
                                          setform({
                                            ...form,
                                            tag: tag.id,
                                          });
                                        }}
                                      >
                                        <img
                                          src={methodModel.noImg(tag.image)}
                                          className="h-16 w-16 object-cover rounded-full"
                                        />
                                      </label>
                                    </>
                                  );
                                })}
                              </div>
                              {/* {submitted && form?.tag == 0 && (
                                  <div className="text-danger small mt-1 capitalize">
                                    Please select the tag to submit.
                                  </div>
                                )} */}
                            </div>

                            <div className="mt-4">
                              <h5 className="text-[14px] font-regular mb-3">
                                Personal Notes
                              </h5>

                              <textarea
                                value={form.comment}
                                onChange={(e) => {
                                  setform({
                                    ...form,
                                    comment: e.target.value,
                                  });
                                }}
                                required
                                id="voicemessage"
                                placeholder="Write comments....."
                                className="h-36 p-4 w-full rounded-[21px] border-[0.21px] border-black/50 bg-white"
                              ></textarea>
                              {/* {submitted && !form.comment && (
                                  <div className="text-danger small mt-1 capitalize">
                                    please write comments.
                                  </div>
                                )} */}

                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={voice}
                                  className={`btn btn-outline-dark px-3 mb-3 btnmi ${
                                    speachStart ? "glowing" : ""
                                  }`}
                                  id="voiceBtn"
                                >
                                  <i className="fa fa-microphone mr-1"></i> Type or
                                  Speak
                                </button>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 flex-wrap mt-6">
                              {/* <div>
                              <p className="mb-2 text-[16px] font-semibold">
                                Private/Public
                              </p>

                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  value=""
                                  className="sr-only peer"
                                  checked={form.privacy}
                                  onChange={(e) => setform({ ...form, privacy: e.target.checked })
                                  }
                                />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#540C0F]"></div>
                              </label>
                            </div> */}

                              <div className="btns flex items-center gap-2 ">
                                <button
                                  type="button"
                                  onClick={closeModal}
                                  className="bg-gray-400 py-3 px-2 w-32 text-white text-[14px] font-medium"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="bg-[#263238] py-3 px-2 w-32 text-white text-[14px] font-medium"
                                >
                                  Save
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
      ) : (
        <></>
      )}
      {recieptModal ? (
        <>
          <Modal
            className="max-w-xl"
            title="View Receipt"
            body={
              <>
                <BoxReceipt
                  data={recieptModal}
                  // detail={detail}
                />
              </>
            }
            result={() => setRecieptModal('')}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Orders;
