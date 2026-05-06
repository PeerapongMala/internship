import { PUBLIC_ASSETS_LOCATION } from '@/assets/public-assets-locations';
import styles from './index.module.css';

const renderItemFrameWithData = (
  props: {
    frame: string;
    image: string;
    level?: number;
    superTier?: boolean;
  }
) => (
  <div className={styles.itemContainer}>
    <img
      className={styles.subtractIcon}
      alt=""
      src={props.frame}
    />
    <div className={styles.itemFrame}>
      <img
        className={styles.item}
        alt=""
        src={props.image}
      />
    </div>
  </div>
);

const Collection = () =>
// props: {
//   image: string;
//   title: string;
//   description: string;
//   level: number;
//   onUpgradeClick: (skill?: string) => void;
//   skill: string;
// } = {
//     image: '',
//     title: '',
//     description: '',
//     level: 0,
//     onUpgradeClick: function (skill?: string): void {
//       throw new Error('Function not implemented.');
//     },
//     skill: '',
//   }
{
  return (
    <>
      <div className={styles.collection}>
        <div className={styles.space} />
        <div className={styles.weapons}>
          <div className={styles.collectionLabel}>อาวุธ</div>
          <img
            className={styles.weaponsTopbar}
            alt=""
            src={PUBLIC_ASSETS_LOCATION.image.special.collection.weaponsTopbar}
          />
          <div className={styles.items}>
            <div className={styles.couple}>
              {renderItemFrameWithData({
                frame: PUBLIC_ASSETS_LOCATION.image.special.collection.weaponFrame,
                image: PUBLIC_ASSETS_LOCATION.image.special.collection.supplyFrame,
              })}
              {renderItemFrameWithData({
                frame: PUBLIC_ASSETS_LOCATION.image.special.collection.weaponFrame,
                image: PUBLIC_ASSETS_LOCATION.image.special.collection.supplyFrame,
              })}
            </div>
            {renderItemFrameWithData({
              frame: PUBLIC_ASSETS_LOCATION.image.special.collection.weaponFrame,
              image: PUBLIC_ASSETS_LOCATION.image.special.collection.supplyFrame,
            })}
            <div className={styles.couple}>
              {renderItemFrameWithData({
                frame: PUBLIC_ASSETS_LOCATION.image.special.collection.weaponFrame,
                image: PUBLIC_ASSETS_LOCATION.image.special.collection.supplyFrame,
              })}
              {renderItemFrameWithData({
                frame: PUBLIC_ASSETS_LOCATION.image.special.collection.weaponFrame,
                image: PUBLIC_ASSETS_LOCATION.image.special.collection.supplyFrame,
              })}
            </div>
          </div>
          <div className={styles.bottombar}>
            <div className={styles.weaponsbottombar}>
              <img
                className={styles.weaponsbottombarleftIcon}
                src={
                  PUBLIC_ASSETS_LOCATION.image.special.collection.weaponsBottombarLeft
                }
              />
              <img
                className={styles.weaponsbottombarrightIcon}
                src={
                  PUBLIC_ASSETS_LOCATION.image.special.collection.weaponsBottombarRight
                }
              />
            </div>
          </div>
        </div>
        <div className={styles.space} />
        <div className={styles.supplies}>
          <div className={styles.collectionLabel}>เสบียง</div>
          <img
            className={styles.suppliesTopbar}
            src={PUBLIC_ASSETS_LOCATION.image.special.collection.suppliesTopbar}
          />
          <div className={styles.items}>
            <div className={styles.couple}>
              {renderItemFrameWithData({
                frame: PUBLIC_ASSETS_LOCATION.image.special.collection.supplyFrame,
                image: PUBLIC_ASSETS_LOCATION.image.special.collection.weaponFrame,
              })}
              {renderItemFrameWithData({
                frame: PUBLIC_ASSETS_LOCATION.image.special.collection.supplyFrame,
                image: PUBLIC_ASSETS_LOCATION.image.special.collection.weaponFrame,
              })}
            </div>
            {renderItemFrameWithData({
              frame: PUBLIC_ASSETS_LOCATION.image.special.collection.supplyFrame,
              image: PUBLIC_ASSETS_LOCATION.image.special.collection.weaponFrame,
            })}
            <div className={styles.couple}>
              {renderItemFrameWithData({
                frame: PUBLIC_ASSETS_LOCATION.image.special.collection.supplyFrame,
                image: PUBLIC_ASSETS_LOCATION.image.special.collection.weaponFrame,
              })}
              {renderItemFrameWithData({
                frame: PUBLIC_ASSETS_LOCATION.image.special.collection.supplyFrame,
                image: PUBLIC_ASSETS_LOCATION.image.special.collection.weaponFrame,
              })}
            </div>
          </div>
          <div className={styles.collectionBottombar}>
            <div className={styles.weaponsbottombar}>
              <img
                className={styles.suppliesbottombarleftIcon}
                src={
                  PUBLIC_ASSETS_LOCATION.image.special.collection.suppliesBottombarLeft
                }
              />
              <img
                className={styles.suppliesbottombarrightIcon}
                src={
                  PUBLIC_ASSETS_LOCATION.image.special.collection.suppliesBottombarRight
                }
              />
            </div>
          </div>
        </div>
        <div className={styles.space} />
      </div>
    </>
  );
};

export default Collection;
