import React from 'react';
import InfiniteScrollDropDown from './InfiniteScrollDropDown';
import StaticDropDown from './StaticDropDown';

export default function DynamicTreeDropdown(props: any) {
  if (props?.staticDropdown) {
    return <StaticDropDown {...props} />;
  } else {
    return <InfiniteScrollDropDown {...props} />;
  }
}
