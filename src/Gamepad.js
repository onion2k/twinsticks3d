import React, { useState, useEffect } from 'react'
import { useFrame } from 'react-three-fiber'

const GamepadContext = React.createContext({});

const GamepadProvider = (props) => {
  // const ref = useRef()
  const [pollGamepads, setPollGamepads] = useState(false);
  const [gamepadState, setGamepadState] = useState(null);

  useEffect(()=>{
    window.addEventListener("gamepadconnected", (event) => {
      console.log("A gamepad connected");
      setPollGamepads(true);
    });
    
    window.addEventListener("gamepaddisconnected", (event) => {
      console.log("A gamepad disconnected");
      setPollGamepads(false);
    });
  }, [])

  useFrame(({ clock, camera }) => {
    if (pollGamepads) {
      const gp = navigator.getGamepads();
      setGamepadState(gp[0]);
    }
  })

  return (
    <GamepadContext.Provider value={[gamepadState, setGamepadState]}>
      {props.children}
    </GamepadContext.Provider>
  )

}

export { GamepadContext, GamepadProvider };
