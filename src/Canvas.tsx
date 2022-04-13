import React, { MutableRefObject, useCallback, useEffect, useRef, useState, VFC } from 'react';
import {  v4 as uuidv4 } from 'uuid';

const Canvas: VFC = () => {
  const ref = useRef(null);
  const { handleOnMouseDown, handleOnMouseMove, handleOnMouseUp, handleOnMouseLeave, handleOnMouseEnter } = useCanvas({ ref });

  return <canvas ref={ref} width="1280" height="720" onMouseDown={handleOnMouseDown}  onMouseMove={handleOnMouseMove} onMouseUp={handleOnMouseUp} onMouseLeave={handleOnMouseLeave} onMouseEnter={handleOnMouseEnter}></canvas>
}

type Props = {
  ref: MutableRefObject<HTMLCanvasElement | null>
}

class DrawPath {
  id: string;
  points: Point[];

  constructor() {
    this.id = uuidv4();
    this.points = [];
  }

  fixPoints() {
    setTimeout(() => {
      this.points = [];
    }, 2000);
  }
}

type Point = {
  x: number;
  y: number;
}

const useCanvas = ({ ref }: Props) => {

  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<DrawPath | null>(null);
  const [drawnPaths, setDrawnPaths] = useState<DrawPath[]>([]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const canvasContext = ref.current.getContext('2d');
    setContext(canvasContext)
  }, [ref]);

  const handleOnMouseDown = useCallback((e: any) => {
    if (!context) {
      return;
    }
    setIsDragging(true);
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    context.beginPath();
    context.moveTo(x, y);
    const path = new DrawPath();
    path.points.push({x, y});
    setCurrentPath(path);

    drawCurrentPath();
  }, [context]);

  const handleOnMouseMove = useCallback((e: any) => {
    if (!isDragging) {
      return;
    }
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    currentPath?.points.push({x, y});

    drawCurrentPath();
  }, [isDragging, currentPath]);

  const handleOnMouseLeave = useCallback((e: any) => {
    if (!isDragging) {
      return;
    }
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    currentPath?.points.push({x, y});

    setIsDragging(false);
    
    drawCurrentPath();
  }, [isDragging, currentPath]);

  const handleOnMouseEnter = useCallback((e: any) => {
    if (!isDragging) {
      return;
    }
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    currentPath?.points.push({x, y});

    drawCurrentPath();
  }, [isDragging, currentPath]);

  const handleOnMouseUp = useCallback((e: any) => {
    if (!context) {
      return;
    }
    setIsDragging(false);

    if (!currentPath) {
      return;
    }
    // 全部pathを引っ越して描画しなおす
    const id = currentPath?.id;
    currentPath.fixPoints();
    drawnPaths.push(currentPath);
    setCurrentPath(null);
    if (ref.current) {
      context.clearRect(0 ,0, ref.current.width, ref.current.height);
    }
    drawDrawnPaths(drawnPaths);

    setTimeout(() => {
      if (ref.current) {
        context.clearRect(0 ,0, ref.current.width, ref.current.height);
        drawCurrentPath();
        drawDrawnPaths(drawnPaths);
      }
    }, 2000);
  }, [context, drawnPaths, currentPath, ref]);

  const drawCurrentPath = useCallback(() => {
    if (!context || !currentPath) {
      return;
    }
    context.save();
    context.beginPath();
    currentPath?.points.forEach((point) => {
      context.lineTo(point.x, point.y);
    });
    context.stroke();
  }, [context, currentPath]);

  const drawDrawnPaths = useCallback((paths: DrawPath[]) => {
    if (!context) {
      return;
    }
    paths.forEach((drawnPath) => {
      context.beginPath();
      context.strokeStyle = 'red';
      drawnPath.points.forEach((point) => {
        context.lineTo(point.x, point.y);
      })
      context.stroke();
    });
    context.restore();
  }, [context]);

  useEffect(() => {

  }, []);

  return { handleOnMouseDown, handleOnMouseMove, handleOnMouseUp, handleOnMouseLeave, handleOnMouseEnter }
}

export default Canvas;