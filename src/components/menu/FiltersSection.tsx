import { useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import RangeSlider from "react-range-slider-input";
import 'react-range-slider-input/dist/style.css';
import DebouncedInput from "../DebouncedInput";
import { dietaryChange, dietaryList, primaryUseList } from "@/utils/shared.utils";


type Props={
  priceRages?: {
    id: string;
    name: string;
    min: any;
    max: any;
  }[];
  priceRangeData?: {
    min: number|string;
    max: number|string;
  };
  priceRangeChange?: (p: any) => void;
  showSearchinput?: boolean;
  searchValue?: string;
  onSearch: (p: any) => void;
  setSearchValue: (p: any) => void;
  onSearchCick: () => void;
  handleClearSearch?: () => void;
  page?: string;
  categorytypes?: {
    id: string;
    name: string;
  }[];
  categoryTypes: string[];
  categorychange: (p: any) => void;
  grooves?: boolean;
  SelectFilter?: boolean;
  grooveChange: (p: any) => void;
  setSelectFilter: (p: any) => void;
  theraCategories?: {
    id: string;
    name: string;
  }[];
  isBlogPage?: boolean;
  funcCategories?: {
    id: string;
    name: string;
  }[];
  recentPosts?: {
    id: string;
    title: string;
    createdAt: string;
    slug: string;
    image: string;
  }[];
  showCategories?: boolean;
  categories?: {
    id: string;
    name: string;
  }[];
  onCategoryClick: (p: any) => void;
  selectedCategory?: string;
  showTags?: boolean;
  experience?: {
    _id: string;
    name: string;
    id: string;
  }[];
  selectedTag?: string[];
  handleTagInputChange: (p: any, _:any) => void;
  experienceH?: string;
  isBox?: boolean;
  setIsBox?: (p: any) => void;
  boxExclusive?: boolean;
  setBoxExclusive?: (p: any) => void;
  dietaryKeys?: {
    [key: string]: boolean;
  };
  dietaryResult?: (p: any) => void;
  setFilter?:(p:any)=>void;
  filters?:any;
  placeholder?:string;
}

const FilterSection = ({
  priceRages,
  priceRangeData,
  priceRangeChange = () => { },
  showSearchinput,
  searchValue, onSearch, setSearchValue, onSearchCick, handleClearSearch, page, categorytypes, categoryTypes, categorychange, grooves, SelectFilter, theraCategories, grooveChange, setSelectFilter, isBlogPage, funcCategories, recentPosts, showCategories, categories, onCategoryClick, selectedCategory, showTags, experience, selectedTag, handleTagInputChange, experienceH, isBox = false, setIsBox = () => { },
  boxExclusive = false,
  setBoxExclusive = () => { },
  dietaryKeys = {},
  dietaryResult = () => { },
  setFilter=(_)=>{},
  filters,
  placeholder=''
}:Props) => {

  const dietaryOnChange = (key:string) => {
    dietaryResult(dietaryChange(key, dietaryKeys))
  }
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [GrooveCollapsed, setGrooveCollapsed] = useState(false);
  const [DietaryCollapsed, setDietaryCollapsed] = useState(false);
  const [PriceCollapsed, setPriceCollapsed] = useState(false);
  const [Experiences, setExperiences] = useState(false);
  const [priceRange, setPriceRange] = useState<{min:any,max:any}>({
    min: '',
    max: ''
  })

  const [tabs, setTab] = useState({
    primaryUse:true,
    category:true
  })

  const tabChange=(key:string)=>{
    setTab((prev:any)=>({...prev,[key]:!prev[key]}))
  }

  useEffect(() => {
    setPriceRange({
      min: priceRangeData?.min || '',
      max: priceRangeData?.max || '',
    })
  }, [priceRangeData])

  const setPrimary=(id:string)=>{
    let primaryUse=[...(filters?.primaryUse||[])]
    if(primaryUse.includes(id)){
      primaryUse=primaryUse.filter(itm=>itm!=id)
    }else{
      primaryUse.push(id)
    }
    setFilter({primaryUse:primaryUse,categories:'',tags:[]})
  }

  const catClick=(id:string)=>{
    let categories=[...(filters?.categories||[])]
    if(categories.includes(id)){
      categories=categories.filter(itm=>itm!=id)
    }else{
      categories.push(id)
    }
    setFilter({categories:categories})
  }

  return <>
    {showSearchinput && (
      <>
        <div className="flex items-center justify-center mb-8">
          <form className="w-full">
            <div className="border border-[#434D56] rounded-md bg-[#F9F7F5] flex items-center h-12 ">
              <div className="flex relative w-full">
                <input
                  type="text"
                  className="w-full px-4 bg-[#F9F7F5] placeholder:text-gray-800 pr-6"
                  placeholder={placeholder?placeholder:`${page == 'content' ? 'Search Resources' : 'Search Menu'}`}
                  value={searchValue}
                  onChange={(e) => {
                    onSearch(e)
                    setSearchValue(e.target.value)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onSearchCick();
                    }
                  }}
                />
                {searchValue && (
                  <i
                    className="fa fa-times absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                    aria-hidden="true"
                    onClick={handleClearSearch}
                  ></i>
                )}
              </div>

              <div className="h-full w-12 bg-[#F9F7F5] rounded-md flex items-center justify-center" onClick={onSearchCick}>
                <IoSearchOutline
                  className="text-[#52525B] cursor-pointer"
                />
              </div>
            </div>
          </form>
        </div>
      </>
    )}

    {page == 'content' ? <>
      <div className="cate_texts overflow-y-auto mb-8">
        <p onClick={() => setIsCollapsed(!isCollapsed)} className="text-black flex items-center gap-2 justify-between font-semibold text-[18px] lg:text-[16px] xl:text-[18px] cursor-pointer border-t-[1px] pt-1 mb-3 border-t-[1px] pt-1 mb-3 border-gray-300">
          Category {isCollapsed ? <IoIosArrowUp className="text-[#8B96A5]" /> : <IoIosArrowDown className="text-[#8B96A5]" />}
        </p>
        {!isCollapsed && (
          <div className="mt-4 custom-scrollbar pr-2">
            <ul>
              {categorytypes &&
                categorytypes.map((item) => {
                  return (
                    <li key={item.id} className="text-[#061522] font-inter text-[12px] xl:text-[16px] font-bold leading-[28px] uppercase flex gap-2 items-center mb-2">
                      <input
                        type="checkbox"
                        className="h-3 w-3 cursor-pointer custom-input "
                        checked={categoryTypes.includes(item.id)}
                        value={item.id}
                        title={item.name}
                        style={{ accentColor: "#540C0F" }}
                        onChange={(e) => {
                          categorychange(e)
                        }}
                      />
                      {item.name}
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </div>
    </> : <></>}

    {page == 'discover' ? <>
      <div className="cate_texts overflow-y-auto mb-8">
        <p onClick={() => setGrooveCollapsed(!GrooveCollapsed)} className="text-black flex items-center gap-2 justify-between font-semibold text-[18px] lg:text-[16px] xl:text-[18px] cursor-pointer border-t-[1px] pt-1 mb-3 border-t-[1px] pt-1 mb-3 border-gray-300">
          My Groove {GrooveCollapsed ? <IoIosArrowUp className="text-[#8B96A5]" /> : <IoIosArrowDown className="text-[#8B96A5]" />}
        </p>
        {!GrooveCollapsed && (
          <div className="mt-4 custom-scrollbar pr-2">
            <ul>
              <li className="text-[#061522] font-inter text-[12px] xl:text-[16px] font-bold leading-[28px] uppercase flex gap-2 items-center mb-2">
                <input
                  type="checkbox"
                  className="h-3 w-3 cursor-pointer custom-input "
                  checked={grooves && SelectFilter}
                  style={{ accentColor: "#540C0F" }}
                  onChange={(e) => {
                    grooveChange(e);
                  }}
                />
                Recommended for You
              </li>
              <li className="text-[#061522] font-inter text-[12px] xl:text-[16px] font-bold leading-[28px] uppercase flex gap-2 items-center mb-2">

                <input
                  type="checkbox"
                  className="h-3 w-3 cursor-pointer custom-input "
                  checked={isBox}
                  style={{ accentColor: "#540C0F" }}
                  onChange={(e) => {
                    setIsBox(e.target.checked);
                  }}
                />
                {`In this Month's Box`}
              </li>
              <li className="text-[#061522] font-inter text-[12px] xl:text-[16px] font-bold leading-[28px] uppercase flex gap-2 items-center mb-2">

                <input
                  type="checkbox"
                  className="h-3 w-3 cursor-pointer custom-input "
                  checked={boxExclusive}
                  style={{ accentColor: "#540C0F" }}
                  onChange={(e) => {
                    setBoxExclusive(e.target.checked);
                  }}
                />
                Exclusive Box
              </li>
            </ul>
          </div>
        )}
      </div>

<div className="cate_texts overflow-y-auto mb-8">
        <p onClick={() => tabChange('primaryUse')} className="text-black flex items-center gap-2 justify-between font-semibold text-[18px] lg:text-[16px] xl:text-[18px] cursor-pointer border-t-[1px] pt-1 mb-3 border-t-[1px] pt-1 mb-3 border-gray-300">
          Primary Use {!tabs.primaryUse ? <IoIosArrowUp className="text-[#8B96A5]" /> : <IoIosArrowDown className="text-[#8B96A5]" />}
        </p>
        {tabs.primaryUse && (
          <div className="mt-4 custom-scrollbar pr-2">
            <ul className=" ">
              {primaryUseList?.map((item) => {
                return (
                  <li key={item.id} onClick={()=>setPrimary(item.id)} className="text-[#061522] font-inter text-[12px] xl:text-[16px] font-bold leading-[28px] uppercase flex gap-2 items-center mb-2">

                    <input
                      type="checkbox"
                      className="h-3 w-3 cursor-pointer custom-input "
                      checked={filters?.primaryUse?.includes(item.id) ? true : false}
                      style={{ accentColor: "#540C0F" }}
                    />
                    {item.name}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="cate_texts overflow-y-auto mb-8">
        <p onClick={() => tabChange('category')} className="text-black flex items-center gap-2 justify-between font-semibold text-[18px] lg:text-[16px] xl:text-[18px] cursor-pointer border-t-[1px] pt-1 mb-3 border-t-[1px] pt-1 mb-3 border-gray-300 mb-3 border-gray-300 ">
          Category {!tabs.category ? <IoIosArrowUp className="text-[#8B96A5]" /> : <IoIosArrowDown className="text-[#8B96A5]" />}
        </p>
        {tabs.category && (
          <div className="mt-4 custom-scrollbar pr-2">
            <ul>
              {theraCategories?.map((item) => {
                return (
                  <li key={item.id} onClick={()=>catClick(item.id)} className="text-[#061522] font-inter text-[12px] xl:text-[16px] font-bold leading-[28px] uppercase flex gap-2 items-center mb-2">

                    <input
                      type="checkbox"
                      className="h-3 w-3 cursor-pointer custom-input "
                      checked={filters.categories?.includes(item.id)}
                      value={item.id}
                      style={{ accentColor: "#540C0F" }}
                      onChange={(e) => {
                        setSelectFilter(true)
                      }}
                    />
                    {item.name}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

    {showTags && (
      <div className="cate_texts overflow-y-auto mb-8">
        <p onClick={() => setExperiences(!Experiences)} className="text-black flex items-center gap-2 justify-between font-semibold text-[18px] lg:text-[16px] xl:text-[18px] cursor-pointer border-t-[1px] pt-1 mb-3 border-t-[1px] pt-1 mb-3 border-gray-300">
        Experiences & Benefits {Experiences ? <IoIosArrowUp className="text-[#8B96A5]" /> : <IoIosArrowDown className="text-[#8B96A5]" />}
        </p>
        {!Experiences && (
          <div className="mt-4 custom-scrollbar pr-2">
            <ul>
              {experience &&
                experience.map((item) => {
                  return (
                    <li key={item._id} className="text-[#061522] font-inter text-[12px] xl:text-[16px] font-bold leading-[28px] uppercase flex gap-2 items-center mb-2">

                      <input
                        type="checkbox"
                        className="h-3 w-3 cursor-pointer custom-input "
                        checked={selectedTag?.includes(item.id)}
                        style={{ accentColor: "#540C0F" }}
                        onChange={(e) => {
                          handleTagInputChange(e.target.checked, item._id);
                          try {
                            setSelectFilter(true)
                          } catch {

                          }
                        }
                        }
                      />
                      {item.name}
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </div>
    )}

     

      <div className="cate_texts overflow-y-auto mb-8">
        <p onClick={() => setDietaryCollapsed(!DietaryCollapsed)} className="text-black flex items-center gap-2 justify-between font-semibold text-[18px] lg:text-[16px] xl:text-[18px] cursor-pointer border-t-[1px] pt-1 mb-3 border-t-[1px] pt-1 mb-3 border-gray-300">
          Dietary {DietaryCollapsed ? <IoIosArrowUp className="text-[#8B96A5]" /> : <IoIosArrowDown className="text-[#8B96A5]" />}
        </p>
        {!DietaryCollapsed && (
          <div className="mt-4 custom-scrollbar pr-2">
            <ul className=" ">
              {dietaryList?.map((item) => {
                return (
                  <li key={item.id} className="text-[#061522] font-inter text-[12px] xl:text-[16px] font-bold leading-[28px] uppercase flex gap-2 items-center mb-2">

                    <input
                      type="checkbox"
                      className="h-3 w-3 cursor-pointer custom-input "
                      checked={dietaryKeys?.[item.id] ? true : false}
                      style={{ accentColor: "#540C0F" }}
                      onChange={(e) => {
                        dietaryOnChange(item.id)
                      }}
                    />
                    {item.name}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* <div className="cate_texts overflow-y-auto mb-8">
        <p onClick={() => setPriceCollapsed(!PriceCollapsed)} className="text-black flex items-center gap-2 justify-between font-semibold text-[18px] lg:text-[16px] xl:text-[18px] cursor-pointer border-t-[1px] pt-1 mb-3 border-t-[1px] pt-1 mb-3 border-gray-300 mb-3 border-gray-300 ">
          Price Range {PriceCollapsed ? <IoIosArrowUp className="text-[#8B96A5]" /> : <IoIosArrowDown className="text-[#8B96A5]" />}
        </p>

        {!PriceCollapsed && (
          <div className="mt-4 custom-scrollbar pr-2">
            <ul className=" ">
              {priceRages?.map((item) => {
                return (
                  <li key={item.id} className="text-[#061522] font-inter text-[12px] xl:text-[16px] font-bold leading-[28px] uppercase flex gap-2 items-center mb-2">

                    <input
                      type="checkbox"
                      className="h-3 w-3 cursor-pointer custom-input "
                      checked={priceRangeId == item.id}
                      value={item.id}
                      name='priceRage'
                      style={{ accentColor: "#540C0F" }}
                      onChange={(e) => {
                        if (priceRangeId === item?.id) {
                          priceRangeChange({ min: '', max: '' })
                        } else {
                          priceRangeChange(item)
                        }
                      }}
                    />
                    {item.name}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div> */}


      <div className="cate_texts overflow-y-auto mb-8">
        <p onClick={() => setPriceCollapsed(!PriceCollapsed)} className="text-black flex items-center gap-2 justify-between font-semibold text-[18px] lg:text-[16px] xl:text-[18px] cursor-pointer border-t-[1px] pt-1 mb-3 border-t-[1px] pt-1 mb-3 border-gray-300 mb-3 border-gray-300 ">
          Price Range {PriceCollapsed ? <IoIosArrowUp className="text-[#8B96A5]" /> : <IoIosArrowDown className="text-[#8B96A5]" />}
        </p>

        {!PriceCollapsed && (
          <div className="mt-4 custom-scrollbar pr-2">
            <div className="">
              <div className="py-3 mb-3">
                <RangeSlider
                  value={[priceRange.min || 0, priceRange.max || 100]}
                  onInput={(e) => setPriceRange({ min: e[0] || 0, max: e[1] || 0 })}
                  // renderTrack={({ props, children }) => (
                  //   <div
                  //     {...props}
                  //     className="h-2 bg-black rounded-lg"
                  //   >
                  //     {children}
                  //   </div>
                  // )}
                  // renderThumb={({ props }) => (
                  //   <div
                  //     {...props}
                  //     className="w-4 h-4 bg-black rounded-full"
                  //   />
                  // )}
                />

              </div>

              <div className="grid grid-cols-12 gap-3 pb-1">
                <div className="col-span-6">
                  <label>Min</label>
                  <DebouncedInput type="number" maxLength={12} value={priceRange.min} onChange={e => setPriceRange(prev => ({ ...prev, min: e, max: e > prev.max ? e : prev.max }))} className="h-10 w-full border !border-[#DEE2E7] rounded-md px-3" />
                </div>
                <div className="col-span-6">
                  <label>Max</label>
                  <DebouncedInput type="number" maxLength={12} value={priceRange.max} onChange={e => setPriceRange(prev => ({ ...prev, max: e, min: (e < prev.min&&e) ? e : prev.min }))} className="h-10 w-full border !border-[#DEE2E7] bg-white  rounded-md px-3" />
                </div>

                <div className="col-span-12">
                  <button type="button" onClick={() => {
                    priceRangeChange({ min: priceRange.min, max: priceRange.max })
                  }} className="bg-[#540C0F] text-white  hover:shadow-sm w-full px-3 py-2 text-[#540C0F] border !border-[#DEE2E7] rounded-md">Apply</button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

    </> : <></>}

    {/* {isBlogPage && recentPosts && <FiltersRecent recentPosts={recentPosts} />} */}

    {showCategories && (
      <div className="cate_texts overflow-y-auto mb-8">
        <p onClick={() => setIsCollapsed(!isCollapsed)} className="text-black flex items-center gap-2 justify-between font-semibold text-[18px] lg:text-[16px] xl:text-[18px] cursor-pointer border-t-[1px] pt-1 mb-3 border-t-[1px] pt-1 mb-3 border-gray-300uppercase">
          Categories {isCollapsed ? <IoIosArrowUp className="text-[#8B96A5]" /> : <IoIosArrowDown className="text-[#8B96A5]" />}
        </p>
        {!isCollapsed && (
          <div className="mt-4 custom-scrollbar">
            <ul>
              {categories &&
                categories.map((item:any, index) => {
                  return (
                    <span
                      key={index}
                      onClick={() => {
                        onCategoryClick(item);
                      }}
                      className="cursor-pointer"
                    >
                      <li
                        key={index}
                        className={`text-[16px] font-semibold border-b border-gray-100 pb-2 mb-3 capitalize ${selectedCategory?.includes(item?._id)
                          ? "underline underline-offset-4 text-[#540C0F]"
                          : "text-[#807e7e]"
                          }`}
                      >
                        {item.name}
                      </li>
                    </span>
                  );
                })}
            </ul>
          </div>
        )}
      </div>
    )}



  </>
}

export default FilterSection