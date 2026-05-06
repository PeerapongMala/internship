import { HelperI18NextInterface } from "skillvir-universal-helper/i18next";
import { AnyRoute, RouteComponent } from "@tanstack/react-router";
import { EngineThreeGameLoopPropsInterface } from "skillvir-game-core/engine/three";
import { SceneState } from "skillvir-game-core/helper/scene-manager";
import { GroupInterface, RouteInterface } from "../interface";
declare const Manager: (domainList: {
    domain: RouteInterface;
    routePath: string;
}[]) => {
    i18nList: HelperI18NextInterface["I18NDomainInterface"][];
    sceneStateList: SceneState<EngineThreeGameLoopPropsInterface>[];
    routeFuncList: ((routeTree: AnyRoute) => AnyRoute)[];
};
declare const GroupManager: (groupList: {
    group: GroupInterface;
    routePath: string;
}[]) => {
    i18nList: HelperI18NextInterface["I18NDomainInterface"][];
    sceneStateList: SceneState<EngineThreeGameLoopPropsInterface>[];
    routeFuncList: ((routeTree: AnyRoute) => AnyRoute)[];
};
declare const LayoutManager: (layout: {
    id: string;
    componentWithChildren: RouteComponent<any>;
}, managerList: {
    i18nList: HelperI18NextInterface["I18NDomainInterface"][];
    sceneStateList: SceneState<EngineThreeGameLoopPropsInterface>[];
    routeFuncList: ((routeTree: AnyRoute) => AnyRoute)[];
}) => {
    i18nList: HelperI18NextInterface["I18NDomainInterface"][];
    sceneStateList: SceneState<EngineThreeGameLoopPropsInterface>[];
    routeFuncList: ((routeTree: AnyRoute) => AnyRoute)[];
};
declare const LayoutManagerWithGroup: (layout: {
    id: string;
    componentWithChildren: RouteComponent<any>;
}, groupList: {
    group: GroupInterface;
    routePath: string;
}[]) => {
    i18nList: HelperI18NextInterface["I18NDomainInterface"][];
    sceneStateList: SceneState<EngineThreeGameLoopPropsInterface>[];
    routeFuncList: ((routeTree: AnyRoute) => AnyRoute)[];
};
declare const MergeRawList: (rawList: {
    i18nList: HelperI18NextInterface["I18NDomainInterface"][];
    sceneStateList: SceneState<EngineThreeGameLoopPropsInterface>[];
    routeFuncList: ((routeTree: AnyRoute) => AnyRoute)[];
}[]) => {
    i18nList: HelperI18NextInterface["I18NDomainInterface"][];
    sceneStateList: SceneState<EngineThreeGameLoopPropsInterface>[];
    routeFuncList: ((routeTree: AnyRoute) => AnyRoute)[];
};
declare const Route: {
    Manager: typeof Manager;
    GroupManager: typeof GroupManager;
    LayoutManager: typeof LayoutManager;
    LayoutManagerWithGroup: typeof LayoutManagerWithGroup;
    MergeRawList: typeof MergeRawList;
};
export default Route;
