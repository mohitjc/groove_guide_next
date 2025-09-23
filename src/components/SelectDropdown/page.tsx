import { memo } from "react";
import HtmlT from "./html";

const SelectDropdown = ({
  isLoading = false,
  intialValue,
  options,
  setOptions = () => { },
  isSingle,
  valueType = "string",
  onFocus,
  className = "",
  inputValue = "",
  onInputChange = (e: any) => { },
  result,
  onBlur = () => { },
  displayValue = "name",
  id,
  placeholder = "Select Status",
  disabled = false,
  name,
  required = false,
  theme = "normal",
  hideDefaultPosition = false,
  content = '',
  isClearable = true,
  // menuIsOpen=false
}: any) => {
  const handleChange = (e: any) => {
    let v = e;
    if (valueType == "object") {
      v = options.find((itm: any) => itm.id == e);
    }
    result({ event: "value", value: v });
  };

  return (
    <>
      <HtmlT
        id={id}
        setOptions={setOptions}
        isLoading={isLoading}
        onFocus={onFocus}
        isClearable={isClearable}
        className={className}
        name={name}
        required={required}
        content={content}
        onBlur={onBlur}
        inputValue={inputValue}
        onInputChange={onInputChange}
        theme={theme}
        disabled={disabled}
        placeholder={placeholder}
        isSingle={isSingle}
        displayValue={displayValue}
        options={options}
        selectedValues={intialValue}
        handleChange={handleChange}
        hideDefaultPosition={hideDefaultPosition}
      // menuIsOpen={menuIsOpen}
      />
    </>
  );
};

export default memo(SelectDropdown);
