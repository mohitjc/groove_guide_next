import { noImg } from "@/utils/shared"

export default function AudioHtml({ src='', className = '', id = '', controls = true }) {
  const fileName = () => {
    const file = src?.split('/')?.pop()
    return file||''
  }
  const extName = () => {
    const file = fileName()
    return file.split('.')?.pop()
  }

  return <>
    <audio
      className={className}
      controls={controls}
      id={id}
    >
      <source src={noImg('compressed/' + fileName())} type={`audio/${extName()}`} />
      <source src={noImg(fileName())} type={`audio/${extName()}`} />
    </audio>
  </>
}