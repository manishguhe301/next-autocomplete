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
        <div className='flex flex-col items-center justify-center'>
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
            className='border-2 border-gray-300 rounded-md p-2 w-64 focus:outline-none focus:border-gray-400'
            role='combobox'
            aria-expanded={focused}
            aria-controls='country-list'
          />
          <div>
            {value && (
              <div
                className='mt-4 h-[200px] w-64 overflow-y-auto'
                id='country-list'
                role='listbox'
              >
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country, index) => (
                    <p
                      id={`country-${index}`}
                      key={index}
                      aria-selected={selectedCountries.includes(country)}
                      className={`cursor-pointer ${
                        selectedCountries.includes(country)
                          ? 'font-semibold text-gray-900 bg-gray-200 border border-white'
                          : highlightedIndex === index
                          ? 'bg-gray-100'
                          : 'text-gray-700'
                      }`}
                      onClick={() => {
                        setSelectedCountries(
                          selectedCountries.includes(country)
                            ? selectedCountries.filter((c) => c !== country)
                            : [...selectedCountries, country]
                        );
                        setHighlightedIndex(null);
                        setValue('');
                      }}
                    >
                      {country}
                    </p>
                  ))
                ) : (
                  <p className='text-gray-700' role='alert'>
                    No results
                  </p>
                )}
              </div>
            )}
          </div>
          <div className='mt-4'>
            {' '}
            {selectedCountries?.length > 0 && (
              <div className='flex items-center justify-center gap-2 max-w-xl flex-wrap'>
                {selectedCountries.map((country) => {
                  return (
                    <p
                      className='text-gray-700 flex items-center gap-1'
                      key={country}
                    >
                      {country}{' '}
                      <IoClose
                        onClick={() => {
                          setSelectedCountries(
                            selectedCountries.filter((c) => c !== country)
                          );
                        }}
                        className='cursor-pointer'
                      />
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
