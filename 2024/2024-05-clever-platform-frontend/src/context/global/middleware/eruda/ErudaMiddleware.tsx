import eruda from 'eruda';
import { ReactNode, useEffect } from 'react';
type ErudaMiddlewarewareProps = { children?: ReactNode };

const ErudaMiddleware = ({ children }: ErudaMiddlewarewareProps) => {
    useEffect(() => {
        if (process.env.NODE_ENV !== 'production' || localStorage.getItem("debugMode") === 'true') {
            eruda.init();
        }

    }, [])
    return children;
};

export default ErudaMiddleware;
