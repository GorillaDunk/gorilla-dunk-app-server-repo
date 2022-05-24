const express = require('express');
app = express();

/* 
let members = require('./members.js'); 이 부분은 지우고
models 디렉토리 안의 index파일에서 db객체를 가져오고
db 객체에서 Member 모델을 꺼냈다. 
이제 이렇게 가져온 Member모델에서 db작업이 가능해진다. 

노드에서는 모듈을 검색할 때 특정 디렉토리의 이름만 적으면 해당 디렉토리에 존재하는 index.js 파일을 자동으로 찾는다.
그래서 사실 require('./models')만 적어줘도 상관없다. 
*/
const db = require('./models/index');
const {Member} = db;

app.use(express.json());

app.get('/api/members', async (req, res) => {
  const {team} = req.query;
  if(team){
    /*
    이번에도 findAll 함수를 사용하였는데 이번에는 특정한 조건을 걸어줬다.
    where라는 프로퍼티에 특정 컬럼의 이름과 특정값을 적어주면 특정 컬럼의 특정값을 조회할 수 있다. 
     where: {team : team} 부분은 where: {team}으로만 작성해도 같은 뜻이다. 
    
     이제 쿼리부분에 engineering과 같은 값을 넣어 실행하면 값을 잘 불러오는걸 볼 수 있다. 
     */
    const teamMembers = await Member.findAll({ where : { team : team } });
    res.send(teamMembers);

  }else{
    /*
    Member모델에 findAll()이라는 메소드를 사용하자.
    findAll()은 members 테이블에 있는 모든 row들을 조회해서 가져오는 기능을한다. 
    
    app.js를 실행해보면 test.http에서 get을 싫ㅇ해보면 sql문이 넘어가는 모습 그리고 response부분에 빈 객체가 보내지는걸 볼 수 있다.
    *** 여기서 참고해야하는건 모델이 가지고 있는 대부분의 메소드들은 promise 객체들을 리턴하는 비동기 실행함수들이다. 

    이런 비동기 실행함수들을 실행하기위해서는 await을 꼭 붙혀줘야한다!

    전체 직원 정보를 다 가져오기를 기다리기 위해서 앞에 await을 붙혀주자.
    await은 async가 붙은 함수 한에서만 사용할 수 있다. 따라서 이 코드가 들어있는 route handler앞에서 async를 붙혀줘야한다.    
    그래서 위에 (req, res) 앞에 async를 붙혀주는 것. 
   
   이번에 다시 get을 실행해주면 빈 객체가 아닌 직원 정보가 모두 배열에 잘 담겨서 온걸 볼 수 있다.
    */
    const members = await Member.findAll();
    res.send(members);
  }
});

/*
 이번에는 직원 하나만 찾는걸 해보자. findOne이라는 메소드를 이용하자!
 여기서도 조건이 필요. why? 우리는 테이블의 여러 row들 중에서 특정 id값을 가지는 row를 가져와야한다.
 이런 조건을 설정하는 방법은 where 프로퍼티에 id값을 넣어주면된다.
 where : {id:id} 에서 첫번째 id는 테이블 row의 id를 의미하고 두번째 id는 현재 get메소드의 id 상수를 의미한다.
 이걸 줄여서 where : {id} 로 바꿔줄 수 있다.

 여기서 모델 객체의 실제 모습을 봐보자. 
 get리퀘스트를 보내고 터미널을 보면 우리가 이전에 봤던 모습과는 조금 다르다. 훨씬 더 다양한 정보들이 있음을 볼 수 있다. 
 기억해야하는 포인트: Member 모델 객체게 우리가 생각했던 것 처럼 딱 필요한 실제 데이터만 갖고 있는 객체가 아니라는 점이다. 

 여기서 여러 프로퍼티를 갖고 있는 Member 모델 객체에서 딱 dataValues 프로퍼티에 해당하는 것만 리스폰스에 담아서
 보내주는 방법이 있을까? --> toJSON 메소드를 이용해보자. 

저 메소드를 사용하고 터미널 확인해보면 실제 데이터 부분만 잘 출력되는걸 볼 수 있다. 
 */
app.get('/api/members/:id', async (req, res) =>{
  const {id} = req.params;
  const member = await Member.findOne({ where : { id: id}});
  if(member){
    res.send(member.toJSON());
  }else{
    res.status(404).send({message : "The member is not existing"});
  }
});


/*
request의 body에 있는 새로운 직원 정보를 받아서 Member모델의 build라는 메소드에 newMember를 넣고 실행
이 build는 하나의 Member모델 객체를 생성하고 리턴한다.
이 member 객체는 앞으로 테이블에서 하나의 row가 될 객체이다.
이 member객체에 save라는 메소드를 실행하면 테이블 row에 이 객체가 추가된다. ]
save역시 promise 객체를 리턴하는 비동기 함수이기 때문에 await와 async 추가가 필요하다. 

POST request로 직원 추가를 할 때 추가될 정보중 id부분을 빼도 자동으로 id가 입력되면서 증가하는걸 볼 수 있다. 
이 이유는 migration의 js파일에서 createTable 인자로 받은 함수에 id값을 PrimaryKey true와 autoIncrement:True를 줬기 때문이다. 
또 model폴더의 member파일에 Member.init에 id가 똑같이 설정이되어있어서 가능한거다.

꿀팁! 아래 const member부터 save메소드까지를 하나로 묶을 수 있는 함수가 있다. 
const member = await Member.create(newMember); 이렇게 하면 한 줄로 처리가 가능하다.

그럼에도 create를 안 쓰고 build와 save메소드를 쓰는 경우는 중간에 member의 프로퍼티를 수정해야하는 경우도 있기 때문이다. 
const member = Member.build(newMember);
member.name = 'Mike' --> name 프로퍼티 변경
await member.save();
*/

app.post('/api/members', async (res, req) =>{
  const newMember = req.body;
  const member = Member.build(newMember);
  await member.save();
  res.send(member);
});

/*
update메소드를 보면 두개의 인자를 받는걸 볼 수 있다.
첫번쨰 인자: 새로운 직원의 정보
두번째 인자: 수정할 row을 특정하기 위한 조건 객체
이전에 findall과 비슷. 이 update도 비동기 실행함수이다. 즉, promise를 리턴.
이 promise 객체에는 작업 성공 결과로 배열 하나가 들어있다. 
이 배열의 첫번째 요소에는 수정된 row가 리턴된다. 
지금은 하나의 해당 아이디를 가지는 특정 row만 수정하는 코드이니 특정 하나의 row를 뜻하는 1이 배열에 있어야한다.
테이블에 존재하지 않는 id를 가지고 수정하면 만약 갱신될 row가 없다면 0을 가지고 있을것이다.

여기서 POST request를 통해서 update되어야할 정보를 담을 때, 안 바꿀 프로퍼티들과 그 값들을 적을 필요가 없다. 
update 함수가 알아서 바꿔야할 프로퍼티만 있어도 그것만 바꿔서 다른 프로퍼티들과 함께 리턴해주기 때문에 
team만 바꾸고 싶다면 POST 리퀘스트 객체 부분에 "team":"Engineering"이렇게만 적어서 요청을해도 된다.

*/
/*
app.put('/api/members/:id', async (req,res) => {

  const {id} = req.params;
  const newInfo = req.body;
  const result = await Member.update(newInfo, {where: {id}})
  if(result[0]){
    res.send({ message: `${result[0]} row(s) affected`});
  }else{
    res.status(404).send({message:'There is no member with the id'})
  }
});

*/

/*

다른 방법으로 직원 정보를 또 수정할 수 있다. 

1. findOne함수는 해당 아이디값을 가진 녀석을 가져온다. 
member 객체가 해당 row와 연동되어있어 해당 아이디 값을 가진 녀석을 가져오고
member 객체의 프로퍼티 값을 req.body에 있는 새로운 정보의 프로퍼티 값으로 수정해주고
마지막에 save를 해주면 데이터가 수정이된다. 

*/

app.put('./api/members/:id', async(req, res) => {
  const {id} = req.params;
  const newInfo = req.body;
  const member = await Member.findOne({ where : {id}});
  if(member){
  Object.keys(newInfo).forEach((prop) => {
    member[prop] = newInfo[prop];
  });
  await member.save();
  res.send(member);
} else{
  res.status(404).send({ message: "There is no member with the id!"});
}
});


/*
destroy메소드도 promise 객체를 리턴하는데 작업성공 결과로는 삭제된 row의 갯수가 들어있따. 
만약 삭제된 row가 없다면 그런 id가 없다고 나온다. 

*/


app.delete('/api/members/:id', async (req, res) => {
  const {id} = req.params;
  const deletedCount = await Member.destroy( { where : { id } });
  
  if (deletedCount) {
    res.send({message: `${deletedCount} row(s) deleted`});
  }else {
    res.status(404).send({message: 'There is no member with the id!'});
  }
});


app.listen(process.env.PORT || 3000, ()=>{
  console.log('server is listening....');
});