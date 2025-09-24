"use client";

import { useEffect, useRef, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import { loaderHtml } from "@/utils/shared";
import Table from "@/components/Table";
import { useSelector } from "react-redux";
import datepipeModel from "@/utils/datepipemodel";
import {
  paymentMethodName,
} from "@/utils/shared.utils";
import Notes from "@/components/Notes";
import Modal from "@/components/Modal";
import pipeModel from "@/utils/pipeModel";
import BoxReceipt from "@/components/Membership/BoxReceipt";

function PaymentHistory() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilter] = useState<any>({ page: 1, count: 50 });
  const [notesModal, setNotesModal] = useState<any>();
  const [recieptModal, setRecieptModal] = useState<any>()
  const user = useSelector((state:any) => state.user?.data);
  const {get}=ApiClientB()

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


  const getBoxList = (p = {}) => {
    const f = {
      ...filters,
      ...p,
      userId: (user?.id || user?._id),
    };
    if (listController) listController.abort()
    getList(`payments/list`, f).then((res) => {
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




  const viewReciept = (row:any) => {
    loaderHtml(true)
    get('orders/getOrderDetails', { orderId: row?.clover_order_id }).then(res => {
      loaderHtml(false)
      if (res.success) {
       setRecieptModal({...res.data,row:row})
      }
    })
  }

  const columns = [
    {
      key: "id",
      name: "Order Id",
      // sort: true,
      render: (row:any) => {
        return (
          <span
          >
            {row?.order_id}
          </span>
        );
      },
    },
    {
      key: "completed_payment_date",
      name: "Payment Status Date",
      sort: false,
      render: (row:any) => {
        return (
          <span className="capitalize">
            {datepipeModel.datetime(row?.completed_payment_date)}
          </span>
        );
      },
    },
   
    {
      key: "method",
      name: "Payment Method",
      // sort: true,
      render: (row:any) => {
        return <span className="capitalize">{paymentMethodName(row?.payment_method)}</span>;
      },
    },
    {
      key: "status",
      name: "Payment Status",
      // sort: true,
      render: (row:any) => {
        return (
          <span
            className={`inline-block rounded capitalize px-[10px] py-[3px] text-[12px] text-white 
                ${row.status == "Completed" ? "bg-green-500" : ""}
              ${row.status != "Completed" ? "bg-red-500" : ""}
              
              `}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      key: "status",
      name: "Payment Status Reason",
      // sort: true,
      render: (row:any) => {
        return (
          <span
            className={``}
          >
            {row.reason}
          </span>
        );
      },
    },
      {
        key: "items",
        name: "Box Order Receipt",
        className: 'min-w-[200px]',
        sort: false,
        render: (row:any) => {
          return <>
            <div className="">
              {((row.clover_order_id && row.payment_method != 'Clover') || (row.manual_orderId && row.payment_method == 'Clover')) ? <>
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
      key: "amount",
      name: "Paid Amount",
      // sort: true,
      render: (row:any) => {
        return (
          <span className="capitalize">
            ${pipeModel.number(row.order_total)}
          </span>
        );
      },
    },
    {
      key: "rewards",
      name: "Rewards Redeem",
      // sort: true,
      render: (row:any) => {
        return (
          <span className="capitalize">${pipeModel.number(row.rewards)}</span>
        );
      },
    },
    {
      key: "total",
      name: "Total Paid",
      // sort: true,
      render: (row:any) => {
        return (
          <span className="capitalize">${pipeModel.number(row.total)} </span>
        );
      },
    },
    // {
    //   key: "ordered_type",
    //   name: "Transaction Origin",
    //   // sort: true,
    //   render: (row) => {
    //     return <span className="">{row.ordered_type}</span>;
    //   },
    // },
    // {
    //   key: "tracking_no",
    //   name: "Tracking",
    //   sort: false,
    //   render: (row) => {
    //     return <>
    //       {row?.tracking_no ? <>
    //         <span
    //           className="capitalize cursor-pointer text-primary hover:underline"
    //           onClick={() => boxtrack(row?.tracking_no)}
    //         >
    //           {row?.tracking_no}
    //         </span>
    //       </> : <>
    //       </>}
    //     </>
    //   },
    // },
    // {
    //   key: "notes",
    //   name: "Customization",
    //   sort: false,
    //   render: (row) => {
    //     return (
    //       <>
    //         {row.status == 'Completed' ? <>
    //           <span
    //             class="material-symbols-outlined cursor-pointer"
    //             onClick={() => {
    //               openNotes(row)
    //             }}
    //           >
    //             description
    //           </span>
    //         </> : <></>}

    //       </>
    //     );
    //   },
    // },
  ];



  return (
    <>
      <div className="relative">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-medium">Payment History</h1>
          {/* <DebouncedInput
            className="border-2 border-black pl-5 py-1.5 rounded-[10px]"
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e)}
          /> */}
        </div>

        {listLoading ? <>
          <div className="shine h-[50px] mb-2 mt-8"></div>
          <div className="shine h-[50px] mb-2"></div>
          <div className="shine h-[50px] mb-2"></div>
          <div className="shine h-[50px] mb-2"></div>
          <div className="shine h-[50px] mb-2"></div>
          <div className="shine h-[50px] mb-2"></div>
          <div className="shine h-[50px] mb-2"></div>
          <div className="shine h-[50px] mb-2"></div>
          <div className="shine h-[50px] mb-2"></div>
        </> : <>
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
                          } } nodata={undefined}          />
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
                  userId={user?.id || user?._id}
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

export default PaymentHistory;
