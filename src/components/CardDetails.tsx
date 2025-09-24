import { Fragment, useEffect, useMemo, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import Tabs from "./Tabs";
import FormControl from "@/components/FormControl";
import datepipeModel from "@/utils/datepipemodel";
import { FiTrash } from "react-icons/fi";
import { fire } from "@/components/Swal";

import { loaderHtml } from "@/utils/shared";
import { toast } from "react-toastify";
import Table from "./Table";
import TooltipHtml from "@/components/TooltipHtml";
import { billingAddress } from "@/utils/shared.utils";
import Image from "next/image";

const CardDetails = (({ userId, detail, result = () => {} }:any) => {
  const { get: getData, isLoading: loading,post,put } = ApiClientB();
  const [data, setData] = useState([]);
  const [tab, setTab] = useState("list");
  const [submitted, setSubmitted] = useState(false);
  const [view, setView] = useState("card");

  const [form, setForm] = useState({
    number: "",
    brand: "",
    cvv: "",
    exp_month: "",
    exp_year: "",
    validate:true,
    notCharge:false
  });

  const getCardDetail = () => {
    const f = {
      userId: userId,
    };
    getData("orders/cardDetails", f).then((res) => {
      if (res.success) {
        const data = res.data.map((itm:any) => ({
          ...itm,
          _id: itm.token,
          isPrimary:
            JSON.parse(itm.isPrimary || "false") || itm.default || false,
        }));
        const ext = data.find((itm:any) => itm.isPrimary);
        if (ext) {
          result({
            action: "primary",
            value: {
              number: String(ext.card_number),
              brand: ext.card_type,
              cvv: ext.card_cvv,
              exp_month: ext.exp_month,
              exp_year: ext.exp_year,
              token: ext.token,
              validate: true,
              notCharge: false,
            },
          });
        }
        setData(data);
      }
    });
  };

  useEffect(() => {
    getCardDetail();
  }, []);

  const addCard = () => {
    setSubmitted(true);
    let inavlid = false;

        const current=new Date()
        const current_month=current.getMonth()+1
        const current_year=current.getFullYear()

    if (
      !form.brand ||
      !form.number ||
      !form.cvv ||
      !form.exp_month ||
      !form.exp_year
    )
      inavlid = true;
    if (
      form.number?.length != 16 ||
      form.cvv?.length != 3 ||
      form.exp_year?.length != 4
    )
      inavlid = true;
    if (inavlid) return;


    if (new Date(`${form.exp_year}-${form.exp_month}-01`).getTime() < new Date(`${current_year}-${current_month}-01`).getTime()) {
      toast.error("This Card is expired")
      return
    }

    const payload = {
      email: detail?.email,
      userId: userId,
      card: {
        ...form,
        last4: form.number.slice(12, 16),
        first6: form.number.slice(0, 6),
      },
      membership: {
        billing_address_1: billingAddress.billing_address_1,
        billing_address_2: billingAddress.billing_address_2,
        billing_city: billingAddress.billing_city,
        billing_state: billingAddress.billing_state,
        billing_postcode: billingAddress.billing_postcode,
        billing_country: billingAddress.billing_country,
        user_id: userId,
      },
    };
    loaderHtml(true);
    post("Subscription/addCard", payload).then((res) => {
      loaderHtml(false);
      if (res.success) {
        loaderHtml(false);
        getCardDetail();
        setTab("list");
        result({ action: "add", value: payload.card });
      } else {
        if (res.error.code == 500) {
          // addCard()
        } else {
          loaderHtml(false);
          // toast.error(message);
        }
      }
    });
  };

  const cardOptions = [
    {
      id: "visa",
      name: "Visa",
    },
    {
      id: "mc",
      name: "Master Card",
    },
    {
      id: "amex",
      name: "American Express",
    },
    {
      id: "discover",
      name: "Discover",
    },
    {
      id: "diners_club",
      name: "Diners Club",
    },
    {
      id: "jcb",
      name: "JCB",
    },
  ];

  const months = useMemo(() => {
    const arr = datepipeModel.monthArray.map((itm:any) => ({
      ...itm,
      id: itm.id + 1,
    }));
    return arr;
  }, []);


  const setPrimary = (row:any) => {
    const payload = {
      user_id: userId,
      card_token: row.token,
      isPrimary: true,
    };
    loaderHtml(true);
    put("orders/setPrimaryCard", payload).then((res) => {
      loaderHtml(false);
      if (res.success) {
        getCardDetail();
      }
    });
  };

  const deleteCard = (itm:any) => {
    const ext = data.find((ditm:any) => ditm.validate) || data?.[0]
    const payload:any = {
      email: detail?.email,
      cardToken: itm.token,
      user_id: userId
    }

    if (data.length <= 1) {
      toast.error('At least one valid card must be on file. Please add another card before deleting this one.')
      return
    } else {
      payload.valid_card = ext
    }
    fire({
      title: "Do you want to delete this card?",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        loaderHtml(true);
        post("Subscription/deleteCard", payload).then((res) => {
          loaderHtml(false);
          if (res.success) {
            getCardDetail();
          }
        });
      }
    });
  };


  const primaryCard = useMemo(() => {
    const ext:any = data.find((itm:any) => itm.isPrimary)
    if (!ext) return null

    const card:any = {
      number: String(ext.card_number || ''),
      card_number:String(ext.card_number || ''),
      brand: ext.card_type,
      cvv: ext.card_cvv,
      exp_month: ext.exp_month,
      exp_year: ext.exp_year,
      token: ext.token,
      _id: ext.token,
      validate: true,
      notCharge: false,
    }
    return card
  }, [data])

  const columns = [
    {
      name: "Primary",
      render: (row:any) => {
        return (
          <>
            <label className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={row.isPrimary ? true : false}
                onChange={() => {}}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </label>
          </>
        );
      },
    },
    {
      name: "Type",
      render: (row:any) => {
        return <>{row.card_type}</>;
      },
    },
    {
      name: "Card Number",
      render: (row:any) => {
        return <>{row.card_number}</>;
      },
    },
    {
      name: "Expiry",
      render: (row:any) => {
        return (
          <>
            {row.exp_month}/{row.exp_year}
          </>
        );
      },
    },
    {
      name: "CVV",
      render: (row:any) => {
        return <>{row.card_cvv}</>;
      },
    },
    {
      name: "",
      render: (row:any) => {
        return (
          <>
            {!row.isPrimary && (
              <span
                onClick={() => deleteCard(row)}
                className={`material-symbols-outlined cursor-pointer`}
              >
                delete
              </span>
            )}
          </>
        );
      },
    },
  ];

 const tabChange=(e:any)=>{
        setTab(e)
        setForm({
            number: "",
            brand: "",
            cvv: "",
            exp_month: "",
            exp_year: "",
            validate: true,
            notCharge: false
        })
        setSubmitted(false)

        if (e == 'list') {
            result({
                action: 'primary', value: primaryCard
            })
        } else if (e == 'add') {
            result({
                action: 'primary', value: null
            })
        }
    }

  return (
    <>
      <Tabs
        active={tab}
        setActive={(e:any) => {
          tabChange(e)
        }}
        className="mb-3"
        list={[
          { id: "list", name: "Existing Card" },
          { id: "add", name: "New Card" },
        ]}
      />

      {tab == "list" ? (
        <>
          <div className="">
            <div className="flex gap-3 mb-3 items-center">
              <TooltipHtml title="List View">
                <div>
                  <span
                    onClick={() => setView("list")}
                    className={`material-symbols-outlined !text-[20px] cursor-pointer ${
                      view == "list" ? "text-primary" : ""
                    }`}
                  >
                    list
                  </span>
                </div>
              </TooltipHtml>
              <TooltipHtml title="Grid View">
                <div>
                  <span
                    onClick={() => setView("card")}
                    className={`material-symbols-outlined !text-[20px] cursor-pointer ${
                      view == "card" ? "text-primary" : ""
                    }`}
                  >
                    grid_view
                  </span>
                </div>
              </TooltipHtml>
            </div>

            {loading ? (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                  <div className="shine h-[200px]"></div>
                  <div className="shine h-[200px]"></div>
                </div>
              </>
            ) : (
              <>
                {view == "card" ? (
                  <>
                    <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-4">
                      {data?.map((itm:any, i) => {
                        return (
                          <Fragment key={i}>
                            <div className="cards_saveds">
                              <div className="">
                                <div
                                  className={`relative w-full h-[200px] rounded-[25px] bg-${
                                    itm.isPrimary ? "primary" : "gray-400"
                                  } backdrop-blur-[30px] border-[2px] border-white/10 overflow-hidden group`}
                                >
                                  <div className="absolute top-[20px] left-[20px] h-auto opacity-80">
                                    {itm?.isPrimary ? (
                                      <>
                                        <button
                                          disabled
                                          className="bg-white text-[12px] text-black px-[12px] py-1 rounded-lg"
                                        >
                                          Primary
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => setPrimary(itm)}
                                          className="bg-white text-[12px] text-black px-[12px] py-1 rounded-lg"
                                        >
                                          Set as Primary
                                        </button>
                                        <button
                                          title="Delete"
                                          onClick={() => deleteCard(itm)}
                                          className="bg-white text-[12px] ml-3 text-black px-[12px] py-1.5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                                        >
                                          <FiTrash />
                                        </button>
                                      </>
                                    )}
                                  </div>

                                  <div className="absolute top-[5px] right-[20px] w-[60px] h-auto opacity-80">
                                    <Image
                                    width={20} height={20}
                                      src={`/assets/img/cards/${itm?.card_type?.toLowerCase()}.png`}
                                      alt={itm.card_type}
                                    />
                                  </div>
                                  <div className="absolute top-[65px] left-[20px] w-[40px] h-auto opacity-80">
                                    <Image
                                    width={20} height={20}
                                      src="/assets/img/cards/chip.png"
                                      alt="chip"
                                    />
                                  </div>
                                  <div className="absolute left-[20px] bottom-[60px] text-white font-normal tracking-wider text-shadow-md">
                                    {String(itm.card_number || "").slice(0, 4)}{" "}
                                    {String(itm.card_number || "").slice(4, 8)}{" "}
                                    {String(itm.card_number || "").slice(8, 12)}{" "}
                                    {String(itm.card_number || "").slice(
                                      12,
                                      16
                                    )}
                                  </div>
                                  <div className="absolute capitalize left-[20px] bottom-[25px] text-white font-normal tracking-wider text-xs">
                                    {detail?.fullName}
                                  </div>
                                  <div className="absolute bottom-[25px] right-[110px] text-white font-normal tracking-wider text-xs">
                                    {itm.exp_month}/{itm.exp_year}
                                  </div>
                                  <div className="absolute bottom-[25px] right-[40px] text-white font-normal tracking-wider text-xs">
                                    {itm.card_cvv}
                                  </div>
                                  <div className="absolute bottom-[-250px] right-[-250px] h-[500px] w-[500px] rounded-full border-[50px] border-white/10 -z-10">
                                    <div className="absolute bottom-[-80px] right-[-110px] h-[600px] w-[600px] rounded-full border-[30px] border-white/10"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Fragment>
                        );
                      })}
                    </div>
                    {!data.length?<>
                    <div className="text-center">No Cards.</div>
                    </>:<></>}
                  </>
                ) : (
                  <>
                    <Table
                                                  className="mb-3"
                                                  data={data}
                                                  columns={columns}
                                                  total={data?.length}
                                                  nodata="No Cards." count={undefined} page={undefined} result={function (): void {
                                                      throw new Error("Function not implemented.");
                                                  } }                    />
                  </>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <></>
      )}

      {tab == "add" ? (
        <>
          <div className="">
            <div className="mt-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <FormControl
                    type="select"
                    label="Card Type"
                    value={form.brand}
                    onChange={(e:any) => {
                      setForm({ ...form, brand: e });
                    }}
                    options={cardOptions}
                    theme="search"
                    required
                  />
                  {submitted && !form.brand ? (
                    <div className="text-[red] text-[12px]">
                      Card Type is Required
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="col-span-12 md:col-span-6">
                  <FormControl
                    type="number"
                    label="Card Number"
                    value={form.number}
                    className="shadow-box"
                    onChange={(e:any) => {
                      setForm({ ...form, number: e });
                    }}
                    maxlength={16}
                  />
                  {submitted && !form.number ? (
                    <div className="text-[red] text-[12px]">
                      Card Number is Required
                    </div>
                  ) : (
                    <></>
                  )}
                  {submitted && form.number && form.number?.length != 16 ? (
                    <div className="text-[red] text-[12px]">
                      Card Number is Invalid
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="col-span-12 md:col-span-4">
                  <FormControl
                    type="number"
                    name="cvv"
                    label="CVV"
                    className="shadow-box"
                    value={form.cvv}
                    onChange={(e:any) => {
                      setForm({ ...form, cvv: e });
                    }}
                    maxlength={3}
                  />
                  {submitted && !form.cvv ? (
                    <div className="text-[red] text-[12px]">
                      CVV is Required
                    </div>
                  ) : (
                    <></>
                  )}
                  {submitted && form.cvv && form.cvv?.length != 3 ? (
                    <div className="text-[red] text-[12px]">CVV is Invalid</div>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="col-span-12 md:col-span-4">
                  <FormControl
                    type="select"
                    name="expiry"
                    label="Expiry Month"
                    theme="search"
                    placeholder="Expiry Month"
                    options={months}
                    value={form.exp_month}
                    onChange={(e:any) => {
                      setForm({ ...form, exp_month: e });
                    }}
                  />
                  {submitted && !form.exp_month ? (
                    <div className="text-[red] text-[12px]">
                      Expiry Month is Required
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="col-span-12 md:col-span-4">
                  <FormControl
                    type="number"
                    label="Expiry Year"
                    className="shadow-box"
                    placeholder="YYYY"
                    value={form.exp_year}
                    maxlength="4"
                    onChange={(e:any) => {
                      setForm({ ...form, exp_year: e });
                    }}
                  />
                  {submitted && !form.exp_year ? (
                    <div className="text-[red] text-[12px]">
                      Expiry Year is Required
                    </div>
                  ) : (
                    <></>
                  )}
                  {submitted && form.exp_year && form.exp_year?.length != 4 ? (
                    <div className="text-[red] text-[12px]">
                      Expiry Year is Invalid
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="text-right mt-3">
                <button
                  type="button"
                  onClick={() => addCard()}
                  className="bg-primary leading-10  mt-2 h-10 inline-flex items-center shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg gap-2"
                >
                  Add Card
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
});

export default CardDetails;
