/**
 * This component generates the model-viewer tag to display 3D object in your slide
 *
 * `!modelviewer(path to your glb file)`
 */
export default (data) => {
  let newData = data;
  [...newData.matchAll(/!modelviewer\((.*)\)/g)].forEach((match) => {
    newData = newData.replace(
      match[0],
      `<model-viewer src="${match[1]}" ar shadow-intensity="1" camera-controls touch-action="pan-y"></model-viewer>`,
    );
  });
  return newData;
};
