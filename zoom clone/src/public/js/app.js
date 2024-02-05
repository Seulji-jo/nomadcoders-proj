// alert("hi");

// btn.addEventListener("click", fn);
// 위의 이벤트리스너가 웹소켓과 더 비슷하다.
// webSocket도 event가 있고, event가 발동될때 사용할 fn을 만들면 된다.
// webSocket은 listen할 특정한 event명이 있다.

const socket = new WebSocket(`ws://${window.location.host}`);
// on mobile, localhost:3000 is not exist so try to use window object to find host

console.log(socket);
