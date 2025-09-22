import Image from "next/image";

type Props={
  src:string;
  errSrc?:string;
  onClick?:()=>void;
  className?:string;
  id?:string;
  alt:string;
  title?:string;
  height:any;
  width:any;
}

export default function ImageHtml({
  src,
  errSrc = "/assets/img/placeholder.jpg",
  onClick = () => {},
  className = "",
  id = "",
  alt = "",
  title = "",
  height,
  width
}:Props) {
  const imageErr = (e:any) => {
    // console.error("imageErr",e.target.src)
    e.target.src = errSrc;
  };

  return (
    <>
    <Image 
    height={height}
    width={width}
    src={src}
    onClick={onClick}
    alt={alt}
    title={title}
    id={id}
    onError={imageErr}
    className={className}
    />
    </>
  );
}
