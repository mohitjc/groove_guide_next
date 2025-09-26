import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { FaAngleDown } from "react-icons/fa";

type Option = {
  color?: any,
  className?:any,
  id:any,
  [x:string]:any
}

interface OptionDropdownProps {
  isLoading?: boolean;
  position?: 'absolute' | 'fixed';
  isCreate?: boolean;
  isSearch?: boolean;
  type?: 'text' | 'number';
  searchText?: string;
  maxlength?: number | null;
  minlength?: number | null;
  disabled?: boolean;
  options?: Option[];
  className?: string;
  menuClassName?:string;
  placeholder?: string;
  value?: string | number;
  displayValue?: string;
  valueType?: 'string' | 'object';
  content?: any,
  title?: any,
  titleRef?: any,
  openClass?:string,
  closeClass?:string,
  showUnselect?:boolean,
  onChange?: (value: any) => void;
}

const isNumber = (e:any) => {
  const key = e.target;
  const maxlength = key.maxLength ? key.maxLength : 0;

  const max = Number(key.max ? key.max : key.value);
  if (Number(key.value) > max) key.value = max;

  // let min = key.min;
  // if (min && Number(key.value)<Number(min)) key.value = min;


  if (maxlength > 0) {
    if (key.value.length > maxlength) key.value = key.value.slice(0, maxlength);
  }

  key.value = key.value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");

  return key.value;
};

const OptionDropdown: React.FC<OptionDropdownProps> = ({
  isLoading = false,
  position = 'absolute',
  isCreate = false,
  type = 'text',
  searchText = 'Search',
  maxlength = null,
  minlength = null,
  disabled = false,
  options = [],
  className = '',
  menuClassName = '',
  placeholder = 'Select',
  value = '',
  displayValue = 'name',
  valueType = 'string',
  content,
  title,
  titleRef,
  openClass='opened',
  closeClass='closed',
  isSearch=true,
  showUnselect=true,
  onChange = (_) => { }
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const buttonRef1 = useRef<any>(null);
  const buttonRef = titleRef?titleRef:buttonRef1;
   
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const scrollX = position === 'fixed' ? (window.screenX || window.screenLeft) : window.scrollX;
      const scrollY = position === 'fixed' ? (window.screenY || window.screenTop) : window.scrollY;
      const rect = buttonRef.current.getBoundingClientRect();

      let left = rect.left + scrollX;
      let top = rect.bottom + scrollY;
      if (position === 'fixed') {
        left = rect.left;
        top = rect.bottom;
      }

      setSearch('');
      setDropdownStyle({
        position: position,
        top: `${top}px`,
        left: `${left}px`,
        minWidth: `${rect.width}px`,
        zIndex: 9999,
        background: "white",
      });
    }
  }, [isOpen, position]);

  const handleChange = (id: string | number) => {
    let v: string | number | Option | undefined = id;
    if (valueType === "object") {
      v = options.find((itm) => itm.id === id);
    }
    setIsOpen(false);
    onChange(v);
  };

  const selected = useMemo(() => {
    let v: any = {
      color: '',
      className: '',
      id: value,
      [displayValue]: value || placeholder || 'Select'
    };

    const ext = options.find(itm => itm.id === value);
    if (ext) {
      v = {
        color: '',
        className: '',
        ...ext
      };
    }
    return v;
  }, [placeholder, options, displayValue, value]);

  const list = useMemo(() => {
    let arr = [...options];
    arr = arr.filter(itm =>
      itm[displayValue]?.toString()?.toLowerCase()?.includes(search?.toLowerCase().trim())
    );
    return arr;
  }, [options, search, displayValue]);

  const createClick = () => {
    if (valueType === "object") {
      onChange({
        id: search,
        [displayValue]: search
      });
    } else {
      onChange(search);
    }
    setIsOpen(false);
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = '';
    if (type === 'number') {
      v = isNumber(e.target.value);
    } else {
      v = e.target.value;
    }
    setSearch(v);
  };

  return (
    <>
      
      {title?<>
      <div
        ref={buttonRef}
        role="button" 
        onClick={() => !disabled?setIsOpen((prev) => !prev):{}}
        className={`${className} ${isOpen?openClass:closeClass}`}
        aria-expanded={isOpen?'true':'false'}
        aria-label="Toggle Notifications"
      >
      {title}
      </div>
      </>:<>
      <div
        ref={buttonRef}
        aria-expanded={isOpen?'true':'false'}
        role="div" 
         aria-label="select"
        onClick={() => !disabled?setIsOpen((prev) => !prev):{}}
        title={selected[displayValue]}
        className={`relative ${disabled?'bg-gray-200':''} cursor-pointer border border-[#e5e7eb] px-4 shadow-box bg-white text-[#333] rounded-lg h-10 flex items-center text-left text-sm gap-2 z-9 overflow-hidden px-2 ${className} ${isOpen?openClass:closeClass}`}
      >
        <div className={`truncate w-full border-r border-[#cccccc] pr-3 ${selected.color ? `text-[${selected.color}]` : ''} ${selected.className || ''}`}>
          {selected[displayValue]}
        </div>
        <FaAngleDown className="text-[20px] font-medium text-[#ccc]" />
      </div>
      </>}

      {isOpen &&
        createPortal(
          <div ref={dropdownRef}>
            <div className="fixed w-full h-full z-[9999] top-0 left-0" onClick={() => setIsOpen(false)}></div>
            <div style={dropdownStyle} className={`rounded-[5px] border-2 mt-2 border-primary shadow ${menuClassName||''}`}>
              {content ? <>
                {content}
              </> : <>
              {isSearch?<>
              <div className="p-[4px] relative">
                  <input
                    type={type}
                    maxLength={maxlength || undefined}
                    minLength={minlength || undefined}
                    className="w-full border px-[10px] py-[4px] rounded"
                    placeholder={searchText}
                    value={search}
                    onChange={onSearch}
                  />
                  {search ? (
                    <span
                      className="material-symbols-outlined cursor-pointer absolute top-[12px] text-[14px] right-[7px]"
                      onClick={() => setSearch('')}
                    >
                      close
                    </span>
                  ) : null}
                </div>
              </>:<></>}
                
                <div className="overflow-auto max-h-[180px] text-[14px]">
                  {isLoading ? (
                    <div className="px-[12px] py-[8px] text-center">Loading...</div>
                  ) : (
                    <>
                      {isCreate && search ? (
                        <div
                          onClick={createClick}
                          className="px-[12px] py-[8px] border-b cursor-pointer"
                        >
                          {`Click here to add "${search}"`}
                        </div>
                      ) : null}
                      {showUnselect?<>
                       <div
                          onClick={() => handleChange('')}
                          className={`px-[12px] py-[8px] border-b cursor-pointer ${!value ? 'bg-primary text-white' : ''}`}
                        >
                          Unselect
                        </div>
                      </>:<></>}
                      {list.map((option) => (
                        <div
                          key={option.id}
                          onClick={() => option.id !== value && handleChange(option.id)}
                          className={`px-[12px] py-[8px] border-b cursor-pointer ${value === option.id ? 'bg-primary text-white' : ''} ${option.color ? `text-[${option.color}]` : ''} ${option.className || ''}`}
                        >
                          {option[displayValue]}
                        </div>
                      ))}
                      {!list.length ? (
                        <div className="px-[12px] py-[8px] text-center text-gray-600">No Options</div>
                      ) : null}
                    </>
                  )}
                </div>
              </>}

            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default OptionDropdown;