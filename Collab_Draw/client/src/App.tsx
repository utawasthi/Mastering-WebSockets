import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client"

const socket : Socket = io('http://localhost:3000');

interface DrawData {
  x0 : number;
  y0 : number;
  x1 : number;
  y1 : number;
}

const App : React.FC = () => {

  const canvasRef = useRef<HTMLCanvasElement | null> (null);
  const ctxRef = useRef<CanvasRenderingContext2D | null> (null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPos = useRef<{x : number; y : number}> ({x : 0 , y : 0})

  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    if(!ctx) return ;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctxRef.current = ctx;
  } , []);


  const drawLine = (x0 : number , y0 : number , x1 : number , y1 : number , emit : boolean) : void => {
    const ctx = ctxRef.current;
    if(!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x0 , y0);
    ctx.lineTo(x1 , y1);
    ctx.stroke();
    ctx.closePath();

    if(emit){
      const drawData : DrawData = {x0 , y0 , x1 , y1};
      socket.emit('draw' , drawData);
    }
  }


  useEffect(() => {
    const drawListener = ({x0 , y0 , x1 , y1} : DrawData) => {
      drawLine(x0 , y0 , x1 , y1 , false);
    };

    socket.on('draw' , drawListener);

    return () => {
      socket.off('draw' , drawListener);
    }
  } , []);


  const handleMouseDown = (e : React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const {offsetX , offsetY} = e.nativeEvent;
    lastPos.current = {x : offsetX , y : offsetY};
  };

  const handleMouseMove = (e : React.MouseEvent<HTMLCanvasElement>) => {
    if(!isDrawingRef.current) return;

    const {offsetX , offsetY} = e.nativeEvent;
    const {x : prevX , y : prevY} = lastPos.current;

    drawLine(prevX , prevY , offsetX , offsetY , true);
    lastPos.current = {x : offsetX , y : offsetY};
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  }

  return (
    <canvas 
      ref = {canvasRef}
      onMouseDown = {handleMouseDown}
      onMouseMove = {handleMouseMove}
      onMouseUp = {handleMouseUp}
      onMouseLeave = {handleMouseUp}

      style = {{display : 'block' , border : '1px solid black'}}
    />
  )
}

export default App
