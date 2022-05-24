
/* sequelize 패키지는 sequelize 클래스를 외부에 공개하는데 그 클래스를 가져온거다. 
 이 sequelize 클래스에 DB 접속해 관한 설정값을 넣고 sequelize 객체를 생성하면된다. 

 다음 confg의 config.json파일을 가져온다.
 config.json파일에 가보면 DB 접속 설정 데이터들을 넣어줬었다. 
 이 정보를 그대로 가져온거다. 그 중에서도 develpment부분의 접속 정보를 가져온것이다. \

 이제 sequelize 객체로 sequelize 객체 하나를 생성해보자.

 const sequelize부분처럼 코드를 작성해주면 sequelize 샛체가 생성이된다. 

****
const Sequelize =require('sequelize');

const config = require('../config/config.json');

const {
  username, password, database, host, dialect,
} = config.development;

const sequelize = new Sequelize(database, username, password, {
  host, 
  dialect,
});


이제 member.js에 있는 함수를 가져오자. 
member.js파일을 다시보면 member클래스를 리턴한 함수를 외부에 공개하고 있다. 
그 파라미터에는 sequelize와 DataTypes를 인자로 받는걸 볼 수 있다.
우리는 이 파리미터들에게 (sequelize, Sequelize.DataTypes)라는 코드를 추가함으로써 값들을 넘겨줄거다. 
이제 Member 모델은 sequelize객체를 사용해서 초기화를 하고 이를 통해서 DB에 존재하는 Members테이블을 인식할 수 있게된다.
이 코드가 실행되면 Member 모델은 Members 테이블과 연동되고 그리고나면 Member 모델을 이용해서 원하는 작업을 할 수 있게된다. 

***
require('./member.js')(sequelize, Sequelize.DataTypes);
****

이제 우리가 작성했던 app.js파일에서 이 member모델을 사용할 수 있게 해보자. 
먼저 Member모델을 외부로 공개해야한다. 여기서 바로 Member모델을 공개해도 되지만
일단 DB라는 객체를 만들고 그 안에 Member모델을 넣어서 공개하자.
이렇게 하는 이유는 또 다른 테이블이 생긴다면 또 새로운 모델이 필요할 수 있기 때문이다. 


const db = {};
db.Member = Member;

module.exports = db;

 이제 app.js파일로 가자. 

 */


 // 여기서 부터는 Heroku 이용해여 배포하기위한 코드

 const Sequelize = require('sequelize');
//NODE_ENV라는 환경변수 값을 가져오는데 이 녀석은 이 코드이 실행용도를 설정하기 위한 환경변수의 이름이다.
// 만약 개발 용도라면 이 환경변수에 development를 실제 서비스 제고용도라면 production이라는 값을 넣어주는것이다.
// 만약 NODE_ENV에 환경변수의 값이 존재하면 config에서 그 값을 가진 설정 객체를 참조하고 만약 없으면 development 설정 객체를 참조하겠다는 뜻. 
// 나중에 Heroku를 통해서 배포를 하면 Heroku는 자동으로 NODE_ENV 환경변수의 값으로 production을 지정하고 코드를 실행한다.
// 이렇게되면 production 설정 객체를 참조해서 mySQL DB에 접속하는 sequelize 객체를 생성한다. 
// *** mysql DB 접속을 위해 필요한 정보를 환경변수로 가져오고 어떻한 접속 정보를 사용할지도 환경변수를 사용한다.  

const env = process.env.NODE_ENV || 'developement';
 const config = require('../config/config')[env];

 const {
   username, password, database, host, dialect
 } = config;
 const sequelize = new Sequelize(database, username, password, {
   host,
   dialect,

 });

 const Member = require('./member')(sequelize, Sequelize.DataTypes);

 const db = {};
 db.Member = Member;

 module.exports = db;