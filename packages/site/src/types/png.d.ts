// custom.d.ts

declare module '*.png' {
  const value: string; // the import will be a string (path to the image)
  export default value;
}
