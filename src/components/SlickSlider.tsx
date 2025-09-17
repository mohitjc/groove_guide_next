import React, { useState, useEffect, useRef, Fragment } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { IoMdClose, IoMdSearch } from "react-icons/io";
import { Dialog, Transition } from "@headlessui/react";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { noImg } from "@/utils/shared";
import ImageHtml from "./ImageHtml";

type Props = {
  images: string[];
  isLoggedIn: boolean;
  onFavClick: () => void;
  isFav: boolean;
}

function SlickSlider({ images, isLoggedIn, onFavClick, isFav }: Props) {
  const [nav1, setNav1] = useState<any>(null);
  const [nav2, setNav2] = useState<any>(null);

  const [favourite, setFavourite] = useState(isFav);

  const [currentIndex, setCurrentImageIndex] = useState(0);
  const sliderRef1 = useRef(null);
  const sliderRef2 = useRef(null);

  useEffect(() => {
    setNav1(sliderRef1.current);
    setNav2(sliderRef2.current);
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  const openModal = (i: any) => {
    setIsOpen(true);
    setCurrentImageIndex(i);
  };

  function handleNextImage() {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  }

  function handlePrevImage() {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }

  useEffect(() => {
    return () => {
      setCurrentImageIndex(0);
    };
  }, []);
  return (
    <div className="slider_thumbs sfs flex">
      {images?.length > 1 && (
        <div className="!w-[20%]">
          <Slider
            asNavFor={nav1}
            ref={sliderRef2}
            slidesToShow={images?.length}
            swipeToSlide={true}
            focusOnSelect={true}
            vertical={true}
            arrows={false}
            infinite={false}
          >
            {images?.map((img, i) => (
              <div key={i}>
                <div className="images_data">
                  <ImageHtml
                    height={430}
                    width={760}
                    className="h-24 w-full object-cover cursor-pointer"
                    src={noImg(img)}
                    alt={`Thumbnail ${i}`}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}


      <div className={`${images?.length > 1 ? `w-[80%]` : `w-[100%]`}`}>
        <Slider
          asNavFor={nav2}
          ref={sliderRef1}
          arrows={false}
          infinite={false}
        >
          {images?.map((img, i) => (
            <div key={i}>
              <div className="main_img_slide relative">
                <ImageHtml
                  height={430}
                  width={760}
                  className="object-contain h-auto w-full"
                  src={noImg(img)}
                  alt={`Main ${i}`}
                />
                {isLoggedIn && (
                  <a
                    onClick={() => {
                      setFavourite(!favourite);
                      onFavClick();
                    }}
                    className="h-10 w-10 bg-white rounded-full absolute right-5 top-5 flex items-center justify-center cursor-pointer shadow-md"
                  >
                    <FaHeart
                      className={`drop-shadow-md text-xl ${favourite ? "text-red-500" : "text-[#E0D5CE]"
                        } `}
                    />
                  </a>
                )}
                <div className="absolute bottom-4 right-4">
                  <IoMdSearch
                    onClick={() => {
                      openModal(i);
                    }}
                    className="text-primary text-3xl cursor-pointer bg-white rounded-full h-10 w-10 p-2 shadow-md"
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {isOpen && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/80" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden relative bg-white text-left align-middle shadow-xl transition-all">
                    <div className="">
                      <Slider
                        slidesToShow={1}
                        arrows={false}
                        infinite={false}
                        initialSlide={currentIndex}
                      >
                        <ImageHtml
                          height={430}
                          width={760}
                          alt="slider image"
                          src={noImg(images[currentIndex])}
                          className="relative object-contain h-auto w-full"
                        />
                      </Slider>

                      {images?.length > 1 && (
                        <div className="absolute flex items-center gap-2 right-0 bottom-0 bg-white px-4 py-2">
                          <MdOutlineChevronLeft
                            onClick={handlePrevImage}
                            className="text-2xl cursor-pointer text-[#540C0F]"
                          />
                          <MdOutlineChevronRight
                            onClick={handleNextImage}
                            className="text-2xl cursor-pointer text-[#540C0F]"
                          />
                        </div>
                      )}
                    </div>
                    <div
                      className="bg-white absolute top-0 px-3 py-2 shadow-lg right-0 cursor-pointer"
                      onClick={closeModal}
                    >
                      <IoMdClose />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  );
}

export default SlickSlider;
