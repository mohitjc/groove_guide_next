
import moment from "moment";
import methodModel from "@/utils/methodModel";
import Link from "next/link";
import Image from "next/image";

export const FiltersRecent = ({ recentPosts }:any) => {
  const urlPath = window.location.pathname

  console.log(urlPath, '==',recentPosts);


  return (
    <div className="blogs_details">
      <div className="mb-4">
        <p className="text-xl font-medium">RECENT POSTS</p>
      </div>
      {recentPosts.map((blog:any,i:any) => {
        if (urlPath.includes("/blogs/")) {
          return (
            <>
              <div
                className="w-full group cursor-pointer"
                onClick={() =>
                  window.open(
                    blog?.publishType === 'public'
                      ? `https://theshroomgroove.com/blog/${blog?.slug}`
                      : `/blogs/${blog?.slug}`,
                    '_parent'
                  )
                }
              >
                <div className="relative rounded-md overflow-hidden border border-gray-200 mb-3">
                  <Image width={650} height={500}  
                              src={methodModel.noImg(blog?.cover_image, "/assets/img/thumbnail/Blog.jpg")}
                              className="w-full h-52 md:h-64 object-cover rounded-md transition-transform duration-300 group-hover:scale-105" alt={""}                  />

                  {/* Overlay Text on Hover */}
                  <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {blog?.category_detail && (
                      <p className="bg-white text-[#540C0F] py-1 px-3 rounded-full text-xs font-semibold mb-2">
                        {blog?.category_detail?.name}
                      </p>
                    )}
                    <p className="text-sm">{moment(blog?.updatedAt).format("LL")}</p>
                    <p className="text-lg font-semibold mt-1 line-clamp-2">
                      {blog?.title}
                    </p>
                  </div>
                </div>

                {/* Optional: keep the original text shown below image too */}
                {/* 
  <div className="textshown onhover mt-2">
    <p className="text-[14px] font-medium line-clamp-2">
      {blog?.title}
    </p>
  </div>
  */}
              </div>


            </>
          );
        } else {
          return (
            <div key={i} className="flex md:flex-col cursor-pointer 2xl:flex-row  bg-white p-2 rounded-md border border-gray flex-row items-center gap-2 mb-3">
              <Image
                      src={methodModel.noImg(blog?.cover_image, "/assets/img/thumbnail/Blog.jpg")}
                      className="h-20 w-20 2xl:w-20 md:w-full object-cover rounded-lg" alt={""}  width={200} height={180}            />
              <div className="w-full" onClick={() => window.open(blog?.publishType == 'public' ? `${'https://theshroomgroove.com/'}blog/${blog?.slug}` : `/blogs/${blog?.slug}`, '_parent')}>
                {/* Previous Code */}
                {/* to={`/blog/${blog.slug}`} */}
                <div>
                  <div className="flex justify-between flex-wrap items-center">
                    {blog?.category_detail && (
                      <p className="bg-[#540C0F] py-1 px-2 rounded-full text-white text-[11px] font-regular">
                        {blog?.category_detail?.name}
                      </p>
                    )}
                    <p className="text-xs">
                      {moment(blog?.updatedAt).format("LL")}
                    </p>
                  </div>
                  <p className="text-[14px] font-medium mt-2 line-clamp-2">
                    {blog?.title}
                  </p>
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default FiltersRecent