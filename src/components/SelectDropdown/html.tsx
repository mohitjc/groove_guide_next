import React, { Fragment, memo, useMemo } from "react";
import methodModel from "@/utils/methodModel";
import "./style.scss";
import Select from "react-select";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import CreatableSelect from "react-select/creatable";

const Html = ({
  isLoading,
  options,
  dynamicStyle = false,
  onFocus = () => { },
  className = "",
  selectedValues,
  onInputChange = () => { },
  handleChange = () => { },
  displayValue,
  id = "",
  placeholder,
  setOptions,
  required = false,
  disabled,
  onBlur,
  name = "",
  noDefault,
  content = '',
  hideDefaultPosition = false,
  theme = "normal",
  isClearable = true,
  // menuIsOpen=false
}: any) => {
  const categoryVal = () => {
    const ext = options && options.find((item: any) => item?.id == selectedValues);
    return ext ? { value: ext.id, label: ext[displayValue] } : selectedValues ? {
      value: selectedValues,
      label: selectedValues
    } : '';
  };

  const dropOptions = useMemo(() => {
    let opt = options?.map((itm: any) => {
      return { value: itm?.id, label: itm?.[displayValue] };
    }) || []

    if (!opt?.length && selectedValues) {
      opt = [{
        value: selectedValues,
        label: selectedValues
      }]
    }
    return opt
  }, [options, selectedValues])

  return (
    <>
      {theme == "search" ? (
        <>
          <div className={`${className || "capitalize"}`}>
            <Select
              options={dropOptions}
              placeholder={placeholder}
              onBlur={onBlur}
              value={categoryVal()}
              onFocus={onFocus}
              isClearable={isClearable}
              name={name}
              onInputChange={onInputChange}
              onChange={(e: any) => handleChange(e?.value || "")}
              className="text-gray-700 block text-sm options_classs "
              isDisabled={disabled ? true : false}
              required={required}
              isLoading={isLoading}
            />
          </div>
        </>
      ) :
        theme === "create" ? (
          <CreatableSelect
            options={dropOptions}
            placeholder={placeholder}
            onBlur={onBlur}
            value={categoryVal()}
             onFocus={onFocus}
            isClearable={isClearable}
            name={name}
            onInputChange={onInputChange}
            onChange={(e: any) => handleChange(e?.value || "")}
            onCreateOption={(inputValue: string) => {
              const newOption = {
                id: inputValue,
                name: inputValue,
              };
              handleChange(inputValue || "")
              setOptions((prev: any) => {
                const data = prev || []
                return ([...data, newOption])
              })
              // handleChange(inputValue); // or full newOption if needed
              // Optionally add new option to your state if maintaining options locally
            }}
               formatCreateLabel={(inputValue) => `Click here to add "${inputValue}"`}
            className="text-gray-700 block text-sm options_classs"
            isDisabled={disabled ? true : false}
              required={required}
              isLoading={isLoading}
          />) : (
          <>
            <div className="selectDropdown">
              <input
                type="hidden"
                name={name}
                required={required}
                value={selectedValues}
              />
              <div className="">
                <Menu as="div" className="relative list_box_active_state ml-auto">
                  <div>
                    <Menu.Button
                      disabled={disabled}
                      id={"dropdownMenuButton" + id}
                      className={`capitalize border flex text-[#808080] justify-between gap-3 align-items-center rounded w-full ${className}`}
                    >
                      <span className="py-2 pl-3 text-[14px]">
                        {selectedValues
                          ? methodModel.find(options, selectedValues, "id")?.[
                          displayValue
                          ] || placeholder
                          : placeholder}
                      </span>

                      <ChevronDownIcon
                        className="text-gray-400 border-l h-[37px] p-2 w-[37px]"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      className={`${dynamicStyle ? "" : "max-h-60"
                        }  focus:!outline-[#540C0F] focus:!outline text-sm absolute !z-10 ${className ? className : "min-w-[auto] lg:min-w-[100%]  md:min-w-[180px]"
                        }  right-0 shadow-lg !py-2 !mt-1.5 overflow-y-auto overflow-x-hidden bg-white  rounded-lg scrollbar capitalize`}
                    >
                      <div className="mt-2">

                        {content ? <>
                          {content}
                        </> : <>

                          {hideDefaultPosition ? null : (
                            <>
                              {noDefault ? (
                                <Menu.Item disabled={disabled}>
                                  {() => (
                                    <a
                                      className={
                                        selectedValues == ""
                                          ? "text-gray-700 block px-4 py-2 text-sm active"
                                          : "text-gray-700 block px-4 py-2 text-sm"
                                      }
                                      onClick={() => handleChange("")}
                                    >
                                      {placeholder}
                                    </a>
                                  )}
                                </Menu.Item>
                              ) : (
                                <Menu.Item>
                                  {() => (
                                    <a
                                      className={
                                        selectedValues == ""
                                          ? "text-gray-700 block px-4 py-2 text-sm active"
                                          : "text-gray-700 block px-4 py-2 text-sm"
                                      }
                                      onClick={() => handleChange("")}
                                    >
                                      {placeholder}
                                    </a>
                                  )}
                                </Menu.Item>
                              )}
                            </>
                          )}
                          {options &&
                            options.map((itm: any,i:any) => {
                              return (
                                <Menu.Item key={i}>
                                  {({  }) => (
                                    <a
                                      className={
                                        selectedValues == itm.id
                                          ? "text-gray-700 block px-4 py-2 text-sm active"
                                          : "text-gray-700 block px-4 py-2 text-sm"
                                      }
                                      onClick={() => handleChange(itm.id)}
                                      key={itm.id}
                                    >
                                      {itm[displayValue]}
                                    </a>
                                  )}
                                </Menu.Item>
                              );
                            })}
                        </>}


                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>


              </div>
            </div>
          </>
        )}
    </>
  );
};

export default memo(Html);
