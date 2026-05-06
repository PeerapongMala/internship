import { HelperI18NextInterface } from 'skillvir-universal-helper/i18next';
import { AnyRoute } from '@tanstack/react-router';
import { EngineThreeGameLoopPropsInterface } from 'skillvir-game-core/engine/three';
import { SceneState } from 'skillvir-game-core/helper/scene-manager';
import { DomainInterface, GroupInterface } from '../interface';
declare const Manager: (domainList: DomainInterface[]) => {
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
declare const Route: {
    Manager: typeof Manager;
    GroupManager: typeof GroupManager;
};
export default Route;
