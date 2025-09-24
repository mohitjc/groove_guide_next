import { useEffect, useState } from "react";
import Html from "./html";

const GooglePlaceAutoComplete = ({ placeholder = 'Enter Address', required = false, result = () => {}, value, disabled }:any) => {
  const [searchText, setSearchText] = useState("");

  const placeChange = (place:any) => {
    console.log(place, 'place');

    const getComponent = (type:any, key = 'long_name') => {
      const comp = place.address_components?.find((c:any) => c.types.includes(type));
      return comp ? comp[key] : '';
    };

    const lat = typeof place.geometry?.location.lat === 'function'
      ? place.geometry.location.lat()
      : place.geometry?.location.lat || '';

    const lng = typeof place.geometry?.location.lng === 'function'
      ? place.geometry.location.lng()
      : place.geometry?.location.lng || '';

    const country = getComponent('country');
    const country_code = getComponent('country', 'short_name');
    const state = getComponent('administrative_area_level_1');
    const state_code = getComponent('administrative_area_level_1', 'short_name');

    const city =
      getComponent('locality') ||
      getComponent('sublocality') ||
      getComponent('neighborhood') ||
      getComponent('administrative_area_level_3') ||
      getComponent('administrative_area_level_2');

    const zipCode = getComponent('postal_code') || '';

    const getAddress = () => {
      const str =place.name+','+ place.formatted_address || '';
      // if (typeof str === 'string' && str.length > 0) {
      //   const arr = str.split(',');
      //   return arr.slice(0, -3).join(', ').trim();
      // }
      return str;
    };

    const address1 = getAddress() || city || '';

    const formattedAddress = {
      address: place.formatted_address || '',
      address1,
      country,
      country_code,
      state,
      state_code,
      city,
      zipCode,
      lat,
      lng,
    };

    setSearchText(address1);

    result({
      event: "placeChange",
      value: place.formatted_address || '',
      place,
      formattedAddress,
    });
  };

  useEffect(() => {
    setSearchText(value || '');
  }, [value]);

  const editAddress = (value:any) => {
    setSearchText(value);
    result({
      event: "change",
      value,
    });
  };

  return (
    <Html
      placeChange={placeChange}
      placeholder={placeholder}
      searchText={searchText}
      editAddress={editAddress}
      disabled={disabled}
      required={required}
    />
  );
};

export default GooglePlaceAutoComplete;