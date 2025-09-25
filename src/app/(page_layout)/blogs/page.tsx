"use client";
import React, { useEffect, useState } from "react";
import { BiSolidStopwatch } from "react-icons/bi";
import ApiClientB from "@/utils/Apiclient";
import Blog from "@/components/Blogs/Blog";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Filters from "@/components/Filters/Filters";
import Pagination from "react-paginate";
import moment from "moment";
import methodModel from "@/utils/methodModel";
import Breadcrumb from "@/components/Breadcrumb";
import ImageHtml from "@/components/ImageHtml";
import Image from "next/image";

function Index() {
  const user = useSelector((state:any) => state.user.data);

  const {get,post,put}=ApiClientB()

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [recent, setRecent] = useState();
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [filters, setFilter] = useState({
    page: 1,
    count: 21,
  });

  const getRecentBlogs = () => {
    const url = "blog/listing";
    get(url, { user_id: user._id,status:'active', count:5,publishType:'groove,public' }).then((res) => {
      if (res.success) {
        const filtered = res.data
        setRecent(filtered)
      }
    });
  };

  const getBlogsList = (p = {}) => {
    const f = {
      page: filters.page,
      count: filters.count,
      user_id: user._id,
      publishType:'groove,public',
      ...p,
      status:'active'
    };
    // f['search']=f?.search?encodeURIComponent(f?.search):''
    const url = "blog/listing";
    setLoader(true);
    get(url, f).then((res) => {
      if (res.success) {
        // let filtered = res.data.filter((itm) => itm.status == "active");
        setData(res.data);
        setTotal(res?.total);
      }
      setLoader(false);
    });
  };

  const handleClearSearch = () => {
    setSearch("");
    const url = "blog/listing";
    get(
      url,
      user._id ? { user_id: user._id, search: "",publishType:'groove,public',status:'active' } : { search: "",status:'active',publishType:'groove,public' }
    ).then((res) => {
      if (res.success) {
        getRecentBlogs();
        const filtered = res.data.filter((itm:any) => itm.status == "active");
        setData(filtered);
      }
    });
  };

  const handleFavouriteClick = (id:any) => {
    post("fav/add-remove", { blog_id: id }).then((res) => {
      if (res.success) {
        getBlogsList();
        // toast.success(res.message);
      }
    });
  };

  const pageChange = (e:any) => {
    setFilter({ ...filters, page: e });
    getBlogsList({ page: e });
  };

  useEffect(() => {
    getBlogsList();
    getRecentBlogs();
  }, [user]);

  return (
    <>
    
        <Breadcrumb
          links={[{ link: "/", name: "Home" }]}
          currentPage={"Blogs"}
        />
        <div className="pt-[20px] md:pt-[40px] lg:pt-[50px] xl:pt-[60px]  px-4 lg:px-10 2xl:px-16">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4 lg:col-span-3 2xl:col-span-3">
              <Filters
                showCategories={false}
                showTags={false}
                showheader={false}
                onSearch={(e:any) => {
                  setSearch(e.target.value);
                }}
                searchValue={search}
                onSearchCick={() => getBlogsList({ search: search })}
                placeholder={"Search blog..."}
                handleClearSearch={handleClearSearch}
                isBlogPage={true}
                recentPosts={recent}
              />
            </div>
            <div className="col-span-12 md:col-span-8 lg:col-span-9 2xl:col-span-9">
              <div className="">
                <h5 className="text-[30px] lg:text-[35px] leading-[40px] xl:text-[45px] text-black font-semibold">
                  Latest articles from our blogs
                </h5>
                <p className="text-[15px] text-black/60 font-semibold max-w-xl mt-2">
                 Stay informed with our latest insights, tips, and stories — curated to inspire, educate, and keep you ahead in every step of your journey.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 mt-10">
                {data &&
                  data.map((item:any,i:any) => {
                    return (
                      < div  key={i}>
                        {item.isScrap == "No" && (
                          <Blog
                         
                            title={item?.title}
                            image={item?.cover_image}
                            time={item.createdAt}
                            onClick={() => handleFavouriteClick(item.id)}
                            isFav={item.isFav}
                            link={item?.publishType == 'public' ? `${'https://theshroomgroove.com/'}blogs/${item?.slug}` : `/blogs/${item?.slug}`}
                            isLoggedIn={user?.loggedIn}
                          />
                        )}
                        {!item?.isScrap && (
                          <BlogWordpress
                            title={item?.title}
                            time={item.date}
                            image={item?.cover_image}
                            link={item?.publishType == 'public' ? `${'https://theshroomgroove.com/'}blogs/${item?.slug}` : `/blogs/${item?.slug}`}
                            isLoggedIn={user?.loggedIn}
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
              {loader && (
                <div className="justify-center flex items-center">
                  <div className="me-2 text-gray-400">Loading blogs</div>
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                </div>
              )}
              {!loader && data?.length == 0 && (
                <div className="text-center">
                  <Image
                    src="/assets/img/noproducts.png"
                    alt=""
                    className="h-16 mx-auto"
                    width={200}
                    height={200}
                  />
                  <p className="text-gray-400 text-[18px] font-regular">
                    No Blogs.
                  </p>
                </div>
              )}
              {total > filters.count ? (
                <div className="paginationWrapper  mt-15">
                  <Pagination
                    // currentPage={filters.page}
                    // totalSize={total}
                    // sizePerPage={filters.count}
                    // changeCurrentPage={pageChange}
                    // image={null}


                                  breakLabel="..."
                                  nextLabel="Next >"
                                  onPageChange={pageChange}
                                  pageRangeDisplayed={filters.count}
                                  pageCount={filters.page}
                                  previousLabel="< Prev"
                                  containerClassName="flex gap-2"
                                  pageClassName="px-3 py-1 border rounded"
                                  activeClassName="bg-black text-white"
                                  previousClassName="px-3 py-1 border rounded"
                                  nextClassName="px-3 py-1 border rounded"
                                  breakClassName="px-3 py-1"
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      
    </>
  );
}

export default Index;

const BlogWordpress = ({ title, time, isLoggedIn, link, image }:any) => {
  const formattedTime = moment(time).format("LL");
  return (
    <div className="bg-[#fff] p-4 group flex flex-col gap-2 border border-black/10 rounded-lg  hover:shadow-xl">
      <div className="mb-2 relative overflow-hidden">
        <a href={link} target="_parent">
          <ImageHtml
                      src={image ? methodModel.noImg(image) : "/assets/img/thumbnail/Blog.jpg"}
                      className="w-full object-contain  bg-[#a1282f24]" alt={""} height={200} width={200}          />
        </a>
      </div>
      <div className="">
        <a href={link} target="_parent">
          <h6 className="text-[18px] font-semibold capitalize line-clamp-1 text-left">
            {title}
          </h6>
        </a>
      </div>

      <div className="flex justify-between gap-2 flex-wrap mt-4">
        <div className="flex items-center gap-1">
          <BiSolidStopwatch className="text-[20px]" />
          <span className=" text-black/60 font-medium text-[14px]">
            {formattedTime}
          </span>
        </div>
        <a href={link} target="_parent">
          <p className="shrink-0 text-[#540C0F] font-medium text-[14px] cursor-pointer">
            Read More
          </p>
        </a>
      </div>
    </div>
  );
};
