import create from 'zustand'

const useStore = create(set => ({
  altitude: 0,
  updateAltitude: (alt) => set({ altitude: alt })
}))

export default useStore