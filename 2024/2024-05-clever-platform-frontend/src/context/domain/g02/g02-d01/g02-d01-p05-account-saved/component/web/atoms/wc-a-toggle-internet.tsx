import ImageToggleInternet from '../../../assets/toggle-internet.svg';
import ImageToggleBackgroudInternet from '../../../assets/toggle-internet-background.svg';
import ImageToggleNoInternet from '../../../assets/toggle-no-internet.svg';
import ImageToggleBackgroudNoInternet from '../../../assets/toggle-no-internet-background.svg';

const ToggleButtonInternet = ({
  isChecked,
  onChange,
}: {
  isChecked: boolean;
  onChange: () => void;
}) => {
  return (
    <label className="flex cursor-pointer select-none items-center">
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
          className="sr-only"
        />
        <div className="block h-[66px]">
          <img
            className="h-full w-full object-cover"
            src={
              isChecked ? ImageToggleBackgroudNoInternet : ImageToggleBackgroudInternet
            }
            alt={isChecked ? 'No Internet BG Icon' : 'Internet BG Icon'}
          />
        </div>
        <div
          className={`dot absolute left-1 top-[6px] h-11 w-11 rounded-full bg-white m-1 transition ${
            isChecked ? 'translate-x-[40px]' : ''
          }`}
        >
          <img
            className="h-full w-full"
            src={isChecked ? ImageToggleNoInternet : ImageToggleInternet}
            alt={isChecked ? 'No Internet Icon' : 'Internet Icon'}
          />
        </div>
      </div>
    </label>
  );
};

export default ToggleButtonInternet;
