import FormControl from "@/components/FormControl";
import { useEffect, useMemo, useState } from "react";
import BoxSooner from "../boxsnoor/page";
import { boxPreferenceList, getPlanPrice, paymentTypeList, receivingMethodList, shippingFee } from "@/utils/shared.utils";
import { getRandomCode } from "@/utils/shared";
import { MdDeleteOutline } from "react-icons/md";
import pipeModel from "@/utils/pipeModel";
import ApiClientB from "@/utils/Apiclient";

import CardDetails from "../CardDetails";

import { useDispatch, useSelector } from "react-redux";
// import Swal from "sweetalert2";
import { fire } from "@/components/Swal";
import datepipeModel from "@/utils/datepipemodel";
import { loaderHtml } from "@/utils/shared";
import { toast } from "react-toastify";
// import { login_success } from "../actions/user";
import { login as login_success} from "@/redux/slices/userSlice";


export default function TakePayment({ membership, resultRes = () => { },user,isPaymentDue,paymentDue}:any) {

    const {get,post}=ApiClientB()
    const detail1 = (useSelector((state:any) => state.user?.data))

    const detail = useMemo(() => {
        const data = user ? user : detail1
        data.nextPaymentDate = data.nextPaymentDate == '0' ? '' : data.nextPaymentDate

        return data
    }, [])

    const craftPlanPrice=getPlanPrice(membership?.membership||detail?.membership)
     
    const dispatch=useDispatch()
    const active = (detail.id || detail._id)
    const [membershipStatus, setMembershipStatus] = useState<any>();
    const [plans, setPlans] = useState([]);

    const [form, setForm] = useState({
        plan: '',
        shipping_method: '',
        acknowledge: ''
    })


    const getPlans = () => {
        get(`subscriptionPlans/list`).then((res) => {
            if (res.success) {
                const data = res.data.map((itm:any) => {
                    if (itm.planId) itm.id = itm.planId
                    return itm
                })
                setPlans(data);
            }
        });
    }

    useEffect(() => {
        getPlans()
    }, [])

    useEffect(() => {
        if (membership) {
            let craft_box = membership.craft_box[0] ? [membership.craft_box[0]] : []
            if (!craft_box?.length) {
                craft_box = [{
                    id: `craft_${getRandomCode(12)}`,
                    payment_type: 'recurring',
                    shippingStatus: 'local_pickup',
                    box_preference:boxPreferenceList[0].id
                }]
            }


            if(paymentDue){
                craft_box = [{
                    id: `craft_${getRandomCode(12)}`,
                    payment_type: 'one_time',
                    shippingStatus: paymentDue?.shippingStatus?.toLowerCase()?.replaceAll(' ','_'),
                    box_preference: paymentDue?.boxPreference
                }]
            }

            craft_box=craft_box.map(itm=>({...itm,shippingStatus:itm.shippingStatus||'local_pickup'}))
            
            setMembershipStatus((prev:any) => ({
                ...prev,
                modal: 'takepayment',
                postal_code: membership?.billing_postcode || membership?.primary_postcode,
                craftBox: [...(craft_box || [])],
                nextBox:true
            }))
        }
    }, [membership,paymentDue])

    const addCraft = () => {
        setMembershipStatus((prev:any) => {
            const payload = { ...prev }
            const arr = [...(prev?.craftBox || [])]
            arr.push({
                id: `craft_${getRandomCode(12)}`,
                payment_type: 'one_time',
                shippingStatus: 'local_pickup',
                box_preference:boxPreferenceList[0].id
            })
            payload.craftBox = arr
            return payload
        })
    }

    const updateCraft = (i:any, values:any) => {
        setMembershipStatus((prev:any) => {
            const payload = { ...prev }
            const arr = membershipStatus.craftBox
            arr[i] = {
                ...arr[i],
                ...values,
            }

            payload.craftBox = arr
            return payload
        })
    }

    const removeCraft = (i:any) => {
        setMembershipStatus((prev:any) => {
            const payload = { ...prev }
            let arr = membershipStatus.craftBox || []
            arr = arr.filter((itm:any, index:any) => index != i)
            arr = arr.filter((itm:any, index:any) => index != i)
            payload.craftBox = arr
            return payload
        })
    }

    const selectedPlan:any = useMemo(() => {
        return plans.find((itm:any) => itm.id == form.plan)
    }, [plans, form?.plan])

    const totalPayment = useMemo(() => {
        let value = 0;
        const price = craftPlanPrice;

        membershipStatus?.craftBox?.forEach((itm:any) => {
            let shipping = 0;
            let boxPrice = 0;

            if (itm.shippingStatus === 'shipping' || itm.shippingStatus === 'only_shipping') {
                shipping = shippingFee;
            }

            if (itm.shippingStatus !== 'only_shipping') {
                boxPrice = price;
            }

            value += boxPrice + shipping;
        });

        return value || ((selectedPlan?.amount || 0) / 100);
    }, [membershipStatus, shippingFee, selectedPlan]);

   const takePaymentSubmit = (p:any) => {
        setMembershipStatus((prev:any) => ({ ...prev, submitted: true }))
        if (!membershipStatus.postal_code) {
            toast.error("Postal Code is Required")
            return
        }
        if (!membershipStatus?.cardDetail) {
            toast.error("Please choose a card first")
            return
        }

        const invalid = (!membershipStatus?.postal_code || membershipStatus.craftBox?.find((itm:any) => !itm.box_preference || !itm.shippingStatus)) ? true : false
        if (invalid) return

        const currentDate = new Date(detail?.nextPaymentDate ? detail?.nextPaymentDate : new Date().toISOString())
        const boxLength = (membershipStatus.craftBox?.length || 1)
        const end = new Date(currentDate).setMonth(currentDate.getMonth() + boxLength)
        let endmonth = new Date(end).getMonth() + 1
        let endyear = new Date(end).getFullYear()
        if (membershipStatus?.nextBox) {
            endmonth = currentDate.getMonth() + 1
            endyear = currentDate.getFullYear()
        }

        // Original flow for other shipping methods
        const title = 'Make Payment?'
        const text = 'Are you sure you want to make one time payment?'

        fire({
            title: title,
            description: text,
            showCancelButton: true,
            confirmButtonText: "Yes",
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                const craftBox = [...membershipStatus.craftBox]

                const payload = {
                    "collectionMethod": "CHARGE_AUTOMATICALLY",
                    userId: active,
                    email: detail?.email,
                    origin:`${window.location.href}`,
                    // amount: planAmount / 100,
                    // isPrimary: true,
                    recurring: p == 'recurring' ? true : false,
                    "customerId": detail?.customerId,
                    nextBox: membershipStatus?.nextBox ? true : false,
                    paymentDue:paymentDue?._id||null,
                    startDate: datepipeModel.datetostring(new Date()),
                    endDate:membershipStatus?.nextDate||datepipeModel.datetostring(`${endyear}-${endmonth}-10`),
                    total_amount: totalPayment,
                    "planId": detail?.planId || '',
                   
                    card: {
                        ...membershipStatus?.cardDetail,
                        last4: membershipStatus?.cardDetail?.number?.slice(-4),
                        first6: membershipStatus?.cardDetail?.number?.slice(0, 6),
                        agree: membershipStatus?.cardDetail?.agree || true,
                        acknowledge: membershipStatus?.cardDetail?.acknowledge || true,
                        // notCharge:true,
                        // validate:false
                    },
                    membership: {
                        "billing_address_1": membership.billing_address_1,
                        "billing_address_2": membership.billing_address_2,
                        "billing_city": membership.billing_city,
                        "billing_state": membership.billing_state,
                        "billing_postcode": membership.billing_postcode,
                        "billing_country": membership.billing_country,
                        "shipping_address_1": membership.shipping_address_1,
                        "shipping_address_2": membership.shipping_address_2,
                        "shipping_city": membership.shipping_city,
                        "shipping_state": membership.shipping_state,
                        "shipping_postcode": membership.shipping_postcode,
                        "shipping_country": membership.shipping_country,
                        "primary_address_1": membership.primary_address_1,
                        "primary_address_2": membership.primary_address_2,
                        "primary_city": membership.primary_city,
                        "primary_state": membership.primary_state,
                        "primary_postcode": membership.primary_postcode,
                        "primary_country": membership.primary_country,
                        user_id: active,
                        box_preference: craftBox?.[0]?.box_preference,
                        shippingStatus: craftBox?.[0]?.shippingStatus,
                        craftBox: craftBox,
                        craft_box: craftBox,
                        postal_code: membershipStatus.postal_code,
                        recurring: p == 'recurring' ? true : false,
                    },
                    IP: localStorage.getItem('IP') || ''
                }

                if (!payload.card?.brand) {
                    fire({
                        title: "Card Brand Not Detected",
                        description: "We were unable to identify the brand associated with the card number you entered. Please remove this card and add it again with the correct information.",
                        icon: "error"
                    });
                    return
                }

                loaderHtml(true)
                post('Subscription/takePayment', payload).then(res => {
                    loaderHtml(false)
                    if (res.success) {
                        setMembershipStatus('')
                        fire({
                            // title: "Good job!",
                            description: "Payment made successfully.",
                            icon: "success"
                        });
                        const item:any ={
                              nextPaymentDate:payload.endDate
                        }
                        dispatch(login_success(item))
                        resultRes({ event: 'success', value: res })
                    }else{
                        resultRes({ event: 'error', value: res })
                    }
                })
            }
        });

    }


    if (!membershipStatus) return <>
        <div className="shine h-[50px] mb-3"></div>
        <div className="shine h-[300px] mb-3"></div>
        <div className="shine h-[200px] mb-3"></div>
    </>


    if(!paymentDue && isPaymentDue){
        return <>
        <div className="p-3 h-[300px]">
        <div className="text-center text-green-500">No payment due. Your pending payment is already completed.</div>
        </div>
        </>
    }

    return <>
        <div className="mb-3 flex justify-between gap-2 bg-gray-200 p-4 rounded-lg items-center">
            <h3 className="font-bold ">Billing Details</h3>
        </div>

        <div>
            <div className="mb-3">
                <FormControl
                    type="text"
                    maxlength='6'
                    label="Postal Code"
                    value={membershipStatus.postal_code}
                    onChange={(e:any) => {
                        setMembershipStatus((prev:any) => ({ ...prev, postal_code: e }))
                    }}
                    className={`${(!membershipStatus.postal_code && membershipStatus.submitted) ? 'border border-red-500' : ''}`}
                    required
                />
                {!membershipStatus.postal_code && membershipStatus.submitted ? <>
                    <div className="text-red-500 mt-1">Postal Code is Required</div>
                </> : <></>}
            </div>

            <h3 className="font-bold mb-3">Order Details</h3>
          
            <div className="mb-3">
                {membershipStatus.craftBox?.map((itm:any, i:any) => {
                    return <div className="p-3 border rounded-xl shadow mb-3" key={itm.id}>
                        <div className="flex gap-2">
                            <div className="w-full">
                                <div className="flex gap-2 mb-3">
                                    <span>{i + 1}. Craft Box</span>
                                    <div className="ml-auto">
                                        {itm.shippingStatus !== 'only_shipping' && <div>${craftPlanPrice}</div>}
                                        {(itm.shippingStatus === 'shipping' || itm.shippingStatus === 'only_shipping') && (
                                            <div className="mt-1">${shippingFee}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div>
                                        <FormControl
                                            type="select"
                                            theme="search"
                                            label="Box Preferences"
                                            value={itm.box_preference}
                                            options={boxPreferenceList}
                                            onChange={(e:any) => {
                                                updateCraft(i, { box_preference: e })
                                            }}
                                            disabled={isPaymentDue}
                                        />
                                        {!itm.box_preference && membershipStatus.submitted ? <>
                                            <div className="text-red-500 mt-1">Box Preferences is Required</div>
                                        </> : <></>}
                                    </div>
                                    <div>
                                        <FormControl
                                            type="radio"
                                            label="Receiving Method"
                                            value={itm.shippingStatus}
                                            options={receivingMethodList}
                                            onChange={(e :any)=> {
                                                updateCraft(i, { shippingStatus: e })
                                            }}
                                            disabled={isPaymentDue}
                                        />
                                        {!itm.shippingStatus && membershipStatus.submitted ? <>
                                            <div className="text-red-500 mt-1">Receiving Method is Required</div>
                                        </> : <></>}
                                    </div>
                                    {!isPaymentDue?<>
                                     <div className="col-span-full">
                                        <FormControl
                                            type="radio"
                                            value={itm.payment_type}
                                            // options={(i == 0) ? [{ id: 'recurring', name: 'Add To Monthly Membership' }] : paymentTypeList}
                                            options={paymentTypeList}
                                            onChange={(e:any) => {
                                                updateCraft(i, { payment_type: e })
                                            }}
                                        />
                                    </div>
                                    </>:<></>}
                                   
                                </div>
                            </div>
                            {i != 0 ? <>
                                <div className="text-right shrink-0 px-2">
                                    {!isPaymentDue?<>
                                     <button type="button" className="bg-primary rounded-full text-white p-1 "
                                        onClick={() => {
                                            removeCraft(i)
                                        }}
                                    ><MdDeleteOutline /></button>
                                    </>:<></>}
                                   
                                </div>
                            </> : <></>}
                        </div>
                    </div>
                })}
            </div>


            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-lg shadow-sm bg-white mb-4">
                <div className="text-lg font-medium">
                    Total Payable: <span className="font-bold text-primary">${pipeModel.number(totalPayment)}</span>
                </div>

                {!isPaymentDue?<>
                 <button
                    type="button"
                    className="flex items-center gap-2 bg-primary px-6 py-2 rounded-xl text-white text-sm font-semibold shadow-md hover:bg-opacity-90 transition-all active:scale-95"
                    onClick={() => addCraft()}
                >
                    Add More
                </button>
                </>:<></>}
               
            </div>

              {isPaymentDue?<>
              <div className="mb-3">
                <p className="text-red-500">Payment Due : {datepipeModel.date(paymentDue?.dormant_date)}</p>
            </div>
            </>:<>
              <div className="mb-3">
                <BoxSooner 
                boxLength={membershipStatus.craftBox?.length}  
                nextBox={membershipStatus.nextBox} 
                nextPaymentDate={detail?.nextPaymentDate} 
                membershipStatus={membership?.status||detail?.membershipStatus}
                setNextBox={(e :any)=> setMembershipStatus((prev:any) => ({ ...prev, nextBox: e.next,nextDate:e.date }))}
                />
            </div>
            </>}


            <div className="bg-white shadow-md rounded-2xl p-3 md:p-6 border">
                <h3 className="font-bold mb-3">Card Details</h3>
                <div className="mb-3">
                    <CardDetails
                        userId={active}
                        detail={detail}
                        result={(e:any) => {
                            setMembershipStatus((prev:any) => ({ ...prev, cardDetail: e.value }))
                        }}
                    />
                </div>
            </div>


            <div className="text-right flex gap-3 mt-3 justify-end">
                <button type="button" className="inline-flex items-center gap-2 bg-primary px-6 py-2 rounded-lg text-white text-sm font-medium shadow hover:bg-opacity-90 transition-all"
                    onClick={() => {
                        takePaymentSubmit('onetime')
                    }}
                >Pay ${pipeModel.number(totalPayment)} Now</button>
                {/* <button type="button" className="inline-flex items-center gap-2 bg-primary px-6 py-2 rounded-lg text-white text-sm font-medium shadow hover:bg-opacity-90 transition-all"
                    onClick={() => {
                        takePaymentSubmit('recurring')
                    }}
                >Turn OFF Recurring</button> */}
            </div>
        </div>
    </>
}