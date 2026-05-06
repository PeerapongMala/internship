import { PropsWithChildren } from 'react';
import VristoLayoutBlank from '../../vristo/component/layout/blank';
export type LayoutBlankInterface = ({ children }: PropsWithChildren) => JSX.Element;

const LayoutBlank: LayoutBlankInterface = VristoLayoutBlank;
export default LayoutBlank;
