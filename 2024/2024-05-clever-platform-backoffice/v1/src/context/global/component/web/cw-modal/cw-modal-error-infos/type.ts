import { ReactNode } from 'react';

export type TModalErrorInfosOptions = {
  title?: ReactNode;
  contextTitle?: ReactNode;
  messageTitle?: ReactNode;
};

export type TErrorInfos = {
  context: ReactNode;
  message: ReactNode;
};
