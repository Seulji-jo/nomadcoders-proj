const msgList = document.querySelector("ul");
const msgForm = document.querySelector("form");
const socket = new WebSocket(`ws://${window.location.host}`);
// on mobile, localhost:3000 is not exist so try to use window object to find host

socket.addEventListener("open", () => {
  console.log("connected to Sever ⭕️");
});

socket.addEventListener("message", (msg) => {
  console.log("New Message: ", msg.data);
});

socket.addEventListener("close", () => {
  console.log("disconnected to Sever ❌");
});

setTimeout(() => {
  socket.send("hello from the browser!");
}, 10000);

function handleSubmit(e) {
  e.preventDefault();
  const input = msgForm.querySelector("input");
  socket.send(input.value);
  input.value = "";
}

msgForm.addEventListener("submit", handleSubmit);
