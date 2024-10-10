import React, { useEffect, useState } from "react";
import { countryCode } from "../../../utils/country";
import getCountrySVG from "react-country-svg-flag";
import { Input, Select } from "antd";

const MobileNumberField = ({ setPhoneNumber, formErrorFields, phoneNumber, phoneCode, setPhoneCode }) => {
  const countryCodes = countryCode;
  const [countryOption, setCountryOption] = useState([]);
  const [number, setNumber] = useState(phoneNumber);

  const changeNumber = (e) => {
    setNumber(e.target.value);
    if (e.target.value == "") {
      setPhoneNumber("");
    } else {
      let phone = e.target.value;
      setPhoneNumber(phone);
    }
  };

  useEffect(() => {
    if (countryCodes.length && countryOption.length === 0) {
      let option = [];
      countryCodes.map((item) => {
        let countrySvg = getCountrySVG(item.country.toLowerCase());
        option.push({
          label: (
            <div className="countryOption ff-ws" style={{ gap: "5px" }}>
              {item.countryCodes[0] + " "}
              <span
                dangerouslySetInnerHTML={{
                  __html: countrySvg,
                }}
                className="tw-max-w-[20px] tw-h-[20px]"
                style={{ marginLeft: "auto" }}
              ></span>
            </div>
          ),
          value: item.countryCodes[0],
        });
      });
      setCountryOption(option);
    }
  }, []);

  return (
    <>
      <div
        className="mobile-inp-field"
        style={{
          borderColor: formErrorFields.includes("phoneNumber")
            ? "#FD5749"
            : "#C9CCCF",
        }}
      >
        <Select
          value={phoneCode}
          style={{ width: "140px" }}
          options={countryOption}
          onChange={(value) => setPhoneCode(value)}
          className="country-select"
        />
        <Input
          placeholder="Enter your mobile number"
          type="number"
          className="phone-input"
          value={phoneNumber}
          onChange={(value) => changeNumber(value)}
        />
      </div>
      {formErrorFields.includes("phoneNumber") && (
        <span style={{ color: "#FD5749", marginTop: "5px" }} className="fs-s">
          This field is required.
        </span>
      )}
    </>
  );
};

export default MobileNumberField;
