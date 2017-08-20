import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
    name: '张某某'
  }
];

const Users = [];

for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    project:Mock.Random.cname(),
    lastRunTime: Mock.Random.datetime(),
    module:Mock.Random.cname(),
    subModule:Mock.Random.cname(),
    requestType:"get",
    requestParam:"{123445}",
    requestAddress:"address",
    requestParamType:"json",
    assertField:"",
    runResult:"true"

  }));
}

export { LoginUsers, Users };
