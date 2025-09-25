import React, { useEffect, useState } from "react";
import Link from "next/link";
import ApiClientB from "@/utils/Apiclient";
import methodModel from "@/utils/methodModel";
import Blog from "@/components/Blogs/Blog";
import { useSelector } from "react-redux";
import environment from "@/envirnment";
import Filters from "@/components/Filters/Filters";
import { loaderHtml } from "@/utils/shared";
import Breadcrumb from "@/components/Breadcrumb";
import AudioHtml from "@/components/AudioHtml";
import { FaFacebookF, FaLinkedinIn, FaRegEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Avatar from "./Avatar";
import Image from "next/image";

function BlogDetailComponent({ slug, isPage }:any) {
    
const formattedDate = (publishDate:any)=>{
return publishDate?.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
}

  const user = useSelector((state:any) => state.user.data);
  const {get,post}=ApiClientB()
  const [data, setData] = useState<any>(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [recent, setRecent] = useState([]);
  // const { slug } = useParams();

  const getRecentBlogs = () => {
    const url = "blog/listing";
    get(url, { user_id: user._id, status: 'active', count: 5,publishType:'groove,public' }).then((res) => {
      if (res.success) {
        const filtered = res.data
        setRecent(filtered)
      }
    });
  };

  const getBlogDetails = () => {
    const url = "blog/slug";
    loaderHtml(true);
    get(url, { slug: slug,publishType:'groove' }).then((res) => {
      if (res.success) {
        setData(res.data);
      }
      loaderHtml(false);
    });
  };

  const getRelatedBlogs = (p = {}) => {
    const url = "blog/listing";
    const f = { user_id: user?._id, ...p ,status:'active',publishType:'groove,public',};
    get(url, f).then((res) => {
      if (res.success) {
        setRelatedBlogs(res.data);
      }
    });
  };

  const handleFavouriteClick = (id:any) => {
    post("fav/add-remove", { blog_id: id }).then((res) => {
      if (res.success) {
        getRelatedBlogs({ category: data.category?.id, id: data._id });
      }
    });
  };

  useEffect(() => {
    getBlogDetails();
    getRecentBlogs();
    if (isPage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [slug]);

  useEffect(() => {
    if (data) {
      getRelatedBlogs({ category: data.category?.id, id: data._id });
    }
  }, [data]);

  const IconReturner =(({ name, url }:any) => {
    switch (name) {
      case 'facebook':
        return <a href={url} target='_blank' style={{ color: 'black' }}><FaFacebookF /></a>;
      case 'twitter':
        return <a style={{ color: 'black' }} target='_blank' href={url}><FaXTwitter /></a>;
      case 'linkedin':
        return <a style={{ color: 'black' }} target='_blank' href={url}><FaLinkedinIn /></a>;
      default:
        return null;
    }
  });
  const encodedUrl = encodeURIComponent(`https://grooveguide.io/blog/${data?.slug}`);
  return (
    <>


      {data && (
        <>
          <div>
            <Image width={1720} height={500}
                          src={data?.cover_image
                              ? methodModel.noImg(data?.cover_image)
                              : "/assets/img/thumbnail/Blog.jpg"}
                          className="w-full object-cover h500  object-center" alt={""}   
                          
                          />
          </div>




          <div className={`${isPage ? 'pt-[20px]  lg:container mx-auto  px-4 lg:px-10 2xl:px-16' : ''}`}>
            {isPage ? <>
              <Breadcrumb
                links={[
                  { link: "/", name: "Home" },
                  { link: "/blogs", name: "Blogs" },
                ]}
                currentPage={data?.title}
              />
            </> : <></>}
            <div className="grid grid-cols-12 gap-4 blog-details mt-4">


              <div className={`${isPage ? 'md:col-span-8 lg:col-span-9' : ''} col-span-12`}>
                <div className={`pt-[20px] ${isPage ? 'md:pt-[20px]  px-4 lg:px-10 2xl:px-16' : ''}`}>
                  <div className="imges   gap-2 mb-12">
                    {data?.category && (
                      <span className="px-4 py-2 bg-primary text-white inline-flex text-sm text-center rounded-full">
                        {data.category.name}
                      </span>
                    )}

                    <div className="mt-4 blog-content ">
                      <h1 className="">
                        {data?.title}
                      </h1>

                      {data?.description1 && (
                        <p
                          dangerouslySetInnerHTML={{
                            __html: data?.description1,
                          }}
                          className="  mt-2"
                        ></p>
                      )}
                    </div>
                  </div>
                </div>

                {!data?.isHide && (
                  <div className=" px-4 lg:px-10 2xl:px-16">
                    <div className="grid grid-cols-12 gap-4">
                      {/* <div className="mb-4 col-span-12">
                        <div className="text-center mb-4">
                          <h4 className="capitalize text-[30px] lg:text-[35px] xl:text-[45px] font-semibold">
                            {data?.audio?.title}
                          </h4>
                        </div>
                      </div> */}

                      <div className="col-span-12">
                        {data?.audio?.audio && (
                          <div className="w-full">
                            <AudioHtml
                              src={`${environment.sasurl}/${data.audio.audio}`}
                              className="w-full h-10 object-cover "
                              controls
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* <div className=" pt-[20px] md:pt-[40px] lg:pt-[50px] xl:pt-[60px]  px-4 lg:px-10 2xl:px-16">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="mb-4 col-span-12">
                      <div className="text-center mb-4">
                        <p className="capatilize text-[30px] lg:text-[35px] xl:text-[45px] font-semibold">
                          {data?.title1}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: data?.description2,
                        }}
                      >
                      
                      </p>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      {data?.image ? <>
                        <div className="imgs_texts">
                          <img
                            src={methodModel.noImg(data?.image)}
                            // src="https://theshroomgroove.com/wp-content/uploads/2024/06/1024x1420-blog-image-779x1024.png"
                            className="h-[450px] mx-auto object-cover"
                          />
                        </div>
                      </> : <></>}

                    </div>
                  </div>
                </div> */}

                <div className=" pt-[20px] md:pt-[40px] lg:pt-[50px] xl:pt-[60px]  px-4 lg:px-10 2xl:px-16">
                  <div className="grid grid-cols-12 gap-4">
                    {data.banners.map((itm:any,i:any) => {
                      if (!itm.url && !itm.banner) return <></>
                      return (
                        <div className="py-6 col-span-12" key={i}>
                          <Link href={itm.url}>
                            <Image
                                      src={methodModel.noImg(itm.banner)}
                                      className="h-[100px] w-full mx-auto  object-cover" alt={""}                            />
                          </Link>
                        </div>
                      );
                    })}

                    <div className="mb-4 col-span-12">
                      <div className=" mb-4">
                        <p
                          className="capatilize text-xl"
                          dangerouslySetInnerHTML={{
                            __html: data?.description3,
                          }}
                        ></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {data?.keywords &&
                        data?.keywords.map((keyword:any,i:any) => {
                          return (
                            <span key={i} className="bg-primary px-2 py-1 rounded-full text-xs text-white">
                              {keyword}
                            </span>
                          );
                        })}
                    </div>
                  </div>

                  <div className="pb-6">

                    <div className="flex items-center gap-4 mb-6">
                      <h5 className="text-lg font-semibold text-gray-800">Share</h5>
                      <div className="flex gap-2 blogsicons">
                        <a
                        style={{ color: 'black' }}
                        className='iconng'
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <FaFacebookF />
                      </a>
                      <a
                        className='iconng'
                        href={`https://twitter.com/intent/tweet?url=${encodedUrl}`}
                        target='_blank'
                        style={{ color: 'black' }}
                        rel='noopener noreferrer'
                      >
                        <FaXTwitter />
                      </a>
                      <a
                        className='iconng'
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                        target='_blank'
                        style={{ color: 'black' }}
                        rel='noopener noreferrer'
                      >
                        <FaLinkedinIn />
                      </a>
                      <a
                        className='iconng'
                        style={{ color: 'black' }}
                        href={`mailto:?subject=Check this out&body=${encodedUrl}`}
                      >
                        <FaRegEnvelope />
                      </a>
                      </div>
                    </div>


                    <div className="flex gap-4 flex-wrap items-start">

                      <div className="relative  shrink-0">
                             {data?.authorImage ? (
                      <div className='imgas_sets'>
                        <Image
                          src="/assets/img/blogimg.png" 
                          alt='Shape' 
                          className='img_stas' 
                          loading="lazy"
                          width={100}
                          height={100}

                        />
                        <Image
                          src={methodModel.noImg(data.authorImage, '/assets/images/sides.png')}
                          alt={data?.authorImageAlt || 'Author'}
                          style={{ objectFit: "cover" }}
                          className='img_stas masked_img'
                          loading="lazy"
                          width={100}
                          height={100}
                        />
                      </div>
                    ) : (
                      <Avatar name={data?.authorName || 'Unknown'} />
                    )}
                      </div>


                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="text-[18px] font-bold tracking-[1.5px] text-left leading-[18px] text-black">{data?.authorName || 'Unknown'}</h5>
                          <div className="flex gap-2 blogsicons">
                             {data?.authorlinks?.map((_itm:any) => (
                            _itm?.url && (
                              <div key={_itm.url} className='iconng-small'>
                                <IconReturner name={_itm.id} url={_itm.url} />
                              </div>
                            )
                          ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">Published on {formattedDate(
                          data?.publishDate ? new Date(data.publishDate) : new Date(data?.updatedAt))
                        } </p>
                        <p className="mt-2 text-gray-700 text-sm max-w-md">
                          {data?.authorDesc}
                        </p>
                      </div>
                    </div>
                  </div>


                </div>







              </div>

              {isPage ? <>
                <div className="col-span-12 md:col-span-4 lg:col-span-3  lg:sticky lg:top-5 mt-6">
                  <Filters
                    showCategories={false}
                    showTags={false}
                    showheader={false}
                    showSearchinput={false}
                    isBlogPage={true}
                    recentPosts={recent}
                  />
                </div>
              </> : <></>}
            </div>
          </div>
        </>
      )}

      {isPage ? <>
        <div className=" pt-[20px] md:pt-[40px] lg:pt-[50px] xl:pt-[60px]  px-4 lg:px-10 2xl:px-16">

          <div className="lg:container mx-auto ">



            <h5 className="text-[30px] lg:text-[35px] xl:text-[45px] text-black font-semibold">
              Related Blogs
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-10 lg:mt-8">
              {relatedBlogs &&
                relatedBlogs.map((item:any) => {
                  return (
                    <>
                      <Blog
                        title={item?.title}
                        image={item?.image}
                        time={item.createdAt}
                        onClick={() => handleFavouriteClick(item.id)}
                        isFav={item?.isFav}
                        link={`/blog/${item.slug}`}
                        isLoggedIn={user?.loggedIn}
                      />
                    </>
                  );
                })}
            </div>

          </div>
        </div>
      </> : <></>}



    </>
  );
}

export default BlogDetailComponent;
