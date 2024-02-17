// io는 자동적으로 back-end socket.io와 연결해주는 fn이다.
const socket = io();

const $myFace = document.getElementById("myFace");
const $muteBtn = document.getElementById("mute");
const $cameraBtn = document.getElementById("camera");
const $cameraSelect = document.getElementById("cameras");

const $call = document.getElementById("call");

$call.hidden = true;

// stream = video + audio
// stream은 track을 제공하고 접근 가능하다.
let myStream;
let isMuted = false;
let isCameraOn = false;
let roomName;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currCam = myStream.getVideoTracks()[0];
    cameras.forEach((cam) => {
      const $option = document.createElement("option");
      $option.value = cam.deviceId;
      $option.innerText = cam.label;
      if (currCam.label === cam.label) {
        $option.selected = true;
      }
      $cameraSelect.appendChild($option);
    });
    console.log(cameras);
  } catch (error) {
    console.log(error);
  }
}

async function getMedia(deviceId) {
  // getUserMedia는 유저의 유저미디어 string을 준다
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };
  const camConstrains = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? camConstrains : initialConstrains
    );
    $myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (error) {
    console.log(error);
  }
}

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

async function handleCameraChange() {
  await getMedia($cameraSelect.value);
}

$muteBtn.addEventListener("click", handleMuteClick);
$cameraBtn.addEventListener("click", handleCameraClick);
$cameraSelect.addEventListener("input", handleCameraChange);

//* Welcome Form (join a room)

const $welcome = document.getElementById("welcome");
const $welcomForm = $welcome.querySelector("form");

function startMedia() {
  $welcome.hidden = true;
  $call.hidden = false;
  getMedia();
}

function handleWelcomeSubmit(e) {
  e.preventDefault();
  const $input = $welcomForm.querySelector("input");
  socket.emit("join_room", $input.value, startMedia);
  roomName = $input.value;
  $input.value = "";
}

$welcomForm.addEventListener("submit", handleWelcomeSubmit);

// Socket Code

socket.on("welcome", () => {
  console.log("someone joined");
});
