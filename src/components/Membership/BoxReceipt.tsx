import { MdOutlinePayments } from "react-icons/md";
import { RiUser3Line } from "react-icons/ri";
import { useMemo } from "react";
import { AiFillPrinter } from "react-icons/ai";
import { PiCheckCircleFill } from "react-icons/pi";
import datepipeModel from "@/utils/datepipemodel";
import pipeModel from "@/utils/pipeModel";

export default function BoxReceipt({ data, detail }:any) {

  const getDicount = (row:any) => {
    let arr = row?.lineItems?.elements || []
    let itemtotal = 0;
    if (arr.length) itemtotal = arr.reduce((sum:any, itm:any) => sum + (itm.price / 100), 0);
    let discounts = row?.discounts?.elements
    let value = 0
    if (discounts?.length) {
      value = discounts?.reduce((acc:any, item:any) => {
        if (item?.amount) {
          acc += -(item.amount / 100);
        }
        if (item?.percentage) {
          acc += (itemtotal * item.percentage) / 100;
        }
        return acc;
      }, 0);
    }

    return value
  }

  const subTotal = (row:any) => {
    let arr = row?.lineItems?.elements || []
    let total = 0;
    if (arr.length) total = arr.reduce((sum:any, itm:any) => sum + (itm.price / 100), 0);
    let discount = getDicount(row)
    return total - discount
  }



  const taxTotal = (row:any) => {
    let arr = row?.payments?.elements || []
    let total = 0
    let subtotal = subTotal(row)
    if (arr.length) total = arr.reduce((sum:any, itm:any) => sum + (itm.taxAmount / 100), 0);
    if (!total) {
      total = (row?.total / 100) - subtotal
    }
    return total
  }

  const itemtotal = useMemo(() => {
    let arr = data?.lineItems?.elements || []
    let total = 0;
    if (arr.length) total = arr.reduce((sum:any, itm:any) => sum + (itm.price / 100), 0);
    return total
  }, [data?.lineItems?.elements])

  const subtotal = useMemo(() => {
    return subTotal(data)
  }, [data?.lineItems?.elements])

  const taxtotal = useMemo(() => {
    return taxTotal(data)
  }, [data?.payments?.elements, subtotal])


  function printElementById(id:any) {
    let doc:any=document
    var content:any = doc.getElementById(id).innerHTML;
    var printWindow:any = window.open('', '', 'width=600,height=600');
    printWindow.document.open();
    printWindow.document.write(`<html><head>
    <title>Groove Guide Receipt</title>
      <style>
    @media print {
    body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
}
    </style>
    </head>
    <body>`);
    printWindow.document.write(content);
    printWindow.document.write(`
     <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.0.2/tailwind.min.css" rel="stylesheet" />
    <script src="https://cdn.tailwindcss.com"></script>
    </body></html>`);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close()
    }, 500);
  }


 const refund_amount = useMemo(() => {
    let arr = data?.refunds?.elements || []
    let total = 0;
    if (arr.length) total = arr.reduce((sum:any, itm:any) => sum + (itm.amount), 0);
    if(data.row?.refundId) total=data?.total
    return total
  }, [data?.refunds?.elements])


  return <>
   <div className="recipt_views relative">

      {/* <div className="flex justify-end  ">
        <button
          onClick={() => printElementById('invoice')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <AiFillPrinter size={20} />
          Print
        </button>
      </div> */}


      <div className="bg-gray-50 mt-4 p-3 rounded-xl shadow-sm mb-2" id="invoice">

        <div style={{ backgroundColor: '#a1282f' }} className="p-4 rounded-2xl">
          <div className="">
            <div className="flex flex-col gap-4 items-center justify-center">
              <div className="w-20 bg-black shadow-md h-20 mx-auto rounded-full border-4 border-white p-2 flex items-center justify-center">
                <img src="/assets/img/shops.png" alt="company-logo" className="h-10" />
              </div>

              <div className="flex flex-col items-center text-white gap-2 text-base">
                <p className="m-0 font-semibold">Craft Club</p>
                <p className="m-0 uppercase">Complete Survey, Collect $ Rewards</p>
                <button className="bg-white rounded-full px-4 py-1 w-32 text-red-700 flex gap-2 items-center justify-center text-base font-medium">
                  <span><PiCheckCircleFill /></span>
                  <p>Following</p>
                </button>

                <div className="text-center text-sm">
                  <p className="uppercase font-medium">29 E Baltimore ST Detroit, MI 48202</p>
                  <p className="">+1 313-474-7666</p>
                </div>
                <div className="emails text-sm">
                  <p className="">joincraftclub@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 text-sm text-gray-800">
          <p className="bg-gray-100 text-xs px-4 py-1 inline-flex mb-2 rounded-full font-semibold text-gray-700">Customer Name</p>
          <p className="text-xl font-semibold mb-4 pb-3 border-b border-gray-300 flex gap-2 items-center text-gray-900 capitalize">
            <RiUser3Line className="text-gray-600" />
            {data?.customers?.firstName ? <>
              {data?.customers?.firstName} {data?.customers?.lastName}
            </> : <>
              {detail?.fullName}
            </>}

          </p>

          <div className="flex flex-col gap-3">
            {data?.lineItems?.elements?.map((item:any) => (
              <div className="flex justify-between text-base" key={item.id}>
                <p>{item.name}</p>
                <p className="font-medium">${pipeModel.number(item.price / 100)}</p>
              </div>
            ))}

            {data?.discounts?.elements?.map((item:any) => (
              <div className="flex justify-between text-base text-green-600 font-medium" key={item.id}>
                <p>{item.name || 'Reward'}</p>
                {item.amount ? <>
                  <p>-${pipeModel.number(-item.amount / 100)}</p>
                </> : <>
                  {item.percentage ? <>
                    -${pipeModel.number(((itemtotal) * item.percentage) / 100)} ({pipeModel.number(item.percentage)}%)
                  </> : <></>}
                </>}

              </div>
            ))}
          </div>

          <div className="mt-4">
            <p className="bg-gray-100 text-xs px-4 py-1 inline-flex mb-2 rounded-full font-semibold text-gray-700">Employee Name</p>
            <p className="text-xl font-semibold mb-3 pb-3 border-b border-gray-300 flex gap-2 items-center text-gray-900 capitalize">
              <RiUser3Line className="text-gray-600" /> {data?.employee?.name}
            </p>

            <div className="flex flex-col gap-3 text-base">
              <div className="flex justify-between font-medium">
                <p>Subtotal</p>
                <p>${pipeModel.number(subtotal)}</p>
              </div>
              <div className="flex justify-between text-gray-600">
                <p>Sales Tax ({pipeModel.number((taxtotal / subtotal) * 100)}%)</p>
                <p>${pipeModel.number(taxtotal)}</p>
              </div>
              <div className="flex justify-between font-semibold text-gray-900">
                <p>Order Total</p>
                <p>${pipeModel.number(data?.total / 100)}</p>
              </div>
              <div className="flex justify-between border-y border-gray-300 py-3 text-lg text-red-600 font-bold">
                <p>Total Paid</p>
                <p>${pipeModel.number((data?.total-refund_amount) / 100)}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1 text-sm text-gray-700">
            <p>{datepipeModel.datetime(datepipeModel.utcToDate(data?.createdTime))}</p>
            {data?.payments?.elements?.map((item:any) => (
              <p className="flex items-center gap-1" key={item.id}>Payment ID: <span className="text-gray-900 font-medium">{item.id}</span></p>
            ))}
            <p className="flex items-center gap-1">Order ID: <span className="text-gray-900 font-medium">{data?.id}</span></p>
          </div>

          <div className="mt-4 border-b-2 pb-2 border-dashed border-red-600"></div>

          <div className="mt-4">
            <p className="text-xl mb-3 font-semibold flex gap-2 items-center text-gray-900"> <MdOutlinePayments className="text-gray-600" /> Payment</p>
            {data?.payments?.elements?.map((item:any) => (
              <div className="flex flex-col gap-3 mb-4 text-base" key={item.id}>
                {item.cashTendered ? (
                  <>
                    {data?.payments?.elements?.length > 1 && (
                      <div className="flex justify-between font-medium text-gray-700">
                        <p>Split Payment</p>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <p>Cash Given</p>
                      <p>${pipeModel.number(item.cashTendered / 100)}</p>
                    </div>
                    <div className="flex justify-between text-red-600 font-medium">
                      <p>Change Received</p>
                      <p>${pipeModel.number((item.cashTendered - item.amount) / 100)}</p>
                    </div>
                    <div className="flex justify-between border-y py-2 border-dashed border-red-600 text-lg font-semibold">
                      <p>Cash Paid</p>
                      <p>${pipeModel.number(item.amount / 100)}</p>
                    </div>
                  </>
                ) : (
                  <>
                    {data?.payments?.elements?.length > 1 && (
                      <div className="flex justify-between font-medium text-gray-700">
                        <p>Split Payment</p>
                      </div>
                    )}
                    <div className="flex justify-between font-medium">
                      <p>Card</p>
                      <p>${pipeModel.number(item.amount / 100)}</p>
                    </div>
                    {/* <div className="flex justify-between border-y py-2 border-dashed border-red-600 text-lg font-semibold">
                      <p>Total Paid</p>
                      <p>${pipeModel.number(item.amount / 100)}</p>
                    </div> */}
                  </>
                )}
              </div>
            ))}
          </div>

          {data.refunds?.elements?.length ? <>
          <div className="mt-4 border-b-2 pb-2 border-dashed border-red-600"></div>
            <div className="mt-4">
              <p className="text-xl mb-3 font-semibold flex gap-2 items-center text-gray-900"> <MdOutlinePayments className="text-gray-600" /> Refund</p>
              {data?.refunds?.elements?.map((item:any) => (
                <div className="flex flex-col gap-3 mb-4 text-base" key={item.id}>
                  {item.cashTendered ? (
                    <>
                      {data?.refunds?.elements?.length > 1 && (
                        <div className="flex justify-between font-medium text-gray-700">
                          <p>Split Payment</p>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <p>Cash Given</p>
                        <p>${pipeModel.number(item.cashTendered / 100)}</p>
                      </div>
                      <div className="flex justify-between text-red-600 font-medium">
                        <p>Change Received</p>
                        <p>${pipeModel.number((item.cashTendered - item.amount) / 100)}</p>
                      </div>
                      <div className="flex justify-between border-y py-2 border-dashed border-red-600 text-lg font-semibold">
                        <p>Cash Paid</p>
                        <p>${pipeModel.number(item.amount / 100)}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      {data?.refunds?.elements?.length > 1 && (
                        <div className="flex justify-between font-medium text-gray-700">
                          <p>Split Payment</p>
                        </div>
                      )}
                      <div className="flex justify-between font-medium">
                        <p>Card</p>
                        <p className="text-green-500">-${pipeModel.number(item.amount / 100)}</p>
                      </div>
                      <div className="text-bold text-center">Refund ID: {item.id}</div>
                      <div className="text-center">{datepipeModel.datetime(datepipeModel.utcToDate(item?.createdTime))}</div>
                      {/* <div className="flex justify-between border-y py-2 border-dashed border-red-600 text-lg font-semibold">
                        <p>Total Paid</p>
                        <p>${pipeModel.number(item.amount / 100)}</p>
                      </div> */}
                      
                    </>
                  )}
                </div>
              ))}
            </div>
          </> : <>
           {data.row?.refundId?<>
               <div className="mt-4 border-b-2 pb-2 border-dashed border-red-600"></div>
               <div className="mt-4">
              <p className="text-xl mb-3 font-semibold flex gap-2 items-center text-gray-900"> <MdOutlinePayments className="text-gray-600" /> Refund</p>
              <div className="flex flex-col gap-3 mb-4 text-base">
                 <div className="flex justify-between font-medium text-gray-700">
                          <p>Split Payment</p>
                        </div>
                      <div className="flex justify-between font-medium">
                        <p>Card</p>
                        <p className="text-green-500">-${pipeModel.number(refund_amount / 100)}</p>
                      </div>
                      <div className="text-bold text-center">Refund ID: {data.row?.refundId}</div>
                      <div className="text-center">{datepipeModel.datetime(data.row?.refundDate)}</div>
                </div>
            </div>
              </>:<></>}
          </>}
         

          <div className="mt-4">
            <div className="border border-red-600 shadow-lg rounded-lg p-4 text-center bg-white">
              <h3 className="text-xl font-semibold text-red-600 mb-2">Refer a Friend & Earn Rewards!</h3>
              <p className="text-gray-700">Invite a friend and get <span className="font-bold text-red-600">$15</span> as a reward.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
}