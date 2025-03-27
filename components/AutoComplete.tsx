'use client';
import React, { useEffect, useState } from 'react';
import Loader from './elements/Loader';
import Input from './Input';
import DropDown from './DropDown';
import SelectedCountries from './SelectedCountries';

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
          <Input
            handleKeyDown={handleKeyDown}
            value={value}
            setValue={setValue}
            setFilteredCountries={setFilteredCountries}
            countries={countries}
            setFocused={setFocused}
            filteredCountries={filteredCountries}
            focused={focused}
          />

          {value && (
            <DropDown
              filteredCountries={filteredCountries}
              setValue={setValue}
              selectedCountries={selectedCountries}
              setSelectedCountries={setSelectedCountries}
              highlightedIndex={highlightedIndex}
            />
          )}

          {selectedCountries.length > 0 && (
            <SelectedCountries
              selectedCountries={selectedCountries}
              setSelectedCountries={setSelectedCountries}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
