import ImageCancelCircle from '@global/assets/icon-cancel-circle.png';
import ImageIconEdit from '@global/assets/icon-edit.svg';
import ImageIconEraser from '@global/assets/icon-eraser.svg';
import ImageIconTrash from '@global/assets/icon-trash.svg';
import Button from '@global/component/web/atom/wc-a-button';
import { cn } from '@global/helper/cn';
import StoreGlobal from '@store/global';
import { useRef, useState } from 'react';
import { ReactSketchCanvas, type ReactSketchCanvasRef } from 'react-sketch-canvas';

const WCAUICanvas = ({ children }: any) => {
  const { activeCanvas } = StoreGlobal.StateGet(['activeCanvas']);

  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [eraseMode, setEraseMode] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(20);
  const [strokeColor, setStrokeColor] = useState('black');
  const [activeButton, setActiveButton] = useState('black');

  const handleEraserClick = () => {
    setEraseMode(true);
    setActiveButton('');
    setStrokeColor('transparent');
    canvasRef.current?.eraseMode(true);
  };

  const handlePenClick = (color: string) => {
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);

    if (strokeColor === color) {
      setActiveButton('');
      setStrokeColor('');
    } else {
      setActiveButton(color);
      setStrokeColor(color);
    }
  };

  const handleResetClick = () => {
    canvasRef.current?.resetCanvas();
  };

  const handleClose = () => {
    setActiveButton('');
    setStrokeColor('black');
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
    canvasRef.current?.resetCanvas();
    StoreGlobal.MethodGet().activeCanvasSet(false);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center relative">
      <div className="absolute top-0 left-0 w-full h-full">{children}</div>
      {activeCanvas && (
        <>
          <div className="absolute top-[10%] left-0 w-full h-[75%] flex flex-col gap-4 items-center justify-center">
            <ReactSketchCanvas
              ref={canvasRef}
              className="w-full cursor-crosshair"
              style={{
                outline: '20rem solid rgba(0, 0, 0, 0.5)',
              }}
              width="100%"
              height="100%"
              canvasColor="transparent"
              strokeColor={eraseMode ? 'transparent' : strokeColor}
              strokeWidth={strokeWidth}
              eraserWidth={eraserWidth}
            />
          </div>
          <div
            className="absolute left-1/2 transform -translate-x-1/2 bottom-[5%]
           flex gap-2 items-center bg-gray-300 border-4 border-white p-[5px] px-2 rounded-full w-fit
           scale-[0.8]
           "
          >
            <Button
              width="46px"
              height="46px"
              className={cn(
                '!bg-black !border-black ',
                activeButton === 'black' &&
                  'scale-[1.3] hover:scale-[1.3] active:scale-[1.3]',
              )}
              onClick={() => handlePenClick('black')}
            >
              <img src={ImageIconEdit} alt="setting" width="26px" height="26px" />
            </Button>
            <Button
              width="46px"
              height="46px"
              className={cn(
                '!bg-green-500 !border-green-500',
                activeButton === 'green' &&
                  'scale-[1.3] hover:scale-[1.3] active:scale-[1.3]',
              )}
              onClick={() => handlePenClick('green')}
            >
              <img src={ImageIconEdit} alt="setting" width="26px" height="26px" />
            </Button>
            <Button
              width="46px"
              height="46px"
              className={cn(
                '!bg-red-500 !border-red-500',
                activeButton === 'red' &&
                  'scale-[1.3] hover:scale-[1.3] active:scale-[1.3]',
              )}
              onClick={() => handlePenClick('red')}
            >
              <img src={ImageIconEdit} alt="setting" width="26px" height="26px" />
            </Button>
            <div className="w-1 h-full border-r-4 border-dotted border-white" />
            <Button
              width="46px"
              height="46px"
              className={cn(
                '!bg-blue-500 !border-blue-500',
                eraseMode && 'scale-[1.3] hover:scale-[1.3] active:scale-[1.3]',
              )}
              onClick={handleEraserClick}
            >
              <img src={ImageIconEraser} alt="setting" width="26px" height="26px" />
            </Button>
            <Button
              width="46px"
              height="46px"
              className={'!bg-red-600 !border-red-600'}
              onClick={handleResetClick}
            >
              <img src={ImageIconTrash} alt="setting" width="29px" height="29px" />
            </Button>
            <div className="w-1 h-full border-r-4 border-dotted border-white" />
            <img
              className="h-6 cursor-pointer"
              src={ImageCancelCircle}
              onClick={handleClose}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default WCAUICanvas;
