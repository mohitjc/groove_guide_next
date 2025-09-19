import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation,  Grid } from "swiper/modules";
import ApiClientB from "@/utils/Apiclient";
import { scrollId } from "@/utils/shared";
import SingleProduct from "./SingleProduct";
import Link from "next/link";
import Image from "next/image";
function ProductsList({ title, products = [], isBox = false, setBoxes = () => { }, boxExclusive = false, link, onSuccess, seeMore = false, viewProduct, category_detail = null, categoryId = '', pfilter = {}, isSlider = false, productCount = 3 }: any) {
  const user = useSelector((state: any) => state.user)
  const {get,post,isLoading:apiLoading}=ApiClientB()
  const handleFavClick = (id: any) => {
    post("fav/add-remove", { product_id: id }).then((res) => {
      if (res.success) {
        onSuccess();
      }
    });
  };

  const [seeAll, setSeeAll] = useState(false)
  const [filters, setFilters] = useState({ page: 1, count: 8 })
  const [list, setList] = useState<any>([])
  const [total, setTotal] = useState(products?.length || 0)
  const [loader, setLoader] = useState(products?.length ? false : true)
  const [slider, setSlider] = useState(isSlider)
  const apiRef=useRef({
    list:{current:null}
  })
  const {get:getListApi,isLoading:loading,controller:controllerList}:any=ApiClientB(apiRef.current.list)

  const getList = () => {
    let arr = products || []
    if (categoryId) arr = list
    if (!seeAll && !isSlider) arr = arr?.slice(0, productCount) || []
    return arr
  }

  const filter = (p = {}, load = false) => {
    setFilters({ ...filters, ...p })
    getProducts(p, load)
  }

  const getProducts = (p = {}, load = false) => {
    const f = {
      ...pfilter,
      ...filters,
      ...p,
      category: categoryId,
      status: 'active',
      sortBy: 'name asc',
      user_id: (user._id || user.id || '')
    }

    if (!f.isBox) {
      delete f.isBox
      delete f.earlyRelease
    }
    if (f.isBox) {
      f.earlyRelease = true
    }
    if (boxExclusive) {
      f.boxExclusive = boxExclusive
    }

    if (isSlider) f.count = ''

    let url = 'product/home-search'
    if (f.recommended) url = 'product/recommended'

    if (load) setLoader(true)
    if(controllerList) controllerList.abort()
    getListApi(url, f).then((res:any) => {
      setLoader(false)
      if (res.success) {
        let data: any = res.data || []
        if (!load) {
          setSeeAll(true)
          data = [
            ...list,
            ...data
          ]
        }
        const monthBoxData = res?.data?.filter((item: any) => item?.isBox)
        setBoxes((prev: any) => ([...prev, ...monthBoxData]))
        setList([...data])
        setTotal(res.total)
      }
    })
  }


  const scrollCall = () => {
    const catId = localStorage.getItem('catId')
    if (catId) {
      const id = `categoryId_${catId}`
      const ext = scrollId(id)
      if (ext) {
        localStorage.removeItem('catId')
      }
    }
  }

  useEffect(() => {
    if (!loader) {
      setTimeout(() => {
        scrollCall()
      }, 100)
    }
  }, [loader])

  useEffect(() => {
    if (categoryId) {
      filter({ page: 1 }, true)
    }
  }, [])

  useEffect(() => {
    if (products.length) {
      setTotal(products.length)
    }
  }, [products])

  const loadMore = () => {
    let page = filters.page
    page = page + 1
    filter({ page: page })
  }

  const seeAllClick = () => {
    setSeeAll(!seeAll)

    if (isSlider) {
      setSlider(!slider)
    } else {
      if (seeAll) {

      } else {
        if (categoryId) filter({ count: '' })
      }
    }
  }



  return (
    <>
      {loader ? <>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${productCount} gap-4 mt-4`}>
          <div className="shine-loader h-60"></div>
          <div className="shine-loader h-60"></div>
          <div className="shine-loader h-60"></div>
        </div>
      </> : <>
        <div className="featured_items mb-6 md:mb-8 lg:mb-10">
          <div className="categoryId" id={`categoryId_${title.replaceAll(' ', '_')}`}></div>
          <div className="flex items-start flex-col mb-4 md:mb-6  lg:mb-8 ">
          {category_detail && (
                <span className="rounded-full text-xs bg-primary px-2 py-1.5 text-white flex items-center justify-center">
                  {category_detail.department === 'Health & Wellness' ? 'Functional/Medicinal' : 'Therapeutic'}
                </span>
              )}
            <h6 className="text-xl xl:text-4xl 2xl:text-5xl font-bold text-[#1B1B1F] tracking-[-2.24px]  capitalize">
              
              {title}
            </h6>

          </div>


          {total == 0 && (
            <div className="text-center">
                <Image
                  height={64}
                  width={64}
                  src="/assets/img/noproducts.png"
                  alt="no_data"
                  className="h-16 mx-auto"
                />
              <p className="text-gray-400 text-[18px] font-regular">
                No products.
              </p>
            </div>
          )}
          {total > 0 && (
            <>
              {slider ? <>
                <Swiper
                  slidesPerView={productCount}
                  // grid={{
                  //   rows: 1,
                  //   fill: 'row',
                  // }}
                  breakpoints={{
                    200: {
                      slidesPerView: 1,
                      spaceBetween: 10,

                    },

                    550: {
                      slidesPerView: 2, // 1 slide per view on screens smaller than 640px
                      // grid: {
                      //   rows: 1, // Optionally, reduce rows to 1 on mobile
                      // },
                    },

                    1250: {
                      slidesPerView: productCount, // 1 slide per view on screens smaller than 640px
                      // grid: {
                      //   rows: 1, // Optionally, reduce rows to 1 on mobile
                      // },
                    },


                  }}
                  autoplay={{
                    delay: 1000, // delay between slides in ms
                    disableOnInteraction: false,
                  }}
                  speed={1000} // transition speed in ms
                  navigation={true}
                  pagination={false}
                  spaceBetween={20}
                  // pagination={{
                  //   clickable: true,
                  // }}
                  modules={[Grid, Pagination, Navigation]}
                  className="gridstowslide forarrows"
                >
                  {getList()?.map((item: any, i: any) => {
                    return  <SwiperSlide key={i}>
                        <SingleProduct
                          isBox={isBox}
                          item={item}
                          viewProduct={(id: any) => viewProduct(id, title, { current: i, total: total, list: getList().map((itm: any) => itm.product_slug) })}
                          onClick={(id: any) => {
                            handleFavClick(id);
                          }}
                          filter={pfilter}
                        />
                      </SwiperSlide>
                  })}
                </Swiper>
              </> : <>
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${productCount} gap-6`}>
                  {getList().map((item: any, i: any) => {
                    return (
                      <SingleProduct
                        key={i}
                        isBox={isBox}
                        item={item}
                        viewProduct={(id: any) => viewProduct(id, title, { current: i, total: total, list: getList().map((itm: any) => itm.product_slug) })}
                        onClick={(id: any) => {
                          handleFavClick(id);
                        }}
                        filter={pfilter}
                      />
                    );
                  })}
                </div>
              </>}





              {loading && !products?.length ? <>
                <div className="text-center mt-3">
                  Loading... <i className="fa fa-spinner fa-spin"></i>
                </div>
              </> : <></>}


              {/* {getList()?.length<total&&categoryId&&!isSlider?<>
            <div className="text-center mt-3">
            <button onClick={()=>loadMore()} disabled={loading} className="bg-black px-3 text-[12px] lg:text-[16px] lg:px-10 py-2 text-white rounded">Load More {loading?<>
            <i className="fa fa-spinner fa-spin"></i>
            </>:<></>}
            </button>
          </div>
            </>:<></>} */}


            </>
          )}

          <div className="btn_see flex items-end justify-end mt-3">
            {total > productCount ? <>
              {seeMore ? <>
                <span onClick={() => seeAllClick()} className="text-[14px] flex gap-2 items-center cursor-pointer">
                  <span className="">
                    See {seeAll ? 'Less' : 'All'}
                  </span>
                  {!seeAll ? <>
                    <span className="material-symbols-outlined h-auto w-auto inline-block my-auto text-[16px]">keyboard_arrow_down</span>

                  </> : <>
                  <span className="material-symbols-outlined h-auto w-auto inline-block my-auto text-[16px]">keyboard_arrow_up</span>
                    {/* <span className="material-symbols-outlined h-auto w-auto inline-block my-auto text-[16px]">keyboard_arrow_up</span> */}
                  </>} {loading && !products?.length ? <>
                    <i className="fa fa-spinner fa-spin"></i>
                  </> : <></>}
                </span>
              </> : <>
                <Link href={link}>
                  <button className="bg-black px-3 text-[12px] lg:text-[16px] lg:px-10  py-2 text-white">
                    See All
                  </button>
                </Link>
              </>}

            </> : <></>}

          </div>


          {/* {total > productCount && seeMore && seeAll ? <>
            <div className="mt-3 text-center">
              <span onClick={() => seeAllClick()} className="text-[14px] inline-flex cursor-pointer">
                <span className="underline">
                  See {seeAll ? 'Less' : 'More'}
                </span>
                {!seeAll ? <>
                  <span className="material-symbols-outlined h-auto w-auto inline-block my-auto text-[16px]">keyboard_arrow_down</span>
                </> : <>
                  <span className="material-symbols-outlined h-auto w-auto inline-block my-auto text-[16px]">keyboard_arrow_up</span>
                </>} {loading ? <>
                  <i className="fa fa-spinner fa-spin"></i>
                </> : <></>}
              </span>
            </div>
          </> : <></>} */}


        </div>
      </>}

    </>
  );
}

export default ProductsList;
