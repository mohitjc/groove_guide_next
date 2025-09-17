import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Tab } from "@headlessui/react";
import { TbMessageStar } from "react-icons/tb";
import { RootState } from "@/redux/store";
import ApiClientB from "@/utils/Apiclient";
import speechModel from "@/utils/speech.model";
import TooltipHtml from "../TooltipHtml";
import FormControl from "../FormControl";
import SpeachToText from "./SpeachToText";
import ImageHtml from "../ImageHtml";
import { useRouter } from "next/navigation";
import { loaderHtml, noImg } from "@/utils/shared";
import Product from "./Product";
import SlickSlider from "../SlickSlider";

const dietaryList = ["glutenFree", 'nutFree', 'dairyFree', 'vegan']

type ProductLabelProps = {
  product: any;
  pProduct: any;
  onImageClick: (_: any) => void;
}

const ProductLabel = ({ product, pProduct, onImageClick = () => { } }: ProductLabelProps) => {
  if (!product) return <></>

  const flavourClick = (f: any) => {
    const payload: any = {
      flavourId: f.id,
      ingredients: f.ingredient,
      description: f.description,
      image: f.image,
      images: f.image ? [f.image] : []
    }

    dietaryList?.map(itm => {
      payload[itm] = f.dietary?.includes(itm)
    })
    onImageClick({
      ...product,
      ...payload,
    })
  }

  return <>
    <div className="mt-2 shadow-lg bg-white rounded-xl">
      {/* <div className="flex justify-between imagesline">
          <div>
            <img src="../assets/img/line.png" className="h-16" alt=""/>
          </div>
          <div className="rotate-180">
        
            <img src="../assets/img/line.png" className="h-16" alt=""/>
          </div>
      </div> */}
      <div className="px-4 lg:px-6 py-6">
        <div className="sm:flex gap-4  justify-between mb-2">
          <p className="text-primary font-bold lg:text-md mb-1 lg:mb-0 2xl:text-3xl text-xl">GROOVE<span className="text-black lg:text-md 2xl:text-3xl text-xl uppercase"> {pProduct?.category_detail?.name}</span></p>
          <div className="lg:text-right">
            <h5 className="uppercase text-md lg:text-lg 2xl:text-3xl">{pProduct?.name}</h5>
            {/* <p className="text-sm lg:text-xl text-primary">{product.slogan}</p> */}
          </div>
        </div>

        <div className="border-4 border-primary py-2 rounded-xl">


          <div className={`grid sm:grid-cols-${!product?.suggestedUse && !product?.ingredients && !product?.statements ? 1 : 2} items-start gap-4`}>
            <div className="flex flex-col  gap-2">

              <div className="block lg:hidden">
                {product?.flavour?.length ? <>
                  <div className="lefts_dats">
                    <p className="font-bold lg:text-lg text-md xl:text-2xl text-neutral-800 tracking-wide pl-3">Flavor(s):</p>
                    <div className="flex flex-wrap gap-2 pl-3 mt-2">
                      {product?.flavour?.map((item: any, i: any) => <span key={i} onClick={() => flavourClick(item)} className={`capitalize inline-block rounded-lg py-1 px-2 cursor-pointer ${product?.flavourId == item.id ? 'bg-primary text-white' : 'bg-gray-200 text-black'}  text-[12px]`}>{item.name}</span>)}
                    </div>
                  </div>
                </> : <></>}

                {product?.strainData ? <>
                  <div className="lefts_dats">
                    <p className="font-bold lg:text-lg text-md xl:text-2xl text-neutral-800 tracking-wide pl-3">Infused By:</p>
                    <div className="flex-col gap-2 pl-3">
                      <p className="">
                        <span className="!font-regular">{product?.strainData?.name || product?.strainData}</span>
                      </p>
                    </div>
                  </div>
                </> : <></>}


              </div>


              {product?.flavour?.length ? <>
                <div className="lefts_dats hidden lg:block">
                  <p className="font-bold lg:text-lg text-md xl:text-2xl text-neutral-800 tracking-wide pl-3">Flavor(s):</p>
                  <div className="flex flex-wrap gap-2 pl-3 mt-2">
                    {product?.flavour?.map((item: any, i: any) => <span key={i} onClick={() => flavourClick(item)} className={`capitalize inline-block rounded-lg py-1 px-2 cursor-pointer ${product?.flavourId == item.id ? 'bg-primary text-white' : 'bg-gray-200 text-black'}  text-[12px]`}>{item.name}</span>)}
                  </div>
                </div>
              </> : <></>}


              {product?.servingSize || product?.servingperContainer ? <>
                <div className="lefts_dats">
                  <p className="font-bold lg:text-lg text-md xl:text-2xl text-neutral-800 tracking-wide pl-3">Supplement Facts:</p>
                  <div className="flex-col gap-2 pl-3">
                    {product?.servingSize ? <>
                      <p className="font-normal text-[#626262]">Serving Size {product?.servingSize != '1.2 Oz' ? '1' : ''} {product?.servingSize}</p>
                    </> : <></>}
                    {product?.servingperContainer ? <>
                      <p className="font-normal text-[#626262]">Serving Per Container {product?.servingperContainer}</p>
                    </> : <></>}
                  </div>
                </div>
              </> : <></>}

              {Number(product?.totalTheraContent || 0) || Number(product?.perTheraContent || 0) ? <>
                <div className="lefts_dats">
                  <p className="font-bold lg:text-lg text-md xl:text-2xl border-t-4 border-primary pb-2 py-1 text-neutral-800 tracking-wide pl-3">Therapeutic Content</p>
                  <div className="flex-col gap-2 pl-3">
                    <p className="font-normal text-[#000] italic">
                      <span className="font-semibold">{Number(product?.totalTheraContent || 0) * 1000}</span>mg
                      ({product?.totalTheraContent || 0}g) total per container.</p>
                    <p className="font-normal text-[#000] italic">
                      <span className="font-semibold">{Number(product?.perTheraContent || 0) * 1000}</span>mg
                      ({product?.perTheraContent || 0}g) total per serving.</p>
                  </div>
                </div>
              </> : <></>}


              {Number(product?.totalFuncContent || 0) || Number(product?.perFuncContent || 0) ? <>
                <div className="lefts_dats">
                  <p className="font-bold lg:text-lg text-md xl:text-2xl border-t-4 border-primary pb-2 py-1 text-neutral-800 tracking-wide pl-3">Functional Content</p>
                  <div className="flex-col gap-2 pl-3">
                    <p className="font-normal text-[#626262] italic">
                      <span className="font-semibold">{Number(product?.totalFuncContent || 0) * 1000}</span>mg
                      ({product?.totalFuncContent || 0}g) total per container.</p>
                    <p className="font-normal text-[#626262] italic">
                      <span className="font-semibold">{Number(product?.perFuncContent || 0) * 1000}</span>mg
                      ({product?.perFuncContent || 0}g) total per serving.</p>
                  </div>
                </div>
              </> : <></>}







            </div>

            <div className="flex flex-col pl-3   gap-2">


              {product?.strainData ? <>
                <div className="lefts_dats hidden lg:block">
                  <p className="font-bold lg:text-lg text-md xl:text-2xl text-neutral-800 tracking-wide ">Infused By:</p>
                  <div className="flex-col gap-2">
                    {product?.strainData && <p className="">
                      <span className="!font-regular">{product?.strainData?.name || product?.strainData}</span>
                    </p>}
                  </div>
                </div>
              </> : <></>}


              {product?.ingredients ? <>
                <div className="lefts_dats hidden lg:block">
                  <p className="font-bold lg:text-lg text-xl text-neutral-800 tracking-wide">Ingredients:</p>
                  <p className="font-normal text-[#626262]">{product?.ingredients || '--'}</p>
                </div>
              </> : <></>}



              <div className="lefts_dats">
                {product?.statements ? <>
                  <p className="font-bold lg:text-lg text-xl text-neutral-800 tracking-wide">100% Natural | Non-GMO</p>
                  <div className="border-2 border-black p-2 mb-2 mt-2">
                    <p className="text-center">{product?.statements || '--'}
                    </p>
                  </div>
                </> : <></>}

              </div>

              {product?.suggestedUse ? <>
                <div className="lefts_dats">
                  <p className="font-bold lg:text-lg text-xl text-neutral-800 tracking-wide border-t-4 lg:border-0 border-primary">Suggested Use:</p>
                  <p className="font-normal text-[#626262]">{product?.suggestedUse || '--'}</p>
                </div>
              </> : <></>}



              <div className="lefts_dats mt-2">
                <p className="font-normal  text-[#000]">*These Statements have not been evaluated by the Food and Drug Administration. This products is not intended to diagnose, treat, cure, or prevent any disease. </p>
              </div>



            </div>


          </div>

        </div>


        <div className="flex mt-2 items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
          <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>

          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium text-sm"></span> Keep Out of Reach of Children.
          </div>
        </div>




        {product?.ingredients ? <>
          <div className="lefts_dats block lg:hidden">
            <p className="font-bold lg:text-lg text-xl text-neutral-800 tracking-wide">Ingredients:</p>
            <p className="font-normal text-[#626262]">{product?.ingredients || '--'}</p>
          </div>
        </> : <></>}



        <div className="flex gap-2 lg:gap-6 flex-wrap mt-4">
          {product?.vegan ? <>
            <img src="/assets/img/vegan.png" className="h-12 md:h-16 " title="Vegan" alt="vegan" />
          </> : <></>}
          {product?.dairyFree ? <>
            <img src="/assets/img/dairyfree.png" className="h-16  md:h-20" title="Dairy Free" alt="dairyfree" />
          </> : <></>}
          {product?.glutenFree ? <>
            <img src="/assets/img/glutenfree.png" className="h-16  md:h-20" title="Gluten Free" alt="glutenfree" />
          </> : <></>}
          {product?.nutFree ? <>
            <img src="/assets/img/nutfree.png" className="h-16  md:h-20" title="Peanut Free" alt="peanutfree" />
          </> : <></>}

        </div>




        <div className="md:flex hidden  gap-4 mt-1 justify-end">
          {/* <div className="barcode mt-2 w-full">
            <div className="flex items-end gap-2">
              <img src="../assets/img/barcode.png" alt="" className="lg:h-12 h-28 w-full  object-cover" />
              <p className="font-bold text-xl">{pipeModel.currency(product?.price)}</p>
            </div>
            <div className="text-center">
              <p className="font-bold lg:text-md text-xl">123456789452465</p>
              <p className="text-normal italic lg:text-sm text-md">Find your groove with natural mushroom therapy</p>
            </div>
          </div> */}

          {/* <div className="barcode shrink-0 text-right">
            <div className="">
              <p className="text-primary lg:text-lg text-xl">Explore. Reflect. Connect. </p>
            </div>
            <div className="flex  justify-end gap-2">
                <div className="text-right">
                  <p className="lg:text-md text-lg text-primary font-medium">Scan for your </p>
                  <p className="lg:text-lg text-xl text-primary font-bold">GROOVE GUIDE:</p>
                </div>
                <img src={methodModel.noImg(product?.qr_image)} alt="" className="lg:h-24 h-40  object-contain" />
            </div>
          
            
          </div> */}



        </div>

      </div>
      {/* <div className="flex justify-between imagesline">
          <div>
            <img src="../assets/img/line.png" className="h-16" alt=""/>
          </div>
          <div className="rotate-180">
        
            <img src="../assets/img/line.png" className="h-16" alt=""/>
          </div>
      </div> */}
    </div>
  </>
}

type ProductDetailProps = {
  id: string;
  isModal?: boolean;
  dietary?: any;
}

export default function ProductDetail({ id, isModal = false, dietary = {} }: ProductDetailProps) {
  const user: any = useSelector((state: RootState) => state.user.data);
  const { get, post, put } = ApiClientB()
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter()
  const history = (p = '') => {
    router.push(p)
  }
  const [product, setProduct] = useState<any>();
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [tags, setTags] = useState([]);
  const [reviewForm, setReviewForm] = useState<{ personal_notes: string, tags: any[], other: string, privacy: boolean }>({
    personal_notes: "",
    tags: [],
    other: '',
    privacy: false,
  });
  const [images, setImages] = useState<string[]>([]);
  const [selectedVariant, setSelectedVariant] = useState();
  const [speachStart, setSpeachStart] = useState(false);

  const theraTag = tags?.filter((itm: any) => itm.type == 'Therapeutic Use') || []
  const fucTag = tags.filter((itm: any) => itm.type != 'Therapeutic Use') || []

  const getProductDetail = () => {
    loaderHtml(true)
    get("product/detail", { slug: id, user_id: user?._id }).then(
      (res) => {
        loaderHtml(false)
        if (res.success) {
          const data = res.data
          if (!data.id) data.id = data._id
          // data.quantity_type=data.servingSize
          // data.quantity=data.servingperContainer
          data.sub_products = data.sub_products.map((itm: any, i: any) => {
            itm.id = itm.randomId || String(i)
            itm.images = itm.images || data.images
            itm.flavour = itm.flavour?.filter((itm: any) => itm.status != 'deactive')
            // itm.quantity_type=itm.servingSize
            // itm.quantity=itm.servingperContainer
            return itm
          }).filter((itm: any) => (itm.status != 'inacive' || itm.status != 'deactive'))

          data.flavour = data?.flavour?.filter((itm: any) => itm.status != 'deactive')


          let payload: any = {}
          if (data?.flavour?.length) {
            let f = data?.flavour[0]
            const ext = data?.flavour.find((item: any) => {
              let value = true
              Object.keys(dietary).map(key => {
                if (dietary[key] && !item.dietary?.includes(key)) {
                  value = false
                }
              })
              return value
            })
            if (ext) f = ext


            payload = {
              flavourId: f.id,
              ingredients: f.ingredient,
              description: f.description,
              image: f.image,
              images: f.image ? [f.image] : []
            }
            dietaryList?.map(itm => {
              payload[itm] = f.dietary?.includes(itm)
            })
          }

          const variant = {
            ...data,
            ...payload,
          }

          setSelectedVariant(variant)
          setProduct(data);
          setImages(variant.image ? variant.images : data.images);
          post('menuAccess/page', {
            page: 'menu-product',
            userId: user.id || user._id,
            categoryId: data.category,
            productId: data._id
          }).then(res => { })

          get('tag/list', { sortBy: 'name asc', status: 'active', type: res.data.product_type || '' }).then(res => {
            if (res.success) {
              setTags(res?.data);
            }
          })
        }
      }
    );
  };

  const getProductReviews = (type?: string) => {
    let _type = "positive";
    if (type == "negative") {
      _type = "negative";
    }

    get("product/reviews-counts", { id: product?.id, type: _type }).then(
      (res) => {
        if (res.success) {
          setProductReviews(res.data);
        }
      }
    );
  };

  const handleSubmitReview = () => {
    let payload;
    setSubmitted(true);
    if ((reviewForm.tags?.find((itm: any) => itm.id == 'other') && !reviewForm.other)) return
    if (reviewForm.tags?.length > 0) {
      payload = {
        ...reviewForm,
        product_id: product.id,
      };

      payload.tags = payload.tags.filter((itm: any) => itm.id != 'other')

      loaderHtml(true)

      if (product?.isReviewd) {
        put("review/update", payload).then((res) => {
          if (res.success) {
            toast.success("Experience updated successfully.");
            getProductDetail();
            getProductReviews();
            history('/myjournal')
            // document.getElementById('allExpTab')?.click()
          } else {
            loaderHtml(false)
          }
        });
      } else
        post("review/add", payload).then((res) => {
          if (res.success) {
            toast.success("Experience submitted successfully.");
            getProductDetail();
            getProductReviews();
            history('/myjournal')
            // document.getElementById('allExpTab')?.click()
          } else {
            loaderHtml(false)
          }
        });
    }
  };

  const handleFavClick = (id: string) => {
    post("fav/add-remove", { product_id: id }).then((res) => {
      if (res.success) {
        // toast.success(res.message);
      }
    });
  };

  const handleTagClick = (id: string) => {
    let arr: any[] = reviewForm.tags || []
    const ext = arr.find((itm: any) => itm.id == id)
    if (ext) arr = arr.filter(itm => itm.id != id)
    else arr.push({ id: id, value: true })
    setReviewForm(prev => ({
      ...prev,
      tags: arr
    }));
  };

  useEffect(() => {
    if (id) {
      getProductDetail();
    }
  }, [id]);


  useEffect(() => {
    if (product) {
      getProductReviews();
      get('review/own', { user_id: user._id, product_id: product?.id }).then(res => {
        if (res.success) {
          const data = res.data?.[0]
          if (data) {
            setReviewForm({
              personal_notes: data.personal_notes,
              tags: data.tags.map((itm: any) => ({ id: itm?.tag_detail?._id, value: true })) || [],
              privacy: data.privacy ? true : false,
              other: data.other
            })
          }
        }
      })
    }
  }, [product]);



  const handleImageClick = (itm: any) => {
    setSelectedVariant(itm)
    setImages((itm?.images?.length ? itm?.images : '') || itm.image || product?.images);
  };

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }

  const shareExp = () => {
    // history(`/myjournal?product=${id}`)
    document.getElementById('myProTab')?.click()
  }

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

    recognition.onresult = async (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join("\n");

      const el: any = document.getElementById("voicemessage");

      let message = reviewForm.personal_notes;

      message = `${message}\n${transcript}`;
      setReviewForm({
        ...reviewForm,
        personal_notes: message,
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


  const categoryName = product?.category_detail?.name?.trim()?.toLowerCase()

  let sub_products = product?.sub_products || []
  if (product) {
    sub_products = [
      {
        ...product,
        id: product?.id || product?._id
      },
      ...sub_products
    ].map(itm => {
      let order = 2;

      if (categoryName == 'dried' && itm.gram == '3.5') {
        order = 1
      }

      return {
        ...itm,
        order: order
      }
    }).sort((a, b) => {
      return a.order - b.order
    })
  }

  return <>
    <div className="pt-[20px] md:pt-[40px] lg:pt-[50px] xl:pt-[60px]  px-2 lg:px-10">
      <div className="grid grid-cols-12 gap-4 ">
        {product && (
          <div className="col-span-12 lg:col-span-7 2xl:col-span-6">
            <SlickSlider
              images={images}
              isLoggedIn={user?.loggedIn}
              isFav={product.isFav}
              onFavClick={() => {
                handleFavClick(id);
              }}
            />
            <div>
              {!isModal ? <>
                <ProductLabel product={selectedVariant} pProduct={product} onImageClick={handleImageClick} />
              </> : <></>}
            </div>
          </div>
        )}

        {product && (
          <Product
            product={product}
            sub_products={sub_products}
            tags={product?.product_tags}
            selectedVariant={selectedVariant}
            onImageClick={handleImageClick}
          />
        )}

      </div>
    </div>
    {isModal ? <>
      <ProductLabel product={selectedVariant} pProduct={product} onImageClick={handleImageClick} />
    </> : <></>}



    <div className="pt-[20px] md:pt-[40px] lg:pt-[50px] xl:pt-[60px]  px-2 lg:px-10">
      <div className="">
        <div className="tabs_styles">
          <Tab.Group>
            <div className="w-full bg-[#3A3A3A] px-4 py-4 md:py-6 md:px-6 rounded-t-3xl">
              <Tab.List className="flex gap-6 text-white  text-[14px] lg:text-[22px]">
                <Tab
                  id="allExpTab"
                  className={({ selected }) =>
                    classNames(
                      "border-r border-white/40 pr-6 focus:outline-none",
                      "",
                      selected ? "text-[#fff] font-semibold " : "text-gray-300 font-normal"
                    )
                  }
                >
                  Experience Insights
                </Tab>
                <Tab
                  id="myProTab"
                  className={({ selected }) =>
                    classNames(
                      " focus:outline-none",
                      "",
                      selected ? "text-[#fff] font-semibold " : "text-gray-300 font-normal"
                    )
                  }
                >
                  My Experience
                </Tab>
              </Tab.List>
            </div>
            <Tab.Panels className="bg-[#F8F8F8] px-4 py-4 md:py-10 md:px-8">
              <Tab.Panel>
                <div className="">
                  <div className="text-right mb-3">
                    <button className="btn-primary text-sm rounded-xl lg:text-lg px-3 py-2 lg:px-5 lg:py-3" onClick={() => shareExp()}>Share My Experience</button>
                  </div>

                  <div className="grphs_data  border-b-8 border-black/26 overflow-hidden mt-10 lg:mx-10  xl:mx-20 overflow-x-auto">
                    {productReviews?.length == 0 && (
                      <div className="text-center h-[300px] flex items-center justify-center">
                        <div className="flex flex-col gap-6">
                          <img
                            src="/assets/img/noproducts.png"
                            alt=""
                            className="h-36 mx-auto"
                          />
                          <p className="text-gray-400 text-[18px] font-regular">
                            No Experiences.
                          </p>
                        </div>
                      </div>
                    )}
                    {productReviews && productReviews?.length > 0 && (
                      <div className="flex justify-start gap-4 h-[450px] md:h-[500px]">
                        {productReviews?.map((item) => {
                          const tag = item?.tag_detail;
                          // if(!item.tag_detail&&item.other)tag={name:'Other'}
                          if (tag)
                            return (
                              <>
                                <div className="flex flex-col items-center justify-end slidetop">
                                  <div>




                                    <ImageHtml
                                      height={48}
                                      width={48}
                                      alt={tag.name}
                                      src={noImg(tag.image, '/assets/img/s1.png')}
                                      className="h-12 w-12 md:h-20 md:w-20 mx-auto rounded-full object-contain mb-1"
                                    />
                                    <TooltipHtml title={<span style={{ textTransform: 'capitalize' }}>{tag.name}</span>}>

                                      <p className=" line-clamp-1	capitalize w-20 text-center">
                                        {tag.name}
                                      </p>
                                    </TooltipHtml>
                                  </div>
                                  <div
                                    className={`bg-[${tag.color || "#00cbca"
                                      }] w-[70px]  h-full flex items-end justify-center relative`}
                                  >

                                    {/* <div className=" flex items-center justify-center bg-white  w-[50px] h-[50px] rounded-[5px] absolute top-3">
                                   <p className="text-[10px] md:text-[15px] lg:text-[20px] xl:text-[30px] text-[#ec5a63] text-center font-[600]  leading-[0px]">
                                      {item?.count}
                                    </p>
                                   </div> */}
                                    <div className="px-1 h-full py-2">

                                      <TooltipHtml title="Total Review">
                                        <div className="bg-white flex  items-center justify-center rounded-[4px]  mb-3 ">
                                          <div className="flex flex-col gap-1 py-1  items-center  ">
                                            <TbMessageStar className="w-[20px] h-[20px] mx-auto" />


                                            <span className="text-xs  text-center  relative px-1">Total </span>
                                            <span className="block bg-gray-400 w-full h-[1px] relative"></span>
                                            <span className="text-[#00be5f] text-[20px] font-[600] ">  {item?.count}</span>
                                          </div>
                                        </div>
                                      </TooltipHtml>




                                      {item.validateTrue ? <>
                                        <TooltipHtml title="Verified">
                                          <div className="bg-white flex  items-center justify-center rounded-[4px]  mb-3 ">
                                            <div className="flex flex-col gap-1 py-1  items-center  ">
                                              <img
                                                src="/assets/img/veri.png"
                                                className="w-[20px] h-[20px] mx-auto"
                                              />
                                              <span className="text-xs  text-center  relative px-1">Verified </span>
                                              <span className="block bg-gray-400 w-full h-[1px] relative"></span>
                                              <span className="text-[#00be5f] text-[20px] font-[600] ">  {item.validateTrue}</span>
                                            </div>
                                          </div>
                                        </TooltipHtml>
                                      </> : <></>}




                                      {item.validateFalse ? <>

                                        <TooltipHtml title="Un-verified">
                                          <div className="bg-white flex  items-center justify-center rounded-[4px]  mb-3 ">
                                            <div className="flex flex-col gap-1 py-1  items-center  ">
                                              <img
                                                src="/assets/img/inveri.png"
                                                className="w-[20px] h-[20px] mx-auto"
                                              />
                                              <span className="text-xs  text-center  relative px-1">Unverified </span>
                                              <span className="block bg-gray-400 w-full h-[1px] relative"></span>
                                              <span className="text-[#00be5f] text-[20px] font-[600] ">  {item.validateFalse}</span>
                                            </div>
                                          </div>
                                        </TooltipHtml>



                                      </> : <></>}


                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="">
                  <h4 className="font-semibold text-[16px] lg:text-[35px]">
                    Pick one or more Experiences that reflect your use.
                  </h4>

                  <div className="mt-5 md:mt-8">

                    {theraTag?.length ? <>
                      <h6 className="font-semibold text-[15px] mb-4">Top Experiences</h6>
                      <div className="imagses_co grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {theraTag.map((itm: any, index) => {
                          return (
                            <>
                              <input
                                type="checkbox"
                                id={`coin${index}`}
                                className="hidden"
                                checked={reviewForm.tags.find(ritm => ritm.id == itm.id) ? true : false}
                              />
                              <label
                                className="flex items-center gap-4 cursor-pointer"
                                htmlFor={`coin${index}`}
                                onClick={() => handleTagClick(itm.id)}
                              >
                                <ImageHtml
                                  height={48}
                                  width={48}
                                  alt={itm.name}
                                  src={noImg(itm.image)}
                                  className="h-10 w-10 lg:h-16 lg:w-16 object-cover rounded-full"
                                />
                                {itm.name}
                              </label>
                            </>
                          );
                        })}
                      </div>
                    </> : <></>}

                    {fucTag?.length ? <>
                      <h6 className="font-semibold text-[15px] mb-4 mt-4">Health Benefits</h6>
                      <div className="imagses_co grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {fucTag.map((itm: any, index) => {
                          return (
                            <>
                              <input
                                type="checkbox"
                                id={`coin${index}`}
                                className="hidden"
                                checked={reviewForm.tags.find(ritm => ritm.id == itm.id) ? true : false}
                              />
                              <label
                                className="flex items-center gap-4 cursor-pointer"
                                htmlFor={`coin${index}`}
                                onClick={() => handleTagClick(itm.id)}
                              >
                                <ImageHtml
                                  height={48}
                                  width={48}
                                  alt={itm.name}
                                  src={noImg(itm.image)}
                                  className="h-10 w-10 lg:h-16 lg:w-16 object-cover rounded-full"
                                />
                                {itm.name}
                              </label>
                            </>
                          );
                        })}
                      </div>
                    </> : <></>}
                    <div className="imagses_co grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4">
                      <input
                        type="checkbox"
                        id={`coin_other`}
                        className="hidden"
                        checked={reviewForm.tags.find(ritm => ritm.id == 'other') ? true : false}
                      />
                      <label
                        className="flex items-center gap-4 cursor-pointer"
                        htmlFor={`coin_other`}
                        onClick={() => handleTagClick('other')}
                      >
                        <ImageHtml
                          height={48}
                          width={48}
                          alt={'Other'}
                          src={noImg('', '/assets/img/s1.png')}
                          className="h-10 w-10 lg:h-16 lg:w-16 object-cover rounded-full"
                        />
                        Other
                      </label>
                    </div>


                    {submitted && reviewForm.tags?.length == 0 && (
                      <div className="text-danger text-sm small mt-2">
                        Please select the tag to submit.
                      </div>
                    )}

                    {reviewForm.tags?.length && reviewForm.tags?.find(itm => itm.id == 'other') ? <>
                      <div className="mt-4">
                        <h5 className="text-[14px] font-regular mb-3">
                          Other
                        </h5>
                        <FormControl
                          onChange={(e: any) => {
                            setReviewForm(prev => ({
                              ...prev,
                              other: e,
                            }));
                          }}
                          id="voiceInput"
                          value={reviewForm.other || ''}
                          required
                        />
                      </div>

                      {submitted && !reviewForm.other && reviewForm?.tags?.length && reviewForm?.tags?.find(itm => itm.id == 'other') ? (
                        <div className="text-danger text-sm small mt-2">
                          Other is required
                        </div>
                      ) : <></>}

                      <div className="flex justify-end mt-3">
                        <SpeachToText
                          text={reviewForm.other}
                          inputId="voiceInput"
                          setText={e => {
                            setReviewForm(prev => ({
                              ...prev,
                              other: e,
                            }));
                          }}
                        />
                      </div>

                    </> : <></>}






                    <div className="mt-4">
                      <h5 className="text-[14px] font-regular mb-3">
                        Personal Notes
                      </h5>

                      <textarea
                        value={reviewForm.personal_notes}
                        onChange={(e) => {
                          setReviewForm({
                            ...reviewForm,
                            personal_notes: e.target.value,
                          });
                        }}
                        id="voicemessage"
                        placeholder="Write comments....."
                        className="h-36 p-4 w-full rounded-[21px] border-[0.21px] border-black/50 bg-white"
                      ></textarea>
                      {/* {submitted && !reviewForm.personal_notes && (
                        <div className="text-danger small mt-1 capitalize">
                          please write comments.
                        </div>
                      )} */}

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={voice}
                          className={`btn btn-outline-dark px-3 mb-3 btnmi ${speachStart ? "glowing" : ""
                            }`}
                          id="voiceBtn"
                        >
                          <i className="fa fa-microphone mr-1"></i> Type
                          or Speak
                        </button>
                      </div>
                    </div>

                    {/* <div>
                                  <p className="mb-2 text-[16px] font-semibold">
                                    Public/Private
                                  </p>

                                  <label className="inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      value=""
                                      className="sr-only peer"
                                      checked={reviewForm.privacy}
                                      onChange={(e) =>
                                        setReviewForm({
                                          ...reviewForm,
                                          privacy: e.target.checked,
                                        })
                                      }
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#540C0F]"></div>
                                  </label>
                                </div> */}

                    <div className="flex justify-end mt-6">
                      <button
                        // disabled={reviewForm.tags?.length == 0}
                        className={`lg:px-8 px-4 py-3 rounded-xl text-white bg-primary `}
                        onClick={handleSubmitReview}
                      >
                        Share Experience
                      </button>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  </>
}