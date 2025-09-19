import { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME, noImg } from "@/utils/shared";
import axios from "axios";
import envirnment from "@/envirnment";
import { cookies } from "next/headers";

async function fetchDetail(slug: string) {
  try {
  const cookieStore = cookies();
    const token = (await cookieStore).get('auth_token')?.value
    const url = `${envirnment.api}product/detail`
    const res = await axios.get(url, {
      params: { slug },
      headers: { 
        "Content-Type": "application/json" ,
         "Authorization": `Bearer ${token}`
      },
    });
    if (!res.data?.success) return null;
    return res.data?.data;
  } catch (error: any) {
    console.error("Error fetching detail:", error?.message);
    return null;
  }
}

// ✅ Dynamic SEO Metadata
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const blog = await fetchDetail(params?.slug);

  if (!blog) {
    return {
      title: `No Data Found - ${APP_NAME}`,
      description: APP_DESCRIPTION,
      openGraph: {
        title: `No Data Found - ${APP_NAME}`,
        description: APP_DESCRIPTION,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `No Data Found - ${APP_NAME}`,
        description: APP_DESCRIPTION,
      },
    };
  }

  const images=blog?.images?.map((itm:any)=>noImg(itm))||[]
  const data={
     title: blog.name,
    description: blog.description,
    openGraph: {
      title: blog.name,
      description: blog.description,
      images: images,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.name,
      description: blog.description,
      images: images,
    },
  }

  return data;
}

export default function MenuDetail() {
  return (
   <>
  menu detail
   </>
  );
}
