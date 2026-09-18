// vanta ships no types. Only the one effect we use is declared.
declare module 'vanta/dist/vanta.clouds.min' {
  const CLOUDS: (options: Record<string, unknown>) => { destroy: () => void }
  export default CLOUDS
}
