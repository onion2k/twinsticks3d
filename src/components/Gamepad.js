import React, { useState, useEffect } from 'react'
import { useFrame } from 'react-three-fiber'

const GamepadContext = React.createContext({});

const GamepadProvider = (props) => {
  // const ref = useRef()
  const [pollGamepads, setPollGamepads] = useState(false);
  const [gamepadState, setGamepadState] = useState(null);

  const [yawInputState, setYawInputState] = useState(0);
  const [thrustInputState, setThrustInputState] = useState(0);

  const [yawState, setYawState] = useState(0);
  const [thrustState, setThrustState] = useState(0);

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

      switch (event.key) {
        case 'ArrowLeft':
          setYawInputState(-1);
          break;
        case 'ArrowRight':
          setYawInputState(1);
          break;
        case 'ArrowUp':
          setThrustInputState(1);
          break;
        case 'ArrowDown':
          setThrustInputState(-1);
          break;
        default:
          break;
      }

    });

    window.addEventListener("keyup", (event) => {

      switch (event.key) {
        case 'ArrowLeft':
          setYawInputState(0);
          break;
        case 'ArrowRight':
          setYawInputState(0);
          break;
        case 'ArrowUp':
          setThrustInputState(0);
          break;
        case 'ArrowDown':
          setThrustInputState(0);
          break;
        default:
          break;
      }

    });


  }, [])

  useFrame(({ clock, camera }) => {

      const gp = navigator.getGamepads();
      if (gp[0]) {
        setGamepadState(gp[0]);
      } else {

        if (yawInputState) {
          setYawState(yaw=>yaw += 0.1 * yawInputState)
        } else {
          //die back
        }

        if (thrustInputState) {
          setThrustState(thrust=>thrust += 0.1 * thrustInputState)
        } else {
          //die back
        }

        setGamepadState({
          axes: [yawState,0,0,0],
          buttons: [
            0,0,0,0,0,0,0,
            { value: thrustState }
            ,0,0,0,0,0
          ]
        });
      }
  })

  return (
    <GamepadContext.Provider value={[gamepadState, setGamepadState]}>
      {props.children}
    </GamepadContext.Provider>
  )

}

export { GamepadContext, GamepadProvider };
