'use client';

import AudioHtml from "@/components/AudioHtml";
import DebouncedInput from "@/components/DebouncedInput";
import FormControl from "@/components/FormControl";
import ImageHtml from "@/components/ImageHtml";
import SocialShare from "@/components/menu/SocialShare";
import Modal from "@/components/Modal";
import VideoHtml from "@/components/VideoHtml";
import envirnment from "@/envirnment";
import ApiClientB from "@/utils/Apiclient";
import contentLibrary from "@/utils/contentLibrary";
import datepipeModel from "@/utils/datepipemodel";
import { loaderHtml, noImg, replaceUrl, scrollId } from "@/utils/shared";
import { contentMainCategory, contentTypes } from "@/utils/shared.utils";
import { useParams, useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoArrowRight, GoChevronLeft, GoChevronRight } from "react-icons/go";
import { IoIosSearch, IoMdClose, IoMdHeartEmpty } from "react-icons/io";
import { LuArrowRight } from "react-icons/lu";
import { useSelector } from "react-redux";

import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import 'swiper/css/grid';
import Image from "next/image";

type FiltersType={
  search?:string;
  tags?:any[];
  sortBy?:string;
  main_category?:string;
  types?:string;
}


type ContentListType={
  list?:any[];
  api?:string;
  content?:string;
  onClick:(_:any)=>void;
  pfilter?:FiltersType;
  title?:string;
  slideCount?:number;
  isLoading?:boolean;
  noData?:any;
  showAnotherSlider?:boolean;
}

const ResourceItem=({item,onClick = () => { }}:any)=>{
    
    const scrollRef = useRef(null);

const noImg = (img:any='', defaultImg = '/assets/img/placeholder.png') => {
  let value = defaultImg;
  if (img?.includes("https")) return img;
  if (img) value = `${envirnment.image_path}${img}`;
  return value;
};
    
  return <>
    <div className="w-full rounded-xl overflow-hidden  border bg-white">
                {/* Image with Favorite Icon */}
                <div className="relative">
                    {/* <ImageHtml src={noImg((item.thumbnail || item.image), `/assets/img/thumbnail/${item.type}.jpg`)}
                        alt="Workout"
                        // className="w-full h-[185px] object-cover object-top"
                        className="w-full cursor-pointer"
                        onClick={() => onClick(item)} /> */}

                        <Image src={noImg(item.thumbnail || item.image)} alt="" className="w-full cursor-pointer" onClick={() => onClick(item)}/>
                    {/* <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md">
                        <IoMdHeart className="text-red-500 text-lg" />
                    </button> */}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-2">
                    {/* Tags */}
                    <div className="flex gap-2 mb-2 items-center">
                        {/* Scrollable Tags */}
                        <div
                            ref={scrollRef}
                            className="flex gap-2 custom-scrollbar overflow-x-auto flex-grow items-center min-h-[24px] scrollbar-hide"
                        >
                            {(item?.tags || []).slice(0, 2).map((item:any, i:any) => (
                                <span
                                    key={i}
                                    // onClick={() => onclick(item)}
                                    className="capitalize text-[#540C0F] text-white text-[11px] 2xl:text-xs px-3 py-1 bg-primary rounded-full whitespace-nowrap"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>

                        {/* Fixed "+X more" Button */}
                        {(item?.tags || []).length > 2 && (
                            <span
                                // onClick={() => onClick(tags)}
                                className="capitalize text-[#540C0F] text-white text-[11px] 2xl:text-xs px-3 py-1 bg-primary rounded-full shrink-0"
                            >
                                +{(item?.tags || []).length - 2} more
                            </span>
                        )}
                    </div>


                    {/* Engagement */}
                    <div className="flex items-center text-gray-600 text-[12px] 2xl:text-sm gap-2">
                        <div className="flex gap-1 items-center">
                            <Image
                                src="/assets/img/v2/2.svg"
                                alt="Author"
                                className=" h-4 "
                            />
                            <span className="text-[#828282] mr-2">Helpful</span>
                        </div>
                        <div className="flex gap-1 items-center">
                            <span className="material-symbols-outlined">visibility</span>
                            <span className="font-semibold">{item.views}</span>
                        </div>
                        <SocialShare  shareUrl={`${envirnment.frontUrl}resource-center/${item?.content}/${item?.id}`} />
                    </div>

                    {/* Title */}
                    <h3
                        // onClick={() => onclick(item)}
                        className={`cursor-pointer text-[17px] 2xl:!text-[24px] line-clamp-2 font-bold text-gray-800 text-left leading-[22px] 2xl:leading-[28px] capitalize ${(item?.title?.length || 0) > 18 ? 'lg:h-[50px] 2xl:h-[60px]' : ''
                            }`}
                    >
                        {item?.title || ''}
                    </h3>



                    {/* Author Info */}
                    <div className="flex justify-between items-center mt-3 text-gray-500 text-sm gap-2 ">
                        <div className="flex text-left items-center gap-2">
                            {/* <Image
                                src="/assets/img/v2/123.png"
                                alt="Author"
                                className="w-6 h-6 2xl:w-8 2xl:h-8 rounded-full"
                            /> */}
                            <span className="text-[12px] 2xl:text-[16px] font-[500] text-[#97989F] worksans max-w-40 line-clamp-1">{contentTypes.find(itm => itm.id == item.content)?.name}</span>
                        </div>

                        <span className="text-[12px] 2xl:text-[16px] text-[#97989F] font-[400] worksans shrink-0">{datepipeModel.date(item.createdAt)}</span>
                    </div>
                </div>
            </div>
  
  
  </>
}

    const ContentList = ({ list = [], api = '', content = '', onClick, pfilter = {}, title = '', slideCount = 4, isLoading = false, noData = '', showAnotherSlider = false }:ContentListType) => {
    const width = document.body.offsetWidth
    const isMobile = width < 769 ? true : false

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(api ? true : false)
    const [slider, setSlider] = useState(true)

    const apiRef=useRef({
        list:{current:null}
    })
    const {get:getList,isLoading:listLoading,controller:listController}=ApiClientB(apiRef.current.list)

    const listData = useMemo(() => {
        let arr = list
        if (data.length) arr = data

        return arr
    }, [list, data])

    useEffect(() => {
        if (api) {
            const f:any = {
                status: 'active',
                isPublish: "pulished",
                ...pfilter,
                tags: pfilter.tags?.toString()
            }

            if (pfilter.main_category == 'Therapeutic & Functional Mushrooms') {
                f.category_type = 'Functional/medicinal,Therapeutic'
            }

            if (pfilter.main_category == 'Live Unboxings & Product Reviews') {
                f.type = 'unboxingShorts,live'
            }

            if (pfilter.types?.length) {
                f.type = pfilter.types.toString()
            }

            if (content == 'guide') {
                f.type = ''
            }

            setLoading(true)
            if(listController)  listController.abort()
            getList(api, f).then(res => {
                setLoading(false)
                if (res.success) {
                    setData(res.data.map((itm:any) => {
                        const payload = itm
                        if (content) payload.content = content
                        // if (!itm.id) itm.id = itm._id
                        itm.id = itm.info_slug
                        return payload
                    }))
                }
            })
        }
    }, [pfilter.search, pfilter.tags, pfilter.sortBy, pfilter.main_category])

    const total = useMemo(() => {
        return listData.length
    }, [listData])

    const seeAllClick = useCallback(() => {
        setSlider(!slider)
    }, [slider])

    const load = useMemo(() => {
        return loading || isLoading||(api&&listLoading)
    }, [isLoading, loading,listLoading])

    return <>
        {load ? <>
            {isMobile ? <>
                <div className="grid grid-cols-1 gap-5">
                    {[...Array(slideCount)].map((_, index) => (<div className="shine h-[300px]" key={index}></div>))}
                </div>
            </> : <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(slideCount)].map((_, index) => (<div className="shine h-[520px]" key={index}></div>))}
                </div>
            </>}

        </> : <>
            {slider ? <>{showAnotherSlider ?
                <section className="container mx-auto">
                    <div className="relative w-full flex items-center justify-center">
                        {/* Custom Prev Button */}
                        <button className="custom-prev absolute top-1/2 -left-10 transform -translate-y-1/2 bg-primary p-2 rounded-full text-white z-10 shadow-md">
                            <GoChevronLeft size={20} />
                        </button>

                        {/* Swiper Component */}
                        <Swiper
                            slidesPerView={slideCount}
                            spaceBetween={25}
                            autoplay={{
                                delay: 1000,
                                disableOnInteraction: false,
                            }}
                            navigation={{ prevEl: ".custom-prev", nextEl: ".custom-next" }}
                            pagination={{ clickable: true, el: ".custom-pagination" }}
                            modules={[Navigation, Pagination]}
                            className="container centers_style px-2 mx-auto "
                            breakpoints={{
                                200: {
                                    slidesPerView: 1, // 1 slide per view on screens smaller than 640px
                                    // grid: {
                                    //   rows: 1, // Optionally, reduce rows to 1 on mobile
                                    // },
                                    spaceBetween: 10,
                                },

                                550: {
                                    slidesPerView: 2, // 1 slide per view on screens smaller than 640px
                                    // grid: {
                                    //   rows: 1, // Optionally, reduce rows to 1 on mobile
                                    // },
                                },

                                1099: {
                                    slidesPerView: 3, // 1 slide per view on screens smaller than 640px
                                    // grid: {
                                    //   rows: 1, // Optionally, reduce rows to 1 on mobile
                                    // },
                                },

                                1280: {
                                    slidesPerView: 4, // 1 slide per view on screens smaller than 640px
                                    // grid: {
                                    //   rows: 1, // Optionally, reduce rows to 1 on mobile
                                    // },
                                },
                                1380: {
                                    slidesPerView: slideCount, // 1 slide per view on screens smaller than 640px
                                    // grid: {
                                    //   rows: 1, // Optionally, reduce rows to 1 on mobile
                                    // },
                                },


                            }}
                        >

                            {listData.map((itm, i) => {
                                return  <SwiperSlide key={i}>
                                        <ResourceItem item={itm} isMobile={isMobile} onClick={onClick} />
                                    </SwiperSlide>
                            })}
                        </Swiper>


                        {/* Custom Next Button */}
                        <button className="custom-next absolute top-1/2 -right-10 transform -translate-y-1/2 bg-primary p-2 rounded-full text-white z-10 shadow-md">
                            <GoChevronRight size={20} />
                        </button>

                    </div>

                </section> :
                <Swiper
                    slidesPerView={slideCount}
                    // grid={{
                    //   rows: 1,
                    //   fill: 'row',
                    // }}
                    breakpoints={{
                        200: {
                            slidesPerView: 1, // 1 slide per view on screens smaller than 640px
                            // grid: {
                            //   rows: 1, // Optionally, reduce rows to 1 on mobile
                            // },
                            spaceBetween: 10,
                        },

                        769: {
                            slidesPerView: 1, // 1 slide per view on screens smaller than 640px
                            // grid: {
                            //   rows: 1, // Optionally, reduce rows to 1 on mobile
                            // },
                        },

                        770: {
                            slidesPerView: 2, // 1 slide per view on screens smaller than 640px
                            // grid: {
                            //   rows: 1, // Optionally, reduce rows to 1 on mobile
                            // },
                        },

                        1099: {
                            slidesPerView: 3, // 1 slide per view on screens smaller than 640px
                            // grid: {
                            //   rows: 1, // Optionally, reduce rows to 1 on mobile
                            // },
                        },

                        1280: {
                            slidesPerView: 4, // 1 slide per view on screens smaller than 640px
                            // grid: {
                            //   rows: 1, // Optionally, reduce rows to 1 on mobile
                            // },
                        },
                        1380: {
                            slidesPerView: slideCount, // 1 slide per view on screens smaller than 640px
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
                    spaceBetween={10}
                    // pagination={{
                    //   clickable: true,
                    // }}
                    modules={[Grid, Pagination, Navigation]}
                    className="gridstowslide forarrows"
                >
                    {listData.map((itm, i) => {
                      
                        return <SwiperSlide key={i}>
                                <ResourceItem item={itm} isMobile={isMobile} onClick={onClick} />
                            </SwiperSlide>
                    })}
                </Swiper>}
            </> : <>
                {isMobile ? <>
                    <div className="grid grid-cols-1 gap-4">
                        {listData.map((itm, i) => {
                            // const key=itm.id||itm._id
                            return <Fragment key={i}>
                                <ResourceItem item={itm} isMobile onClick={onClick} />
                            </Fragment>
                        })}

                    </div>
                </> : <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {listData.map((itm, i) => {
                            // const key=itm.id||itm._id
                            return <Fragment key={i}>
                                <ResourceItem item={itm} onClick={onClick} />
                            </Fragment>
                        })}
                    </div>
                </>}
            </>}

            <div className="btn_see flex items-end justify-end mt-3">
                {total > slideCount ? <>
                    <span onClick={() => seeAllClick()} className="text-[16px] font-[400]  flex gap-2 items-center cursor-pointer">
                        <span className="">
                            See {!slider ? 'Less' : 'All'}
                        </span>
                        {slider ? <>
                            <GoArrowRight />
                        </> : <>
                            <GoArrowRight />
                            {/* <span className="material-symbols-outlined h-auto w-auto inline-block my-auto text-[16px]">keyboard_arrow_up</span> */}
                        </>}
                    </span>

                </> : <></>}

            </div>


            {noData ? <>
                <div>
                    {noData}
                </div>
            </> : <></>}

        </>}

        {title && (listData?.length || load) ? <>
            <div className="h-[30px]"></div>
        </> : <></>}

    </>
}



export default function PageContent() {
   const user = useSelector((state:any) => state.user.data)
    const { content, slug } = useParams()
    const [isOpen3, setIsOpen3] = useState(false);
    const [weekLoader, setWeekLoader] = useState(true);
    const [weekData, setWeekData] = useState([]);
    const [filters, setFilter] = useState<FiltersType>({ search: '', tags: [], sortBy: 'createdAt desc', main_category: '', types: '' });
    const contentCategory = useMemo(() => {
        let arr = contentTypes
        if (filters.main_category == 'Therapeutic & Functional Mushrooms') arr = arr.filter(itm => itm.id != 'guide')
        if (filters.main_category == 'Live Unboxings & Product Reviews') arr = arr.filter(itm => itm.id == 'video')
        if (filters.main_category == 'Research & Expert Insights') arr = arr.filter(itm => itm.id == 'guide')
        if (filters.main_category == 'Community Stories & Shared Experiences') arr = []
        return arr
    }, [filters.main_category])
    const [contents, setContent] = useState<any[]>([]);

    const [detailModal, setDetailModal] = useState<any>();
    const [tags, setTags] = useState<any[]>([]);
    const [tagModal, setTagModal] = useState(false);

    const { get, post } = ApiClientB()
    const { get: getTags, isLoading: tagsLoading } = ApiClientB()
    

    const router=useRouter()
  const history = (p: string) => {
    router.push(p)
  }

    function closeModal() {
        setDetailModal(null)
    }

    const openModal = (e:any) => {
        console.log('openmodal');
        
        setDetailModal(e)
        const url = `/resource-center/${e.content}/${e.id}`
        replaceUrl({ url: url })
        post('menuAccess/page', {
            page: 'info-content',
            userId: user.id || user._id,
            contentId: e._id,
            type: e.type || '',
            content_type: e.content
        }).then(() => { })
    }

    const contentchange = (e:any) => {
        const checked = e.target.checked
        const value = e.target.value
        let arr = contents
        if (checked) {
            arr.push(value)
        } else {
            arr = arr.filter(itm => itm != value)
        }
        setContent([...arr])
    }


    const getThisweekData = async () => {
        setWeekLoader(true)
        const filter = { week: true, status: 'active', isPublish: 'pulished' };

        const res = await get('audio/list', filter)
        const res2 = await get('video/list', filter)
        const res3 = await get('resource/listing', { ...filter })
        let data = []
        if (res.success) {
            data = res.data.map((itm:any) => ({ ...itm, content: 'audio', id: itm.info_slug }))
        }
        if (res2.success) {
            data = [...data, ...res2.data.map((itm:any) => ({ ...itm, content: 'video', id: itm.info_slug }))]
        }
        if (res3.success) {
            data = [...data, ...res3.data.map((itm:any) => ({ ...itm, content: 'resource', id: itm.info_slug }))]
        }
        setWeekData(data.sort((a:any, b:any) => {
            return (a.weekOrder || 0) - (b.weekOrder || 0)
        }))
        setWeekLoader(false)
    }

    useEffect(() => {
        getThisweekData()
        getTags('tag/getTagsFromlibrary').then(res => {
            if (res.success) {
                setTags(res.data.map((itm:any) => ({ id: itm, name: itm })))
            }
        })

        if (user.loggedIn) {
            post('menuAccess/page', {
                page: 'info',
                userId: user.id || user._id,
            })
            .then(() => { })
        }
    }, [])

    const filter = (p = {}) => {
        setFilter(prev => ({ ...prev, ...p }))
    }

    useEffect(() => {
        if (content) {
            loaderHtml(true)
            let url = 'audio/detail'
            const f = {
                slug: slug
            }
            if (content == 'video') url = 'video/detail'
            if (content == 'guide') url = 'resource/resourceDetails'
            get(url, f).then(res => {
                loaderHtml(false)
                if (res.success) {
                    const data = res.data
                    openModal({
                        ...data,
                        content: content,
                        id: slug
                    })
                }
            })
        }
    }, [content, slug])

    const tagClick = useCallback((p:any) => {
        let tag:any[] = (filters.tags || [])
        tag=[...tag]
        if (tag.includes(p)) {
            tag = tag.filter(itm => itm != p)
        } else {
            tag.push(p)
        }
        filter({ tags: tag })
    }, [filters.tags])

    const allTagsClick = useCallback(() => {

        const ext = tags.find((itm:any) => !filters?.tags?.includes(itm.id))

        if (ext) {
            filter({ tags: [...tags.map(itm => itm.id)] })
        } else {
            filter({ tags: '' })
        }

    }, [filters.tags, tags])

    const allTagSelected = useMemo(() => {
        const ext = tags.find(itm => !filters?.tags?.includes(itm.id))

        return ext ? false : true
    }, [filters.tags, tags])

    const allContentCategorySelect = useMemo(() => {
        const ext = contentCategory.find(itm => !contents.includes(itm.id))

        return ext ? false : true
    }, [contents, contentCategory])

    const allContentCategoryClick = useCallback(() => {
        if (allContentCategorySelect) {
            setContent([])
        } else {
            setContent([...contentCategory.map(itm => itm.id)])
        }
    }, [allContentCategorySelect, contentCategory])


    const sortByList = [
        { id: 'createdAt desc', name: 'Most Recent' },
        { id: 'views desc', name: 'Most Popular' },
        { id: 'likes desc', name: 'Most Engaging' },
    ]

    const topCategory = contentMainCategory

    const categoryTitle = useMemo(() => {
        let value = 'Curated by the Craft Therapy Network'
        if (filters.main_category) value = `Curated by the ${filters.main_category}`
        return value
    }, [filters.main_category])

    const content_types = useMemo(() => {
        let arr = contentLibrary.list.filter(itm => contentCategory.map(itm => itm.id).includes(itm.library)).map(itm => ({ ...itm, id: itm.type }))
        if (filters.main_category == 'Live Unboxings & Product Reviews') arr = arr.filter(itm => itm.type == 'live' || itm.type == 'unboxingShorts')
        return arr
    }, [contentCategory])


    useEffect(() => {
        setContent([...contentCategory.map(itm => itm.id)])
    }, [contentCategory])
   
  return <>
  
        <div className="bg-[#f9f7f5]">

            <section className="resoureceone">
                <div className="bg-[#1E8F72] border-t border-gray-300">
                    <div className="xl:container mx-auto px-4 py-6 lg:py-2  flex flex-col lg:flex-row items-center justify-between gap-8 xl:gap-8 2xl:gap-10">

                        <div className="flex flex-col items-center lg:flex-row gap-4 xl:gap-8">
                            <Image src="/assets/img/v2/res.svg" className="h-20 w-fit" alt={""} />
                            <div className="flex flex-col lg:flex-row gap-8 xl:gap-14 2xl:gap-16 items-center">
                                <h2 className="text-3xl lg:text-3xl xl:text-3xl 2xl:text-5xl text-center lg:text-left font-bold tracking-[-2.24px] text-[#E0EBD4] md:w-[305px] xl:w-[380px] 2xl:w-[605px]">
                                    Craft Therapy Network
                                    Resource Center
                                </h2>


                                <p className="text-base 2xl:text-lg  text-[#E0EBD4] text-center lg:text-left font-bold sm:max-w-[385px]  ">
                                    Your trusted hub for knowledge, education, and community-driven wellness—powered by the Craft Therapy Network.
                                </p>

                            </div>
                        </div>


                        <div className="flex flex-col gap-2">
                            <button className="flex items-center gap-2 ">
                                <span className="text-sm text-[#E0EBD4] font-bold text-md uppercase" onClick={() => {
                                    scrollId('contentGrid')
                                }}> Browse resources</span>
                                <span className=" text-[#E0EBD4] text-xl">
                                    <LuArrowRight size={20} />
                                </span>
                            </button>
                            <button className="flex items-center gap-2 ">
                                <span className="text-sm text-[#E0EBD4] font-bold text-md uppercase" onClick={() => {
                                    scrollId('newThisWeek')
                                }}> See What’s New</span>
                                <span className=" text-[#E0EBD4] text-xl">
                                    <LuArrowRight size={20} />
                                </span>
                            </button>
                        </div>

                    </div>
                </div>

            </section>




            <section className="resourecetwo sliders_news px-4 sm:px-6 2xl:px-10 py-6 lg:py-16 border-b-2 border-gray-200">
                <div className="hidden md:block lg:container mx-auto px-6">
                    <div className="text-center">
                        <h6 className="uppercase text-3xl xl:text-4xl 2xl:text-5xl text-[#1B1B1F] font-bold mb-6 tracking-[-2.24px] mb-8" id="newThisWeek">What’s Fresh in Wellness</h6>
                    </div>
                    <div className="relative">
                        <ContentList list={weekData} onClick={openModal} isLoading={weekLoader} showAnotherSlider={true} />
                    </div>
                </div>

                <div className="block md:hidden lg:container mx-auto">
                    <div className="text-center">
                        <h6 className="uppercase text-3xl xl:text-4xl 2xl:text-5xl text-[#1B1B1F] font-bold mb-6 tracking-[-2.24px] mb-8">What’s Fresh in Wellness</h6>
                    </div>
                    <div className="relative">
                        <ContentList list={weekData} onClick={openModal} isLoading={weekLoader} />
                    </div>
                </div>
            </section>


            <section className="resourecethree  px-4 2xl:px-10 py-6 lg:py-16">
                <div className="lg:container mx-auto">
                    <div className="text-center">
                        <h6 className="uppercase text-3xl xl:text-4xl 2xl:text-5xl text-[#1B1B1F] font-bold tracking-[-2.24px] mb-10">Choose Category</h6>
                    </div>


                    <div className=" grid max-[480px]:!grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mt-8">

                        {topCategory.map((item,i) => {
                            return <div onClick={() => {
                                filter({ main_category: item.id, types: '' })
                                scrollId('contentGrid')
                            }} className={`w-full cursor-pointer hover:shadow-lg rounded-xl overflow-hidden  border bg-white ${filters.main_category == item.id ? 'shadow-lg' : ''}`} 
                            key={i}>
                                {/* Image with Favorite Icon */}
                                <div className="relative">
                                    <Image
                                        src={item.image}
                                        alt="Workout"
                                        className="w-full h-82 object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-4 flex flex-col gap-1">

                                    {/* Title */}
                                    <h3 className="text-[20px] xl:text-[22px] 2xl:text-[24px] line-clamp-2 font-[700] leading-[26px] sm:leading-[27px] md:leading-[28px] text-[#181A2A]">
                                        {item.name}
                                    </h3>

                                    <p className="text-[14px] font-[400] text-[#181A2A] mt-3">{item.description}</p>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </section>



            <section className="resourecetwo ">
                <div className="hidden md:grid grid-cols-12  gap-4 xl:gap-8 px-4 2xl:px-16 py-16">
                    <div className="col-span-12 md:col-span-4 xl:col-span-3">
                        <div className="flex flex-col gap-4 xl:gap-8">
                            <div className="">
                                <div className="flex items-center relative w-[80%] p-3 rounded-lg border border-black">
                                    <DebouncedInput value={filters.search}
                                        className="w-full pr-3 bg-transparent placeholder:text-[12px] placeholder:text-gray-400"
                                        placeholder="Search Resources Center"
                                        onChange={e => {
                                            filter({ search: e })
                                        }} />
                                    <IoIosSearch
                                        className="text-black text-[14px] 2xl:text-[18px]"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">


                                <div className="flex gap-2 items-center">
                                    <label className="text-[#061522] font-inter text-[14px] xl:text-[16px] font-bold leading-[28px] uppercase flex gap-2 items-center">
                                        <input type="checkbox" className="h-3 w-3 cursor-pointer custom-input"
                                            checked={allContentCategorySelect}
                                            onChange={() => {
                                                allContentCategoryClick()
                                            }}
                                        />
                                        All
                                    </label>
                                </div>

                                {contentCategory.map((item, i) => {
                                    // const key=item.id
                                    return <div className="flex gap-2 items-center" key={i}>
                                        <label className="text-[#061522] font-inter text-[14px] xl:text-[16px] font-bold leading-[28px] uppercase flex gap-2 items-center">
                                            <input type="checkbox" className="h-3 w-3 cursor-pointer custom-input"
                                                checked={contents.includes(item.id)}
                                                value={item.id}
                                                onChange={(e) => {
                                                    contentchange(e)
                                                }}
                                            />
                                            {item.name}
                                        </label>
                                    </div>
                                })}

                            </div>

                            {tagsLoading ? <>
                                <div className="flex flex-wrap gap-2">
                                    <p className="h-[38px] w-[100px] rounded-full shine"></p>
                                    <p className="h-[38px] w-[100px] rounded-full shine"></p>
                                    <p className="h-[38px] w-[100px] rounded-full shine"></p>
                                    <p className="h-[38px] w-[100px] rounded-full shine"></p>
                                </div>
                            </> : <>
                                <div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <p className={`capitalize ${allTagSelected ? 'text-white bg-primary border-[#1a604c] font-bold' : 'text-black'} cursor-pointer px-4 xl:px-5 py-2 text-sm border border-[#000] rounded-full`} onClick={() => {
                                            allTagsClick()
                                        }}>All</p>
                                        {tags.slice(0, 5).map((itm, i) => {
                                            //  const key=itm.id||itm._id
                                            return <p key={i} onClick={() => tagClick(itm.id)} className={`capitalize ${filters.tags?.includes(itm.id) ? 'text-white bg-primary border-[#1a604c] font-bold' : 'text-black'} cursor-pointer px-4 xl:px-5 py-2 text-sm border border-[#000] rounded-full`}>{itm.name}</p>
                                        })}
                                        <span className="capitalize flex items-center text-[14px] text-primary cursor-pointer ml-auto" onClick={() => setTagModal(true)}>See All</span>
                                    </div>
                                </div>
                            </>}
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-8 xl:col-span-9" id="contentGrid">
                        <div className="flex flex-col gap-2 mb-4">
                            <div className="">
                                <h6 className="text-3xl xl:text-4xl 2xl:text-5xl text-[#1B1B1F] font-bold tracking-[-2.24px]">{categoryTitle}</h6>
                            </div>
                            <div className="flex items-center justify-end gap-2 min-w-72 ml-auto">
                                <p className="shrink-0">Sort by:</p>
                                <FormControl
                                    type="multiselect"
                                    options={content_types}
                                    value={filters.types}
                                    placeholder="All"
                                    className="z-40 new_radius flex-grow min-w-72 max-w-full"
                                    onChange={(e:any) => {
                                        filter({ types: e })
                                    }}
                                />
                            </div>
                        </div>
                        {contentCategory.map((item, i) => {
                            let url = 'audio/list'
                            //  const key=item.id
                            if (item.id == 'video') url = 'video/list'
                            if (item.id == 'guide') url = 'resource/listing'
                            if (contents.includes(item.id) || !contents.length)
                                return <Fragment key={i}>
                                    <ContentList title={item.name} api={url} content={item.id} pfilter={filters} onClick={openModal} />
                                </Fragment>
                        })}
                    </div>


                </div>


                <div className="grid md:hidden grid-cols-12  gap-4 xl:gap-8 px-4 py-6  lg:py-16">

                    <div className="col-span-12 md:col-span-9">
                        <div className="border-b pb-4 border-gray-200 mb-6">
                            <div className="flex flex-col gap-2 md:px-4">
                                <div className="">
                                    <h6 className="text-3xl 2xl:text-4xl text-center mb-2 text-black font-bold">{categoryTitle}</h6>
                                </div>

                                <div className="flex flex-col gap-4 xl:gap-8">
                                    <div className="flex gap-2">
                                        <div className="flex items-center relative w-full bg-[#F9F7F5] border border-[#E8E8EA] p-3 rounded-lg ">
                                            <DebouncedInput value={filters.search}
                                                className="w-full pr-3  placeholder:text-[12px] bg-transparent placeholder:text-gray-400"
                                                placeholder="Search Menu."
                                                onChange={e => {
                                                    filter({ search: e })
                                                }} />
                                            {/* {search && search.length > 0 && (
                                    <div className="-translate-y-1/2 top-1/2 text-[12px] xl:text-[18px] right-3 cursor-pointer hover:text-[#540C0F] absolute">
                                        <MdOutlineClose onClick={handleClearSearch} />
                                    </div>
                                )} */}
                                            <IoIosSearch
                                                className="text-black text-[14px] 2xl:text-[18px]"
                                            />
                                        </div>

                                        <div onClick={() => setIsOpen3(true)} className="bg-[#F9F7F5] border border-[#E8E8EA] cursor-pointer flex items-center justify-center px-4 py-1 rounded-lg">
                                            <Image alt="filter" src="/assets/img/v2/filter.svg" className="h-8" />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <p className={`capitalize px-3 ${allTagSelected ? 'text-white bg-primary font-semibold text-[#540C0F]' : 'text-black '} py-1 rounded-full border-[#1a604c] border text-xs italic`}
                                            onClick={() => {
                                                allTagsClick()
                                            }}
                                        >All</p>
                                        {tags.slice(0, 6).map((item, i) => {
                                            return <p key={i} onClick={() => tagClick(item.id)}
                                                className={`capitalize px-3 ${filters?.tags?.includes(item.id) ? 'text-white bg-primary font-semibold text-[#540C0F]' : 'text-black '}  py-1 border-[#1a604c] border rounded-full text-xs italic`}>{item.name}</p>
                                        })}
                                        <span className="capitalize flex items-center text-[14px] text-primary cursor-pointer ml-auto" onClick={() => setTagModal(true)}>See All</span>
                                    </div>
                                </div>
                                <div className="flex items-center flex-wrap  gap-2">
                                    <p className="font-bold text-sm text-black">Sort by:</p>
                                    {sortByList.map((item, i) => {
                                        return <p className={`${item.id == filters.sortBy ? 'font-bold' : ''} text-sm text-black`} key={i} onClick={() => filter({ sortBy: item.id })}>{item.name}</p>
                                    })}
                                </div>
                            </div>
                        </div>

                        {contentCategory.map((item, i) => {
                            let url = 'audio/list'
                            if (item.id == 'video') url = 'video/list'
                            if (item.id == 'guide') url = 'resource/listing'
                            if (contents.includes(item.id) || !contents.length)
                                return <Fragment key={i}>
                                    <ContentList title={item.name} api={url} content={item.id} pfilter={filters} onClick={openModal} />
                                </Fragment>
                        })}
                    </div>
                </div>
            </section>
        </div>

        {detailModal ? <>
            <Modal
                title="Details"
                className="max-w-[800px]"
                body={<>
                    <div className=" py-6 flex flex-col gap-2 lg:gap-4">
                        <p className="text-lg lg:text-2xl  text-black font-bold text-center ">
                            {detailModal?.title}
                        </p>
                        <div className="mt-4 bg-gray-100">
                           
                            {detailModal?.audio ? <>
                                <AudioHtml
                                    src={detailModal?.audio}
                                    className="w-full  object-contain"
                                    controls
                                />
                            </> : <></>}
                            {detailModal?.video ? <>
                                <VideoHtml
                                    className="  object-contain h-52 lg:h-96 w-full"
                                    preload="false"
                                    controls
                                    src={detailModal?.video}
                                />
                            </> : <></>}
                            {!(detailModal?.audio || detailModal?.video) ? <>
                                <ImageHtml 
                                  height={256}
                                  width={750}
                                  alt=""
                                  src={noImg((detailModal?.thumbnail || detailModal?.image), `/assets/img/thumbnail/${detailModal?.type}.jpg`)} className="w-full h-52 lg:h-62 object-contain" />
                            </> : <></>}
                        </div>

                        {/* Author Info */}
                        <div className="flex gap-4 items-center mt-2 sm:mt-3 text-gray-500 text-[10px] sm:text-sm flex-wrap">
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Image
                                    src="/assets/img/v2/123.png"
                                    alt="Author"
                                    className="w-6 sm:w-8 h-6 sm:h-8 rounded-full"
                                />
                                <span className="font-semibold text-[12px]">Tracey Wilson</span>
                            </div>
                            <span className="text-[12px]">{datepipeModel.date(detailModal?.createdAt)}</span>

                            {/* <div className="flex gap-1 items-center ">
                                                    <Image src="/assets/img/v2/3.svg" alt="Comment" className="h-3 sm:h-4" />
                                                </div> */}
                            <div className="">
                                <SocialShare shareUrl={`${envirnment.frontUrl}resource-center/${detailModal?.content}/${detailModal?.id}`} />
                            </div>

                            <div className="flex gap-1 items-center ">
                                <IoMdHeartEmpty className="text-xl" />
                            </div>
                        </div>

                        <div className="flex gap-2 mb-2 flex-wrap">
                            {detailModal?.tags?.map((item:any, i:any) => {
                                return <span key={i} className="bg-primary  text-white text-xs px-3 py-2 rounded-full">
                                    {item}
                                </span>
                            })}
                        </div>


                        <div>
                            <div className="text-[16px] text-[#6D6E76]" dangerouslySetInnerHTML={{ __html: detailModal?.description }}></div>
                        </div>
                        {detailModal?.content == 'guide' ? <>
                            <div>
                                <button onClick={() => {
                                    history(`/info-library/guide-preview?id=${detailModal?.id}`)
                                }} className="inline-flex items-center gap-2 px-6 py-2 rounded-sm border border-gray-300 bg-[#540C0F] text-white hover:bg-[#b53032] hover:shadow-md active:bg-[#801f20] focus:outline-none focus:ring-2 focus:ring-offset-1 rounded-lg focus:ring-[#801f20] transition-all duration-200">Preview</button>
                            </div>
                        </> : <></>}

                    </div>
                </>}
                result={() => {
                    closeModal()
                }}
            />
        </> : <></>}

       

        {/* sidebar modals */}
        {isOpen3?<>
         <div className="rightheader_modals">
            <div className={`fixed top-0 right-0 z-50 h-screen w-72 bg-white shadow-lg transform transition-transform duration-300 ${isOpen3 ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Sidebar Header */}
                <div className="flex border-b border-gray-100 justify-between items-center px-4 py-4 border-b">
                    <h2 className="text-lg font-semibold">
                        Filters
                    </h2>
                    <IoMdClose
                        className="text-2xl cursor-pointer"
                        onClick={() => setIsOpen3(false)}
                    />
                </div>

                {/* Sidebar Content */}
                <div>
                    <div className="flex flex-col gap-3 px-4 py-4 items-start w-full ">
                        <div className="flex flex-col gap-2 border-b border-gray-200 pb-4  w-full">
                            <div className="">
                                <p className="font-bold text-lg mb-2">Content Type:</p>
                            </div>
                            {/* <div className="flex gap-1 items-center">
                                <p className="text-[13px] font-bold  text-[#000] capitalize flex items-center gap-2">
                                    <input type="checkbox" className="h-4 w-4 cursor-pointer" />
                                    All
                                </p>
                            </div> */}

                            {contentCategory.map((item, i) => {
                                return <div className="flex gap-2 items-center" key={i}>
                                    <label className="text-[#061522] font-inter text-[14px] xl:text-[16px] font-bold leading-[28px] uppercase flex gap-2 items-center">
                                        <input type="checkbox" className="h-3 w-3 cursor-pointer custom-input"
                                            checked={contents.includes(item.id)}
                                            value={item.id}
                                            onChange={(e) => {
                                                contentchange(e)
                                            }}
                                        />
                                        {item.name}
                                    </label>
                                </div>
                            })}
                        </div>

                        <div className="flex flex-col w-full">
                            <div className="flex w-full items-center justify-end">
                                <button className="text-[#540C0F] px-3 text-sm text-white py-2 rounded-full" onClick={() => setIsOpen3(false)}>Show Results</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {isOpen3 && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50"
                    onClick={() => setIsOpen3(false)}
                ></div>
            )}

           
        </div>
        </>:<></>}
        {tagModal ? <>
                <Modal
                    title="Tags"
                    body={<>
                        <div className="overflow-auto h-[400px]">
                            {tagsLoading ? <>
                                <div className="flex flex-wrap gap-2">
                                    <p className="h-[38px] w-[100px] rounded-full shine"></p>
                                    <p className="h-[38px] w-[100px] rounded-full shine"></p>
                                    <p className="h-[38px] w-[100px] rounded-full shine"></p>
                                    <p className="h-[38px] w-[100px] rounded-full shine"></p>
                                    <p className="h-[38px] w-[100px] rounded-full shine"></p>
                                    <p className="h-[38px] w-[100px] rounded-full shine"></p>
                                    <p className="h-[38px] w-[100px] rounded-full shine"></p>
                                </div>
                            </> : <>
                                <div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <p className={`capitalize ${allTagSelected ? 'text-white bg-primary border-[#1a604c] font-bold' : 'text-black'} cursor-pointer px-4 xl:px-5 py-2 text-sm border border-[#000] rounded-full`} onClick={() => {
                                            allTagsClick()
                                        }}>All</p>
                                        {tags.map((itm, i) => {
                                            return <p key={i} onClick={() => tagClick(itm.id)} className={`capitalize ${filters?.tags?.includes(itm.id) ? 'text-white bg-primary border-[#1a604c] font-bold' : 'text-black'} cursor-pointer px-4 xl:px-5 py-2 text-sm border border-[#000] rounded-full`}>{itm.name}</p>
                                        })}
                                    </div>
                                </div>

                            </>}
                        </div>
                    </>}
                    result={() => {
                        setTagModal(false)
                    }}
                />
            </> : <></>}


  </>
}
