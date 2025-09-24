import React from "react";
import methodModel from "@/utils/methodModel";
import { FiPlus } from "react-icons/fi";
import AudioHtml from "../AudioHtml";
import VideoHtml from "../VideoHtml";
import Image from "next/image";

const Html = ({
  inputElement,
  uploadImage,
  img,
  remove,
  className = "",
  loader,
  model,
  multiple,
  required,
  err,
  label = "",
  content,
  accept,
  error,
  // ref,
}:any) => {
  return (
    <>
      <label
        className={`block cursor-pointer text-gray-500 bg-white border-2 border-dashed border-[#540C0F] p-3 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
          img && !multiple ? "d-none" : ""
        }`}
      >
        <input
          type="file"
          className="hidden"
          ref={inputElement}
          accept={accept}
          multiple={multiple ? true : false}
          // disabled={loader}
          onChange={(e) => {
            uploadImage(e);
          }}
        />
        <div className="flex gap-2 items-center justify-center">
          <FiPlus />
          <span>{label || "Please upload image"}</span>
        </div>
      </label>
      {error ? <p style={{ color: "red" }}>{error}</p> : ""}
      {!error && loader ? (
        <div className="text-success text-center mt-2">
          Uploading... <i className="fa fa-spinner fa-spin"></i>
        </div>
      ) : (
        <></>
      )}

      {multiple ? (
        <>
          <div className="imagesRow">
            {img &&
              img.map((itm:any, i:any) => {
                return (
                  <>
                    {content == "image" ? (
                      <>
                        <div className="imagethumbWrapper">
                          <Image
                          width={20} height={20}
                            src={methodModel.noImg(itm, model)}
                            className={`thumbnail ${className}`} alt={""}                          />
                          <i
                            className="fa fa-times"
                            title="Remove"
                            onClick={(e) => remove(i)}
                          ></i>
                        </div>
                      </>
                    ) : content == "audio" ? (
                      <>
                        <div className="imagethumbWrapper">
                          <AudioHtml
                            src={methodModel.noImg(itm, model)}
                            className="w-[200px]"
                            controls
                          />
                          <i
                            className="fa fa-times"
                            title="Remove"
                            onClick={(e) => remove(i)}
                          ></i>
                        </div>
                      </>
                    ) : content == "video" ? (
                      <>
                        <div className="imagethumbWrapper">
                          <VideoHtml
                            src={methodModel.noImg(itm, model)}
                            className="w-[200px]"
                            controls
                          />
                          <i
                            className="fa fa-times"
                            title="Remove"
                            onClick={(e) => remove(i)}
                          ></i>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="imagethumbWrapper">
                          <Image
                          width={20} height={20}
                          alt={""}
                            src="/assets/img/ic_asc.png"
                            className={`thumbnail ${className}`}
                          />
                          <i
                            className="fa fa-times"
                            title="Remove"
                            onClick={() => remove(i)}
                          ></i>
                        </div>
                      </>
                    )}
                  </>
                );
              })}
          </div>
        </>
      ) : (
        <>
          {img ? (
            <>
              <div className="imagethumbWrapper">
                {content == "image" ? (
                  <>
                    <Image
                    alt={""}
                    width={20} height={20}
                      src={methodModel.noImg(img, model)}
                      className={`thumbnail ${className}`}
                    />
                  </>
                ) : content == "audio" ? (
                  <>
                    <AudioHtml
                      src={methodModel.noImg(img, model)}
                      className="w-[200px]"
                      controls
                    />
                  </>
                ) : content == "video" ? (
                  <>
                    <VideoHtml
                      src={methodModel.noImg(img, model)}
                      className="w-[200px]"
                      controls
                    />
                  </>
                ) : (
                  <>
                    <Image width={20} height={20}
                              src="/assets/img/ic_asc.png"
                              className={`thumbnail ${className}`} alt={""}                    />
                  </>
                )}
                <i
                  className="fa fa-times"
                  title="Remove"
                  onClick={(e) => remove()}
                ></i>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      )}

      {required && !img ? (
        <div className="text-danger">{err ? err : "Image is Required"}</div>
      ) : (
        <></>
      )}
    </>
  );
};
export default Html;
