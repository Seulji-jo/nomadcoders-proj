# Noom

Zoom Clone using Node.js, WebRTC and Websockets.

---

## Introduction

실시간 채팅어플

1. 익명으로 채팅 주고받기
2. 닉네임 추가
3. 채팅방 컨셉 정하기
4. 입장 & 퇴장 이벤트 추가 및 방 참여 인원수 확인
5. 서버에 방이 실시간으로 몇 개 존재하는지 체크

---

---

# Summary

---

## Requirements Before Proj

backend에서 필요한 부분

- ExpressJs
- app.get()
- Pug
- (req, res) ⇒

---

- package.json
- Babel
- nodemon

---

---

## Setup(개발환경 구축)

server

- nodemon.json
  - Nodemon을 설정하기 위한 파일
    - nodemon은 프로젝트의 변경사항을 파악해 서버를 재시작해주는 프로그램
  - `src/server.js` 을 `babel-node` 명령문으로 execute한다.
    - 서버를 재시작하는 대신 Babel-node 실행하게 한다. → babel-node는 babel.config.json을 찾아 실행
    - babel-node는 작성한 코드를 일반 node.js코드로 컴파일 해주는데 `src/server.js` 파일에 해준다.
    - server.js 파일에서 express import해서 익스프레스 앱을 구성
- babel.config.json
  - 사용할 유일한 `preset` 이 입력되어있다.
  - package.json의 script에서 nodemon이 호출되면 nodemon이 nodemon.json을 보고 내부에 작성된 코드 실행
- express
  - views 설정 & render
    - pug: express view engine
    - views 디렉토리 설정
  - public url 생성해 유저에게 파일 공유
    - public에 있는 파일은 frontend에서 구동되는 코드
      - js가 많아질수록 `front/back` 구분이 어려워 `app.js & server.js`로 나눔
  - template이 어디있는지 지정
  - route handler: home.pug를 render

---

---

## HTTP vs WebSockets

둘다 protocol이다.

- protocol: 사람들이 어떤 방에서 만나고, 어떻게 일들이 진행될지 결정한다.
  - 표준이 되는 규칙
  1. 어떻게 모든 것이 돌아갈지에 대한 규칙 생성
  2. 프로그래머는 해당 규칙에 따르는 코드 생성 후 실행

브라우저 - backend, backend - backend 가능

### WebSockets

- 실시간 chat, notification 같은 real-time을 만들 수 있다.
- websocket을 사용하고 싶고 서버가 지원하는경우 wss를 사용하면 된다. ( https://nomadcoders.co → wss://nomadcoders )
  - WSS: Secure Web Socket
- http와 다른 protocol
- 악수같은것으로 browser가 req를 보내면 socket에서 accept/denied한다.
  - accept되면 연결(connection)은 성립(establish)된다.
    - 연결돼있기 때문에 서버는 유저를 기억할 수 있다. → 서버가 먼저 유저한테 메세지를 보낼 수 있다.
    - bi-directional(양방향) 연결: 서버와 유저 서로에게 바로 갈 수 있는 길이 있어 메세지를 보낼 수 있다.
- 터널같이 브라우저랑 서버가 서로 커뮤니케이션한다.
- JS 전용은 아니나, 구현된게 있어 JS에서도 사용 가능하다.
  - 브라우저 내부에 webSocket API가 있다.
  - 특정 프로그램 언어에 국한되어있지 않다. protocol일 뿐이다.
- ex) wifi, 전화

### HTTP

- 서버가 작동하는 방식(not real-time)
- 인터넷이 http기반으로 만들어져 있다.
- user(browser) request를 보낼때만 server가 response한다.
  - 서버가 먼저 메세지를 보낼 수 없다.
- stateless → backend가 유저를 기억하지 못함
  - response후에 유저를 잊고, 다음 request를 기다린다
  - 로그인 후에는 req를 보낼때 cookie만 보내면 된다.

---

---

### ws

- 사용하기 편하고, 빠르고, 클라와 서버 사이의 webSocket실행에서 검증 됐다.
- node.js를 위한 webSocket implementation
  - 어떤 규칙을 따르는 코드이다.
  - webSocket protocol을 실행하는 package
  - 예시: 채팅방에 user가 들어오고 나가고, 메세지 보내는 것 등의 일을 하는 채팅방은 ws에 포함 되지 않는다.
    → 채팅방은 webSocket protocol의 일부분이 아니라 feature일 뿐이다.
    → ws로 채팅방을 구현할 경우 특유의 logic을 구현해야한다.
- webSocket의 core다.(웹소켓의 기반/기초 다.)
  - 부가적인 utils, feature가 없다.
  - 웹소켓 프로토콜의 설명에 있는 기본적인 기능 밖에 없다.
- ws를 사용해 public 채팅을 만들고 ws기반으로 만들어진 framework 소개

---

---

WebSocket

browser에서 webSocket을 지원해준다.

- 모든 브라우저 지원(even mobile)

---

## SocketIO vs WebSockets

SocketIO는 websocket의 부가기능이 아니라
websocket을 사용해 실시간, 양방향, event기반의 통신을 제공하는 프레임워크다.
websocket사용이 불가해도 다른방법으로 돌아간다.
(websocket을 지원하지 않는 경우, HTTP long polling같은 것을 사용)

- 커스텀 이벤트 사용 가능
- front에서 js object를 보낼수 있다.
- socket.emit argument 개수 및 타입에 제한이 없다.
- 끝날때 실행되는 fn을 보내고 싶으면 마지막 argu에 넣는다

---

### Adapter

- 다른 서버들 사이에 실시간 어플리케이션을 동기화 한다.
- 나뉘어 있는 서버간의 통신을 해준다.
- adapter가 어플로 통하는 창문이다.

  - 누가 연결됐는지, 현 어플에 room이 얼마나 있는지 알려준다.

- Map에 있는 rooms ID를 socket ID(sids)에서 찾을 수 있다면 Private room을 찾은것이다.
  - room ID를 sids에서 찾을 수 없다면 public room이다.

---

---

## WebRTC

### IceCandidate

- offer와 answer를 받고난 후, 실행하는 이벤트
- Internet Connectivity Establishment(인터넷 연결 생성): webRTC에 필요한 프로토콜들을 의미한다.
- 브라우저가 서로 소통할 수 있게 해주는 방법
