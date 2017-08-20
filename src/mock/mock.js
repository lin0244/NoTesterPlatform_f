import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { LoginUsers, Users } from './data/user';
let _Users = Users;

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios);

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });

    //登录
    mock.onPost('/login').reply(config => {
      let {username, password} = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        let user = null;
        setTimeout(() => {
          let hasUser = LoginUsers.some(u => {
            if (u.username === username && u.password === password) {
              user = JSON.parse(JSON.stringify(u));
              user.password = undefined;
              return true;
            }
          });

          if (hasUser) {
            resolve([200, { code: 200, msg: '请求成功', user }]);
          } else {
            resolve([200, { code: 500, msg: '账号或密码错误' }]);
          }
        }, 1000);
      });
    });

    //获取用户列表
    mock.onGet('/user/list').reply(config => {
      let {name} = config.params;
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //获取用户列表（分页）
    mock.onGet('/user/listpage').reply(config => {
      let {page, name} = config.params;
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockUsers.length;
      mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //删除用户
    mock.onGet('/user/remove').reply(config => {
      let { id } = config.params;
      _Users = _Users.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //执行选中的单条用例
    mock.onGet('/user/runonecase').reply(config => {
      let { id } = config.params;
      _Users = _Users.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '执行成功',
            result:{
              code:"1",
              data:"xxxxxxxxxxxxx"
            }
          }]);
        }, 500);
      });
    });
    //获取测试指定工程的测试用例通过情况饼图信息
    mock.onGet('/user/getTestcasePieChart').reply(config => {
      //let { id } = config.params;
      //_Users = _Users.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '执行成功',
            result:{
              code:"1",
              data:[{"name":"通过","value":200},{"name":"不通过","value":400}]
            }
          }]);
        }, 500);
      });
    });

    //人均用例数
    mock.onGet('/user/getTestcaseByOnePersonColumnChart').reply(config => {
      //let { id } = config.params;
      //_Users = _Users.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '执行成功',
            result:{
              legend:["xuzh","lijie","wangli"],
              data:[18,15,23]
            }
          }]);
        }, 500);
      });
    });

    //获取用例增长趋势图
    mock.onGet('/user/getTestcaseIncreLineChart').reply(config => {
      //let { id } = config.params;
      //_Users = _Users.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '执行成功',
            result:{
              legend:["项目1","项目2","项目3"],
              xsize:[1,2,3],
              data:[{"name":"项目1","type":"line","data":[10,20,30]},{"name":"项目2","type":"line","data":[20,30,40]},{"name":"项目3","type":"line","data":[30,40,50]}]
            }
          }]);
        }, 500);
      });
    });



    //返回指定用例的执行结果信息
    mock.onGet('/user/runresultdetail').reply(config => {
      let { id } = config.params;
      _Users = _Users.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '执行成功',
            result:{
              runResult:"true",
              assertField:"code",
              assertValue:"200",
              serverResponseData:"{\"serverData\":\"yyyyyy\"}"
            }
          }]);
        }, 500);
      });
    });


    //批量删除用户
    mock.onGet('/user/batchremove').reply(config => {
      let { ids } = config.params;
      ids = ids.split(',');
      _Users = _Users.filter(u => !ids.includes(u.id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //编辑用户
    mock.onGet('/user/edit').reply(config => {
      let { id, project, module, subModule, testcase, requestType,requestParamType,requestParam,requestAddress,assertField,assertValue } = config.params;
      _Users.some(u => {
        if (u.id === id) {
          u.project = project;
          u.module = module;
          u.subModule = subModule;
          u.testcase = testcase;
          u.requestType = requestType;
          u.requestParamType = requestParamType;
          u.requestParam = requestParam;
          u.requestAddress = requestAddress;
          u.assertField = assertField;
          u.assertValue = assertValue;

          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });

    //新增用户
    mock.onGet('/user/add').reply(config => {
      let { name, addr, age, birth, sex } = config.params;
      _Users.push({
        name: name,
        addr: addr,
        age: age,
        birth: birth,
        sex: sex
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });

  }
};