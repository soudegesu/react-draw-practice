import React, { MutableRefObject, useCallback, useRef, useState, VFC } from 'react';

const Canvas: VFC = () => {
  const ref = useRef(null);
  const { handleOnMouseDown, handleOnMouseMove, handleOnMouseUp, handleOnMouseLeave, handleOnMouseEnter } = useCanvas({ ref });

  return <canvas ref={ref} width="1280" height="720" onMouseDown={handleOnMouseDown}  onMouseMove={handleOnMouseMove} onMouseUp={handleOnMouseUp} onMouseLeave={handleOnMouseLeave} onMouseEnter={handleOnMouseEnter}></canvas>
}

type Props = {
  ref: MutableRefObject<HTMLCanvasElement | null>
}

const useCanvas = ({ ref }: Props) => {

  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleOnMouseDown = useCallback((e: any) => {
    if (!ref.current) {
      return;
    }
    const canvasContext = ref.current.getContext('2d');
    setContext(canvasContext)
    if (!canvasContext) {
      return;
    }
    setIsDragging(true);
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    canvasContext.moveTo(x, y)
  }, [ref]);

  const handleOnMouseMove = useCallback((e: any) => {
    if (!context) {
      return;
    }
    if (!isDragging) {
      return;
    }
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    context.lineTo(x, y);
    context.stroke();
  }, [isDragging, context]);

  const handleOnMouseLeave = useCallback((e: any) => {
    if (!context) {
      return;
    }
    if (!isDragging) {
      return;
    }
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    context.lineTo(x, y);
    context.closePath();
    context.stroke();
  }, [isDragging, context]);

  const handleOnMouseEnter = useCallback((e: any) => {
    if (!context) {
      return;
    }
    if (!isDragging) {
      return;
    }
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    context.lineTo(x, y);
    context.stroke();
  }, [isDragging, context]);

  const handleOnMouseUp = useCallback((e: any) => {
    if (!context) {
      return;
    }
    setIsDragging(false);
  }, [context]);

  return { handleOnMouseDown, handleOnMouseMove, handleOnMouseUp, handleOnMouseLeave, handleOnMouseEnter }
}

export default Canvas;