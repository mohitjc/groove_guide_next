import { memo, useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import OptionDropdown from "./OptionDropdown";
import {fire} from "./Swal";
import datepipeModel from "@/utils/datepipemodel";
import { isNumber } from "@/utils/shared";

const FormControl = memo(function FormControl({
  join = "",
  name,
  id = "",
  valueType = "string",
  displayValue = "name",
  placeholder = "",
  type = "text",
  options = [],
  error,
  label,
  required = false,
  onChange = (_:any) => {},
  maxlength = "",
  minlength = "",
  min = "",
  className = "",
  value,
  disabled=false,
  position='absolute',
  searchType='text',
  isLoading=false,
  searchText='Search',
  isCreate=false
}: any) {
  const [text, setText] = useState("");
  const [dob, setDob] = useState<any>({
    year: "",
    month: "",
    date: "",
  });

  const add = () => {
    const arr = value || [];
    if (text) {
      arr.push(text);
    }
    onChange(arr);
    setText("");
  };

  const remove = (i: any) => {
    let arr = value || [];
    arr = arr.filter((itm: any, index: any) => index != i);
    onChange(arr);
  };

  const addItem = (v: any) => {
    let arr = value || [];
    const ext = arr?.find((itm: any) => itm == v);

    if (ext) {
      arr = arr.filter((itm: any) => itm != v);
    } else {
      arr.push(v);
    }

    onChange(arr);
  };

  useEffect(() => {
    if (type == "dob") {
      let v: any = {};
      if (value) {
        v = datepipeModel.datetostring(value);
        v = v.split("-");
        v = {
          year: Number(v[0]),
          month: Number(v[1]),
          date: Number(v[2]),
        };
      }
      setDob({
        ...dob,
        ...v,
      });
    }
  }, [value, type]);

  const days = [];
  const months = [];
  const year = new Date().getFullYear();
  const years = [];

  for (let i = 1; i <= 12; i++) {
    months.push({ name: i, id: i });
  }

  for (let i = 1; i <= 31; i++) {
    days.push({ name: i, id: i });
  }

  for (let i = 21; i <= 100; i++) {
    years.push({ name: year - i, id: year - i });
  }

  const dobRequired =
    required || dob.year || dob.month || dob.date ? true : false;
  const dobChange = (p: any) => {
    const dobValue = { ...dob, ...p };
    let value = "";

    // Ensure all fields are present
    if (dobValue.date && dobValue.month && dobValue.year) {
      const dateObj = new Date(
        Number(dobValue.year),
        Number(dobValue.month) - 1, // 🔴 Fix month offset
        Number(dobValue.date)
      );

      value = datepipeModel.datetostring(dateObj.toISOString());
    }

    onChange(value);

    setDob((prev: any) => ({
      ...prev,
      ...p, // 🔁 Only update with current patch
    }));
  };
  const handleYearChange = (e: any) => {
    const selectedYear = Number(e.target.value);
    const currentYear = new Date().getFullYear();
    const age = currentYear - selectedYear;

    if (age < 21) {
      fire({
        imageUrl: "/assets/img/age.png",
        imageHeight: 120,
        title: "Age Restricted!",
        description: "Your age is less than 21. You are not eligible for this service.",
        confirmButtonText: "Got it, thanks!",
      });

      // Clear year in state if underage
      dobChange({ year: "" });
    } else {
      dobChange({ year: selectedYear });
    }
  };

  return (
    <>
      <div className="formWrapper relative w-full">
        {label ? (
          <>
            <label className="text-sm mb-2 inline-block">
              {label}{" "}
              {required ? (
                <>
                  <span className="star">*</span>
                </>
              ) : (
                <></>
              )}
            </label>
          </>
        ) : (
          <></>
        )}

        {type == "multiselect" ? (<>
        MultiSelectDropdown
         {/* <MultiSelectDropdown
            id={`statusDropdown_${id}`}
            displayValue={displayValue}
            intialValue={value}
            className={className}
            placeholder={placeholder}
            result={(e: any) => {
              onChange(e.value);
            }}
            options={options}
            disabled={disabled}
          /> */}
        </>
         
        ): type == 'dob' ? <>

        <div className="flex items-center  overflow-hidden">
          <div className='input_dates flex items-center  gap-1 w-full'>
            <select
              value={dob.date}
              required={dobRequired}
              onChange={e => {
                dobChange({date:e.target.value})
              }}
              className="text-sm px-3 h-10 w-32 text-md bg-white  border focus:outline-0   border-gray-300 rounded-full font-normal">
              <option value="">Day</option>
              {days.map((itm: any,i:any) => {
                return <option value={itm.id} key={i}>{itm.name}</option>
              })}
            </select>
            <select
              value={dob.month}
              required={dobRequired}
              onChange={e => {
                dobChange({month:e.target.value})
              }}
              className="text-sm px-3 h-10 w-32 text-md bg-white  border focus:outline-0   border-gray-300 rounded-full font-normal">
              <option value="">Month</option>
              {months.map((itm,i) => {
                return <option value={itm.id} key={i}>{itm.name}</option>
              })}
            </select>
            <select
              value={dob.year}
              required={dobRequired}
              onChange={e => {
                handleYearChange(e)
              }}
              className="text-sm px-3 h-10 w-32 text-md bg-white border focus:outline-0  border-gray-300 rounded-full font-normal"
            >
              <option value="">Year</option>
              {years.map(itm => {
                return <option key={itm.id} value={itm.id}>{itm.name}</option>;
              })}
            </select>
          </div>
        </div>
      </> :type == "select" ? <>
       <OptionDropdown
           position={position}
              maxlength={maxlength}
              minlength={minlength}
              type={searchType}
              isLoading={isLoading}
              searchText={searchText}
              isCreate={isCreate}
              options={options}
              disabled={disabled}
              valueType={valueType}
              displayValue={displayValue}
              onChange={onChange}
              placeholder={placeholder}
              value={value || ''}
          />
      </>: type=='phone'?<>
        <PhoneInput
                country={"us"}
                value={value||''}
                enableSearch={true}
                onChange={(e:any) => onChange(e)}
                countryCodeEditable={true}
                inputClass={`${className}`}
              />
        </>:type == "textarea"?<>
          <textarea className="relative bg-white w-full  rounded-lg h-[150px] border flex items-center gap-2 z-9 overflow-hidden px-2" value={value||''} onChange={e=>onChange(e.target.value)} required={required} />
        </>: type == "number" ? (
          <input
            type="text"
            name={name}
            className="relative shadow-box bg-white w-full rounded-lg h-10 flex items-center gap-2 z-9 overflow-hidden px-2"
            required={required}
            placeholder={placeholder}
            value={value || ""}
            maxLength={maxlength}
            minLength={minlength}
            autoComplete="off"
            min={min}
            onChange={(e) => onChange(isNumber(e))}
          />
        ) : type == "badge" ? (
          <>
            <div className="flex">
              <input
                type="text"
                className="relative shadow-box bg-white w-full rounded-lg h-10 flex items-center gap-2 overflow-hidden px-2"
                placeholder={placeholder}
                value={text}
                autoComplete="off"
                onChange={(e) => setText(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary ml-2"
                onClick={add}
              >
                Add
              </button>
            </div>
            <div className="">
              {value?.map((itm: any, i: any) => {
                return (
                  <span className="badge badge-primary m-1" key={i}>
                    {itm}
                    <i
                      className="fa fa-times ml-1"
                      onClick={() => remove(i)}
                    ></i>
                  </span>
                );
              })}
            </div>
          </>
        ) : type == "radio" ? (
          <>
            <div className="flex items-center gap-x-4">
              {options.map((itm: any, i: any) => {
                return (
                  <>
                    <div className="">
                      {" "}
                      <label className={`border border-gray-300 px-6  py-2 rounded-lg flex cursor-pointer ${disabled?'disabled':''}`}>
                        <input
                          type="radio"
                          checked={value == itm.id ? true : false}
                          onChange={() => onChange(itm.id)}
                          className="mr-2"
                          name={name}
                          autoComplete="off"
                          disabled={disabled}
                        />
                        {itm.name}
                      </label>
                    </div>
                    {i != options.length - 1 ? <>{join}</> : <></>}
                  </>
                );
              })}
            </div>
          </>
        ) : type == "checkbox" ? (
          <>
            {options.map((itm: any) => {
              return (
                <label className="flex" key={itm.id}>
                  <input
                    type="checkbox"
                    checked={value?.includes(itm.id) ? true : false}
                    onChange={() => addItem(itm.id)}
                    className="mr-2"
                    autoComplete="off"
                  />
                  {itm.name}
                </label>
              );
            })}
          </>
        ) : (
          <input
            type={type}
            name={name}
            className="relative shadow-box bg-white w-full rounded-lg h-10 flex items-center gap-2 overflow-hidden px-2"
            required={required}
            placeholder={placeholder}
            value={value || ""}
            maxLength={maxlength}
            minLength={minlength}
            min={min}
            id={id}
            autoComplete="off"
            onChange={(e) => {
              onChange(e.target.value);
            }}
          />
        )}

        {error ? (
          <>
            <div className="text-danger small mt-1 capitalize">{error}</div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
});

export default FormControl;
