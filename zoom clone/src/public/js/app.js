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
let myPeerConnection;

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

async function initCall() {
  $welcome.hidden = true;
  $call.hidden = false;
  await getMedia();
  makeConnection();
}

async function handleWelcomeSubmit(e) {
  e.preventDefault();
  const $input = $welcomForm.querySelector("input");
  // websocket/RTC의 속도가 media를 가져오는 속도나 연결을 만드는 속도보다 빠르기 때문에 순서를 변경
  // getMedia하고, makeConnection을 한 다음 이벤트를 emit한다.
  await initCall();
  socket.emit("join_room", $input.value);
  roomName = $input.value;
  $input.value = "";
}

$welcomForm.addEventListener("submit", handleWelcomeSubmit);

// Socket Code

socket.on("welcome", async () => {
  // 방을 만드는 offer A가 주체로 다른 브라우저에서 방에 접근하면 실행되는 코드
  const offer = await myPeerConnection.createOffer();
  // offer를 가지면 방금 만든 offer로 연결 구성 필요
  myPeerConnection.setLocalDescription(offer);
  console.log("sent the offer");
  // peerB로 위에서 구성한 offer를 보냄
  socket.emit("offer", offer, roomName);
});

// offerB에서 실행되는 코드
socket.on("offer", async (offer) => {
  console.log("received the offer");
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
  console.log("sent the answer");
});

socket.on("answer", (answer) => {
  console.log("received the answer");

  myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", (ice) => {
  console.log("received candidate");
  myPeerConnection.addIceCandidate(ice);
});

// RTC Code

function makeConnection() {
  // peer to peer connection
  // 각 브라우저 따로 구성
  myPeerConnection = new RTCPeerConnection();
  myPeerConnection.addEventListener("icecandidate", handleIce);
  // addstream event is deprecated. and safari no support.
  // myPeerConnection.addEventListener("addstream", handleAddStream);
  myPeerConnection.addEventListener("track", handleAddStream);
  // addStream()과 같은 역할
  // track들을 개별적으로 추가해주는 함수
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}

function handleIce(data) {
  console.log("sent candidate");
  socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data) {
  const $peerFace = document.getElementById("peerFace");
  $peerFace.srcObject = data.streams[0];
  console.log("Peer's Stream", data.streams[0]);
}
