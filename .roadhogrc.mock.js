import mockjs from 'mockjs';
import { getNotices } from './mock/notices';
import { delay } from 'roadhog-api-doc';
import { getModule } from './mock/module';
import { listAccount } from './mock/user';
import { getDictItemByRoleId, listModule, listRole, listUser } from './mock/role';
import { changeStatus, deleteOrg, getOrg, listOrg, saveOrg } from './mock/organization';
import { addDictItem, deleteDictItem, getDict, listDict } from './mock/dict';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: '获取当前用户接口',
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/keeYtvRpGFVVKOOiOZDS.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  'GET /api/account/list': listAccount,
  'GET /api/module/list': getModule,
  'GET /api/module/listModuleByAttr': getModule,
  'GET /api/role/list': listRole,
  'GET /api/role/listUser': listUser,
  'GET /api/role/listModule': listModule,
  'GET /api/role/getDictItemByRoleId': getDictItemByRoleId,
  'GET /api/dict/getDict': getDict,
  'GET /api/dict/list': listDict,
  'POST /api/dict/deleteDictItem': deleteDictItem,
  'POST /api/dict/addDictItem': addDictItem,
  'POST /api/organization/edit': saveOrg,
  'GET /api/organization/get': getOrg,
  'GET /api/organization/list': listOrg,
  'GET /api/organization/listOrgByAttr': listOrg,
  'POST /api/organization/del': deleteOrg,
  'POST /api/organization/changeStatus': changeStatus,
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  }),
  'POST /api/auth/login': (req, res) => {
    const { password, account, type } = req.body;
    if (password === 'admin' && account === 'admin') {
      res.send({
        "data":{
          "user":{
            "account":"admin",
            "avatar":"https://gitee.com/uploads/8/8108_pkaq.png?1491552997",
            "code":"admin",
            "id":"9199482d76b443ef9f13fefddcf0046c",
            "modules":[
              {
                "children":[
                  {
                    "icon":"bars",
                    "id":"7",
                    "isleaf":true,
                    "name":"模块管理",
                    "parentId":"5",
                    "parentName":"系统管理",
                    "path":"module",
                    "pathId":"5",
                    "status":"0001"
                  },
                  {
                    "icon":"flag",
                    "id":"6",
                    "isleaf":true,
                    "name":"组织管理",
                    "parentId":"5",
                    "parentName":"系统管理",
                    "path":"organization",
                    "pathId":"5",
                    "status":"0001"
                  },
                  {
                    "icon":"usergroup-add",
                    "id":"8",
                    "isleaf":true,
                    "name":"用户管理",
                    "parentId":"5",
                    "parentName":"系统管理",
                    "path":"account",
                    "pathId":"5",
                    "status":"0001"
                  },
                  {
                    "icon":"profile",
                    "id":"10",
                    "isleaf":true,
                    "name":"字典管理",
                    "parentId":"5",
                    "parentName":"系统管理",
                    "path":"dictionary",
                    "pathId":"5",
                    "status":"0001"
                  },
                  {
                    "icon":"form",
                    "id":"9",
                    "isleaf":true,
                    "name":"权限管理",
                    "parentId":"5",
                    "parentName":"系统管理",
                    "path":"role",
                    "pathId":"5",
                    "status":"0001"
                  }
                ],
                "icon":"setting",
                "id":"5",
                "isleaf":false,
                "name":"系统管理",
                "orders":2,
                "path":"sys",
                "pathId":"0",
                "status":"0001"
              }
            ],
            "name":"超级管理员",
            "roles":[
              {
                "code":"ROLE_ADMIN",
                "id":"1",
                "name":"系统管理员"
              }
            ]
          },
          "token":"eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI5MTk5NDgyZDc2YjQ0M2VmOWYxM2ZlZmRkY2YwMDQ2YyIsImlhdCI6MTUyOTc5Nzg1MCwiaXNzIjoiUEtBUSIsInN1YiI6IjkxOTk0ODJkNzZiNDQzZWY5ZjEzZmVmZGRjZjAwNDZjIiwiZXhwIjoxNTI5ODAxNDUwfQ.jiBNNoIivYRDWBldkdDxRkSIPyQ9ImKl_WJI7LBQPhM"
        },
        "status":200,
        "statusText":"操作成功",
        "success":true
      });
      return;
    }
    if (password === '123456' && account === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};

export default (noProxy ? {} : delay(proxy, 1000));
