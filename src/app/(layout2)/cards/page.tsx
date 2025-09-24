"use client";

import { useSelector } from "react-redux";
import CardDetails from "@/components/CardDetails";
import { useEffect, useRef, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import { getRandomCode } from "@/utils/shared";
import {  loaderHtml } from "@/utils/shared";
import Modal from "@/components/Modal";
import EditAddress from "@/components/EditAddress";

export default function Cards() {
    const user = useSelector((state:any) => state.user?.data)
    const [membershipStatus, setMembershipStatus] = useState<any>();
    const [membership, setMembership] = useState<any>();
    const [showEditAddress, setShowEditAddress] = useState('');
    const detail=user
    const [, setPrimaryCard] = useState();
    const {get,put}=ApiClientB()
    const active = (user?._id || user?.id)

    const getCardDetails = () => {
        get('orders/cardDetails', { userId: active }).then(res => {
            if (res.success) {
                const data = res.data.map((itm:any) => ({
                    ...itm,
                    _id: itm.token,
                    isPrimary:
                        JSON.parse(itm.isPrimary || "false") || itm.default || false,
                }));
                const ext = data.find((itm:any) => itm.isPrimary);
                setPrimaryCard(ext)
            }
        })
    }

    useEffect(() => {
        getCardDetails();
    }, []);

    const apiRef = useRef({
        membership: { current: null },
        detail: { current: null },
    });
    const {
        get: getMembership,
        isLoading: membershipLoading,
        controller: membershipController,
    } = ApiClientB(apiRef.current.membership);

    const getMembershipDetail = () => {
        getMembership("membership/detail", { user_id: active }).then((res) => {
            if (res.success) {
                const data = res.data;
                data.box_preference = data.box_preference?.replaceAll("N/A", "") || "";
                data.shippingStatus =
                    data.shippingStatus
                        ?.toLowerCase()
                        ?.replaceAll(" ", "_")
                        ?.replaceAll("n/a", "") || "";

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

                craft_box = craft_box.map((itm:any) => ({ ...itm, shippingStatus: itm.shippingStatus.toLowerCase()?.replaceAll(' ', '_') }))

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
        if (e.event == 'submit') {
            const payload = {
                user_id: active,
                ...e.data
            }
            loaderHtml(true)
            put('membership/edit', payload).then(res => {
                if (res.success) {
                    setMembership((prev:any) => ({ ...prev, ...payload }))
                    setShowEditAddress('')
                }
            }).finally(() => {
                loaderHtml(false)
            })
        }
    }





    return <>
        <div>
            <div className="relative">
                <h1 className="text-3xl font-medium">Card on File</h1>

                <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {membershipLoading ? (
                            <>
                                <div className="shine h-[150px] rounded-xl"></div>
                                <div className="shine h-[150px] rounded-xl"></div>
                                <div className="shine h-[150px] rounded-xl"></div>
                            </>
                        ) : (
                            <>
                                {/* Mailing Address */}
                                <div className="bg-white border rounded-xl p-4 shadow-sm space-y-2">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <span className="material-symbols-outlined text-primary">location_on</span>
                                        <h4 className="text-sm font-semibold">Mailing Address</h4>
                                        <span
                                            className="material-symbols-outlined text-[20px] text-primary cursor-pointer ml-auto"
                                            onClick={() => setShowEditAddress('primary')}
                                        >
                                            edit
                                        </span>
                                    </div>
                                    {membership?.primary_address_1 ? (
                                        <div className="text-xs text-gray-600 space-y-1">
                                            <p>{membership?.primary_address_1}</p>
                                            <p>{membership?.primary_city}, {membership?.primary_state}, {membership?.primary_country}, {membership?.primary_postcode}</p>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-red-500">No Address</p>
                                    )}
                                </div>

                                {/* Billing Address */}
                                <div className="bg-white border rounded-xl p-4 shadow-sm space-y-2">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <span className="material-symbols-outlined text-primary">location_on</span>
                                        <h4 className="text-sm font-semibold">Billing Address</h4>
                                        {!detail?.isDeleted && (
                                            <span
                                                className="material-symbols-outlined text-[20px] text-primary cursor-pointer ml-auto"
                                                onClick={() => setShowEditAddress('billing')}
                                            >
                                                edit
                                            </span>
                                        )}
                                    </div>
                                    {membership?.billing_address_1 ? (
                                        <div className="text-xs text-gray-600 space-y-1">
                                            <p>{membership?.billing_address_1}</p>
                                            <p>{membership?.billing_city}, {membership?.billing_state}, {membership?.billing_country}, {membership?.billing_postcode}</p>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-red-500">No Address</p>
                                    )}
                                </div>

                                {/* Shipping Address */}
                                <div className="bg-white border rounded-xl p-4 shadow-sm space-y-2">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <span className="material-symbols-outlined text-primary">location_on</span>
                                        <h4 className="text-sm font-semibold">Shipping Address</h4>
                                        {!detail?.isDeleted && (
                                            <span
                                                className="material-symbols-outlined text-[20px] text-primary cursor-pointer ml-auto"
                                                onClick={() => setShowEditAddress('shipping')}
                                            >
                                                edit
                                            </span>
                                        )}
                                    </div>
                                    {membership?.shipping_address_1 ? (
                                        <div className="text-xs text-gray-600 space-y-1">
                                            <p>{membership?.shipping_address_1}</p>
                                            <p>{membership?.shipping_city}, {membership?.shipping_state}, {membership?.shipping_country}, {membership?.shipping_postcode}</p>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-red-500">No Address</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                </div>

            </div>

            {showEditAddress ? <>
                <Modal
                    title={`Update ${showEditAddress} Address`}
                    body={<>
                        <EditAddress atype={showEditAddress} membership={membership} result={updateAddress} />
                    </>}
                    result={e => {
                        setShowEditAddress('')
                    }}
                />
            </> : <></>}

            <div className="flex flex-col gap-2 mt-10 ">
                <h5 className="font-bold mb-3">Payments Detail</h5>
                <div className="">
                    <CardDetails
                        userId={user?._id || user?.id}
                        detail={user}
                        result={() => {
                        }}
                    />
                </div>

            </div>

        </div>
    </>
}