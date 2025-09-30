"use client";

import { useEffect, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import Blog from "@/components/Blogs/Blog";
import { useSelector } from "react-redux";
import { Tab } from "@headlessui/react";
import SingleProduct from "@/components/menu/SingleProduct";
import { loaderHtml } from "@/utils/shared";
import Table from "@/components/Table";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const Dashboard = () => {
  const user = useSelector((state: any) => state.user.data);
  const [active, setActive] = useState("blogs");



  return (
    <>
        <div className="pt-[20px] md:pt-[40px] lg:pt-[50px] xl:pt-[60px]  px-4 lg:px-10 2xl:px-16">

       
        <Tab.Group>
          <div className="w-full bg-[#3a3a3a] rounded-xl py-3 px-4">
            <Tab.List className="flex gap-2 text-white font-semibold text-[18px]">
              <Tab
                onClick={() => {
                  setActive("blogs");
                }}
                className={({ selected }) =>
                  classNames(
                    "border-r border-white/40 pr-2 focus:outline-none",
                    "",
                    selected ? "text-white" : "text-[#d5d5d5]"
                  )
                }
              >
                Blogs
              </Tab>
              <Tab
                onClick={() => {
                  setActive("products");
                }}
                className={({ selected }) =>
                  classNames(
                    "pr-2 focus:outline-none",
                    "",
                    selected ? "text-white" : "text-[#d5d5d5]"
                  )
                }
              >
                Products
              </Tab>
            </Tab.List>
          </div>
          <Tab.Panels className=" pt-6 pb-6">
            <Tab.Panel>
              <div className="">
              <TabContentBlog />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="">
              <TabContent2 />
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        </div>
    </>
  );
};

export default Dashboard;

const TabContent2 = () => {
      const{get,post}=ApiClientB()
  const user = useSelector((state: any) => state.user.data);
  const [products, setFavProducts] = useState([]);
  const [filters, setFilters] = useState({page:1,count:12});
  const [total, setTotal] = useState(0);
  const getFavProductsList = (p={}) => {
    loaderHtml(true)
    const f={
      ...filters,
      ...p,
      user_id: user?._id,
      isFav:true
    }
    get("product/listing", f).then((res:any) => {
      loaderHtml(false)
      if (res.success) {
        const fav = res.data
        setFavProducts(fav);
        setTotal(res.total)
      }
    });
  };

  useEffect(()=>{
    getFavProductsList()
  },[])

  const filter=(p={})=>{
    setFilters({...filters,...p})
    getFavProductsList(p)
  }

  const handleFavClick = (id: any) => {
    const f: any = {};
    f.product_id = id;
    post("fav/add-remove", f).then((res:any) => {
      if (res.success) {
        getFavProductsList();
      }
    });
  };

  const ListHtml=({row}:any)=>{
    return <SingleProduct
    item={row}
    onClick={(id: any) => {
      handleFavClick(id);
    }}
  />
  }

  return (
    <>
    <Table
              ListHtml={ListHtml}
              data={products}
              count={filters.count}
              page={filters.page}
              rowClass="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              total={total}
              nodata={<>
                  <div className="text-center h-[300px] flex items-center justify-center col-span-12">
                      <div className="flex flex-col gap-6">
                          <img
                              src="/assets/img/noproducts.png"
                              alt=""
                              className="h-36 mx-auto" />
                          <p className="text-gray-400 text-[18px] font-regular">
                              No favorite products.
                          </p>
                      </div>
                  </div>
              </>}
              result={e => {
                  if (e.event == 'page') filter({ page: e.value });
              } } className={""} columns={undefined}    />
    </>
  );
};


const TabContentBlog = () => {
      const{get,post}=ApiClientB()

  const user = useSelector((state: any) => state.user.data);
  const [products, setFavProducts] = useState([]);
  const [filters, setFilters] = useState({page:1,count:12});
  const [total, setTotal] = useState(0);
  const getFavProductsList = (p={}) => {
    loaderHtml(true)
    const f={
      ...filters,
      ...p,
      user_id: user?._id,
      isFav:true,
      publishType:'groove,public',
      status:'active'
    }
    get("blog/listing", f).then((res:any) => {
      loaderHtml(false)
      if (res.success) {
        const fav = res.data
        setFavProducts(fav);
        setTotal(res.total)
      }
    });
  };

  useEffect(()=>{
    getFavProductsList()
  },[])

  const filter=(p={})=>{
    setFilters({...filters,...p})
    getFavProductsList(p)
  }

  const handleFavClick = (id: any) => {
    const f: any = {};
    f.blog_id = id;
    post("fav/add-remove", f).then((res:any) => {
      if (res.success) {
        getFavProductsList();
      }
    });
  };

  const ListHtml=({row}:any)=>{
    return  <Blog
    title={row?.title?.rendered||row?.title}
    link={row?.publishType=='public'?`${ 'https://theshroomgroove.com/'}blog/${row?.slug}`:`/blog/${row.slug}`}
    image={row?.image}
    onClick={() => {
      handleFavClick(row?._id);
    }}
    isFav={row?.isFav}
    isLoggedIn={user?.loggedIn}
  />
  }

  return (
    <>
    <Table
              ListHtml={ListHtml}
              data={products}
              count={filters.count}
              page={filters.page}
              rowClass="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              total={total}
              nodata={<>
                  <div className="text-center h-[300px] flex items-center justify-center col-span-12">
                      <div className="flex flex-col gap-6">
                          <img
                              src="/assets/img/noproducts.png"
                              alt=""
                              className="h-36 mx-auto" />
                          <p className="text-gray-400 text-[18px] font-regular">
                              No favorite blogs.
                          </p>
                      </div>
                  </div>
              </>}
              result={e => {
                  if (e.event == 'page') filter({ page: e.value });
              } } className={""} columns={undefined}    />
    </>
  );
};