import React, { useEffect, useRef, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import Html from "./html";
import "./style.scss";

const ImageUpload = ({
  apiUrl = "upload/image",
  accept = "image/*",
  content = "image",
  model,
  result,
  value,
  className = "",
  multiple,
  required,
  err,
  label = "",
}:any) => {

    const {get,multiImageUpload}=ApiClientB()
  const inputElement = useRef<any>('');
  const [img, setImg] = useState<any>("");
  const [loading, setLoader] = useState(false);
  const [error, setError] = useState("");
  console.log(img, "img");

  const uploadImage = async (e:any) => {
    let files = e.target.files;
    let i = 0;
    let imgfile = [];
    for (let item of files) {
      imgfile.push(item);
    }

    let images:any = [];
    if (img) images = img;
    setLoader(true);

    // Set valid types based on content
    let validTypes:any = [];
    if (content === "image") {
      validTypes = ["image/jpeg", "image/png"];
    } else if (content === "audio") {
      validTypes = ["audio/mpeg", "audio/wav", "audio/mp3"];
    } else if (content === "video") {
      validTypes = ["video/mp4", "video/webm", "video/ogg"];
    }

    for await (let item of imgfile) {
      let file = files.item(i);
      if (file) {
        const fileType = file.type;
        if (!validTypes.includes(fileType)) {
          setError(
            content === "image"
              ? "Only image files are allowed (JPG, PNG)."
              : content === "audio"
              ? "Only audio files are allowed (MP3, WAV)."
              : "Only video files are allowed (MP4, WEBM, OGG)."
          );
          setImg(null);
          inputElement.current.value = null;
          setLoader(false);
          return;
        } else {
          setError("");
        }
        const res = await multiImageUpload(apiUrl, files);
        if (res.fileName) {
          let image = res.fileName;
          if (!multiple) {
            setImg(image);
            result({ event: "value", value: image });
          } else {
            images.push(image);
          }
        }
      }
      i++;
    }
    setLoader(false);
    if (multiple) {
      setImg(images);
      result({ event: "value", value: images });
    }
  };

  const remove = (index:any) => {
    if (multiple) {
      let images = img.filter((itm:any, idx:any) => idx !== index);
      result({ event: "remove", value: images });
      setImg(images);
    } else {
      result({ event: "remove", value: "" });
      setImg("");
    }
  };

  useEffect(() => {
    setImg(value);
  }, [value]);

  return (
    <>
      <Html
        label={label}
        accept={accept}
        content={content}
        multiple={multiple}
        inputElement={inputElement}
        uploadImage={uploadImage}
        img={img}
        model={model}
        required={required}
        loader={loading}
        err={err}
        className={className}
        remove={remove}
        error={error}
        // ref={fileInputRef}
      />
    </>
  );
};
export default ImageUpload;
