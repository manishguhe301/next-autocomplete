import React from 'react';

interface InputProps {
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  setFilteredCountries: React.Dispatch<React.SetStateAction<string[]>>;
  countries: string[];
  setFocused: React.Dispatch<React.SetStateAction<boolean>>;
  filteredCountries: string[];
  focused: boolean;
}

const Input = ({
  handleKeyDown,
  value,
  setValue,
  setFilteredCountries,
  countries,
  setFocused,
  filteredCountries,
  focused,
}: InputProps) => {
  return (
    <input
      value={value}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        setFilteredCountries(
          countries.filter((c) => c.toLowerCase().includes(value.toLowerCase()))
        );
        setFocused(true);
      }}
      onBlur={() => {
        setTimeout(() => setFilteredCountries([]), 200);
        setFocused(false);
      }}
      onChange={(e) => setValue(e.target.value)}
      placeholder='Search countries by name...'
      className='border border-gray-300 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900 placeholder-gray-500 shadow-sm'
      role='combobox'
      aria-expanded={filteredCountries.length > 0 && focused}
      aria-controls='country-list'
    />
  );
};

export default Input;
