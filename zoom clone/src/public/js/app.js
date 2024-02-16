// io는 자동적으로 back-end socket.io와 연결해주는 fn이다.
const socket = io();

const $myFace = document.getElementById("myFace");
const $muteBtn = document.getElementById("mute");
const $cameraBtn = document.getElementById("camera");
const $cameraSelect = document.getElementById("cameras");

// stream = video + audio
// stream은 track을 제공하고 접근 가능하다.
let myStream;
let isMuted = false;
let isCameraOn = false;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    cameras.forEach((cam) => {
      const $option = document.createElement("option");
      $option.value = cam.deviceId;
      $option.innerText = cam.label;
      $cameraSelect.appendChild($option);
    });
    console.log(cameras);
  } catch (error) {
    console.log(error);
  }
}

async function getMedia() {
  // getUserMedia는 유저의 유저미디어 string을 준다
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    $myFace.srcObject = myStream;
    await getCameras();
  } catch (error) {
    console.log(error);
  }
}

getMedia();

function handleMuteClick() {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!isMuted) {
    $muteBtn.innerText = "Unmute";
    isMuted = true;
  } else {
    $muteBtn.innerText = "Mute";
    isMuted = false;
  }
}
function handleCameraClick() {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (isCameraOn) {
    $cameraBtn.innerText = "Camera Off";
    isCameraOn = false;
  } else {
    $cameraBtn.innerText = "Camera On";
    isCameraOn = true;
  }
}

$muteBtn.addEventListener("click", handleMuteClick);
$cameraBtn.addEventListener("click", handleCameraClick);
