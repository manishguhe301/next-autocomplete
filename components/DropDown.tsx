import React from 'react';

const DropDown = ({
  filteredCountries,
  selectedCountries,
  highlightedIndex,
  setSelectedCountries,
  setValue,
}: {
  filteredCountries: string[];
  selectedCountries: string[];
  highlightedIndex: number | null;
  setSelectedCountries: React.Dispatch<React.SetStateAction<string[]>>;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div
      className='mt-3 max-h-48 w-72 overflow-y-auto border border-gray-300 rounded-lg shadow-md bg-white'
      id='country-list'
      role='listbox'
    >
      {filteredCountries.length > 0 ? (
        filteredCountries.map((country, index) => (
          <p
            id={`country-${index}`}
            key={index}
            aria-selected={selectedCountries.includes(country)}
            className={`px-4 py-2 cursor-pointer transition-all ${
              selectedCountries.includes(country)
                ? 'font-semibold text-gray-900 bg-gray-200'
                : highlightedIndex === index
                ? 'bg-gray-100'
                : 'text-gray-700'
            } hover:bg-gray-100`}
            onClick={() => {
              setSelectedCountries(
                selectedCountries.includes(country)
                  ? selectedCountries.filter((c) => c !== country)
                  : [...selectedCountries, country]
              );
              setValue('');
            }}
          >
            {country}
          </p>
        ))
      ) : (
        <p className='text-gray-500 px-4 py-2'>No results</p>
      )}
    </div>
  );
};

export default DropDown;
