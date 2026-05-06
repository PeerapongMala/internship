import { Link } from '@tanstack/react-router';
import listActive from '../../assets/list-active.png'

const activelist: React.CSSProperties = {
  width: `stretch`,
  height: `106px`,
  position: 'relative', // Remove absolute positioning
  backgroundImage: `url(${listActive})`,
};

interface AnnounceSlotsProps {
  additionalProp1: string;
  additionalProp2: number;
  KeyZIndex: number;
  // Add other props here
}

const WCTAnnounceSlots: React.FC<AnnounceSlotsProps> = ({KeyZIndex, additionalProp1, additionalProp2 }) => {
  // Component implementation
  console.log(additionalProp1)
  console.log( additionalProp2)

  console.log("CALL FROM ANNOUNCE SLOT COMPO")
  return (
  <div
    key={KeyZIndex}
    className="absolute inset-0 bg-cover bg-center"
    style={{ ...activelist }} // Adjust the top position dynamically
    onClick={() => {
      console.log("Clicking click");
    }}
  ></div>)
};


export default WCTAnnounceSlots;
