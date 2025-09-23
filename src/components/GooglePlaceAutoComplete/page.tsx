import { useEffect, useState } from "react";
import Html from "./html";

const GooglePlaceAutoComplete = ({ placeholder='Enter Address',required=false, result=()=>{}, value, disabled }:any) => {
  const [searchText, setSeatchText] = useState("");

 const placeChange = (place:any) => {
  const getComponent = (type:any, key = 'long_name') => {
    const comp = place.address_components?.find((c :any)=> c.types.includes(type));
    return comp ? comp[key] : '';
  };

  const lat = typeof place.geometry.location.lat === 'function'
    ? place.geometry.location.lat()
    : place.geometry.location.lat;

  const lng = typeof place.geometry.location.lng === 'function'
    ? place.geometry.location.lng()
    : place.geometry.location.lng;

  const country = getComponent('country');
  const country_code = getComponent('country', 'short_name');
  const state = getComponent('administrative_area_level_1');
  const state_code = getComponent('administrative_area_level_1', 'short_name');

  const city =
    getComponent('locality') || // Most accurate city
    getComponent('sublocality') || // Next best
     getComponent('neighborhood') || // Next best
    getComponent('administrative_area_level_3')|| // Sometimes city-like
    getComponent('administrative_area_level_2') // District/County
    
  const zipCode = getComponent('postal_code') || '';

  const getAddress = () => {
    const str = place.formatted_address || '';
    const arr = str.split(',');
    // Use full address without last 3 parts: state, country, and zip
    return arr.slice(0, -3).join(', ').trim();
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

  setSeatchText(address1); // If this is a typo, correct to setSearchText

  result({
    event: "placeChange",
    value: place.formatted_address,
    place,
    formattedAddress,
  });
};

  

  useEffect(() => {
    setSeatchText(value);
  }, [value]);

  const editAddress=(e:any)=>{
    setSeatchText(e)
    result({
      event: "change",
      value:e,
    });
  }

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