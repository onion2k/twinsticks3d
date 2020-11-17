import create from 'zustand'

const useStore = create(set => ({
  altitude: 0,
  longitude: 0,
  latitude: 0,
  yaw: 0,
  thrust: 0,
  pitch: 0,
  updateAltitude: (a) => set({ altitude: a }),
  updateLongitude: (l) => set({ longitude: l }),
  updateLatitude: (l) => set({ latitude: l }),
  updateYaw: (y) => set({ yaw: y }),
  updateThrust: (t) => set({ thrust: t }),
  updatePitch: (p) => set({ pitch: p }),
  updateTelemetry: (tel) => set({
    altitude: tel.altitude,
    longitude: tel.longitude,
    latitude: tel.latitude,
    yaw: tel.yaw,
    thrust: tel.thrust,
    pitch: tel.pitch
  })
}))

export default useStore