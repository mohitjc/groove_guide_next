import { Metadata } from "next";

// Simulated blog fetch (replace with your CMS / API)
async function getBlog(slug: string) {
  return {
    title: `Blog: ${slug}`,
    description: `This is a detailed post about ${slug}`,
    image: "https://example.com/og-image.jpg",
  };
}

// ✅ Dynamic SEO Metadata
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const blog = await getBlog(params.slug);

  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: [blog.image],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: [blog.image],
    },
  };
}

export default function BlogDetail() {
  return (
    <>
    detai
    </>
  );
}
