import React from 'react';

export const HelperStrictMode = (props: { children: React.ReactNode }) => {
  if (import.meta.env.VITE_DEBUG_IS_STRICT_MODE == 'true') {
    console.log('Strict Mode');
    return <React.StrictMode>{props.children}</React.StrictMode>;
  }

  return <>{props.children}</>;
};
