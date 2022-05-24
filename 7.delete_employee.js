const express = require('express');
app = express();
let members = require('./members.js');

app.use(express.json());

app.get('/api/members', (req, res) => {
  const {team} = req.query;
  if(team){
    const teamMembers = teamMembers = members.filter((m) => m.team === team);
    res.send(teamMembers);
  }else{
    res.send(members);
  }
});

app.delete('/api/members/:id', (req, res) => {
  const {id} = req.params;
  const membersCount = members.length;
  // filter함수를 이용해서 지우려는 id와 일치하지 않는 직원들의 정보를 뽑아서 새로운 배열을 만들어 members라는 변수에 새로 저장
  members = members.filter((members) => member.id !== Number(id));
  
  if (members.length < membersCount){
    res.send({message: 'Deleted'});
  }else {
    res.status(404).send({message: 'There is no member with the id!'});
  }
});


app.get('/api/members/:id', (res, req) => {
  const {id} = req.params;
  
});