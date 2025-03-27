'use client';
import React, { useEffect, useState } from 'react';
import Loader from './elements/Loader';
import { IoClose } from 'react-icons/io5';

const AutoComplete = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

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
            onChange={(e) => setValue(e.target.value)}
            placeholder='Search countries by name...'
            className='border-2 border-gray-300 rounded-md p-2 w-64 focus:outline-none focus:border-gray-400'
          />
          <div>
            {value && (
              <div className='mt-4 h-[200px] w-64 overflow-y-auto'>
                {countries.filter((country) =>
                  country.toLowerCase().includes(value.toLowerCase())
                ).length > 0 ? (
                  countries
                    .filter((country) =>
                      country.toLowerCase().includes(value.toLowerCase())
                    )
                    .map((country, index) => (
                      <p
                        key={index}
                        className={`cursor-pointer ${
                          selectedCountries.includes(country)
                            ? 'font-semibold text-gray-900 bg-gray-200 border border-white'
                            : 'text-gray-700'
                        }`}
                        onClick={() =>
                          setSelectedCountries(
                            selectedCountries.includes(country)
                              ? selectedCountries.filter((c) => c !== country)
                              : [...selectedCountries, country]
                          )
                        }
                      >
                        {country}
                      </p>
                    ))
                ) : (
                  <p className='text-gray-700'>No results</p>
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
