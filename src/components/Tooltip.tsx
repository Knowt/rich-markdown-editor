import React, { ReactNode } from 'react';


type Props = {
  children: ReactNode;
  tooltip: string;
};


const Tooltip = ( { 
  children,
  tooltip, 
}: Props ) => {
  return (
    <span title={tooltip}>{children}</span>
  )
}


export default Tooltip;