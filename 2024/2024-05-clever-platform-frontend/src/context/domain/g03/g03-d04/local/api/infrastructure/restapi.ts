import { Character, Coupon, Frame, ItemBadge, Log, Pet } from '../group';
import { RepositoryPatternInterface } from '../repository-pattern';

const RestAPI: RepositoryPatternInterface = {
  Character,
  ItemBadge,
  Pet,
  Frame,
  Coupon,
  Log,
};

export default RestAPI;
