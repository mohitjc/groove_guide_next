"use client";

import React, { useState, useEffect } from "react";
// import PageLayout from "../../components/global/PageLayout";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "./style.scss";
import ApiClientB from "@/utils/Apiclient";
import { useRouter, useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import SingleProduct from "@/components/menu/SingleProduct";
import { useSelector } from "react-redux";
import ProductDetail from "./ProductDetail";

function ViewProduct() {
    const {get,post}=ApiClientB()
  const user = useSelector((state:any) => state.user?.data);
  const  id  = useParams();
  console.log(id.slug,'useParams');
  
  const [product, setProduct] = useState<any>();
  const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
    console.log(id,'getProductDetail');
    
    if (id) {

      window.scrollTo({ top: 0, behavior: "smooth" });
      getProductDetail();
    }
  }, [id]);

  const getProductDetail = () => {
   get("product/detail", { slug: id.slug, user_id: user?._id }).then(
      (res) => {
        if (res.success) {
          const data=res.data
          if(!data.id) data.id=data._id
          data.sub_products=data.sub_products.map((itm:any,i:any)=>{
            itm.id=itm.id||itm.randomId||String(i)
            itm.images=itm.images||data.images
            return itm
          })
          
          setProduct(res.data);
        }
      }
    );
  };

  const getRelatedProducts = () => {
    get("product/listing", {
      product_type: product?.product_type,
      id: product?.id,
      user_id: user?._id,
    }).then((res) => {
      if (res.success) {
        setRelatedProducts(res.data);
      }
    });
  };


  const handleFavClick = (id:string) => {
    post("fav/add-remove", { product_id: id }).then((res) => {
      if (res.success) {
        // toast.success(res.message);
        getRelatedProducts();
      }
    });
  };




  useEffect(() => {
    if (product) {
      // getProductTags();
      getRelatedProducts();
    }
  }, [product]);

  return (
    <>
      <Breadcrumb
        links={[{ link: "/", name: "Home" }]}
        currentPage={product?.name}
      />

  <ProductDetail id={id.slug} />


      <div className="recommeded_products pt-[20px] md:pt-[40px] lg:pt-[50px] xl:pt-[60px]  px-4 lg:px-10 2xl:px-16">
        <div className="mb-16">
          <div className="flex items-end ">
            <span className="inline-flex bg-black h-[2px] w-full"></span>
            <div className="flex-grow shrink-0">
              <h5 className="text-[30px]  lg:text-[40px] xl:text-[50px] font-semibold 	h-10 lg:h-12 xl:h-14">
                Related Products
              </h5>
            </div>
            <span className="inline-flex bg-black h-[2px] w-full"></span>
          </div>
          <p className="text-center text-[25px]  lg:text-[30px] xl:text-[34px] font-light  ">
            Recommendations For You
          </p>
        </div>

        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {relatedProducts?.map((product,i) => {
              return (
                <SingleProduct
                key={i}
                  item={product}
                  onClick={(id:string) => {
                    handleFavClick(id);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewProduct;
