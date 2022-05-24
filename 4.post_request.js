
const express = require('express');

const app = express();

const members = require('./members');

/*
app객체의 get메소드 -> get메소드의 route handler들(app.get메소드의 콜백함수들)은 단순히
/api/members를 포함한 url을 통해 request를 받는다고 무조건 실행되는것이 아니다. 
조건이 하나 더 있는데 이는 request의 메소드가 get이어야한다는 것이다. 

request메소드란 request의 성격을 나타내기위해서 request 헤드부분에 존재하는 속성을 메소드라고 부른다.

app객체의 get함수는 특정 path로 오는 get메소드를 가진 request를 처리하는 route handler를 등록한다는 사실이다. 
아무리 같은 path로 request를 보내도 다른 메소드를 가진 녀석으로 보내면 이 request는 실행되지 않는다. 
보통 서버의 리소스를 조회하고자 할 때 get메소드를 사용. 우리는 이를 get request라고 부른다. 
즉, app객체의 get함수는 get request에 대응하는 route handler를 등록하는 함수이다. 

request에는 
get request: 서버의 리소스를 조회
post request: 서버의 리소스를 추가
put request: 기존 리소스 수정
delete request: 기존 리소스 삭제

post request를 처리하려면 위해서는 app객체의 post를 이용
post request는 get request보다 처리해야하는 작업들이 더 많다. 
이유: 새로 추가하려는 리소스의 내용이 해당 request의 바디에 담겨있어서 서버에서 바디의 내용을 별도로 처리해줘야한다. 
*/
app.get('/api/members', (req, res) => {
  const {team} = req.query
  if(team){
  const teamMember = members.filter((m) => m.team === team);
  res.send(teamMember);
  }else{
  res.send(members);
  }
});


app.get('/api/members/:id', (req, res) =>{
  const {id} = req.params
  const member = members.find((m) => {m.id === Number(id)});

  if(member){
    res.send(member);
  }else{
    res.status(404).send({ message : 'There is no such member'});
  }
});

/*
post 작업을 하기위해서 rest client라는 녀석을 별도로 vs code에 설치를해주자. 
test.http라는 파일을 같은 디렉토리에 넣어보자.
http라는 확장자를 써야 방금 설치한 플러그인(REST client)에서 이 파일을 인식할 수 있다. 
이 파일안에 우리가 보낼 request를 작성하면 vs에서 바로 서버로 request를 보낼 수 있다. 

http확장자를 가진 파일을 보면
위의 두줄이 헤더 아래가 json형식의 추가할 부분을 바디에 담은것 
Content-Type 부분은 바디에 있는 데이터의 타입을 나타낸다. 
POST http://localhost:3000/api/members
Content-Type: application/json 

{
  "id": 11,
  "name": "Zake",
  "team": "Engineering",
  "position": "Android Developer",
  "emailAddress":"zake@google.com",
  "phoneNumber":"010-xxxx-xxxx",
  "admissionDate":"2021/06/12",
  "birthdat":"1995/09/27",
  "profileImage": "profile11.png"
}

하지만 위와 같이 test.http파일에 추가해서 서버를 실행하면 undefined라는 코드가 뜨게된다. 
이를 해결하기 위한 방법은 다음 js파일에서 보자. 
*/
app.post('/api/members', (req, res)=> {
  console.log(req.body);
});

app.listen(3000, () => {
  console.log('Server is listening....');
});