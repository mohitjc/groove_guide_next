'use client'
import { useEffect, useRef } from "react";
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { loaderHtml, noImg } from "@/utils/shared";
import ApiClientB from "@/utils/Apiclient";
import FormControl from "../../../components/FormControl";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import moment from "moment";
import { Tab } from "@headlessui/react";
import speechModel from "@/utils/speech.model";
import NewQR from "../../../components/myjournal/NewQr";
import { useSelector } from "react-redux";
import DateRangePicker from "../../../components/myjournal/DateRangePicker";
import Table from "../../../components/Table";
import { MdClose } from "react-icons/md";
import Modal from "@/components/Modal";
import { useParams } from 'next/navigation'
import methodModel from "@/utils/methodModel";
import Image from "next/image";


function classNames(...classes:any) {
  return classes.filter(Boolean).join(" ");
}


  type myJou={
    images:any;
    comment:any;
    product:any;
    createdAt:any;
    seeNote:any;
  }


type listHtml={
    row:any;
    itemProps:any;
}
  
const MyJournal = ({ images, comment, product, createdAt ,seeNote}:myJou) => {
  const time = moment(createdAt).format("dddd, MMMM YYYY");
  const date = moment(createdAt).format("DD");
  const history=useRouter()

  // const maxLength = 25;
  // const truncatedText =
  //   comment?.length > maxLength
  //     ? comment?.slice(0, maxLength) + "..."
  //     : comment;

      const view=()=>{
        if(product.product_slug){
          history.push(`/product-detail/${product.product_slug}`)
        }
      }

  return (
    <>
       <div className="border-[0.23px] group bg-white border-black p-4 rounded-[33px] lg:p-6 shadow-lg cursor-pointer hover:border-[#a1282f]  transform transition-transform duration-300 ease-in-out hover:scale-105">
          <div className="mb-4">
            <h3 className="font-semibold text-[27px]" onClick={()=>view()}>{date}</h3>
            <p className="font-light text-[12px]" onClick={()=>view()}>{time}</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="drop-shadow-xl  lg:h-32 lg:w-32 xl:h-40 xl:w-40 shrink-0">
              {images && images?.length > 0 && (
                <Image
                src={images
                  ? noImg(images[0])
                  : "../assets/img/mush2.png"}
                onClick={() => view()}
                width={20}
                 height={20}
                className="  h-full w-full object-contain rounded-[38px] custom_shadow_small bg-gray-200 " alt={""}                />
              )}
            </div>

            <div className="pl-2 w-full">
              <h3 className="font-semibold text-[19px]" onClick={()=>view()}>{product?.name}</h3>
              {/* <p className="font-light text-[13px] mt-2 break-normal	">
                {!showFullText ? truncatedText : comment}
              </p> */}
              {comment?<>
                <span className="text-primary" onClick={()=>seeNote(comment)}>See Personal Notes</span>
              </>:<></>}
     
            </div>
          </div>

          {/* {comment && comment?.length > maxLength && (
            <div className="flex justify-end mt-2">
              <span
                to={`/myjournal/${product._id}`}
                className="shrink-0 text-[#540C0F] font-medium text-[14px] cursor-pointer"
              >
                Read More
              </span>
            </div>
          )} */}
        </div>
    </>
  );
};

const ListHtml=({row,itemProps}:listHtml)=>{
    return <>
    <MyJournal
                    product={{...row?.product_detail,_id:row.product_id}}
                    comment={row?.personal_notes}
                    createdAt={row.tags[0]?.createdAt}
                    images={row?.product_detail?.images}
                    seeNote={itemProps.setPersonalNote}
                  />
    </>
}

function Index() {
  const user = useSelector((state:any) => state.user?.data);
  const query = useParams().product;
  const history = useRouter();
  const [journals, setMyJournals] = useState([]);
  const [total, setTotal] = useState(0);
  const [personalNote, setPersonalNote] = useState('');
  const [loading, setLoader] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // const [product, setProduct] = useState();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubcategory] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [productTags, setProductTags] = useState([]);
  const [reviewTags, setReviewTags] = useState<any>([]);
  const [filters, setFilter] = useState({startDate:'',endDate:'',page:1,count:12});
  const [speachStart, setSpeachStart] = useState(false);
  // const privacyOptions = [
  //   { id: "public", name: "Public" },
  //   { id: "private", name: "Private" },
  // ];

  const theraTag=productTags?.filter((itm:any)=>itm.type=='Therapeutic Use')||[]
  const fucTag=productTags.filter((itm:any)=>itm.type!='Therapeutic Use')||[]
  const apiRef=useRef({
    product:{current:null},
    tags:{current:null},
    productDetail:{current:null},
    category:{current:null}
  })

  const {get,post}=ApiClientB()
  const {get:getProduct,isLoading:isProductLoading,controller:productController}=ApiClientB(apiRef.current.product)
  const {get:getTags,controller:tagsController}=ApiClientB(apiRef.current.tags)
  const {get:getProductDetail,controller:productDetailController}=ApiClientB(apiRef.current.productDetail)
  const {get:getCategory,isLoading:isCategoryLoading,controller:catetgoryController}=ApiClientB(apiRef.current.category)

  const [isOpen, setIsOpen] = useState(false);
  const [form, setform] = useState<any>({
    id: "",
    category: "",
    sub_category: "",
    product_id: "",
    comment: "",
    privacy: false,
  });

  const formValidation = [
    // {
    //   key: "category",
    //   required: true,
    //   message: "category is required",
    // },
    { key: "product_id", required: true },
    // { key: "comment", required: true },
  ];

  function closeModal() {
    setIsOpen(false);
    setSubmitted(false);
    setform({
      id: "",
      category: "",
      sub_category: "",
      product_id: "",
      comment: "",
    });
    setReviewTags([])
    setProductTags([])
  }

  function openModal() {
    setIsOpen(true);
  }

  const getProductDetails = () => {
    loaderHtml(true)
    if(productDetailController) productDetailController.abort()
    getProductDetail("product/detail", {
      id: query,
    }).then((res) => {
      loaderHtml(false)
      if (res.success) {
        // setProduct(res?.data);
        openModal();
        setform({
          ...form,
          category: res.data?.category?._id||res.data?.category,
          sub_category:res.data?.sub_category?._id||res.data?.sub_category,
          product_id: res.data?._id,
          product_slug:res.data?.product_slug
        });
      }
    });
  };

  const getProductTags = () => {
    loaderHtml(true)
    if(tagsController) tagsController.abort()
    getTags("product/detail", {
      id: form?.product_id,
    }).then((res) => {
      if (res.success) {
       get('tag/list',{sortBy:'name asc',status:'active',type:res.data.product_type||''}).then(res=>{
          loaderHtml(false)
          if(res.success){
            setProductTags(res?.data);
          }
        })
      }else{
        loaderHtml(false)
      }
    });
  };

  const getCategories = (p = {}) => {
    const f = {
      ...p,
      type: "product",
      category_type: "master",
      status:'active'
    };
   get("category/listing", f).then((res) => {
      if (res.success) {
        const _options = res?.data?.map(({ id, name }:any) => {
          return { id: id, name: name };
        });
        setCategoryOptions(_options);
      }
    });
  };

  const getSubCategories = (p = {}) => {
    const f = {
      ...p,
      type: "product",
      status:'active',
      parent_category:''
    };
    if (form.category) {
      f.parent_category = form.category;
    }
    if(catetgoryController) catetgoryController.abort()
    getCategory("category/listing", f).then((res) => {
      if (res.success) {
        const options = res?.data?.map(({ id, name }:any) => {
          return { id: id, name: name };
        });
        setSubcategory(options);
      }
    });
  };

  const getProductsList = () => {
    const f = {
      category:form.category||'',
      sub_category: form.sub_category||'',
      status:'active'
    };
    if(productController) productController.abort()
    getProduct("product/listing", f).then((res) => {
      if (res.success) {
        const options = res?.data?.map(({ id, name,product_slug }:any) => {
          return { id: id, name: name,product_slug };
        });
        setProductOptions(options);
      }
    });
  };

  const handleTagClick = (id:any) => {
    let arr:any=reviewTags||[]
    const ext=arr.find((itm:any)=>itm.id==id)
    if(ext)arr=arr.filter((itm:any)=>itm.id!=id)
    else arr.push({ id: id, value: true})

    setReviewTags([...arr]);
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (form.category) {
      getSubCategories();
    }
  }, [form.category]);

  useEffect(() => {
    getProductsList();
  }, [form.category, form.sub_category]);

  useEffect(() => {
    if (query) {
      getProductDetails();
    }
  }, [query]);

  useEffect(() => {
    if (form.product_id) getProductTags();
  }, [form.product_id]);


  const handleSubmit = (e:any) => {
    e.preventDefault();
    setSubmitted(true);
    const invalid = methodModel.getFormError(formValidation, form);

    if (invalid || reviewTags?.length == 0) return;
    let payload;
    if (reviewTags) {
      payload = {
        product_id: form.product_id,
        tags: reviewTags,
        personal_notes: form.comment,
        privacy:form.privacy
      };
    }


    const slug=form?.product_slug||''

    loaderHtml(true);
    post("review/add", payload).then((res) => {
      loaderHtml(false);
      if (res.success) {
        const hasOnboarding = user?.primary_interest?true:false;

        post('menuAccess/page',{
          page:'share-experience',
          userId:user?.id||user?._id,
          categoryId:form.category,
          productId:form.product_id
        }).then(res=>{ })

        if(query){
          if(!hasOnboarding){
            history.push('/getstarted')
          }else{
            history.push(`/product-detail/${slug}`)
            // history.push(`/myjournal`)
          }
        }else{
          // history.push(`/myjournal`)
          history.push(`/product-detail/${slug}`)
        }

        toast.success("Experience added successfully.");
        closeModal();
        getJournalsList();
      }
    });
  
  };

  

  const getJournalsList = (p={}) => {
    setLoader(true)
    get("review/own", { ...filters,...p,user_id: user?._id }).then((res) => {
      setLoader(false)
      if (res.success) {
        setMyJournals(res.data);
        setTotal(res.total)
      }
    });
  };

  const filter=(p={})=>{
    setFilter({
      ...filters,
      ...p
    })
    getJournalsList(p)
  }

  const clear=()=>{
    const p={
      startDate:'',
      endDate:''
    }
    filter(p)
  }

  useEffect(() => {
    console.log(user,'useruser');
    
    if (user){
      getJournalsList();
    }
  }, []);

  const stop = () => {
    const recognition = speechModel.recognition;
    recognition.stop();
    setSpeachStart(false);
  };

  const voice = () => {
    const voiceBtn = document.getElementById("voiceBtn");
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

      const el:any = document.getElementById("voicemessage");

      let message = form.comment;

      message = `${message}\n${transcript}`;
      setform({
        ...form,
        comment: message,
      });
      
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

  return (
    <>
      <Breadcrumb
        links={[{ link: "/", name: "Home" }]}
        currentPage={"My Experiences"}
      />
      <div className="pt-[30px] md:pt-[50px] lg:pt-[70px] xl:pt-[100px] px-4 lg:px-10 2xl:px-16">
      <div className="flex  flex-wrap justify-between gap-4">

          <h4 className="font-semibold text-[30px] lg:text-[35px]">
            My Experiences
          </h4>

          <div className="flex items-center gap-4">
           
          <button
            className="lg:px-8 px-4 py-3 bg-[#540C0F] rounded-xl flex items-center gap-1 text-white"
            onClick={openModal}
          >
           Share Your Experience
          </button>
         
          
          </div>
         
        </div>

        <div className="flex items-center gap-4 mt-4">
        <DateRangePicker
              value={{
                startDate:filters.startDate,
                endDate:filters.endDate
              }}
              onChange={e=>{
                filter({
                  startDate:e.startDate,
                  endDate:e.endDate,
                  page:1
                })
              }}

                dynamicStyle={false}
  className=""
  disabled={false}
  title=""
  placeholder=""
  isCompare={false}
  showcustom={true}
  showRange={true}
            />
        {filters.startDate||filters.endDate?<>
            <button
            className="lg:px-8 px-4 py-3 bg-neutral-700 flex items-center gap-1 text-white"
            onClick={()=>clear()}
          >
            <MdClose/> Clear
          </button>
          </>:<></>}
        </div>

        {loading?<>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6 md:mb-8 lg:mb-10 xl:mb-20 mt-4">
                  <div className="shine-loaderHtml h-60"></div>
                  <div className="shine-loaderHtml h-60"></div>
                  <div className="shine-loaderHtml h-60"></div>
                  <div className="shine-loaderHtml h-60"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6 md:mb-8 lg:mb-10 xl:mb-20">
                  <div className="shine-loaderHtml h-60"></div>
                  <div className="shine-loaderHtml h-60"></div>
                  <div className="shine-loaderHtml h-60"></div>
                  <div className="shine-loaderHtml h-60"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6 md:mb-8 lg:mb-10 xl:mb-20">
                  <div className="shine-loaderHtml h-60"></div>
                  <div className="shine-loaderHtml h-60"></div>
                  <div className="shine-loaderHtml h-60"></div>
                  <div className="shine-loaderHtml h-60"></div>
                </div>
        </>:<>
        <Table
          rowClass="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-14 gap-4 md:gap-6 lg:gap-8 xl:gap-10"
          ListHtml={ListHtml}
          data={journals}
          total={total}
          page={filters.page}
          count={filters.count}
          itemProps={
            {
              setPersonalNote:setPersonalNote
            }
          }
          nodata={<>
          <div className="col-span-12 text-center h-[300px] flex items-center justify-center">
              <div className="flex flex-col gap-6">
                <Image
                width={20}
                 height={20}
                  src="/assets/img/noproducts.png"
                  alt=""
                  className="h-36 mx-auto"
                />
                <p className="text-gray-400 text-[18px] font-regular">
                  No Experiences.
                </p>
              </div>
            </div>
          </>}
          result={e=>{
            if(e.event=='page') filter({page:e.value})
          }}
         className = ""
         theme = "table"
         columns = {[]}
         topHead = {[]}

        />
        </>}

     

      </div>

{isOpen?<>
      <Modal 
      title="Experiences Share"
      body={<>
               <div className="tabs_styles">
                    <Tab.Group>
                      <div className="w-full bg-[#3a3a3a] rounded-xl py-3 px-4">
                        <Tab.List className="flex gap-2 text-white font-semibold text-[15px] lg:text-[18px]">
                          <Tab
                            className={({ selected }) =>
                              classNames(
                                "border-r border-white/40 pr-2 focus:outline-none",
                                "",
                                selected ? "text-white" : "text-[#d5d5d5]"
                              )
                            }
                          >
                            Manually
                          </Tab>
                          <Tab
                            onClick={() => {}}
                            className={({ selected }) =>
                              classNames(
                                " focus:outline-none",
                                "",
                                selected ? "text-white" : "text-[#d5d5d5]"
                              )
                            }
                          >
                             Scan Product QR Code
                          </Tab>
                        </Tab.List>
                      </div>
                      <Tab.Panels className=" pt-6 pb-6">
                        <Tab.Panel>
                          <form onSubmit={handleSubmit}>
                            <div className="mt-2">
                              <div className="col-span-12 md:col-span-6 mb-3">
                                <FormControl
                                  type="select"
                                  name="category"
                                  label="Category"
                                  value={form.category}
                                  onChange={(e:any) => {
                                    setform({
                                      ...form,
                                      category: e,
                                      sub_category: "",
                                      product_id: "",
                                    });
                                    setProductTags([]);
                                    setReviewTags([])
                                  }}
                                  options={categoryOptions}
                                  theme="search"
                                  // required
                                />
                                {/* {submitted && !form.category && (
                                  <div className="text-danger small mt-1 capitalize ">
                                    category is required.
                                  </div>
                                )} */}
                              </div>

                              {subCategoryOptions.length ? <>
                                <div className="col-span-12 md:col-span-6 mb-3">
                                  <FormControl
                                    type="select"
                                    name="sub_category"
                                    label="Sub category"
                                    value={form.sub_category}
                                    onChange={(e:any) =>
                                      setform({ ...form, sub_category: e })
                                    }
                                    options={subCategoryOptions}
                                    isLoading={isCategoryLoading}
                                    theme="search"
                                  />
                                </div>
                              </> : <></>}

                              <div className="col-span-12 md:col-span-6 mb-3">
                                <FormControl
                                  type="select"
                                  name="product_id"
                                  label="Product"
                                  value={form.product_id}
                                  onChange={(e:any) => {
                                    setform({ ...form, product_id: e.id,product_slug:e.product_slug});
                                    setProductTags([]);
                                  }}
                                  options={productOptions}
                                  theme="search"
                                  required
                                  valueType="object"
                                  isLoading={isProductLoading}
                                />
                                {submitted && !form.product_id && (
                                  <div className="text-danger small mt-1 capitalize">
                                    select the product first.
                                  </div>
                                )}
                              </div>

                              {form.product_id?<>
                                <div className="chos_modal">
                                <p className="font-semibold text-[15px] mb-4">
                                  Pick one or more Experiences that reflect your use
                                </p>

                                    {theraTag?.length ? <>
                                      <h6 className="font-semibold text-[15px] mb-4">Top Experiences</h6>

                                      <div className="imagses_co grid grid-cols-1 md:grid-cols-2 h-72 overflow-auto gap-4">
                                        {theraTag?.map((tag:any, index:any) => {
                                          return (
                                            <>
                                              <input
                                                type="checkbox"
                                                name="coin"
                                                id={`coin${index}`}
                                                checked={reviewTags.find((itm:any) => itm.id == tag.id) ? true : false}
                                                className="hidden"
                                              />
                                              <label
                                                className="flex items-center gap-2 cursor-pointer"
                                                htmlFor={`coin${index}`}
                                                onClick={() => {
                                                  handleTagClick(tag.id);
                                                }}
                                              >
                                                <Image
                                                  width={20}
                                                  height={20}     
                                                  src={methodModel.noImg(tag.image)}
                                                  className="h-16 w-16 object-cover rounded-full" alt={""}                                                />
                                                <div>{tag.name}</div>
                                              </label>
                                            </>
                                          );
                                        })}
                                      </div>
                                    </> : <></>}

                                    {fucTag?.length ? <>
                                      <h6 className="font-semibold text-[15px] mb-4 mt-4">Health Benefits</h6>

                                      <div className="imagses_co grid grid-cols-1 md:grid-cols-2 h-72 overflow-auto gap-4">
                                        {fucTag?.map((tag:any, index:any) => {
                                          return (
                                            <>
                                              <input
                                                type="checkbox"
                                                name="coin"
                                                id={`coin${index}`}
                                                checked={reviewTags.find((itm:any) => itm.id == tag.id) ? true : false}
                                                className="hidden"
                                              />
                                              <label
                                                className="flex items-center gap-2 cursor-pointer"
                                                htmlFor={`coin${index}`}
                                                onClick={() => {
                                                  handleTagClick(tag.id);
                                                }}
                                              >
                                                <Image
                                                  src={methodModel.noImg(tag.image)}
                                                  className="h-16 w-16 object-cover rounded-full" alt={""}   
                                                                  width={20}
                 height={20}                                             />
                                                <div>{tag.name}</div>
                                              </label>
                                            </>
                                          );
                                        })}
                                      </div>
                                    </> : <></>}

                                
                                {submitted && reviewTags?.length == 0 && (
                                  <div className="text-danger small mt-1 capitalize">
                                    Please select the tag to submit.
                                  </div>
                                )}
                              </div>
                              </>:<></>}

                           

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
                                    <i className="fa fa-microphone mr-1"></i> Type
                                    or Speak
                                  </button>
                                </div>
                              </div>

                              <div className="flex justify-end gap-2 flex-wrap mt-6">
                                {/* <div>
                                  <p className="mb-2 text-[16px] font-semibold">
                                    Public/Private
                                  </p>

                                  <label className="inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      value=""
                                      className="sr-only peer"
                                      checked={form.privacy}
                                      onChange={(e) =>
                                        setform({
                                          ...form,
                                          privacy: e.target.checked,
                                        })
                                      }
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#540C0F]"></div>
                                  </label>
                                </div> */}

                                <div className="btns flex items-center gap-2 shrink-0">
                                  <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-400 rounded-xl py-3 px-2 w-32 text-white text-[14px] font-medium"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="bg-[#263238] rounded-xl py-3 px-2 w-32 text-white text-[14px] font-medium"
                                  >
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </Tab.Panel>
                        <Tab.Panel>
                          <div className="text-center">
                           <div className="mb-2">
                           <div className="flex items-center p-4 mb-4 text-sm text-primary border border-primary rounded-lg bg-red-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800" role="alert">
                            <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                            </svg>
                            <span className="sr-only">Info</span>
                            <div>
                              <span className="font-medium"></span>  Scan QR printed on your product to create Experience.
                            </div>
                          </div>
                            
                            </div>
                            <NewQR />
                          </div>
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
      </>}
      result={()=>{
        closeModal()
      }}
      />
</>:<></>}

{personalNote?<>
  <Modal
    title="Personal Notes"
    body={<>
      <div dangerouslySetInnerHTML={{__html:personalNote}}></div>
    </>}
    result={()=>{
      setPersonalNote('')
    }}
    />
</>:<></>}
    
  
    </>
   
  );
}

export default Index;

