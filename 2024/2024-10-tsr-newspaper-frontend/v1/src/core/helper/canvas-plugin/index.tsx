import  { useEffect, useRef } from 'react';

const CanvasPlugin = (props: {
  className: string;
  setUI: (canvas: HTMLCanvasElement, context2d: CanvasRenderingContext2D) => void;
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (!canvas) {
      return;
    }

    // @ts-expect-error - getContext is not available on null
    const ctx = canvas.getContext('2d');
    props.setUI(canvas, ctx);
    // Set canvas size
    // // @ts-expect-error - getContext is not available on null
    // canvas.width = 400;
    // // @ts-expect-error - getContext is not available on null
    // canvas.height = 300;

    const resizeCanvas = () => {
      if (!canvas) {
        return;
      }
      // @ts-expect-error - getContext is not available on null
      canvas.width = window.innerWidth;
      // @ts-expect-error - getContext is not available on null
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ border: '1px solid black' }}
      className={props.className}
    />
  );
};

export default CanvasPlugin;
