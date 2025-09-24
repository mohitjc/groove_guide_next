import React, { Fragment, useEffect, useState } from "react";
import Modal from "../Modal";
import FilterSection from "./FiltersSection";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import ApiClientB from "@/utils/Apiclient";
import { primaryUseList } from "@/utils/shared.utils";
import Image from "next/image";

type FilterType = {
  page?: string;
  filters: any;
  setFilter: (p: any) => void;
  setSelectFilter: (p: boolean) => void;
  SelectFilter?: boolean;
  onCategoryClick: (p: any) => void;
  showCategories?: boolean;
  handleTagInputChange: (p: any,_:any) => void;
  selectedTag?: any[];
  onClearAll: () => void;
  showTags?: boolean;
  onSearch?: (e: any) => void;
  searchValue?: string;
  setSearchValue?: (e: any) => void;
  onSearchCick?: () => void;
  showheader?: boolean;
  placeholder?: string;
  handleClearSearch?: () => void;
  isBlogPage?: boolean;
  recentPosts?: any[];
  className?: string;
  showSearchinput?: boolean;
  grooves?: boolean;
  setGrooves?: (p: boolean) => void;
  categoryTypes?: any;
  setCategoryTypes?: (p: any) => void;
  selectedDeals?: any[];
  setSelectedDeals?: (p: any) => void;
  priceRangeData?: {
    min: string | number;
    max: string | number;
  };
  priceRangeChange?: (p: any) => void;
  isBox?: boolean;
  setIsBox?: (p: boolean) => void;
  boxExclusive?: boolean;
  setBoxExclusive?: (p: boolean) => void;
  dietaryResult?: (p: any) => void;
  dietaryKeys?: any;
}

function MenuFilters({
  page = '',
  filters={},
  setFilter = (_) => { },
  setSelectFilter,
  SelectFilter = true,
  onCategoryClick,
  showCategories=false,
  handleTagInputChange,
  selectedTag,
  onClearAll,
  showTags=true,
  onSearch = () => { },
  searchValue,
  setSearchValue = () => { },
  onSearchCick = () => { },
  showheader=true,
  placeholder="Explore Products, Mushrooms, Mexican, Italian Etc.",
  handleClearSearch = () => { },
  isBlogPage=false,
  recentPosts,
  className = "",
  showSearchinput=true,
  grooves = false, setGrooves = () => { },
  categoryTypes = '',
  setCategoryTypes = () => { },
  selectedDeals = [],
  setSelectedDeals = () => { },
  priceRangeData = {
    min: '',
    max: ''
  },
  priceRangeChange = () => { },
  isBox = false,
  setIsBox = () => { },
  boxExclusive = false,
  setBoxExclusive = () => { },
  dietaryResult = () => { },
  dietaryKeys = {}
}:FilterType) {
  // const [categories, setCategories] = useState([]);
  const {get}=ApiClientB()
  const [theraCategories, setTheraCategories] = useState<any[]>([]);
  const [experience, setExperience] = useState([]);
  const [filterModal, setFilterModal] = useState(false);
  const [selectedCatObj, setSelectedCatObj] = useState<any[]>([]);

  const driedPriceRange = [
    {
      id: '_35',
      name: 'Up to $35/3.5g',
      min: '',
      max: 35
    },
    {
      id: '35_45',
      name: '$35 to $45/3.5g',
      min: 35,
      max: 45
    },
    {
      id: '45_55',
      name: '$45 to $55/3.5g',
      min: 45,
      max: 55
    },
    {
      id: '55_65',
      name: '$55 to $65/3.5g',
      min: 55,
      max: 65
    },
  ]

  const otherPriceRange = [
    {
      id: '_25',
      name: 'Up to $25',
      min: '',
      max: 25
    },
    {
      id: '25_50',
      name: '$25 to $50',
      min: 25,
      max: 50
    },
    {
      id: '50_100',
      name: '$50 to $100',
      min: 50,
      max: 100
    },
    {
      id: '100_',
      name: '$100 & Above',
      min: 100,
      max: ''
    },
  ]


  const [priceRages, setPriceRanges] = useState([
    ...driedPriceRange,
    ...otherPriceRange,
  ]);

  const categories = theraCategories

  const getTheraCategories = (p = {}) => {
    const f = {
      ...p,
      category_type: "master",
      department: filters?.primaryUse?.length == 2 ? '' : (filters?.primaryUse?.toString() || ''),
      status: 'active',
      type: 'product',
      sortBy: 'name asc'
    };

    get("category/listing", f).then((res) => {
      if (res.success) {
        setTheraCategories(res.data);
      }
    });
  };

  const getExperience = () => {
    get("tag/list", { type: filters?.primaryUse?.length == 2 ? '' : (filters?.primaryUse?.toString() || ''), sortBy: 'name asc' }).then((res) => {
      if (res.success) {
        setExperience(res.data);
      }
    });
  };

  useEffect(() => {
    getExperience();
  }, []);

  useEffect(() => {
    getTheraCategories()
    getExperience()
  }, [filters?.primaryUse])


  const grooveChange = () => {
    const checked = !grooves
    setSelectFilter(true)
    setGrooves(checked)
  }

  const categorytypes = [
    { id: 'Therapeutic Use', name: 'Therapeutic' },
    { id: 'Health & Wellness', name: 'Functional' },
    { id: '', name: 'Both' },
  ]

  const categorychange = (e:any) => {
    const checked = e.target.checked
    const value = e.target.value
    let arr = categoryTypes||[]
    if (checked) {
      arr.push(value)
    } else {
      arr = arr.filter((itm:any) => itm != value)
    }
    setCategoryTypes([...arr])
  }



  const catClick = (itm:any) => {
    const id = itm.id
    let arr = selectedCatObj || []
    if (arr.map(itm => itm.id).includes(id)) {
      arr = arr.filter(itm => itm.id != id)
    } else {
      arr.push(itm)
    }

    setSelectedCatObj([...arr])
    onCategoryClick(id)
  }

  const [isOpen3, setIsOpen3] = useState(false);

  const menucatClick = (id:string) => {
    let categories = [...(filters?.categories || [])]
    if (categories.includes(id)) {
      categories = categories.filter(itm => itm != id)
    } else {
      categories.push(id)
    }
    setFilter({ categories: categories })
  }

  const setPrimary = (id:string) => {
    let primaryUse = [...(filters?.primaryUse || [])]
    if (primaryUse.includes(id)) {
      primaryUse = primaryUse.filter(itm => itm != id)
    } else {
      primaryUse.push(id)
    }
    setFilter({ primaryUse: primaryUse, categories: '', tags: [] })
  }

  return (
    <>
      <div className={`col-span-12 md:col-span-4 lg:col-span-3 2xl:col-span-3 md:sticky top-6 hidescroll overflow-y-auto md:h-screen ${className}`}>
        <div className={"!border-none md:!border border-black/46 md:bg-white md:px-6 md:py-6 !pt-4"}>
          {showheader && (
            <>
              <div className={`flex items-center !justify-start md:!justify-between gap-4 mb-0 border-gray-200 md:border-none md:pb-0  `}>
                <div className="hidden max-md:flex  items-center gap-2">
                  <Image width={20} height={20} src="/assets/img/filter.svg" alt={""} />
                  <h5 className="text-black font-semibold text-[16px] lg:text-[20px]">
                    {" "}
                    Filter
                  </h5>
                </div>

                {(selectedTag?.length || searchValue || filters?.categories?.length || grooves || selectedDeals?.length) ? (
                  <a className="ml-auto" onClick={onClearAll}>
                    <span className="text-black font-semibold text-[12px] xl:text-[15px]">
                      Clear all
                    </span>
                  </a>
                ) : <></>}
              </div>

              {showCategories || page == 'discover' ? <>
                <div className="block md:hidden mt-4">
                  {/* sidebar modals */}
                  <div className="rightheader_modals">
                    <div className={`fixed top-0 right-0 z-50 h-screen w-72 bg-white shadow-lg transform transition-transform duration-300 ${isOpen3 ? "translate-x-0" : "translate-x-full"
                      }`}
                    >
                      {/* Sidebar Header */}
                      <div className="flex border-b border-gray-100 justify-between items-center px-4 py-4 border-b">
                        <h2 className="text-lg font-semibold">
                          Filters
                        </h2>
                        <IoMdClose
                          className="text-2xl cursor-pointer"
                          onClick={() => setIsOpen3(false)}
                        />
                      </div>

                      {/* Sidebar Content */}
                      <div className="scrolingaccordingtohieght">
                        <div className="px-4 pt-2 h-[90vh] overflow-auto">
                          <FilterSection
                            dietaryResult={dietaryResult}
                            dietaryKeys={dietaryKeys}
                            isBox={isBox}
                            filters={filters}
                            setFilter={setFilter}
                            setIsBox={setIsBox}
                            boxExclusive={boxExclusive}
                            setBoxExclusive={setBoxExclusive}
                            priceRangeData={priceRangeData}
                            priceRangeChange={priceRangeChange}
                            priceRages={priceRages}
                            showSearchinput={showSearchinput}
                            placeholder={placeholder}
                            searchValue={searchValue}
                            onSearch={onSearch}
                            setSearchValue={setSearchValue}
                            onSearchCick={onSearchCick}
                            handleClearSearch={handleClearSearch}
                            page={page}
                            categorytypes={categorytypes}
                            categoryTypes={categoryTypes}
                            categorychange={categorychange}
                            grooves={grooves}
                            SelectFilter={SelectFilter}
                            theraCategories={theraCategories}
                            grooveChange={grooveChange}
                            setSelectFilter={setSelectFilter}
                            isBlogPage={isBlogPage}
                            recentPosts={recentPosts}
                            showCategories={showCategories}
                            categories={categories}
                            onCategoryClick={catClick}
                            showTags={showTags}
                            experience={experience}
                            selectedTag={selectedTag}
                            handleTagInputChange={handleTagInputChange}
                          />
                        </div>
                      </div>



                    </div>

                    {/* Overlay */}
                    {isOpen3 && (
                      <div
                        className="fixed inset-0 z-40 bg-black bg-opacity-50"
                        onClick={() => setIsOpen3(false)}
                      ></div>
                    )}
                  </div>
                </div>
              </> : <></>}

            </>

          )}

          <div className="block md:hidden pt-4">

            <div className="flex gap-2">
              <div className="flex items-center relative w-full bg-[#F9F7F5] border border-[#E8E8EA] p-3 rounded-lg ">
                <input
                  type="text"
                  className="w-full pr-3  placeholder:text-[12px] bg-transparent placeholder:text-gray-400"
                  placeholder={placeholder}
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
                    className="fa fa-times absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                    aria-hidden="true"
                    onClick={handleClearSearch}
                  ></i>
                )}

                <IoIosSearch
                  onClick={() => onSearchCick()}
                  className="text-black text-[18px] 2xl:text-[18px]"
                />
              </div>

              <div onClick={() => setIsOpen3(true)} className="bg-[#F9F7F5] border border-[#E8E8EA] cursor-pointer flex items-center justify-center px-4 py-1 rounded-lg">
                <Image width={20} height={20} alt="filter" src="/assets/img/v2/filter.svg" className="h-8" />
              </div>
            </div>

            <div className="flex flex-col gap-3 my-3">

              <div className="overflow-auto whitespace-nowrap mobilecustom-scrollbar  ">
                <div className="flex gap-2 mb-2 items-center">
                  <span onClick={() => grooveChange()} className={`px-[12px] py-[5px] rounded-[12px] border-[1px] border-[#540c0f]  ${(grooves && SelectFilter) ? 'bg-primary text-white' : 'bg-white text-primary'}`}>Recommended for You</span>
                  <span onClick={() => setIsBox(!isBox)} className={`px-[12px] py-[5px] rounded-[12px] border-[1px] border-[#540c0f]  ${(isBox) ? 'bg-primary text-white' : 'bg-white text-primary'}`}>{`In this Month's Box`}</span>
                  <span onClick={() => setBoxExclusive(!boxExclusive)} className={`px-[12px] py-[5px] rounded-[12px] border-[1px] border-[#540c0f]  ${(boxExclusive) ? 'bg-primary text-white' : 'bg-white text-primary'}`}>Exclusive Box</span>
                </div>
              </div>

              <div className="overflow-auto whitespace-nowrap mobilecustom-scrollbar  ">
                <div className="flex gap-2 mb-2 items-center">
                  {primaryUseList.map(item => {
                    return <span key={item.id} onClick={() => setPrimary(item.id)} className={`px-[12px] py-[5px] rounded-[12px] border-[1px] border-[#540c0f]  ${filters.primaryUse?.includes(item.id) ? 'bg-primary text-white' : 'bg-white text-primary'}`}>{item.name}</span>
                  })}
                </div>
              </div>

              <div className="overflow-auto whitespace-nowrap mobilecustom-scrollbar ">
                <div className="flex gap-2 mb-2 items-center ">
                  {theraCategories.map(item => {
                    return <span key={item.id} onClick={() => menucatClick(item.id)} className={`px-[12px] py-[5px] rounded-[12px] border-[1px] border-[#540c0f]  ${filters.categories?.includes(item.id) ? 'bg-primary text-white' : 'bg-white text-primary'}`}>{item.name}</span>
                  })}
                </div>
              </div>

            </div>

          </div>


          <div className="hidden md:block ">
            <FilterSection
              dietaryResult={dietaryResult}
              dietaryKeys={dietaryKeys}
              isBox={isBox}
              filters={filters}
              setFilter={setFilter}
              setIsBox={setIsBox}
              boxExclusive={boxExclusive}
              setBoxExclusive={setBoxExclusive}
              priceRangeData={priceRangeData}
              priceRangeChange={priceRangeChange}
              priceRages={priceRages}
              showSearchinput={showSearchinput}
              placeholder={placeholder}
              searchValue={searchValue}
              onSearch={onSearch}
              setSearchValue={setSearchValue}
              onSearchCick={onSearchCick}
              handleClearSearch={handleClearSearch}
              page={page}
              categorytypes={categorytypes}
              categoryTypes={categoryTypes}
              categorychange={categorychange}
              grooves={grooves}
              SelectFilter={SelectFilter}
              theraCategories={theraCategories}
              grooveChange={grooveChange}
              setSelectFilter={setSelectFilter}
              isBlogPage={isBlogPage}
              recentPosts={recentPosts}
              showCategories={showCategories}
              categories={categories}
              onCategoryClick={catClick}
              showTags={showTags}
              experience={experience}
              selectedTag={selectedTag}
              handleTagInputChange={handleTagInputChange}
            />
          </div>



        </div>
      </div>

      {filterModal ? <>
        <Modal
          title="Filters"
          className="filterModal"
          body={<>
            <div className="filterWrapper">
              <FilterSection
                dietaryResult={dietaryResult}
                dietaryKeys={dietaryKeys}
                isBox={isBox}
                filters={filters}
                setFilter={setFilter}
                setIsBox={setIsBox}
                priceRangeChange={priceRangeChange}
                priceRangeData={priceRangeData}
                priceRages={priceRages}
                showSearchinput={showSearchinput}
                placeholder={placeholder}
                searchValue={searchValue}
                onSearch={onSearch}
                setSearchValue={setSearchValue}
                onSearchCick={onSearchCick}
                handleClearSearch={handleClearSearch}
                page={page}
                categorytypes={categorytypes}
                categoryTypes={categoryTypes}
                categorychange={categorychange}
                grooves={grooves}
                SelectFilter={SelectFilter}
                theraCategories={theraCategories}
                grooveChange={grooveChange}
                setSelectFilter={setSelectFilter}
                isBlogPage={isBlogPage}
                recentPosts={recentPosts}
                showCategories={showCategories}
                categories={categories}
                onCategoryClick={catClick}
                showTags={showTags}
                experience={experience}
                selectedTag={selectedTag}
                handleTagInputChange={handleTagInputChange}
              />
            </div>
            <div className="pt-2 text-right">
              <button onClick={() => {
                onSearchCick();
                setFilterModal(false)
              }} className="bg-primary rounded-lg px-4 py-2 text-white">Show Result</button>
            </div>

          </>}
          result={() => {
            setFilterModal(false)
          }}
        />
      </> : <></>}







    </>
  );
}

export default MenuFilters;