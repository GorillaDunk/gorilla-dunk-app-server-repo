/*
이전에는 Route Parameter를 이용해서 특정 직원에 대한 정보를 조회했다. 
이번에는 특정 팀에 속한 직원 정보를 조회해보자. 

http://loaclhost:3000/api/members?team=engineering
http://loaclhost:3000/api/members?team=marketing
http://loaclhost:3000/api/members?team=sales
등으로 조회하면 좋지 않을까?

?표 이후의 녀석들을 우리는 Query라고 부른다. 
서버에 있는 데이터를 조회할 때 기준을 정하기 위해 사용한다. 
우리는 이 쿼리를 보통 서버에 있는 Resource를 조회할 때, 이들을 정렬하거나 필터링하는 기준을 설정하기 위해서 사용한다. 
지금은 원하는 팀을 필터링하기 위해서 이런 쿼리를 이용한다. 
쿼리에는 &등을 이용해서 여러개의 파라미터도 처리할 수 있다. 

*/

const express = require('express');
const app = express();
const members = require('./members');

app.get('/api/members', (req, res) => {
  /*
  res.send(members); 이 부분을 이제 쿼리를 받아오는 방식으로 바꿔 볼꺼다. 
  이번에는 req객체의 query객체를 불러 올것이다. 
  이 query객체는 url로부터 전달받은 쿼리의 파라미터값들을 포함하고있다. 
  여러 파라미터들중 team을 가져오기 위해서는 
  const team = res.query.team
  object constructing방식으로 가져오면

  이제 url에 쿼리가 있고 team이라는 파라미터가 존재한다면 team에 속한 직원들의 정보를 response에 담아 보내주면된다. 
  만약 그런게 없으면 전체 직원들의 정보를 담아 보내줄 수 있게 만들어보자. 

  filter 메소드: list안의 요소들을 순회하면서 인자로 들어오는 콜백이 True를 반환하는 요소들만 뽑아서 새로운 배열을 만들어내는 메소드이다. 
  */
  const { team } = req.query;

  if(team){
    const teamMember = members.filter( (m) => m.team === team);
    res.send(teamMember);
  }else{
    res.send(members);
  }
});


app.get('/api/members/:id', (req,res) => {
  const {id} = req.params; // (= const id = req.params.id)
  const member = members.find((m) => m.id ===  Number(id));

  if(member){
    res.send(member);
  }else{
    res.status(404).send({ message: 'There is no such member'});

  }
});

app.listen(3000, () =>{ 
console.log('Server is listening....')
});


