import { PropsWithChildren } from 'react';
import VristoLayoutDefault from '../../vristo/component/layout/default';
export type LayoutDefaultInterface = ({ children }: PropsWithChildren) => JSX.Element;

const LayoutDefault: LayoutDefaultInterface = VristoLayoutDefault;
export default LayoutDefault;
