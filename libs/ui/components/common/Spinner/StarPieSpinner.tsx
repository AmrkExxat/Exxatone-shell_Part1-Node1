import type { JSX } from 'react';
import type { SpinnerProps } from './Spinner';
import PieSpinner from './PieSpinner';
import StarSpinner from './StarSpinner';

type StarPieSpinnerSize = SpinnerProps['size'] | number;

type StarPieSpinnerProps = {
  size?: StarPieSpinnerSize;
  pieColor?: string;
  pieDelay?: number;
  pieStrokeWidth?: number;
  pieStrokeColor?: string;
  starDelay?: number;
  starColors?: string[];
};

const StarPieSpinner = ({
  size = 'md',
  pieColor,
  pieDelay,
  pieStrokeWidth,
  pieStrokeColor,
  starDelay,
  starColors,
}: StarPieSpinnerProps): JSX.Element => {
  const pieProps = {
    size,
    ...(pieColor ? { color: pieColor } : {}),
    ...(pieDelay ? { delay: pieDelay } : {}),
    ...(pieStrokeWidth ? { strokeWidth: pieStrokeWidth } : {}),
    ...(pieStrokeColor ? { strokeColor: pieStrokeColor } : {}),
  };

  const starProps = {
    size,
    ...(starDelay ? { delay: starDelay } : {}),
    ...(starColors ? { colors: starColors } : {}),
  };

  return (
    <div className="flex items-center gap-4">
      <PieSpinner {...pieProps} />
      <StarSpinner {...starProps} />
    </div>
  );
};

export default StarPieSpinner;
