import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { loaderHtml } from "@/utils/shared";
import ApiClientB from "@/utils/Apiclient";
import { getRandomCode } from "@/utils/shared";
import Image from "next/image";

const CapturePhoto = ({result=(e:any)=>{}}) => {
  const webcamRef:any = useRef(null);
  const {postFormFileData}=ApiClientB()
  const [image, setImage] = useState(null);
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);

    if(!imageSrc) return 
    // Convert base64 to Blob
    loaderHtml(true)
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const body = new FormData();
        body.append('file',blob,`image_${getRandomCode(6)}.png`)
        const file=body.get('file')
        // result({value:blob})
        postFormFileData('upload/multiple-images',{files:file}).then(res=>{
            if (res.success) {
                const file=res.files?.[0]?.fileName
              result({value:file})
            }
            loaderHtml(false);
        })
      })
      .catch((err) => console.error("Blob conversion error:", err));
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-96">
        <div className="p-4">
          {image ? (
            <Image src={image} alt="Captured" className="rounded-lg w-[200px]" />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              className="rounded"
            />
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={capture} className="bg-primary px-6 py-2 rounded text-white text-[13px] rounded-full">
          Capture Photo
        </button>
        {/* <button onClick={() => { setImage(null);}} className="bg-primary px-6 py-2 rounded text-white text-[13px]" variant="destructive">
          Retake
        </button> */}
      </div>

    </div>
  );
};

export default CapturePhoto;
