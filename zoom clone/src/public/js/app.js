// io는 자동적으로 back-end socket.io와 연결해주는 fn이다.
const socket = io();

const $welcome = document.getElementById("welcome");
const $msgForm = $welcome.querySelector("#msg");
const $room = document.getElementById("room");

$room.hidden = true;

let roomName;

function addMessage(message) {
  const $ul = document.querySelector("ul");
  const $li = document.createElement("li");
  $li.innerText = message;
  $ul.appendChild($li);
}

function handleMessageSubmit(e) {
  e.preventDefault();
  const $input = $room.querySelector("#msg input");
  const value = $input.value;
  socket.emit("new_message", $input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  $input.value = "";
}

function handleNicknameSubmit(e) {
  e.preventDefault();
  const $input = $room.querySelector("#name input");
  const value = $input.value;
  socket.emit("nickname", value);
}

function showRoom() {
  $welcome.hidden = true;
  $room.hidden = false;
  const $h3 = room.querySelector("h3");
  $h3.innerText = `Room ${roomName}`;

  const $msgForm = $room.querySelector("#msg");
  const $nameForm = $room.querySelector("#name");
  $msgForm.addEventListener("submit", handleMessageSubmit);
  $nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(e) {
  e.preventDefault();
  const $input = $welcome.querySelector("input");
  // 1st argument: event name
  // 2nd argument: payload
  // last argument: function
  socket.emit("enter_room", $input.value, showRoom);
  roomName = $input.value;
  $input.value = "";
}

$welcome.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} arrived!`);
});

socket.on("bye", (left) => {
  addMessage(`${left} leftㅜㅜㅜ`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const $roomList = $welcome.querySelector("ul");
  rooms.forEach((room) => {
    $roomList.innerHTML = "";
    const $li = document.createElement("li");
    $li.innerText = room;
    $roomList.append($li);
  });
});
