// io는 자동적으로 back-end socket.io와 연결해주는 fn이다.
const socket = io();

const $welcome = document.getElementById("welcome");
const $form = $welcome.querySelector("form");

function handleRoomSubmit(e) {
  e.preventDefault();
  const $input = $form.querySelector("input");
  // 1st argument: event name
  // 2nd argument: payload
  // 3rd argument: function
  socket.emit("enter_room", { payload: $input.value }, () => {
    console.log("server is done!");
  });
  $input.value = "";
}

$form.addEventListener("submit", handleRoomSubmit);
