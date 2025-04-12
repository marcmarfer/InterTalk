import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface SelectLanguageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string } }) => void;
  languages: Language[];
}

const SelectLanguageInput: React.FC<SelectLanguageInputProps> = ({
  value,
  onChange,
  languages
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (langCode: string) => {
    onChange({ target: { value: langCode } } as any);
    setIsOpen(false);
  };

  const selectedLanguage = languages.find(lang => lang.code === value);

  return (
    <div ref={dropdownRef} className="relative">
      <div
        className="bg-[#393251]/50 backdrop-blur-sm p-3 rounded-xl border border-[#615472]/50 text-white relative cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <div className="w-6 h-4 relative mr-2 overflow-hidden rounded-sm">
            <Image
              src={selectedLanguage?.flag || ''}
              alt={selectedLanguage?.name || ''}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-left text-lg font-medium">
            {selectedLanguage?.name || value}
          </div>
        </div>

        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <Image
            src="/icons/chevron-down.svg"
            alt="Chevron Down Icon"
            width={16}
            height={16}
            className={`text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-[#393251]/90 backdrop-blur-sm rounded-xl border border-[#615472]/50 text-white overflow-hidden z-10 max-h-60 overflow-y-auto">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`p-3 cursor-pointer hover:bg-[#4b4363] ${lang.code === value ? 'bg-[#4b4363]' : ''}`}
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <div className="flex items-center">
                <div className="w-6 h-4 relative mr-2 overflow-hidden rounded-sm">
                  <Image
                    src={lang.flag}
                    alt={lang.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-base font-medium">
                  {lang.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <select
        value={value}
        onChange={onChange}
        className="appearance-none hidden"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectLanguageInput; 