'use client';
import React, { useEffect, useState } from 'react';
import Loader from './elements/Loader';
import { IoClose } from 'react-icons/io5';

const AutoComplete = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const filteredCountries = countries.filter((country) =>
      country.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCountries(filteredCountries);

    if (filteredCountries.length === 0) return;

    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => {
        const newIndex =
          prev === null || prev === filteredCountries.length - 1 ? 0 : prev + 1;
        document
          .getElementById(`country-${newIndex}`)
          ?.scrollIntoView({ block: 'nearest' });
        return newIndex;
      });
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => {
        const newIndex =
          prev === null || prev === 0 ? filteredCountries.length - 1 : prev - 1;
        document
          .getElementById(`country-${newIndex}`)
          ?.scrollIntoView({ block: 'nearest' });
        return newIndex;
      });
    } else if (e.key === 'Enter' && highlightedIndex !== null) {
      const selectedCountry = filteredCountries[highlightedIndex];
      setSelectedCountries((prev) =>
        prev.includes(selectedCountry)
          ? prev.filter((c) => c !== selectedCountry)
          : [...prev, selectedCountry]
      );
      setHighlightedIndex(null);
      setValue('');
    }
  };

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/countries');
      const data = await res.json();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
      alert('Error fetching countries. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <div className='my-10 flex items-center justify-center h-full'>
      {loading ? (
        <div className='h-[70vh] w-full flex items-center justify-center'>
          <Loader />
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center w-full max-w-lg'>
          <input
            value={value}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setFilteredCountries(
                countries.filter((c) =>
                  c.toLowerCase().includes(value.toLowerCase())
                )
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

          {value && (
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
          )}

          {selectedCountries.length > 0 && (
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
          )}
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
