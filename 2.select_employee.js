const express = require('express');


const app = express();

const members = require('./members');

//api관련 url은 아래와 같이 /api/를 포함한 path로 나타낸다. 또는 도메인 자체에 api라는 단어를 넣어서 api.cowork.com 이런식으로 나타내기도한다.
//이번에 send 메소드는 members라는 배열 자체를 보낸다. 
app.get('/api/members', (req, res)=>{
  res.send(members);
});

// /api/members/:id는 members/뒤에오는 값을 id 변수에 대입하라는 뜻이다.
// 이런 :id 는 Route Parameter라 부른다.
// path부분에서 가변적인 값을 전달할 때 사용한다.
app.get('/api/members/:id', (req, res)=>{
 
  // Route parameter값은 request 객체의 params라는 객체의 프로퍼티로 설정이된다. 
  //const id = req.params.id;
  
  // const id = req.params.id에서 modern JS에서 사용하는 object destructuring 방식의 코딩으로 바꾸기
  const { id } = req.params;
  
  /*
  직원 정보들 중에서 해당 id값을 찾기위해 배열의 find()메소드를 이용
  이 find는 인자로 들어온 콜백함수가 True를 리턴하게하는 배열의 여러 요소들 중 첫 번째 요소를 return한다.
  아래 find함수 작동 방식: 
  1. 먼저 find함수 안에 인자로 members의 객체 하나하나를 순서대로 받는다. 
  2. 받은 첫번째 객체의 id속성을 접근하여 기존에 저장했던 request객체의 params객체 안에 있는 string타입의 id를 가져온다. 
  3. 그 둘을 비교하여 Trud아니면 False를 리턴. 
  
  주의!! member객체의 id 프로퍼티는 number 타입인데 router parameter의 id값은 String타입이라느점
  따라서 이 두 값을 비교하려면 type을 맞춰줘야한다. 그래서 Number()함수를 이용하여 Number(id) 를 비교값으로 설정
  그리고 만약 해당 정보가 존재한다면 res.send()로 그 직원의 정보를 담아 전송
  만약 해당 직원 정보가 없다면 find함수는 undefined를 반환. undefined는 JS false값으로 받아들인다. 
  
  
  */
  const member = members.find((m) => m.id === Number(id));

  if(member) {
    res.send(member);
  } else{
    // 요청 정보가 없다는 상태 코드는 404이다. 상태 코드를 쓰려면 status라는 함수를 이용. 
    //이렇게 메세지를 남기는경우도 'There is no such member'보다  json형식으로 보내는게 더 좋다. 그래야 나중에 확장할때도 더 편하다. 
    res.status(404).send({ message : 'There is no such member'}); 
    
  }
});


app.listen(3000, () =>{
  console.log('Server is listening...');
});

/*
위에서 했던 작업은
1. 서버에 직원정보를 보내달라고 request를 요청
2. response 바디에 요청한 데이터를 담아서 브라우저에 전송

우리는 이런 서버에 있는 데이터를 Resource라는 단어로 표현한다. 
이런 데이터를 처리한다는 것은
Resource를 갱신, 추가, 갱신, 삭제등을 한다는 뜻이다. 
이녀석들이 API서버에서 하는 작업들이다. 
*/