import { RepositoryPatternInterface } from '../repository-pattern';
import { GetAllCharacter, UpdateCharacter } from './character';
import { ItemBadgeAll, UpdateItemBadge } from './item-badge';
import { GetAllCoupon, UpdateCoupon, UseCoupon } from './item-coupon';
import { GetAllFrame, UpdateFrame } from './item-frame';
import { GetAllPet, UpdatePet } from './pet';

import { ItemLogsAll } from './item-logs';

const Character: RepositoryPatternInterface['Character'] = {
  CharacterAll: { Get: GetAllCharacter },
  UpdateCharacter: { Patch: UpdateCharacter },
};

const ItemBadge: RepositoryPatternInterface['ItemBadge'] = {
  ItemBadgeAll: { Get: ItemBadgeAll },
  UpdateItemBadge: { Patch: UpdateItemBadge },
};

const Pet: RepositoryPatternInterface['Pet'] = {
  petAll: { Get: GetAllPet },
  UpdatePet: { Patch: UpdatePet },
};

const Frame: RepositoryPatternInterface['Frame'] = {
  frameAll: { Get: GetAllFrame },
  UpdateFrame: { Patch: UpdateFrame },
};

const Coupon: RepositoryPatternInterface['Coupon'] = {
  couponAll: { Get: GetAllCoupon },
  UpdateCoupon: { Patch: UpdateCoupon },
  UseCoupon: { Post: UseCoupon },
};

const Log: RepositoryPatternInterface['Log'] = {
  logsAll: { Get: ItemLogsAll },
};

export { Character, Coupon, Frame, ItemBadge, Log, Pet };
