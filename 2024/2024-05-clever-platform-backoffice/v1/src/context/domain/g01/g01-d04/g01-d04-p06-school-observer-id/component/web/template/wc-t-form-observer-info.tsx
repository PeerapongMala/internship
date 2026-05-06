import { IObserverAccess, IObserverInput } from '@domain/g01/g01-d04/local/type';
import UserProfileInfo from '../molecule/UserProfileInfo';
import React from 'react';

interface FormObserverInfoProps {
  observerInput: IObserverInput;
  setObserverInput: React.Dispatch<React.SetStateAction<IObserverInput>>;
  observerAccesses?: IObserverAccess[];
}

export default function FormObserverInfo({
  observerInput,
  setObserverInput,
  observerAccesses,
}: FormObserverInfoProps) {
  return (
    <UserProfileInfo
      inputValueObserver={observerInput}
      setInputValueObserver={setObserverInput}
      observerAccesses={observerAccesses}
    />
  );
}
