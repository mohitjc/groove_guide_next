"use client"
import { useEffect, useState, useCallback, useRef } from "react";
import methodModel from "@/utils/methodModel";
import { AiOutlineCheck } from "react-icons/ai";
import {
    MdChevronRight,
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
} from "react-icons/md";
import { HiMiniChevronDoubleUp } from "react-icons/hi2";
import { useSelector } from "react-redux";
import ApiClientB from "@/utils/Apiclient";
import { loaderHtml, noImg } from "@/utils/shared";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Video {
    _id: string;
    title: string;
    slug: string;
    thumbnail: string;
    description: string;
    totalViews: number;
    type: "short" | "long" | "series" | "playlist";
    category_type: string;
    category_detail: {
        _id: string;
        name: string;
    };
    populatedVideos: any[];
    createdAt: string;
    main_title?: string;
}

interface Category {
    _id: string;
    name: string;
    id: string;
}

interface TypeOption {
    name: string;
    id: string;
}

const VideoHtml = (): any => {

    const { get, post, postFormData } = ApiClientB()
    const user = useSelector((state: any) => state.user);
    console.log(user, 'useruser', user?.loggedIn);

    const [AllVideos, setAllVideos] = useState<Video[]>([]);
    const [search, setSearch] = useState<string>("");
    const Navigate = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const categoryScrollRef = useRef<HTMLDivElement>(null);

    // Single active filter state
    const [activeFilter, setActiveFilter] = useState<{
        type: 'all' | 'category' | 'type' | 'content';
        value: string;
    }>({ type: 'all', value: 'all' });
    console.log(AllVideos, 'AllVideos');

    const types: TypeOption[] = [
        { name: 'Long Video', id: 'long' },
        { name: 'Shorts', id: 'short' },
        { name: 'Playlist', id: 'playlist' },
        { name: 'Series', id: 'series' }
    ];

    const contentFilters: TypeOption[] = [
        { name: 'Recently Uploaded', id: 'recently_uploaded' },
        { name: 'Most Watched', id: 'most_watched' },
        { name: 'Unviewed', id: 'unviewed' }
    ];

    // Show more/less states
    const [showAllTrending, setShowAllTrending] = useState<boolean>(false);
    const [showAllShorts, setShowAllShorts] = useState<boolean>(false);
    const [showAllLongVideos, setShowAllLongVideos] = useState<boolean>(false);
    const [showAllPlaylists, setShowAllPlaylists] = useState<boolean>(false);
    const [showAllSeries, setShowAllSeries] = useState<boolean>(false);

    // Login popup state
    const [isLoginPopupOpen, setIsLoginPopupOpen] = useState<boolean>(false);

    // Fetch categories
    const GetCategories = useCallback((): void => {
        get(`category/listing?category_type=master&type=video`)
            .then((res: any) => {
                if (res.success) {
                    setCategories([
                        { _id: "All", name: "All", id: "All" },
                        ...(res?.data || []),
                    ]);
                }
            })
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    // Fetch all videos with active filter
    const GetAllVideos = useCallback((searchTerm: string = ""): void => {
        loaderHtml(true);

        let queryParams = `page=1&count=1000&search=${searchTerm}&isPublish=pulished`;

        // Add filter based on active filter type
        if (activeFilter.type === 'category' && activeFilter.value !== 'All') {
            queryParams += `&category_type=${activeFilter.value}`;
        } else if (activeFilter.type === 'type') {
            queryParams += `&type=${activeFilter.value}`;
        } else if (activeFilter.type === 'content') {
            queryParams += `&${activeFilter.value}=yes`;
        }

        get(`groovevideo/list?${queryParams}`)
            .then((res: any) => {
                if (res.success) {
                    setAllVideos(res?.data || []);
                }
                loaderHtml(false);
            })
            .catch(() => loaderHtml(false));
    }, [activeFilter]);

    // Initial Load
    useEffect(() => {
        GetAllVideos("");
        GetCategories();
    }, [GetCategories, activeFilter]);

    // Debounced Search Effect
    useEffect(() => {
        const handler = setTimeout(() => {
            GetAllVideos(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search, GetAllVideos]);

    // No need for client-side filtering anymore since API handles it
    const getFilteredVideos = useCallback((): Video[] => {
        return AllVideos;
    }, [AllVideos]);

    // Get trending videos (all videos with more than 1 view, sorted by views)
    const getTrendingVideos = useCallback((): Video[] => {
        const filtered = getFilteredVideos();
        return [...filtered]
            .filter((video) => video.totalViews >= 1)
            .sort((a, b) => b.totalViews - a.totalViews);
    }, [getFilteredVideos]);

    // Get shorts videos
    const getShortsVideos = useCallback((): Video[] => {
        const filtered = getFilteredVideos();
        return filtered.filter((video) => video.type === "short");
    }, [getFilteredVideos]);

    // Get playlist videos
    const getPlaylistVideos = useCallback((): Video[] => {
        const filtered = getFilteredVideos();
        return filtered.filter((video) => video.type === "playlist");
    }, [getFilteredVideos]);

    // Get series videos
    const getSeriesVideos = useCallback((): Video[] => {
        const filtered = getFilteredVideos();
        return filtered.filter((video) => video.type === "series");
    }, [getFilteredVideos]);

    // Get long videos
    const getLongVideos = useCallback((): Video[] => {
        const filtered = getFilteredVideos();
        return filtered.filter((video) => video.type === "long");
    }, [getFilteredVideos]);

    // Format time ago
    const formatTimeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return "Today";
        if (diffInDays === 1) return "1 day ago";
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
        return `${Math.floor(diffInDays / 365)} years ago`;
    };

    // Format views count
    const formatViews = (views: number): string => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
        return views.toString();
    };

    // Scroll category buttons
    const scrollCategories = (direction: "left" | "right") => {
        if (categoryScrollRef.current) {
            const scrollAmount = 200;
            categoryScrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const trendingVideos = getTrendingVideos();
    const shortsVideos = getShortsVideos();
    const longVideos = getLongVideos();
    const playlistVideos = getPlaylistVideos();
    const seriesVideos = getSeriesVideos();

    // Get displayed videos based on show more/less state - Always show only top 3
    const displayedTrendingVideos = trendingVideos.slice(0, 3);
    const displayedShortsVideos = showAllShorts
        ? shortsVideos
        : shortsVideos.slice(0, 4);
    const displayedLongVideos = showAllLongVideos
        ? longVideos
        : longVideos.slice(0, 3);
    const displayedPlaylistVideos = showAllPlaylists
        ? playlistVideos
        : playlistVideos.slice(0, 3);
    const displayedSeriesVideos = showAllSeries
        ? seriesVideos
        : seriesVideos.slice(0, 3);

    const toSentenceCase = (text = "") =>
        text
            .toLowerCase()
            .replace(/^\s*\w/, c => c.toUpperCase());

    return (
        <>
            <div className="container mx-auto px-5">
                {/* Header Section */}
                <div className="flex justify-between gap-4 items-center md:flex-nowrap mt-5 flex-wrap">
                    <div className="w-full">
                        <p className="xl:text-[34px] lg:text-[30px] md:text-[26px] sm:text-[24px] text-[20px] font-semibold text-[#000] mb-3">
                            Explore Groove Guide Videos
                        </p>
                        <p className="sm:text-[16px] text-[14px] text-[#00000099] font-sembold">
                            Discover tutorials, highlights, and insights from our experts and
                            community.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="flex gap-2 justify-end w-full">
                        {/* Type Filter - Commented out, now integrated with categories below */}
                        {/* <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-[#D9D9D9] text-[#540C0F] text-[14px] rounded-full px-4 py-1 border-none outline-none cursor-pointer"
            >
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select> */}
                        <div className="flex gap-1 w-full">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search videos, playlist, and series..."
                                className="bg-gray-100 text-[14px] placeholder:text-[12px] placeholder:text-[#540C0F] w-full rounded-l-full px-4 py-2.5"
                            />
                            <button
                                onClick={() => GetAllVideos(search)}
                                className="bg-[#540C0F] px-5 rounded-r-full py-1 sm:text-[15px] text-[13px] text-[#fff]"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                {/* Category and Type Filter */}
                <div className="mt-10 relative px-10">
                    <button
                        onClick={() => scrollCategories("left")}
                        className="bg-[#540C0F] h-[30px] w-[30px] rounded-full hover:bg-[#F2B2B5] border border-[#540C0F] p-1 absolute top-[1.5px] left-0 flex justify-center items-center z-10"
                    >
                        <MdKeyboardArrowLeft className="text-[#fff] text-[18px]" />
                    </button>
                    <div
                        ref={categoryScrollRef}
                        className="flex gap-2 overflow-hidden items-center"
                    >
                        {/* All Filter - Clears everything */}
                        <button
                            onClick={() => setActiveFilter({ type: 'all', value: 'all' })}
                            className={`border px-3 w-full max-w-fit whitespace-nowrap py-1.5 rounded-full sticky left-0 top-0 sm:text-[14px] text-[12px] font-medium ${activeFilter.type === 'all'
                                ? "bg-[#540C0F] text-[#fff] border-[#540C0F]"
                                : "bg-[#fff] border-[#540C0F] text-[#540C0F]"
                                }`}
                        >
                            All
                        </button>

                        {/* Separator */}
                        {/* <div className="h-8 w-[2px] bg-[#540C0F] opacity-30 mx-2"></div> */}
                        {/* <div className="pl-[5px] flex gap-2 overflow-hidden items-center ">
            </div> */}
                        {/* Category Filters */}
                        {categories
                            .filter((cat) => cat._id !== "All")
                            .map((cat) => (
                                <button
                                    key={cat._id}
                                    onClick={() => setActiveFilter({ type: 'category', value: cat._id })}
                                    className={`border px-3 w-full whitespace-nowrap py-1.5 rounded-full sm:text-[14px] text-[12px] font-medium ${activeFilter.type === 'category' && activeFilter.value === cat._id
                                        ? "bg-[#540C0F] text-[#fff] border-[#540C0F]"
                                        : "border-[#540C0F] text-[#540C0F]"
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}

                        {/* Separator */}
                        {/* <div className="h-8 w-[2px] bg-[#540C0F] opacity-30 mx-2"></div> */}

                        {/* Type Filters */}
                        {types.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setActiveFilter({ type: 'type', value: type.id })}
                                className={`border px-3 w-full whitespace-nowrap py-1.5 rounded-full sm:text-[14px] text-[12px] font-medium ${activeFilter.type === 'type' && activeFilter.value === type.id
                                    ? "bg-[#540C0F] text-[#fff] border-[#540C0F]"
                                    : "border-[#540C0F] text-[#540C0F]"
                                    }`}
                            >
                                {type.name}
                            </button>
                        ))}

                        {/* Separator */}
                        {/* <div className="h-8 w-[2px] bg-[#540C0F] opacity-30 mx-2"></div> */}

                        {/* Content Filters */}
                        {contentFilters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter({ type: 'content', value: filter.id })}
                                className={`border px-3 w-full whitespace-nowrap py-1.5 rounded-full sm:text-[14px] text-[12px] font-medium ${activeFilter.type === 'content' && activeFilter.value === filter.id
                                    ? "bg-[#540C0F] text-[#fff] border-[#540C0F]"
                                    : "border-[#540C0F] text-[#540C0F]"
                                    }`}
                            >
                                {filter.name}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => scrollCategories("right")}
                        className="bg-[#540C0F] h-[30px] w-[30px] rounded-full p-1 hover:bg-[#F2B2B5] border border-[#540C0F] absolute top-[1.5px] right-0 flex justify-center items-center z-10"
                    >
                        <MdKeyboardArrowRight className="text-[#fff] text-[18px]" />
                    </button>
                </div>

                {/* Personalized Wellness Journey Banner */}
                {
                    !user?.loggedIn && <div className="mt-7 rounded-[12px] p-5 bg-[#FFEAE5] relative">
                        <img
                            src="/assets/images/bg-1.png"
                            className="absolute top-0 left-0 opacity-[5%] w-full h-full object-cover"
                            alt="background"
                        />
                        <div className="flex flex-col text-center justify-center items-center gap-4 relative z-[9]">
                            <p className="xl:text-[24px] lg:text-[22px] md:text-[20px] sm:text-[18px] text-[#000000CC] font-semibold">
                                Your Personized Wellness Journey
                            </p>
                            <p className="lg:text-[18px] md:text-[16px] sm:text-[14px] text-[12px] text-[#00000099]">
                                Sign In to get personized recommendations based on:
                            </p>
                            <div className="flex gap-4 flex-wrap justify-center items-center">
                                <div className="flex gap-2 text-[#540C0F] items-center">
                                    <AiOutlineCheck className="text-[16px]" />
                                    <span className="md:text-[16px] sm:text-[14px] text-[12px] font-medium">
                                        Your Health Goals
                                    </span>
                                </div>
                                <div className="flex gap-2 text-[#540C0F] items-center">
                                    <AiOutlineCheck className="text-[16px]" />
                                    <span className="md:text-[16px] sm:text-[14px] text-[12px] font-medium">
                                        Dietary Preferences
                                    </span>
                                </div>
                                <div className="flex gap-2 text-[#540C0F] items-center">
                                    <AiOutlineCheck className="text-[16px]" />
                                    <span className="md:text-[16px] sm:text-[14px] text-[12px] font-medium">
                                        Watch History
                                    </span>
                                </div>
                                <div className="flex gap-2 text-[#540C0F] items-center">
                                    <AiOutlineCheck className="text-[16px]" />
                                    <span className="md:text-[16px] sm:text-[14px] text-[12px] font-medium">
                                        Saved Favorites
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => Navigate.push('/login')}
                                className="px-5 py-2 rounded-full bg-[#540C0F] sm:text-[14px] text-[12px] text-[#fff] hover:opacity-90 transition-opacity"
                            >
                                Sign In To Unlock
                            </button>
                        </div>
                    </div>
                }


                {/* Trending Now Section */}
                <div className="my-10">
                    <div className="flex items-end justify-between gap-2 flex-wrap">
                        <div>
                            <p className="xl:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#000000CC] font-semibold">
                                Trending Now
                            </p>
                            <p className="sm:text-[16px] text-[14px] text-[#00000099]">
                                Top 3 most watched this week
                            </p>
                        </div>
                        {/* <div className="flex gap-0 items-center text-[#00000099] cursor-pointer">
              <span className="sm:text-[13px] text-[11px] font-medium">
                See All
              </span>
              <MdChevronRight className="text-[14px]" />
            </div> */}
                    </div>
                    {trendingVideos.length > 0 ? (
                        <>
                            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-10 gap-5 mt-4">
                                {displayedTrendingVideos.map((video, index) => (
                                    <div
                                        key={video._id}
                                        className="flex relative flex-col gap-3 cursor-pointer justify-between"
                                        onClick={() => Navigate.push(`/video-detail/${video.slug}`)}
                                    >
                                        <div>
                                            {
                                                video.thumbnail ?
                                                    <Image
                                                        height={250}
                                                        width={300}
                                                        alt={video.title || "Video thumbnail"}
                                                        src={noImg(video.thumbnail ||
                                                            "assets/img/dummy.webp")}

                                                        className="rounded-[6px] max-h-[215px] w-full object-cover" />

                                                    :
                                                    <Image
                                                        height={250}
                                                        width={300}
                                                        src={"/assets/img/dummy.webp"}
                                                        alt={video.title || "Video thumbnail"}
                                                        className="rounded-[6px] max-h-[215px] w-full object-cover"
                                                    />
                                            }

                                            <p className="lg:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#000000CC] font-bold mt-3 ">
                                                {toSentenceCase(video.title) || "Untitled Video"}
                                            </p>
                                        </div>
                                        <div
                                            className="md:text-[16px] sm:text-[15px] text-[14px] text-[#00000099] line-clamp-3"
                                            dangerouslySetInnerHTML={{
                                                __html: video?.description
                                                    ? video.description.replace(/<\/?[^>]+(>|$)/g, "")
                                                    : "",
                                            }}
                                        />
                                        <div>
                                            <div className="flex gap-8 items-center">
                                                <span className="md:text-[14px] sm:text-[12px] text-[10px] text-[#000000CC] font-medium">
                                                    {formatViews(video.totalViews)} views
                                                </span>
                                                <ul className="list-disc">
                                                    <li className="md:text-[14px] sm:text-[12px] text-[10px] text-[#000000CC] font-medium">
                                                        {formatTimeAgo(video.createdAt)}
                                                    </li>
                                                </ul>
                                            </div>
                                            <button className="mt-3 sm:text-[16px] px-3 w-full text-[14px] bg-[#540C0F] py-1.5 text-[#fff] rounded-full hover:opacity-80">
                                                Watch Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-center items-center py-10">
                            <p className="text-[#00000099] sm:text-[16px] text-[14px]">
                                No data found
                            </p>
                        </div>
                    )}
                </div>

                {/* Shorts Section */}
                <div className="my-10">
                    <div className="flex items-end justify-between gap-2 flex-wrap">
                        <div>
                            <p className="xl:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#000000CC] font-semibold">
                                Shorts
                            </p>
                            <p className="sm:text-[16px] text-[14px] text-[#00000099]">
                                Quick wellness tips under 60 seconds
                            </p>
                        </div>
                        {/* <div className="flex gap-0 items-center text-[#00000099] cursor-pointer">
              <span className="sm:text-[13px] text-[11px] font-medium">
                See All
              </span>
              <MdChevronRight className="text-[14px]" />
            </div> */}
                    </div>
                    {shortsVideos.length > 0 ? (
                        <>
                            <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-10 gap-5 mt-4">
                                {displayedShortsVideos.map((video) => (
                                    <div
                                        key={video._id}
                                        className="cursor-pointer"
                                        onClick={() => Navigate.push(`/video-detail/${video.slug}`)}
                                    >
                                        {
                                            video.thumbnail ?

                                                //   <img
                                                //     src={methodModel.userImg(
                                                //       video.thumbnail ||
                                                //       "assets/img/dummy.webp"
                                                //     )}
                                                //     alt={video.title || "Video thumbnail"}
                                                //     className="max-h-[500px] h-full min-h-[500px] w-full object-cover rounded-[14px]"
                                                //   /> 

                                                <Image
                                                    height={250}
                                                    width={300}
                                                    alt={video.title || "Video thumbnail"}
                                                    src={noImg(video.thumbnail ||
                                                        "assets/img/dummy.webp")}

                                                    className="max-h-[500px] h-full min-h-[500px] w-full object-cover rounded-[14px]" />

                                                :
                                                <Image
                                                    height={250}
                                                    width={300}
                                                    src={"/assets/img/dummy.webp"}
                                                    alt={video.title || "Video thumbnail"}
                                                    className="max-h-[500px] h-full min-h-[500px] w-full object-cover rounded-[14px]"
                                                />
                                        }
                                        <p className="lg:text-[18px] md:text-[16px] text-[16px] font-semibold text-[#000000CC] my-2 ">
                                            {toSentenceCase(video.title)}
                                        </p>
                                        <div className="flex gap-8 items-center">
                                            <span className="md:text-[14px] sm:text-[12px] text-[10px] text-[#000000CC] font-medium">
                                                {formatViews(video.totalViews)} views
                                            </span>
                                            <ul className="list-disc">
                                                <li className="md:text-[14px] sm:text-[12px] text-[10px] text-[#000000CC] font-medium">
                                                    {formatTimeAgo(video.createdAt)}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {shortsVideos.length > 4 && (
                                <div className="flex justify-center whitespace-nowrap items-center gap-3 my-10">
                                    <div className="bg-[#433B3B33] h-[1.5px] w-full"></div>
                                    <button
                                        onClick={() => setShowAllShorts(!showAllShorts)}
                                        className="bg-[#433B3B33] px-5 py-4 justify-center rounded-[8px] border border-[#433B3B33] flex gap-1 items-center sm:text-[14px] text-[12px] max-w-[380px] w-full hover:bg-[#433B3B4D]"
                                    >
                                        <span className="text-[#5F5656] font-semibold">
                                            {showAllShorts ? "Show Less" : "Show More"}
                                        </span>
                                        <HiMiniChevronDoubleUp
                                            className={`text-[16px] transition-transform ${showAllShorts ? "" : "rotate-180"
                                                }`}
                                        />
                                    </button>
                                    <div className="bg-[#433B3B33] h-[1.5px] w-full"></div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex justify-center items-center py-10">
                            <p className="text-[#00000099] sm:text-[16px] text-[14px]">
                                No data found
                            </p>
                        </div>
                    )}
                </div>

                {/* Long Videos Section */}
                <div className="my-10">
                    <div className="flex items-end justify-between gap-2 flex-wrap">
                        <div>
                            <p className="xl:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#000000CC] font-semibold">
                                Long Videos
                            </p>
                            <p className="sm:text-[16px] text-[14px] text-[#00000099]">
                                In-depth wellness content and tutorials
                            </p>
                        </div>
                        {/* <div className="flex gap-0 items-center text-[#00000099] cursor-pointer">
              <span className="sm:text-[13px] text-[11px] font-medium">
                See All
              </span>
              <MdChevronRight className="text-[14px]" />
            </div> */}
                    </div>
                    {longVideos.length > 0 ? (
                        <>
                            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-10 gap-5 mt-4">
                                {displayedLongVideos.map((video) => (
                                    <div
                                        key={video._id}
                                        className="flex relative flex-col gap-3 cursor-pointer justify-between"
                                        onClick={() => Navigate.push(`/video-detail/${video.slug}`)}
                                    >
                                        <div>
                                            {
                                                video.thumbnail ?

                                                    <Image
                                                        height={250}
                                                        width={300}
                                                        alt={video.title || "Video thumbnail"}
                                                        src={noImg(video.thumbnail ||
                                                            "assets/img/dummy.webp")}

                                                        className="rounded-[6px] max-h-[215px] w-full object-cover" />


                                                    // <img
                                                    //   src={methodModel.userImg(
                                                    //     video.thumbnail ||
                                                    //     "assets/img/dummy.webp"
                                                    //   )}
                                                    //   alt={video.title || "Video thumbnail"}
                                                    //   className="rounded-[6px] max-h-[215px] w-full object-cover"
                                                    // /> 

                                                    :
                                                    <Image
                                                        height={250}
                                                        width={300}
                                                        src={"/assets/img/dummy.webp"}
                                                        alt={video.title || "Video thumbnail"}
                                                        className="rounded-[6px] max-h-[215px] w-full object-cover"
                                                    />
                                            }
                                            <p className="mt-3 lg:text-[22px] md:text-[20px] sm:text-[18px] text-[17px] text-[#000000CC] font-bold">
                                                {toSentenceCase(video.title)}
                                            </p>
                                        </div>
                                        <div
                                            className="md:text-[16px] sm:text-[15px] text-[14px] text-[#00000099] line-clamp-3"
                                            dangerouslySetInnerHTML={{
                                                __html: video?.description
                                                    ? video.description.replace(/<\/?[^>]+(>|$)/g, "")
                                                    : "",
                                            }}
                                        />
                                        <div>
                                            <div className="flex gap-8 items-center">
                                                <span className="md:text-[14px] sm:text-[12px] text-[10px] text-[#000000CC] font-medium">
                                                    {formatViews(video.totalViews)} views
                                                </span>
                                                <ul className="list-disc flex gap-8 items-center">
                                                    <li className="md:text-[14px] sm:text-[12px] text-[10px] text-[#000000CC] font-medium">
                                                        {formatTimeAgo(video.createdAt)}
                                                    </li>
                                                </ul>
                                            </div>
                                            <button className="mt-3 sm:text-[16px] px-3 w-full text-[14px] bg-[#540C0F] py-1.5 text-[#fff] rounded-full hover:opacity-80">
                                                Watch Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {longVideos.length > 3 && (
                                <div className="flex whitespace-nowrap justify-center items-center gap-3 my-10">
                                    <div className="bg-[#433B3B33] h-[1.5px] w-full"></div>
                                    <button
                                        onClick={() => setShowAllLongVideos(!showAllLongVideos)}
                                        className="bg-[#433B3B33] px-5 py-4 justify-center rounded-[8px] border border-[#433B3B33] flex gap-1 items-center sm:text-[14px] text-[12px] max-w-[380px] w-full hover:bg-[#433B3B4D]"
                                    >
                                        <span className="text-[#5F5656] font-semibold">
                                            {showAllLongVideos ? "Show Less" : "Show More"}
                                        </span>
                                        <HiMiniChevronDoubleUp
                                            className={`text-[16px] transition-transform ${showAllLongVideos ? "" : "rotate-180"
                                                }`}
                                        />
                                    </button>
                                    <div className="bg-[#433B3B33] h-[1.5px] w-full"></div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex justify-center items-center py-10">
                            <p className="text-[#00000099] sm:text-[16px] text-[14px]">
                                No data found
                            </p>
                        </div>
                    )}
                </div>

                {/* Playlist Videos Section */}
                <div className="my-10">
                    <div className="flex items-end justify-between gap-2 flex-wrap">
                        <div>
                            <p className="xl:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#000000CC] font-semibold">
                                Playlist Videos
                            </p>
                            <p className="sm:text-[16px] text-[14px] text-[#00000099]">
                                Curated video collections
                            </p>
                        </div>
                        {/* <div className="flex gap-0 items-center text-[#00000099] cursor-pointer">
              <span className="sm:text-[13px] text-[11px] font-medium">
                See All
              </span>
              <MdChevronRight className="text-[14px]" />
            </div> */}
                    </div>
                    {playlistVideos.length > 0 ? (
                        <>
                            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-10 gap-5 mt-4">
                                {displayedPlaylistVideos.map((video: any) => (
                                    <div
                                        key={video._id}
                                        className="flex relative flex-col gap-3 cursor-pointer justify-between"
                                        onClick={() => Navigate.push(`/video-detail/${video.slug}`)}
                                    >
                                        <div>
                                            {
                                                video.thumbnail ?


                                                    <Image
                                                        height={250}
                                                        width={300}
                                                        alt={video.title || "Video thumbnail"}
                                                        src={noImg(video.thumbnail ||
                                                            "assets/img/dummy.webp")}

                                                        className="rounded-[6px] max-h-[215px] w-full object-cover" /> :
                                                    <Image
                                                        height={250}
                                                        width={300}
                                                        src={"/assets/img/dummy.webp"}
                                                        alt={video.title || "Video thumbnail"}
                                                        className="rounded-[6px] max-h-[215px] w-full object-cover"
                                                    />
                                            }
                                            <div className="mt-3 px-4 py-1.5 bg-[#E1E1E14D] text-[#fff] sm:text-[14px] text-[12px] font-medium rounded-full absolute top-[15px] right-[12px] backdrop-blur-[8px]">
                                                Playlist · {video.populatedVideos?.length || 0} Videos
                                            </div>
                                            <p className="mt-3 lg:text-[22px] md:text-[20px] sm:text-[18px] text-[17px] text-[#000000CC] font-bold">
                                                {toSentenceCase(video.main_title ? video.main_title : video.title)}
                                            </p>
                                        </div>
                                        <div
                                            className="md:text-[16px] sm:text-[15px] text-[14px] text-[#00000099] line-clamp-3"
                                            dangerouslySetInnerHTML={{
                                                __html: video?.description
                                                    ? video.description.replace(/<\/?[^>]+(>|$)/g, "")
                                                    : "",
                                            }}
                                        />
                                        <div>
                                            <div className="flex gap-8 items-center">
                                                <span className="md:text-[14px] sm:text-[12px] text-[10px] text-[#000000CC] font-medium">
                                                    {video.populatedVideos?.length || 0} videos
                                                </span>
                                                <ul className="list-disc flex gap-8 items-center">
                                                    <li className="md:text-[14px] sm:text-[12px] text-[10px] text-[#000000CC] font-medium">
                                                        {formatViews(video.totalViews)} views
                                                    </li>
                                                    <li className="md:text-[14px] sm:text-[12px] text-[10px] text-[#000000CC] font-medium">
                                                        {formatTimeAgo(video.createdAt)}
                                                    </li>
                                                </ul>
                                            </div>
                                            <button className="mt-3 sm:text-[16px] px-3 w-full text-[14px] bg-[#540C0F] py-1.5 text-[#fff] rounded-full hover:opacity-80">
                                                Watch Playlists
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {playlistVideos.length > 3 && (
                                <div className="flex whitespace-nowrap justify-center items-center gap-3 my-10">
                                    <div className="bg-[#433B3B33] h-[1.5px] w-full"></div>
                                    <button
                                        onClick={() => setShowAllPlaylists(!showAllPlaylists)}
                                        className="bg-[#433B3B33] px-5 py-4 justify-center rounded-[8px] border border-[#433B3B33] flex gap-1 items-center sm:text-[14px] text-[12px] max-w-[380px] w-full hover:bg-[#433B3B4D]"
                                    >
                                        <span className="text-[#5F5656] font-semibold">
                                            {showAllPlaylists ? "Show Less" : "Show More"}
                                        </span>
                                        <HiMiniChevronDoubleUp
                                            className={`text-[16px] transition-transform ${showAllPlaylists ? "" : "rotate-180"
                                                }`}
                                        />
                                    </button>
                                    <div className="bg-[#433B3B33] h-[1.5px] w-full"></div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex justify-center items-center py-10">
                            <p className="text-[#00000099] sm:text-[16px] text-[14px]">
                                No data found
                            </p>
                        </div>
                    )}
                </div>

                {/* Series Videos Section */}
                <div className="my-10">
                    <div className="flex items-end justify-between gap-2 flex-wrap">
                        <div>
                            <p className="xl:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#000000CC] font-semibold">
                                Series Videos
                            </p>
                            <p className="sm:text-[16px] text-[14px] text-[#00000099]">
                                Structured wellness journeys
                            </p>
                        </div>
                        {/* <div className="flex gap-0 items-center text-[#00000099] cursor-pointer">
              <span className="sm:text-[13px] text-[11px] font-medium">
                See All
              </span>
              <MdChevronRight className="text-[14px]" />
            </div> */}
                    </div>
                    {seriesVideos.length > 0 ? (
                        <>
                            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-10 gap-5 mt-4">
                                {displayedSeriesVideos.map((video) => (
                                    <div
                                        key={video._id}
                                        className="flex relative flex-col gap-3 cursor-pointer justify-between"
                                        onClick={() => Navigate.push(`/video-detail/${video.slug}`)}
                                    >
                                        <div>
                                            {
                                                video.thumbnail ?

                                                    <Image
                                                        height={250}
                                                        width={300}
                                                        alt={video.title || "Video thumbnail"}
                                                        src={noImg(video.thumbnail ||
                                                            "assets/img/dummy.webp")}

                                                        className="rounded-[6px] max-h-[215px] w-full object-cover" /> :
                                                    <Image
                                                        height={250}
                                                        width={300}
                                                        src={"assets/img/dummy.webp"}
                                                        alt={video.title || "Video thumbnail"}
                                                        className="rounded-[6px] max-h-[215px] w-full object-cover"
                                                    />
                                            }
                                            <div className="mt-3 px-4 py-1.5 bg-[#E1E1E14D] text-[#fff] sm:text-[14px] text-[12px] font-medium rounded-full absolute top-[15px] right-[12px] backdrop-blur-[8px]">
                                                Series · {video.populatedVideos?.length || 0} Episodes
                                            </div>
                                            <p className="mt-3 lg:text-[22px] md:text-[20px] sm:text-[18px] text-[17px] text-[#000000CC] font-bold ">
                                                {toSentenceCase(video.title)}
                                            </p>
                                        </div>
                                        <div
                                            className="md:text-[16px] sm:text-[15px] text-[14px] text-[#00000099] line-clamp-3"
                                            dangerouslySetInnerHTML={{
                                                __html: video?.description
                                                    ? video.description.replace(/<\/?[^>]+(>|$)/g, "")
                                                    : "",
                                            }}
                                        />
                                        <div>
                                            <div className="flex gap-8 items-center">
                                                <span className="md:text-[14px] sm:text-[12px] text-[10px] text-[#000000CC] font-medium">
                                                    {formatViews(video.totalViews)} views
                                                </span>
                                                <ul className="list-disc flex gap-8 items-center">
                                                    <li className="md:text-[14px] sm:text-[12px] text-[10px] text-[#000000CC] font-medium">
                                                        {formatTimeAgo(video.createdAt)}
                                                    </li>
                                                </ul>
                                            </div>
                                            <button className="mt-3 px-3 w-full sm:text-[16px] text-[14px] bg-[#540C0F] py-1.5 text-[#fff] rounded-full hover:opacity-80">
                                                Watch Series
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {seriesVideos.length > 3 && (
                                <div className="flex whitespace-nowrap justify-center items-center gap-3 my-10">
                                    <div className="bg-[#433B3B33] h-[1.5px] w-full"></div>
                                    <button
                                        onClick={() => setShowAllSeries(!showAllSeries)}
                                        className="bg-[#433B3B33] px-5 py-4 justify-center rounded-[8px] border border-[#433B3B33] flex gap-1 items-center sm:text-[14px] text-[12px] max-w-[380px] w-full hover:bg-[#433B3B4D]"
                                    >
                                        <span className="text-[#5F5656] font-semibold">
                                            {showAllSeries ? "Show Less" : "Show More"}
                                        </span>
                                        <HiMiniChevronDoubleUp
                                            className={`text-[16px] transition-transform ${showAllSeries ? "" : "rotate-180"
                                                }`}
                                        />
                                    </button>
                                    <div className="bg-[#433B3B33] h-[1.5px] w-full"></div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex justify-center items-center py-10">
                            <p className="text-[#00000099] sm:text-[16px] text-[14px]">
                                No data found
                            </p>
                        </div>
                    )}
                </div>
            </div>


        </>
    );
};

export default VideoHtml;