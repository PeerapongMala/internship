// import { useClickCountTrigger, useLongPress } from '@global/helper/detect-press';
import { useClickCountTrigger, useLongPress } from '@global/helper/detect-press';
import StoreGame from '@store/game';
import { STATEFLOW } from '../../../interfaces/stateflow.interface';
import InnoMathImg from '/logo/BLUE_DS_LOGO_INNOMATH.png';

interface LoginLogoProps {
  // enable a trigger for enter an login admin mode
  // if `pressed`, long press 7 seconds to enter admin mode
  // if `clicked`, click 7 times to enter admin mode
  // otherwise, do nothing
  enableEnterAdminMode?: 'pressed' | 'clicked';
}

export default function LoginLogo({ enableEnterAdminMode }: LoginLogoProps) {
  const longPressEvents = useLongPress({
    onLongPress: () => {
      StoreGame.MethodGet().State.Flow.Set(STATEFLOW.AdminEmail);
    },
    shouldPreventDefault: true,
    delay: 7000,
  });

  const clickEvents = useClickCountTrigger({
    triggerCount: 7,
    onTrigger: () => {
      StoreGame.MethodGet().State.Flow.Set(STATEFLOW.AdminEmail);
    },
    timeout: 300,
  });

  let registerEvents = {};
  if (enableEnterAdminMode === 'pressed') {
    registerEvents = longPressEvents;
  } else if (enableEnterAdminMode === 'clicked') {
    registerEvents = clickEvents;
  }

  return (
    <div className="select-none" {...registerEvents}>
      <img
        src={InnoMathImg}
        alt="InnoMathImg"
        className="w-[500px] pointer-events-none"
      />
    </div>
  );
}
