import React from "react";
// import "./style.scss";
import Select from "react-select";

const Html = ({disabled, options, selectedValues, handleChange, displayValue, placeholder='',required,className='' }:any) => {
  return (
    <>
      <div className="selectDropdown">
        <Select
          defaultValue={displayValue}
          isMulti
          value={selectedValues || []}
          options={
            options?.map((itm:any) => {
              return { value: itm.id, label: itm[displayValue] };
            }) || []
          }
          required={required}
          placeholder={placeholder}
          className={`basic-multi-select ${className}`}
          classNamePrefix="select"
          onChange={(e) => handleChange(e)}
          isDisabled={disabled}
          isClearable
        />
      </div>
    </>
  );
};

export default Html;
