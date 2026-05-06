import VectorNext from '../../../assets/VectorNext.svg';
import VectorPrevius from '../../../assets/VectorPre.svg';
import IconButton from '../atoms/wc-a-icon-button';

export function DateTime() {
  return (
    <div className="flex justify-center items-center pl-10">
      <IconButton
        iconSrc={VectorPrevius}
        width={40}
        height={40}
        style={{
          backgroundColor: '#00c5ff', // Correct
          borderColor: '#ace4f2', // Changed to camelCase
        }}
      />

      <div className="pl-5 pr-5 noto-sans-thai1200 text-xl text-gray-20 ">
        อาทิตย์นี้ (วว/ดด/ปป - วว/ดด/ปป)
      </div>
      <IconButton
        iconSrc={VectorNext}
        width={40}
        height={40}
        style={{
          backgroundColor: '#00c5ff', // Correct
          borderColor: '#ace4f2', // Changed to camelCase
        }}
      />
    </div>
  );
}

export default DateTime;
