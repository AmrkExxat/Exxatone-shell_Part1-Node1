import React from 'react';
import classNames from 'classnames';

import { AvatarPropsType } from './types';

const Avatar: React.FC<AvatarPropsType> = ({ id, firstName, lastName, className, src, alt }) => {
  const classes = classNames(
    'flex flex-col items-center justify-center text-sm font-semibold capitalize bg-hover rounded-full',
    {
      'h-[40px]': !className?.includes('h-'),
      'w-[40px]': !className?.includes('w-'),
    },
    className
  );

  if (!firstName && !lastName && !src) {
    return (
      <img id={id} alt="Avatar logo" src="https://via.placeholder.com/60" className={classes} />
    );
  }

  if (src) {
    return <img id={id} alt={alt} src={src} className={classes} />;
  }

  return (
    <div id={id} className={classes}>
      {firstName?.[0]}
      {lastName?.[0]}
    </div>
  );
};

export default Avatar;
