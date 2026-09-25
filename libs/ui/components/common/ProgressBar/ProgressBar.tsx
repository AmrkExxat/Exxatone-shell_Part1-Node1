import { ReactNode, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

export type progressTypes = 'determinate' | 'indeterminate';

interface ProgressBarProps {
  progressValue: number;
  progressVariant: progressTypes;
  barColor?: string;
  backgroundColor?: string;
  className?: string;
}

const BorderLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) =>
    prop !== 'barColor' && prop !== 'backgroundColor' && prop !== 'className',
})<{ barColor?: string; backgroundColor?: string }>(({ theme, barColor, backgroundColor }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      backgroundColor || theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: barColor || (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
  },
}));

const ProgressBar = ({
  progressValue,
  progressVariant,
  barColor,
  backgroundColor,
  className = '',
}: ProgressBarProps): ReactNode => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progressVariant === 'indeterminate') {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            return 0;
          }
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 100);
        });
      }, 500);

      return () => {
        clearInterval(timer);
      };
    } else {
      setProgress(progressValue);
    }
  }, [progressVariant, progressValue]);

  return (
    <Box sx={{ width: '100%' }}>
      <BorderLinearProgress
        variant={progressVariant}
        value={progressVariant === 'determinate' ? progressValue : progress}
        barColor={barColor}
        backgroundColor={backgroundColor}
        className={className}
      />
    </Box>
  );
};

export default ProgressBar;
