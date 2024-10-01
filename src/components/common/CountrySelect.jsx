import { Select } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import getCountrySVG from "react-country-svg-flag";
import { countryList } from "../../utils/country";

const CountrySelect = ({formData, setFormData}) => {
  const [options, setOptions] = useState([]);
  const countries = countryList;
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    if (countries.length) {
      let option = [];
      countries.forEach((item) => {
        let flag = getCountrySVG(item.code.toLowerCase());
        option.push({
          label: (
            <div className="countryOption ff-ws">
              <span
                dangerouslySetInnerHTML={{
                  __html: flag,
                }}
                className="tw-max-w-[20px] tw-h-[20px]"
              ></span>
              {" " + item.name}
            </div>
          ),
          value: item.name,
        });
      });
      setOptions(option);
    }
  }, [countries]);

  const handleChangeCountry = useCallback(
    (value) => {
        setFormData({...formData, country: value})
    },
    [formData, setFormData]
  )

  const filterOption = (input, option) => {
    return (
        option.label.props.children[1].toLowerCase().includes(input.toLowerCase()) ||
        option.value.toString().toLowerCase().includes(input.toLowerCase())
    );
  };
  return (
    <Select
      className={`text-start custom-select ${
        isFocused ? "custom-select-focus" : ""
      } mb-2`}
        value={formData.country}
      placeholder="Select Country*"
        onChange={(value) => handleChangeCountry(value)}
      options={options}
      showSearch
      placement="bottomLeft"
      onBlur={handleBlur}
      onFocus={handleFocus}
      filterOption={filterOption}
    />
  );
};

export default CountrySelect;
