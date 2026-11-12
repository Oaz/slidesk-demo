let video;

async function getConnectedDevices(type) {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === type);
}

async function openCamera(cameraId, minWidth, minHeight) {
  const constraints = {
    video: {
      deviceId: cameraId,
      width: { min: minWidth },
      height: { min: minHeight },
    },
  };

  return await navigator.mediaDevices.getUserMedia(constraints);
}

window.addEventListener("load", () => {
  video = document.querySelector("#webcam");
  webcamize();
});

const webcamize = async () => {
  const cameras = await getConnectedDevices("videoinput");
  const bugCams = cameras.filter((c) => c.label !== "").length;
  console.log(cameras);
  if (cameras && cameras.length > 0) {
    cameras.forEach((camera, _) => {
      if (
        camera.label.includes(window.slidesk.env.WEBCAM) ||
        (camera.label === "" && bugCams === 0)
      ) {
        console.log("camera found");
        openCamera(camera.deviceId, 1280, 720).then((stream) => {
          video.srcObject = stream;
        });
      }
    });
  }
};

window.slidesk.webcam = () => {
  video.classList.toggle("displayed");
};
