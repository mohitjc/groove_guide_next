import { useRef } from "react";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import environment from "@/envirnment";

const Html = ({ searchText, required, placeholder, placeChange, editAddress, disabled = false }:any) => {
  const autocompleteRef:any = useRef(null);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place?.geometry?.location) {
        placeChange(place);
      } else {
        // If no valid place is selected, treat as manual input
        editAddress(searchText || '');
      }
    }
  };

  const libraries:any = ['places'];

  return (
    <div>
      <LoadScript
        googleMapsApiKey={environment.googleapi} // Ensure this is a valid API key
        libraries={libraries}
      >
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceChanged}
          restrictions={{ country: ["us", "ca"] }}
          options={{
            fields: ['address_components', 'geometry', 'name', 'formatted_address'],
          }}
        >
          <input
            type="text"
            placeholder={placeholder}
            value={searchText}
            onChange={(e) => editAddress(e.target.value)} // Use editAddress for manual input
            disabled={disabled}
            required={required}
            className="w-full p-2 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:border-blue-500"
          />
        </Autocomplete>
      </LoadScript>
      <div className="mt-1 text-sm text-blue-500">
        We&apos;ll auto-fill all address fields when you select a suggestion
      </div>
    </div>
  );
};

export default Html;