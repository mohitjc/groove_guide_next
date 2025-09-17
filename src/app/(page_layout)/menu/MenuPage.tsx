'use client';

import {loaderHtml, noImg, replaceUrl } from "@/utils/shared";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Fragment, useEffect, useRef, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import ProductsList from "@/components/menu/ProductsList";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import 'swiper/css/grid';

import { Grid, Navigation, Pagination } from "swiper/modules";
import SingleProduct from "@/components/menu/SingleProduct";
import Modal from "@/components/Modal";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import MenuFilters from "@/components/menu/Filters";
import ProductDetail from "@/components/menu/ProductDetail";


type FilterType = {
  page?: number;
  count?: any;
  user_id?: any;
  search?: string;
  categories?: any[];
  primaryUse?: string;
  startPrice?: any;
  endPrice?: any;
  isBox?: boolean;
  sortBy?: string;
  status?: string;
  department?: string;
  earlyRelease?: boolean;
  boxExclusive?: boolean;
  category?: string;
  tags?: any[];
}

type ThisMonthType = {
  className?: string;
  title?: string;
  data?: any[];
  slideCount?: number;
  isSlider?: boolean;
  itemClick?: (_: any, __: any, ___: any) => void;
  handleFavClick?: (_: any) => void;
  priceRange?: {
    min?: any;
    max?: any;
  };
  isBox?: boolean;
}
const ThisMonthBox = ({ className = '', title = '', data = [], slideCount = 3, isSlider = false, itemClick = (_: any, __: any, ___: any) => { }, handleFavClick = (_: any) => { }, priceRange = { min: '', max: '' }, isBox = false }: ThisMonthType) => {
  const [seeAll, setSeeAll] = useState(false);
  const [slider, setSlider] = useState(isSlider)
  const seeAllClick = () => {
    setSeeAll(!seeAll)
    setSlider(!slider)
  }

  return <>
    <div>
      <div className={`pt-[30px] md:pt-[50px] lg:pt-[70px] xl:pt-[100px] px-4 lg:px-10 2xl:px-16 ${className}`} id={`info_content_${title.replaceAll(' ', '_')}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="">
            <h6 className="text-xl xl:text-4xl font-bold text-[#1B1B1F] capitalize">
              {title}
            </h6>
            {/* <p className=" text-black/60 mt-2">
                {categories &&
                  categories.map((itm) => {
                    const isActive = activeCategory === itm._id;
                    return (
                      <a
                        key={itm._id}
                        onClick={() => handleCategoryClick(itm._id)}
                        className={`mr-2 px-2 py-1 text-sm cursor-pointer ${
                          isActive ? "bg-red-500 text-white" : "bg-gray-100"
                        }`}
                      >
                        {itm.name}
                      </a>
                    );
                  })}
              </p> */}
          </div>
        </div>

        {slider ? <>
          <div>
            <Swiper
              slidesPerView={slideCount}
              breakpoints={{
                200: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },

                550: {
                  slidesPerView: 2,
                },

                1250: {
                  slidesPerView: slideCount,
                },


              }}
              autoplay={{
                delay: 1000,
                disableOnInteraction: false,
              }}
              speed={1000}
              navigation={true}
              pagination={false}
              spaceBetween={20}
              modules={[Grid, Pagination, Navigation]}
              className="gridstowslide forarrows"
            >
              {data.map((item: any, i) => {
                return <Fragment key={i}>
                  <SwiperSlide key={i}>
                    {!item?.product_slug ?
                      <div className={`imgtext hover:shadow-xl transition-transform duration-300 group`}>
                        <div className="overflow-hidden relative">
                          <Image
                            alt={item?.name}
                            src={noImg(item?.image)}
                            width={300}
                            height={250}
                            className={`w-full h-auto shadow-lg object-contain bg-[#a1282f24]`}
                          />
                        </div>
                        <div className="border border-gray-300 shadow-lg p-4 rounded-b-xl bg-white">
                          <div className="flex justify-between gap-2">
                            <span className="cursor-pointer">
                              <h6 className="text-[#2C2C2C] font-bold text-[15px] capitalize line-clamp-1">
                                {item?.name}
                              </h6>
                            </span>
                            <span className="shrink-0 cursor-pointer"></span>
                          </div>
                          <div className="coinsimg flex flex-wrap gap-3 mt-4"></div>
                        </div>
                      </div>
                      :
                      <SingleProduct
                        isBox={isBox}
                        item={item}
                        viewProduct={(id: any) => itemClick(id, item?.category_detail?.name, { current: i, total: data?.length, list: data?.map((item: any) => item?.product_slug) })}
                        onClick={(id: any) => {
                          handleFavClick(id);
                        }}
                        filter={{
                          startPrice: priceRange.min,
                          endPrice: priceRange.max,
                        }}
                      />
                    }

                  </SwiperSlide>
                </Fragment>
              })}
            </Swiper>
          </div>
        </> : <>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-${slideCount} gap-4 mt-10 lg:mt-8`}>
            {data && data?.length ? (
              data.map((item: any, i) => {

                return <>
                  {!item?.product_slug ?
                    <div className={`imgtext hover:shadow-xl transition-transform duration-300 group`}>
                      <div className="overflow-hidden relative">
                        <Image
                        height={250}
                        width={300}
                          alt={item?.name}
                          src={noImg(item?.image)}
                          className={`w-full  shadow-lg object-contain bg-[#a1282f24]`}
                        />
                      </div>
                      <div className="border border-gray-300 shadow-lg p-4 rounded-b-xl bg-white">
                        <div className="flex justify-between gap-2">
                          <span className="cursor-pointer">
                            <h6 className="text-[#2C2C2C] font-bold text-[15px] capitalize line-clamp-1">
                              {item?.name}
                            </h6>
                          </span>
                          <span className="shrink-0 cursor-pointer"></span>
                        </div>
                        <div className="coinsimg flex flex-wrap gap-3 mt-4"></div>
                      </div>
                    </div>
                    :
                    <SingleProduct
                      isBox={isBox}
                      item={item}
                      viewProduct={(id: any) => itemClick(id, item?.category_detail?.name, { current: i, total: data?.length, list: data?.map((item: any) => item?.product_slug) })}
                      onClick={(id: any) => {
                        handleFavClick(id);
                      }}
                      filter={{
                        startPrice: priceRange.min,
                        endPrice: priceRange.max,
                      }}
                    />
                  }
                </>

              })
            ) : (
              <p>No Products</p>
            )}
          </div>
        </>}

        {data.length > slideCount ? <>
          <span onClick={() => seeAllClick()} className="text-[14px] flex cursor-pointer justify-end mt-3">
            <span className="underline">
              See {seeAll ? 'Less' : 'All'}
            </span>
            {!seeAll ? <>
              <span className="material-symbols-outlined h-auto w-auto inline-block my-auto text-[16px]">keyboard_arrow_down</span>
            </> : <>
              <span className="material-symbols-outlined h-auto w-auto inline-block my-auto text-[16px]">keyboard_arrow_up</span>
            </>}
          </span>
        </> : <></>}
      </div>
    </div>
  </>
}

const Deals = ({ className = '', title = '', data = [], slideCount = 3, isSlider = false, itemClick = () => { } }) => {
  const [seeAll, setSeeAll] = useState(false);
  const [slider, setSlider] = useState(isSlider)
  const seeAllClick = () => {
    setSeeAll(!seeAll)
    setSlider(!slider)
  }

  return <>
    <div>
      <div className={`pt-[30px] md:pt-[50px] lg:pt-[70px] xl:pt-[100px] px-4 lg:px-10 2xl:px-16 ${className}`} id={`info_content_${title.replaceAll(' ', '_')}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="">
            <h6 className="text-xl xl:text-4xl font-bold text-[#1B1B1F] capitalize">
              {title}
            </h6>
          </div>
          <div className="view_all mt-4">
            {data.length > slideCount ? <>
              <span onClick={() => seeAllClick()} className="text-[14px] flex cursor-pointer ml-auto">
                <span className="underline">
                  See {seeAll ? 'Less' : 'All'}
                </span>
                {!seeAll ? <>
                  <span className="material-symbols-outlined h-auto w-auto inline-block my-auto text-[16px]">keyboard_arrow_down</span>
                </> : <>
                  <span className="material-symbols-outlined h-auto w-auto inline-block my-auto text-[16px]">keyboard_arrow_up</span>
                </>}
              </span>
            </> : <></>}
          </div>
        </div>

        {slider ? <>
          <div>
            <Swiper
              slidesPerView={slideCount}
              breakpoints={{
                200: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },

                550: {
                  slidesPerView: 2,
                },

                1250: {
                  slidesPerView: slideCount,
                },


              }}
              autoplay={{
                delay: 1000,
                disableOnInteraction: false,
              }}
              speed={1000}
              navigation={true}
              pagination={false}
              spaceBetween={20}
              modules={[Grid, Pagination, Navigation]}
              className="gridstowslide forarrows"
            >
              {data.map((item: any, i) => {
                return <Fragment key={i}>
                  <SwiperSlide key={i}>
                    <div className={`imgtext  hover:shadow-xl transition-transform duration-300 group`}>
                      <div className="overflow-hidden relative">

                        <Image
                        height={250}
                        width={300}
                          alt={item?.name}
                          src={noImg(item?.image)}
                          className={`w-full  shadow-lg object-contain bg-[#a1282f24] `}
                        />
                      </div>
                      <div className="border border-gray-300 shadow-lg p-4 rounded-b-xl bg-white">
                        <div className="flex justify-between gap-2">
                          <span className="cursor-pointer">
                            <h6 className="font-bold text-[18px] xl:text-[24px] text-[#181A2A] line-clamp-1 ">
                              {item?.name}
                            </h6>
                          </span>
                          <span className="shrink-0 cursor-pointer">
                            {/* <p className="text-[#2C2C2C] shrink-0 font-normal text-[12px] flex items-center gap-1 shrink-0 relative top-1">
                View Details
              </p> */}
                          </span>
                        </div>

                      </div>
                    </div>

                  </SwiperSlide>
                </Fragment>
              })}
            </Swiper>
          </div>
        </> : <>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-${slideCount} gap-4 mt-10 lg:mt-8`}>
            {data && data?.length ? (
              data.map((item: any, i) => {

                return <Fragment key={i}>
                  <div className={`imgtext  hover:shadow-xl transition-transform duration-300 group`}>
                    <div className="overflow-hidden relative">

                      <Image
                      height={250}
                      width={300}
                        alt={item?.name}
                        src={noImg(item?.image)}
                        className={`w-full  shadow-lg object-contain bg-[#a1282f24] `}
                      />
                    </div>
                    <div className="border border-gray-300 shadow-lg p-4 rounded-b-xl bg-white">
                      <div className="flex justify-between gap-2">
                        <span className="cursor-pointer">
                          <h6 className="font-bold text-[18px] xl:text-[24px] text-[#181A2A] line-clamp-1 	">
                            {item?.name}
                          </h6>
                        </span>
                        <span className="shrink-0 cursor-pointer">
                          {/* <p className="text-[#2C2C2C] shrink-0 font-normal text-[12px] flex items-center gap-1 shrink-0 relative top-1">
                View Details
              </p> */}
                        </span>
                      </div>

                    </div>
                  </div>
                </Fragment>
              })
            ) : (
              <p>No Data</p>
            )}
          </div>

          {data.length > slideCount ? <>
            <div className="mt-3 text-center">
              <span onClick={() => seeAllClick()} className="text-[14px] inline-flex cursor-pointer ml-auto">
                <span className="underline">
                  See {seeAll ? 'Less' : 'More'}
                </span>
                {!seeAll ? <>
                  <span className="material-symbols-outlined h-auto w-auto inline-block my-auto text-[16px]">keyboard_arrow_down</span>
                </> : <>
                  <span className="material-symbols-outlined h-auto w-auto inline-block my-auto text-[16px]">keyboard_arrow_up</span>
                </>}
              </span>
            </div>
          </> : <></>}
        </>}


      </div>
    </div>
  </>
}

function Discover() {
  const { productId } = useParams()
  const pathname = usePathname()||'/'
  const module1 = pathname.split('/')[1]
const router=useRouter()
  const   user: any = useSelector((state: RootState) => state.user.data);

  const query = useSearchParams();
  const prm = {
    category: query.get("category"),
    recommended: query.get("recommended"),
    reviewed: query.get("reviewed"),
    tag: query.get("tag"),
    searchQuery: query.get("searchQuery"),
    popular: query.get("popular"),
  };
  const history = (p = '') => {
    router.push(p)
  }
  const searchQuery = prm.searchQuery || ''

  const [SelectFilter, setSelectFilter] = useState(false)
  const [searchValue, setSearchValue] = useState(searchQuery)
  const [filters, setFilter] = useState<FilterType>({ categories: prm.category ? [prm.category] : [] })
  const [data, setData] = useState([]);
  const [tags, setTags] = useState<any[]>([]);
  const [grooves, setGrooves] = useState(false);
  const [categoryTypes, setCategoryTypes] = useState('');
  const [productModal, setProductModal] = useState<any>();
  const [productSlide, setProductSlide] = useState({ current: -1, list: [], total: 0 });
  const [recommended, setRecommeded] = useState([]);
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [boxes, setBoxes] = useState<any[]>([]);
  const [merch, setMerch] = useState([]);
  const [isBox, setIsBox] = useState(false);
  const [boxExclusive, setBoxExclusive] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: '',
    max: ''
  });
  const [dietaryKeys, setDietaryKeys] = useState({});


  const apiRef = useRef({
    list: { current: null },
    recommended: { current: null },
    box: { current: null },
    early: { current: null }
  })
  const { get: getListApi, isLoading: loading, controller: controllerList } = ApiClientB(apiRef.current.list)
  const { get: getListRecommended, isLoading: recommendedLoading, controller: controllerRecommended } = ApiClientB(apiRef.current.recommended)
  const { get: getBoxList, isLoading: boxLoading, controller: controllerBox } = ApiClientB(apiRef.current.box)
  const { get, post, isLoading: apiLoading } = ApiClientB()


  const getProductsList = (p = {}) => {
    const f = {
      ...filters,
      ...dietaryKeys,
      tag_ids: tags.toString(),
      user_id: (user?._id||user?.id),
      category: filters.categories?.toString(),
      sortBy: 'name asc',
      status: 'active',
      search: filters.search,
      department: filters.primaryUse?.toString(),
      ...p
    };
    if (priceRange.max || priceRange.min) {
      f.startPrice = priceRange.min
      f.endPrice = priceRange.max
    }
    if (isBox) {
      f.isBox = isBox
      f.earlyRelease = isBox
    }
    if (boxExclusive) {
      f.boxExclusive = boxExclusive
    }

    const url = "product/with-category";

    if (controllerList) controllerList.abort()
    getListApi(url, f).then((res) => {
      if (res.success) {
        setData(res.data);
      }
    });
  };

  const getRecommended = (p = {}) => {
    const f: FilterType = {
      page: 1,
      count: '',
      user_id: (user?._id||user?.id),
      // recommended: grooves&&selectedFilter,
      sortBy: 'name asc',
      status: 'active',
      search: filters.search,
      department: categoryTypes,
      // deals:selectedDeals.toString(),
      category: filters.categories?.toString(),
      ...dietaryKeys,
      ...p
    };

    if (priceRange.max || priceRange.min) {
      f.startPrice = priceRange.min
      f.endPrice = priceRange.max
    }

    const url = "product/recommended";

    if (controllerRecommended) controllerRecommended.abort()
    getListRecommended(url, f).then((res) => {
      if (res.success) {
        setRecommeded(res.data);
      }
    });
  };

  const getBox = (p = {}) => {
    if (controllerBox) controllerBox.abort()
    getBoxList("monthBox/list", { status: 'active', sortBy: 'order asc' }).then((res) => {
      if (res.success) {
        const filtered = res?.data;
        setBoxes(filtered);
      }
    });
  };

  const onSuccess = () => {
    getProductsList();
    getRecommended()
    getBox()
  };

  const handleTagSelect = (checked: boolean, id: string) => {
    setSelectFilter(true)
    if (checked) {
      setTags((prevValues) => [...prevValues, id]);
    } else {
      setTags((prevValues) => prevValues.filter((tagId) => tagId !== id));
    }
  };

  const [deals, setDeals] = useState([]);

  const getDeals = (p = {}) => {
    get("deal/list", { status: 'active' }).then((res) => {
      if (res.success) {
        const filtered = res?.data;
        setDeals(filtered.map(({ id, name, image }: any) => {
          return { id: id, name: name, image };
        }));
      }
    });
  };

  const getMerch = (p = {}) => {
    get("mech/listing", { status: 'active' }).then((res) => {
      if (res.success) {
        const filtered = res?.data;
        setMerch(filtered);
      }
    });
  };

  useEffect(() => {
    getProductsList();
    getBox();
    getRecommended();
  }, [tags, grooves, filters.categories, selectedDeals, categoryTypes, priceRange, isBox, filters.search, dietaryKeys, boxExclusive]);

  useEffect(() => {
    if (searchQuery && searchQuery != searchValue) {
      onSearchCick(searchQuery)
    }
    setSearchValue(searchQuery);
  }, [searchQuery]);

  const handleClearAll = () => {
    setSearchValue('')
    setTags([]);
    setGrooves(false)
    setCategoryTypes('')
    setSelectedDeals([])
    setPriceRange({
      min: '',
      max: ''
    })
    setFilter(prev => ({ ...prev, search: '', categories: [], primaryUse: '' }))
    history(`/${module1}`)
  };

  const viewProduct = (id: any, ref: any, extra: any) => {
    const catId = ref.replaceAll(' ', '_')
    setProductModal(id)
    setProductSlide({
      current: extra.current,
      list: extra.list,
      total: extra.total,
    })
    localStorage.setItem("catId", catId)
    replaceUrl({ url: `/${module1}/${id}` })
    // history(`/product-detail/${id}`)
  }

  useEffect(() => {
    if (user) {
      getRecommended()
      post('menuAccess/page', { page: 'menu', userId: (user?._id||user?.id) }).then(res => { })
    }
    getBox()
    getDeals()
    getMerch()
  }, [])

  const onSearchCick = (s = searchValue) => {
    setFilter({ ...filters, search: s })
  }

  const handleClearSearch = () => {
    setSearchValue('')
    setFilter({ ...filters, search: '' })
    getProductsList({ search: '' })
  }

  const onCategoryClick = (id: string) => {
    let arr = [...(filters.categories || [])]
    if (arr.includes(id)) {
      arr = arr.filter(itm => itm != id)
    } else {
      arr.push(id)
    }
    setFilter(prev => ({ ...prev, categories: arr }))
  }

  useEffect(() => {
    if (pathname == '/menu' && !user) {
      history('/')
    }
  }, [])

  useEffect(() => {
    setProductModal(productId)
  }, [productId])

  const prev = () => {
    const current = productSlide.current - 1
    const id = productSlide.list[current]
    if (id) {
      loaderHtml(true)
      setProductSlide(prev => ({ ...prev, current: current }))
      setProductModal(id)
      replaceUrl({ url: `/${module1}/${id}` })
    }
  }

  const next = () => {
    const current = productSlide.current + 1
    const id = productSlide.list[current]
    if (id) {
      loaderHtml(true)
      setProductSlide(prev => ({ ...prev, current: current }))
      setProductModal(id)
      replaceUrl({ url: `/${module1}/${id}` })
    }
  }

  const dietaryResult = (keys: any) => {
    setDietaryKeys(keys)
  }

  const handleFavClick = (id: string) => {
    post("fav/add-remove", { product_id: id }).then((res) => {
      if (res.success) {
        onSuccess();
      }
    });
  };

  const sortMonthBoxesData = () => {
    // Separate items with and without product_slug
    const thumbnails = boxes.filter(item => !item.product_slug);
    const products = boxes.filter(item => item.product_slug);
    // Sort both arrays by order key
    thumbnails.sort((a, b) => a.order - b.order);
    products.sort((a, b) => a.order - b.order);
    const combined = [...thumbnails, ...products];// Combine both arrays
    // Use a Set to filter out duplicates based on _id
    const uniqueItems = [];
    const seenIds = new Set();
    for (const item of combined) {
      if (!seenIds.has(item._id)) {
        seenIds.add(item._id);
        uniqueItems.push(item);
      }
    }
    return uniqueItems || []; // Return the unique data
  }

  const filterChange = (p: FilterType) => {
    setFilter(prev => ({ ...prev, ...p }))
    if (p?.tags) {
      setTags([...(p.tags || [])])
    }
  }

  return (
    <>
      <div className="pt-[20px] md:pt-[40px] lg:pt-[50px] xl:pt-[60px]  px-4 lg:px-10 2xl:px-16">

        <div className="recomended">

          {recommended.length ? <>

            <div className="text-xl xl:text-4xl font-bold text-[#1B1B1F]">
              <p>Recommended For You
              </p>
            </div>
            <ProductsList
              title=""
              products={recommended}
              seeMore={true}
              isSlider={true}
              pfilter={{
                search: searchValue,
                deals: selectedDeals.toString(),
                product_type: filters?.primaryUse?.toString(),
                startPrice: priceRange.min,
                endPrice: priceRange.max,
                isBox: isBox,
                boxExclusive: boxExclusive,
                ...dietaryKeys
              }}
              onSuccess={onSuccess}
              viewProduct={viewProduct}
            />
          </> : <></>}

        </div>

        <div className="grid-cols-12 grid gap-2 md:gap-6">
          <div className="col-span-12 md:col-span-4 lg:col-span-3 2xl:col-span-3">
            <MenuFilters
              dietaryResult={dietaryResult}
              dietaryKeys={dietaryKeys}
              isBox={isBox}
              filters={filters}
              setFilter={filterChange}
              setIsBox={setIsBox}
              boxExclusive={boxExclusive}
              setBoxExclusive={setBoxExclusive}
              page='discover'
              selectedDeals={selectedDeals}
              setSelectedDeals={setSelectedDeals}
              grooves={grooves}
              SelectFilter={SelectFilter}
              priceRangeData={priceRange}
              priceRangeChange={(e) => {
                setPriceRange({
                  max: e.max,
                  min: e.min,
                })
              }}
              setSelectFilter={setSelectFilter}
              setGrooves={setGrooves}
              showCategories={false}
              handleTagInputChange={(checked:any, type:any) => {
                handleTagSelect(checked, type);
              }}
              onClearAll={handleClearAll}
              onCategoryClick={onCategoryClick}
              categoryTypes={categoryTypes}
              setCategoryTypes={setCategoryTypes}
              onSearchCick={() => onSearchCick()}
              handleClearSearch={handleClearSearch}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              selectedTag={tags}
              className=""
            />
          </div>
          <div className="col-span-12 md:col-span-8 lg:col-span-9 2xl:col-span-9">
            <div>
              {loading ? <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6 md:mb-8 lg:mb-10 xl:mb-20">
                  <div className="shine-loader h-60"></div>
                  <div className="shine-loader h-60"></div>
                  <div className="shine-loader h-60"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6 md:mb-8 lg:mb-10 xl:mb-20">
                  <div className="shine-loader h-60"></div>
                  <div className="shine-loader h-60"></div>
                  <div className="shine-loader h-60"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6 md:mb-8 lg:mb-10 xl:mb-20">
                  <div className="shine-loader h-60"></div>
                  <div className="shine-loader h-60"></div>
                  <div className="shine-loader h-60"></div>
                  {/* <div className="shine-loader h-60"></div> */}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6 md:mb-8 lg:mb-10 xl:mb-20">
                  <div className="shine-loader h-60"></div>
                  <div className="shine-loader h-60"></div>
                  <div className="shine-loader h-60"></div>
                  {/* <div className="shine-loader h-60"></div> */}
                </div>
              </> : <>

                <div className="mb-6 md:mb-8 lg:mb-10 xl:mb-20">
                  {sortMonthBoxesData()?.length ? <>
                    <ThisMonthBox
                      data={sortMonthBoxesData()}
                      title="In this Month's Box"
                      className="!p-0"
                      isSlider
                      priceRange={priceRange}
                      isBox={isBox}
                      itemClick={viewProduct}
                      handleFavClick={handleFavClick}
                    />
                  </> : <></>}

                </div>


                <div className="mb-6 md:mb-8 lg:mb-10 xl:mb-20">
                  {deals.length ? <>
                    <Deals
                      title="Groove Deals"
                      data={deals}
                      className="!p-0"
                      isSlider
                    />
                  </> : <></>}
                </div>

                <div className="mb-6 md:mb-8 lg:mb-10 xl:mb-20">
                  {merch.length ? <>
                    <Deals
                      title="Merch"
                      data={merch}
                      className="!p-0"
                      isSlider
                    />
                  </> : <></>}
                </div>

                <div className="mb-6 md:mb-8 lg:mb-10 xl:mb-20">
                  {data?.map(({ category_detail, products }: any) => {
                    return <Fragment key={category_detail?._id}>
                      <ProductsList
                        category_detail={category_detail}
                        categoryId={category_detail?._id}
                        title={category_detail?.name}
                        boxExclusive={boxExclusive}
                        setBoxes={setBoxes}
                        isSlider={true}
                        link={`/products/list?category=${category_detail?._id}`}
                        seeMore={true}
                        pfilter={{
                          search: searchValue,
                          tag_ids: tags.toString(),
                          deals: selectedDeals.toString(),
                          product_type: filters?.primaryUse?.toString(),
                          startPrice: priceRange.min,
                          endPrice: priceRange.max,
                          isBox: isBox,
                          ...dietaryKeys
                        }}
                        onSuccess={onSuccess}
                        viewProduct={viewProduct}
                      />
                    </Fragment>
                  })}
                </div>
              </>}
            </div>
          </div>
        </div>
      </div>
      {productModal ? <>
        <Modal
          title="Product Detail"
          className="!max-w-full"
          body={<>

            {productSlide?.total ? <>
              <div className="flex gap-3">
                {productSlide.current > 0 ? <>
                  <button className="hidden md:block" onClick={prev}>
                    <img src="/assets/img/arrow-left.png" className="h-[20px] w-full lg:h-[50px]" />
                  </button>
                </> : <></>}

                <div className="w-full">
                  <ProductDetail id={productModal} dietary={dietaryKeys} />
                </div>

                {productSlide.current < productSlide.total - 1 ? <>
                  <button className="hidden md:block" onClick={next}>
                    <img src="/assets/img/arrow-right.png" className="h-[20px] w-full lg:h-[50px]" />
                  </button>
                </> : <></>}
              </div>
            </> : <>
              <ProductDetail id={productModal} />
            </>}
          </>}

          result={e => {
            replaceUrl({ url: `/${module1}` })
            localStorage.removeItem('catId')
            setProductModal('')
          }}
        />
      </> : <></>}
    </>
  );
}


export default function MenuPage() {
  
  const pathname = usePathname()||'/'

  if (pathname == '/menumobile') {
    return <Discover />
  } else {
    return <>
      <Breadcrumb
        links={[{ link: "/", name: "Home" }]}
        currentPage={"Menu"}
      />
      <Discover />
    </>
  }
}
