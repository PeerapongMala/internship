import { StrictMode } from "react";


export const HelperStrictMode = (props: { children: React.ReactNode }) => {
  if (import.meta.env.VITE_DEBUG_IS_STRICT_MODE == 'true') {
    console.log('Strict Mode');
    return <StrictMode>{props.children}</StrictMode>;
  }

  return <>{props.children}</>;
};
