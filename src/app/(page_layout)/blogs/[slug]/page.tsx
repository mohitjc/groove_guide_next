
"use client";

import { useParams } from 'next/navigation'
import BlogDetailComponent from "./BlogDetailComponent";

function Detail() {
  const { slug } = useParams();

  return (

       <BlogDetailComponent
       slug={slug}
       isPage
       />
    
  );
}

export default Detail;
