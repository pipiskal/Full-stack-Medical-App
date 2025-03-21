import { SearchOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

import { useLanguageContext } from '@/context/LanguageProvider';
import useDocument from '@/hooks/useDocument';
import useDropDownMenuBlur from '@/hooks/useDropDownMenuBlur';
import { PatientType } from '@/types';

import s from './SearchBar.module.scss';

type SearchBarPropsType = {
  itemsList: PatientType[];
  onSelectedItem: (patient: PatientType) => void;
};

const SearchBar = ({ itemsList, onSelectedItem }: SearchBarPropsType) => {
  const { document } = useDocument();
  const { translate } = useLanguageContext();

  const [isSearchBarVisible, setIsSearchBarVisible] = useState<boolean>(false);
  const [results, setResults] = useState<PatientType[] | null>(null);

  const { elementRef: searchMenuRef } = useDropDownMenuBlur({
    handleMenuClose: () => setIsSearchBarVisible(false),
  });

  const resetInput = () => {
    if (document) {
      const searchBar = document.getElementById(
        'searchBar'
      ) as HTMLInputElement;

      searchBar.value = '';
      setIsSearchBarVisible(false);
      setResults(null);
    }
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const searchWord = e.target.value.toLocaleLowerCase();

    if (searchWord.length > 2) {
      const filteredResults = itemsList.filter(
        (result) =>
          result.firstName.toLocaleLowerCase().includes(searchWord) ||
          result.lastName.toLocaleLowerCase().includes(searchWord) ||
          result.amka.toLocaleLowerCase().includes(searchWord) ||
          result.phoneNumber.toLocaleLowerCase().includes(searchWord) ||
          (result.email &&
            result.email.toLocaleLowerCase().includes(searchWord))
      );

      if (filteredResults && filteredResults.length > 0) {
        setResults(filteredResults);
        setIsSearchBarVisible(true);
      }
    } else {
      setIsSearchBarVisible(false);
      setResults(null);
    }
  };

  const handleItemClick = (item: PatientType) => {
    onSelectedItem(item);
    setIsSearchBarVisible(false);
    resetInput();
  };

  const handleInputFocus = () => {
    if (results && results.length > 0) {
      setIsSearchBarVisible(true);
    }
  };

  return (
    <div className={s.wrapper} ref={searchMenuRef}>
      <div className={s.input_wrapper}>
        <SearchOutlined className={s.search_icon} />

        <input
          id="searchBar"
          type="text"
          name="Search"
          onChange={onSearch}
          className={s.searchBar}
          placeholder={translate('search_patient')}
          onFocus={handleInputFocus}
          maxLength={45}
        />
      </div>

      {isSearchBarVisible && (
        // TODO: add and fix scrollbar in dropdown menu
        <div className={s.dropdown_menu}>
          <ul>
            {results?.map((result) => (
              <li key={result._id}>
                <button
                  type="button"
                  className={s.dropdown_menu_item}
                  onClick={() => handleItemClick(result)}
                >
                  {`${result.firstName} ${result.lastName}`}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
