import React, { useState, useEffect } from 'react'
import { useFrame } from 'react-three-fiber'

const GamepadContext = React.createContext({});

const GamepadProvider = (props) => {
  // const ref = useRef()

  const yawMin = -1.6;
  const yawMax = 1.6;
  const yawSensitivity = 0.12;

  const pitchMin = -1.6;
  const pitchMax = 1.6;
  const pitchSensitivity = 0.12;

  const thrustMax = 1;
  const thrustMin = 0;
  const thrustDeadMax = 0.1;

  const [gamepadState, setGamepadState] = useState(null);

  const [yawInputState, setYawInputState] = useState(0);
  const [pitchInputState, setPitchInputState] = useState(0);
  const [thrustInputState, setThrustInputState] = useState(0);

  const [yawState, setYawState] = useState(0);
  const [pitchState, setPitchState] = useState(0);
  const [thrustState, setThrustState] = useState(0);

  useEffect(()=>{
    window.addEventListener("gamepadconnected", (event) => {
      console.log("A gamepad connected");
    });
    
    window.addEventListener("gamepaddisconnected", (event) => {
      console.log("A gamepad disconnected");
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
          setPitchInputState(1);
          break;
        case 'ArrowDown':
          setPitchInputState(-1);
          break;  
        case 'a':
          setThrustInputState(1);
          break;
        case 'z':
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
          setPitchInputState(0);
          break;
        case 'ArrowDown':
          setPitchInputState(0);
          break;
        case 'a':
        case 'z':
          setThrustInputState(0);
          break;
        default:
          break;
      }

    });


  }, [])

  useFrame(() => {

      const gp = navigator.getGamepads();
      if (gp[0]) {
        setGamepadState(gp[0]);
      } else {
        if (yawInputState) {
          if (yawState < yawMax && yawState > yawMin) {
            setYawState(yaw=>yaw += yawSensitivity * yawInputState)
          } else {
            if (yawState > yawMax) {
              setYawState(yawMax)
            } else if (yawState < yawMin) {
              setYawState(yawMin)
            }
          }
        } else {
          if (yawState < yawSensitivity && yawState > -yawSensitivity) {
            setYawState(0);
          } else {
            setYawState(yaw=>yaw += yawSensitivity * -2.0 * Math.sign(yaw))
          }
        }

        if (pitchInputState) {
          if (pitchState < pitchMax && pitchState > pitchMin) {
            setPitchState(yaw=>yaw += yawSensitivity * pitchInputState)
          } else {
            if (pitchState > pitchMax) {
              setPitchState(pitchMax)
            } else if (pitchState < pitchMin) {
              setPitchState(pitchMin)
            }
          }
        } else {
          if (pitchState < pitchSensitivity && pitchState > -pitchSensitivity) {
            setPitchState(0);
          } else {
            setPitchState(pitch=>pitch += pitchSensitivity * -2.0 * Math.sign(pitch))
          }
        }

        if (thrustInputState) {
          if (thrustState < thrustMax*0.9 && thrustState >= thrustMin) {
            setThrustState(thrust=>thrust += 0.1 * thrustInputState)
          }
        } else {
          if (thrustState < thrustDeadMax) {
            setThrustState(0)
          } else {
            setThrustState(thrust=>thrust -= 0.01)
          }
        }

        setGamepadState({
          axes: [yawState,pitchState,0,0],
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
