const express = require('express');
const app = express();
const members = require('./members.js');

app.use(express.json());

app.get('/api/member', (req, res) =>{
  const {team} = req.query;
  if(team){
    const teamMember = members.filter((m) => m.team === team)
    res.send(teamMember);
  }else{
    res.send(members);
  }

});

app.get('/api/member/:id', (req, res)=>{
  const {id} = req.params;
  const member = members.find((m) => m.id === id)
  if(member){
    res.send(member);
  }else{
    res.send(members);
  }
});

app.post('/api/members', (res, req) =>{

  const newMember = req.body;
  members.push(newMember);
  res.send(newMember);
});

/*
Object.keys()라는 함수는 특정 객체의 모든 프로퍼티를 조회할 수 있다. 
Object.entries()라는 함수는 각 프로퍼티의 이름(key)-값(value)쌍을 담은 배열을 리턴하는 메소드입니다.
*/

app.put('/api/members/:id', (req,res) => {
  //1. 요청받은 :id의 값을 params객체로부터 가져와 id라는 상수에 저장한다. 
  const {id} = req.params;
  //2. request의 body에 있는 정보들(직원에 대한 새로운 정보) newInfo라는 상수에 담는다.
  const newInfo = req.body;
  //3. members안의 객체들의 정보중 id에 접근에서 각 객체의 id들과 :id를 통해 받은 id의 값을 비교하여 일치시키는 녀석을 True로 반환
  const member = members.find((m)=> m.id === Numeber(id));
  if(member){
    // Object.keys(newInfo)를 통해서 newInfo의 프로퍼티들을 모두 끄집어낸다. find를 통해 찾은 직원의 프로퍼티에 접근하여 newInfo의 새로운 프로퍼티 값으로 교체해준다.
    Object.keys(newInfo).forEach((prop) => {
      member[prop] = newInfo[prop];
    });
    res.send(member);
  }else{
    res.status(404).send({message:'There is no member with the id'})
  }
})

app.listen(3000, ()=>{
  console.log('server is listening....');
});

