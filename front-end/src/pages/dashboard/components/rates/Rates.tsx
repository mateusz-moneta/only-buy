import React, { useState } from 'react';
import classNames from 'classnames';

import './Rates.scss';

export const Rates = ({
  confirmedRating,
  selectRates
}: {
  confirmedRating: number;
  selectRates: (rating: number) => void;
}) => {
  const [rating, setRating] = useState(0);

  const handleMouseEnter = (hoveredRating: number) => setRating(hoveredRating);

  const handleMouseLeave = () => setRating(0);

  const handleClick = (clickedRating: number) => {
    setRating(clickedRating);
    selectRates(clickedRating);
  };

  return (
    <div className="rates">
      {Array.from(Array(5).keys()).map((value: number) => (
        <img
          onClick={() => handleClick(value + 1)}
          onMouseEnter={() => handleMouseEnter(value + 1)}
          onMouseLeave={handleMouseLeave}
          className={classNames({
            rates__item: true,
            'rates__item--filled': value + 1 <= (rating || confirmedRating)
          })}
          key={value}
          role="button"
          src={`/icons/${value + 1 <= (rating || confirmedRating) ? 'star-filled' : 'star'}.svg`}
        />
      ))}
    </div>
  );
};

export default Rates;
