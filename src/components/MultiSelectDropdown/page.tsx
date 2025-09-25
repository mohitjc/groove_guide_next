"use client";
import React, { useEffect, useState } from "react";
import methodModel from "@/utils/methodModel";
import Html from "./html";

const MultiSelectDropdown = ({
  intialValue='',
  options,
  result,
  placeholder='',
  displayValue = "name",
  id,
  className='',
  required=false,
  disabled=false
}:any) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleChange = (e:any) => {
    let value = [];
    value = e.map((itm:any) => {
      return itm.value;
    });
    result({ event: "value", value: value });
  };

  useEffect(() => {
    let value = [];
    if (intialValue?.length && options?.length) {
      value = intialValue?.map((itm:any) => {
        return {
          ...methodModel.find(options, itm, "id"),
          value: methodModel.find(options, itm, "id")?.id || "",
          label:
            methodModel.find(options, itm, "id")?.[displayValue] || "Not Exist",
        };
      });
    }
    setSelectedValues(value.filter((itm:any)=>itm.value));
  }, [intialValue, options]);

  return (
    <>
      <Html
        id={id}
        className={className}
        displayValue={displayValue}
        options={options}
        placeholder={placeholder}
        selectedValues={selectedValues}
        handleChange={handleChange}
        required={required}
        disabled={disabled}
      />
    </>
  );
};

export default MultiSelectDropdown;
