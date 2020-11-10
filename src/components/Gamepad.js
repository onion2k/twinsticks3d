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

    window.addEventListener("keydown", (event) => {
      setPollGamepads(true);
    });

    window.addEventListener("keyup", (event) => {
      setPollGamepads(false);
    });
  }, [])

  useFrame(({ clock, camera }) => {
    if (pollGamepads) {
      const gp = navigator.getGamepads();
      if (gp[0]) {
        setGamepadState(gp[0]);
      } else {
        setGamepadState({
          axes: [0.9,0,0,0],
          buttons: [
            0,0,0,0,0,0,0,
            { value: 0.2 }
            ,0,0,0,0,0
          ]
        });
      }
    } else {
      setGamepadState(null);
    }
  })

  return (
    <GamepadContext.Provider value={[gamepadState, setGamepadState]}>
      {props.children}
    </GamepadContext.Provider>
  )

}

export { GamepadContext, GamepadProvider };
