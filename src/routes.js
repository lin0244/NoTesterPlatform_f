import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import Jmeter from './views/nav1/Jmeter.vue'
import JmeterTestCase from './views/nav1/JmeterTestCase.vue'

import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import Page7 from './views/nav2/Page7.vue'

import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: 'Http Protocol',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/table', component: Table, name: '用例管理' },
            { path: '/page4', component: Page4, name: '执行轨迹' },
            { path: '/page7', component: Page7, name: '场景测试' },
            { path: '/page5', component: Page5, name: '查看日志' }

        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Dubbo Protocol',
        iconCls: 'fa fa-id-card-o',
        children: [


        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Jmeter',
        iconCls: 'fa fa-address-card',
        children: [
            { path: '/page6', component: Jmeter, name: '主机配置' },
            { path: '/JmeterTestCase', component: JmeterTestCase, name: 'Jmeter用例' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Reports',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;