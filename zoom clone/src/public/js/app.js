const msgList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const msgForm = document.querySelector("#msg");
const socket = new WebSocket(`ws://${window.location.host}`);
// on mobile, localhost:3000 is not exist so try to use window object to find host

function makeMsg(type, payload) {
  // back으로 js object로 보내면 안된다.
  // back이 다른 언어일지도 몰라서 JSON을 이용해 string으로 보낸다.
  const msg = { type, payload };
  return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
  console.log("connected to Sever ⭕️");
});

socket.addEventListener("message", (msg) => {
  // console.log("New Message: ", msg.data);
  const $li = document.createElement("li");
  $li.innerText = msg.data;
  msgList.append($li);
});

socket.addEventListener("close", () => {
  console.log("disconnected to Sever ❌");
});

// setTimeout(() => {
//   socket.send("hello from the browser!");
// }, 10000);

function handleSubmit(e) {
  e.preventDefault();
  const $input = msgForm.querySelector("input");
  socket.send(makeMsg("new_message", $input.value));
  const $li = document.createElement("li");
  $li.innerText = `You: ${$input.value}`;
  msgList.append($li);
  $input.value = "";
}

function handleNickSubmit(e) {
  e.preventDefault();
  const $input = nickForm.querySelector("input");
  socket.send(makeMsg("nickname", $input.value));
  $input.value = "";
}

msgForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
