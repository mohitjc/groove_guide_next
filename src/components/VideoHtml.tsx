import { noImg } from "@/utils/shared"

export default function VideoHtml({ src='', className = '', id = '', controls = true, preload = 'false' }) {
  const fileName = () => {
    const file = src?.split('/')?.pop()
    return file||''
  }

  const extName = () => {
    const file = fileName()
    return file.split('.')?.pop()
  }

  return <>
    <video
      className={className}
      preload={preload}
      id={id}
      controls={controls}
    >
      <source src={noImg('compressed/' + fileName())} type={`video/${extName()}`} />
      <source src={noImg(fileName())} type={`video/${extName()}`} />
    </video>
  </>
}