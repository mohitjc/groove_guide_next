import GooglePlacesAutocomplete, { geocodeByAddress } from "react-google-places-autocomplete";
import environment from "@/envirnment";

const Html = ({ searchText, required, placeholder, placeChange, disabled = false }:any) => {

    const selectProps:any={
            placeholder: placeholder,
            required: required,
            noOptionsMessage: (e:any) => {
              return e.inputValue ? 'No Address found' : 'Start typing an address...'
            },
            value: searchText ? {
              label: searchText,
              value: { description: searchText }
            } : null,
            onChange: (e:any) => {
              if (!e) return;
              geocodeByAddress(e.label)
                .then((results) => {
                  if (results.length) {
                    placeChange(results[0]);
                  }
                })
                .catch((err) => {
                  const arr = e.value.terms.map((itm:any, i:any) => {
                    return {
                      long_name: itm.value,
                      types: [e.value.types[i]],
                    };
                  });
                  placeChange({ formatted_address: e.label, address_components: arr });
                  console.error("error2", err);
                });
            },
            isDisabled: disabled,
            styles: {
              menu: (provided:any) => ({
                ...provided, // You can customize the menu styles her
              }),
              control: (provided:any) => ({
                ...provided, // Hide the dropdown arrow
                background: 'white',
                border: '1px solid #ccc',
                boxShadow: 'none',
                '&:hover': {
                  border: '1px solid #aaa',
                },
              }),
              dropdownIndicator: (provided:any) => ({
                ...provided,
                display: 'none',
              }),
            },
          }

  return (
    <>
      <div>
        <GooglePlacesAutocomplete
          apiKey={environment.googleClientId}
          selectProps={selectProps}
          autocompletionRequest={{
            componentRestrictions: {
              country: ["us", "ca"], // restricts to USA and Canada
            },
          }}
        />
        <div className="mt-1 text-sm text-blue-500">We&apos;ll auto-fill all address fields when you select a suggestion</div>
      </div>

    </>
  );
};

export default Html;