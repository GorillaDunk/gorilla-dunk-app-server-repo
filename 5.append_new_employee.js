const express = require('express');
const app = express();
const members = require('./members.js');

/*
 app객체의 use라는 메소드를 호출하고 express객체의 json이라는 메소드를 리턴하는 코드를 넣어주었다. 
 이 json 메소드는 어떤 함수를 리턴한다. 정확하게는 여기서 json메소드는 미들웨어를 리턴하는 메소드이다.
 request가 route handler에 의해서 처리되기 전에 추가적으로 필요한 전처리를 해주는 함수를 express에서는 middleware라고 부른다. 
 이 미들웨어는 서버로 온 request의 바디에 json데이터가 존재할 경우에 그것을 추출해서 request객체의 바디 프로퍼티의 값으로 설정해준다.
  
 request가 들어오게되면 이 middleware에 의해서 바디에 있는 json데이터가 request객체의 바디 프로퍼티에 설정이되고 그 다음에 path와 메소드를 보고 알맞은 route handler가 호출이되는 것이다. 
 middleware는 서버로 오는 모든 request에 관해 필요한 처리를해주는 함수이고 app객체의 use 메소드에 설정이 가능하다는걸 기억하자!

 */
app.use(express.json());


app.get('/api/members', (req, res)=>{
  const {team} = req.query
  if(team){
    const teamMember = members.filter((m) => m.team === team); //배열을 리턴
    res.send(teamMember);
  }else{
    res.send(members);
  }
});

app.get('/api/members/:id', (req, res) =>{
  const {id} = req.params;
  const member = members.find((m) => {m.id === Number(id)}); //True or False를 리턴
  if(member){
    res.send(member);
  }else{
    res.status(404).send({message : "The member is not existing"});
  }
});

app.post('/api/members', (req, res) => {
  /*console.log(req.body); --> 단순히 reqest 바디에 새로운 데이터가 뜨나 확인하는 코드
   이제 진짜 추가해주는 코드
   post request를 실행해서 추가해주고
   get request를 통해서 잘 추가되었는지 확인해보자. 
  */
  
  const newMember = req.body;
  members.push(newMember);
  res.send(newMember);
});

app.listen(3000, () =>{
  console.log('Server is listening...')
}); 