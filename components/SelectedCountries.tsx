import React from 'react';
import { IoClose } from 'react-icons/io5';

const SelectedCountries = ({
  selectedCountries,
  setSelectedCountries,
}: {
  selectedCountries: string[];
  setSelectedCountries: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  return (
    <div className='mt-4 flex flex-wrap justify-center gap-2 w-lg'>
      {selectedCountries.map((country) => (
        <div
          className='flex items-center bg-gray-200 text-gray-900 px-3 py-1 rounded-full text-sm'
          key={country}
        >
          {country}
          <IoClose
            className='ml-2 cursor-pointer text-gray-600 hover:text-gray-900'
            onClick={() => {
              setSelectedCountries(
                selectedCountries.filter((c) => c !== country)
              );
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default SelectedCountries;
