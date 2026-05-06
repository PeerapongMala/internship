import { AnyRoute } from '@tanstack/react-router';
import { HelperI18NextInterface } from 'skillvir-universal-helper/i18next';
export interface DomainInterface {
    domain: RouteInterface;
    routePath: string;
}
export interface GroupInterface {
    domainList: (routePath: string) => DomainInterface[];
    i18NInit: HelperI18NextInterface['I18NDomainInterface'];
}
export interface RouteInterface {
    I18N: HelperI18NextInterface['I18NDomainInterface'];
    JSX: () => JSX.Element;
    Route: (routePath: string) => (routeParent: AnyRoute) => AnyRoute;
    GameInitial?: any;
}
export interface HelperArchitectureDomainInterface {
    RouteInterface: RouteInterface;
}
