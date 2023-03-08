import React, { useState } from 'react';
import {
  EuiDualRange,
  EuiFormRow,
  EuiTitle
} from '@elastic/eui';

function YearRangeFacet({
  minYear, maxYear, setYearRange, yearRange
}) {

  const onRangeChange = (value) => {
    // value is an array of [val1, val2]
    setYearRange((prevState) => ({
        ...prevState,
        startYear: parseInt(value[0]),
        endYear: parseInt(value[1])
    }));
  };


  // Passing empty strings as the value allows the inputs to be blank,
  // though the range handles will still be placed at the min/max positions

  return (
    <>
      <EuiTitle size="xxs">
        <h3>Years</h3>
      </EuiTitle>
      <EuiFormRow>
        <EuiDualRange
          value={[yearRange.startYear || "", yearRange.endYear || ""]}
          onChange={onRangeChange}
          fullWidth
          min={minYear}
          max={maxYear}
          showInput={"inputWithPopover"}
          showLabels
          aria-label="Year filter input form"
          prepend="From"
          append="To"
        />
      </EuiFormRow>
    </>
  );
};

export default YearRangeFacet;
