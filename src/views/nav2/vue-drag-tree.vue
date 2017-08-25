<template>
    <div>
        <div :id='model.id' @click="toggle" @dblclick="changeType" draggable='true' @dragstart='dragStart' @dragover='dragOver' @dragenter='dragEnter' @dragleave='dragLeave' @drop='drop' @dragend='dragEnd' class='treeNodeText' @mouseover='mouseOver' @mouseout='mouseOut' :style='styleObj'>
            <span :class="[isClicked ? 'nodeClicked' : '','vue-drag-node-icon']"></span>
            {{model.name}}
            <span @click="removeChild(model.id)" v-if='model.id !="0"'>&nbsp;x</span>
        </div>
        <div class='treeMargin' v-show="open" v-if="isFolder">
            <item v-for="model in model.children" :model="model" :key='model.id' :current-highlight='currentHighlight' :default-text='defaultText' 　:hover-color='hoverColor' :highlight-color='highlightColor'>
            </item>
            <div class='changeTree' @click="addChild" @drop='dropPlus' @dragover='dragOverPlus' @dragenter='dragEnterPlus'>+</div>
        </div>


        <!--新增工程名称-->
        <div>
            <el-dialog title="项目" v-model="ProjectFormVisible" :close-on-click-modal="false">
                <el-form :model="AddProjectForm" label-width="80px" :rules="AddScenarioForm" ref="AddScenarioForm">

                    <el-form-item label="归属项目" prop="projectName">
                        <el-input v-model="AddProjectForm.projectName" auto-complete="off"></el-input>
                    </el-form-item>

                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="ProjectFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="AddProjectFormSubmit" :loading="editLoading">确定</el-button>
                </div>
            </el-dialog>
        </div>


        <!--新增场景名称-->
        <div>
            <el-dialog title="新增场景" v-model="ScenarioFormVisible" :close-on-click-modal="false">
                <el-form :model="AddScenarioForm" label-width="80px" :rules="AddScenarioForm" ref="AddScenarioForm">

                    <el-form-item label="场景名称" prop="scenarioName">
                        <el-input v-model="AddScenarioForm.scenarioName" auto-complete="off"></el-input>
                    </el-form-item>

                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="ProjectFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="AddScenarioFormSubmit" :loading="editLoading">确定</el-button>
                </div>
            </el-dialog>
        </div>

        <!--选择测试用例种类-->
        <div>
            <el-dialog title="新增测试用例" v-model="selectTargetTestCaseCatagoryVisible" :close-on-click-modal="false">
                <el-tabs type="border-card">
                    <el-tab-pane label="Http">

                        <el-form :model="HttpTestCaseAddForm" label-width="80px" :rules="addFormRules" ref="HttpTestCaseAddForm">

                            <el-form-item label="项目" prop="project" >
                                <keep-alive>
                                    <el-select v-model="HttpTestCaseAddForm.project" filterable placeholder="请选择项目" @click.native="getAllProjects(value)" >
                                        <el-option
                                                v-for="item in this.projects"
                                                :label="item.desc"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </keep-alive>
                            </el-form-item>

                            <el-form-item label="创建人" prop="creater" >
                                <keep-alive>
                                    <el-select v-model="HttpTestCaseAddForm.creater" filterable placeholder="请选择创建人" @click.native="getAllusers(value)" >
                                        <el-option
                                                v-for="item in this.users"
                                                :label="item.nickName"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </keep-alive>
                            </el-form-item>



                            <el-form-item label="模块" prop="module" >
                                <keep-alive>
                                    <el-select v-model="HttpTestCaseAddForm.module" filterable placeholder="请选择模块" @click.native="getAllProjects_modules(value)" >
                                        <el-option
                                                v-for="item in this.projects_modules"
                                                :label="item.desc"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </keep-alive>
                            </el-form-item>



                            <el-form-item label="子模块" prop="subModule">
                                <el-input v-model="HttpTestCaseAddForm.subModule" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="用例名称" prop="testcase">
                                <el-input v-model="HttpTestCaseAddForm.testcase" auto-complete="off"></el-input>
                            </el-form-item>



                            <el-form-item label="请求地址" prop="requestAddress">
                                <el-input v-model="HttpTestCaseAddForm.requestAddress" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="请求类型" prop="requestType" >
                                <keep-alive>
                                    <el-select v-model="HttpTestCaseAddForm.requestType">
                                        <el-option
                                                v-for="item in this.requestTypeList"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </keep-alive>
                            </el-form-item>

                            <el-form-item label="参数类型" prop="requestParamType">
                                <keep-alive>
                                    <el-select v-model="HttpTestCaseAddForm.requestParamType"  @change="addParamDiv" >
                                        <el-option
                                                v-for="item in this.requestParamTypeList"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </keep-alive>
                            </el-form-item>




                            <div >
                                <el-form-item label="参数化"  prop="isParameterize">
                                    <el-radio-group v-model="HttpTestCaseAddForm.isParameterize" @change="handleParameterize()">
                                        <el-radio class="radio"  label="true"  >Y</el-radio>
                                        <el-radio class="radio"  label="false" >N</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </div>

                            <div v-if="parameterize_csvFile">

                                <el-form-item>
                                    <el-upload
                                            class="upload-demo"
                                            action="http://localhost:8011/file/testUploadFile"
                                            :headers="{'enctype':'multipart/form-data'}"
                                            :on-success="ParameterizeCsvFilePathSuccess"
                                            :on-error="fileUploadError"
                                    >
                                        <el-button type="primary" >上传CSV</el-button>
                                    </el-upload>
                                </el-form-item>
                            </div>


                            <div v-if="requestParamTypeSeen_json">
                                <el-form-item label="参数值"  prop="requestParam">
                                    <el-input type="textarea" v-model="requestParamValues_json"></el-input>
                                </el-form-item>
                            </div>




                            <div v-if="requestParamTypeSeen_kv">
                                <el-form-item label="参数值" prop="requestParam">
                                    <el-table
                                            :data="requestParamValues_kv"
                                            border
                                            style="width: 100%">
                                        <el-table-column
                                                label="Key"
                                                width="150">
                                            <template scope="scope">
                                                <span  class="cell-edit-input"  ><el-input v-model="scope.row.key"   ></el-input></span>
                                            </template>
                                        </el-table-column>

                                        <el-table-column
                                                label="Value"
                                                width="150">
                                            <template scope="scope">
                                                <span  class="cell-edit-input"  ><el-input v-model="scope.row.value"   ></el-input></span>
                                            </template>
                                        </el-table-column>

                                        <el-table-column label="操作" >
                                            <template scope="scope">
                                                <el-button
                                                        size="small"
                                                        @click="requestParamValuesAdd(scope.$index,scope.row)">添加</el-button>
                                                <el-button
                                                        size="small"
                                                        type="danger"
                                                        @click="requestParamValuesDelete(scope.$index, scope.row)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-form-item>
                            </div>

                            <el-form-item label="断言配置" prop="assertInfo">
                                <el-table
                                        :data="assertConfig"
                                        border
                                        style="width: 100%">
                                    <el-table-column
                                            label="断言字段"
                                            width="150">
                                        <template scope="scope">
                                            <span  class="cell-edit-input"  ><el-input v-model="scope.row.asserField"   ></el-input></span>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                            label="期望值"
                                            width="150">
                                        <template scope="scope">
                                            <span  class="cell-edit-input"  ><el-input v-model="scope.row.expectedValue"   ></el-input></span>
                                        </template>
                                    </el-table-column>

                                    <el-table-column label="操作" >
                                        <template scope="scope">
                                            <el-button
                                                    size="small"
                                                    @click="assertConfigAdd(scope.$index,scope.row)">添加</el-button>
                                            <el-button
                                                    size="small"
                                                    type="danger"
                                                    @click="assertConfigDelete(scope.$index, scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form-item>


                        </el-form>

                        <el-button @click.native="selectTargetTestCaseCatagoryVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>

                    </el-tab-pane>
                    <el-tab-pane label="Dubbo">配置管理</el-tab-pane>

                </el-tabs>
            </el-dialog>
        </div>


    </div>




</template>

<script>
let id = 1000
let fromData = ''
let toData = ''
let fromParentModelChildren = ''  // from 节点的父组件的model
let nodeClicked = undefined   // Attention: 递归的所有组件共享同一个＂顶级作用域＂（这个词或许不太正确，但就这个意思）．即：共享上面这几个let变量．这为实现当前节点的高亮提供了基础．

import util from '../../common/js/util'
//import NProgress from 'nprogress'
import {getTestCaseListPage, getUserListPage,getTargetTestcaseList, removeUser, batchRemoveUser, editUser, addTestCase,editTestCase,getAllProjectsList,getAllProjectsModuleList,getAllUserList,runSelectedCase,runResultDetailApi,downloadCsvFileApi,addenvironmentConfigApi,getEnvironmentConfigApi,batchRunTestCaseApi } from '../../api/api';



export default {
    name: 'VueDragTreeCom42',
    data: function () {
        return {

            testcaseDatas :[],
            assertConfig:[{asserField:'',expectedValue:''}],
            requestParamValues_kv:[{key:'',value:''}],
            requestParamTypeSeen_json:false,
            requestParamTypeSeen_kv:false,
            requestParamTypeList:[{name:"Json",id:"Json"},{name:"Key-Value",id:"Key-Value"},{name:"Raw",id:"Raw"}],
            requestTypeList:[{name:"Get",id:"Get"},{name:"Post",id:"Post"}],
            projects_modules:[],
            users:[],
            projects : [],
            ScenarioFormVisible:false,
            ProjectFormVisible:false,
            selectTargetTestCaseCatagoryVisible:false,
            open: false,
            isClicked: false,
            styleObj: {
                background: 'white',
            },
            AddScenarioForm:{
                id:'',
                scenarioName:'',
                type:'scenario'
            },
            AddProjectForm:{
                id:'',
                projectName:'',
                type:'project'
            },

            HttpTestCaseAddForm: {

                module: '',
                submodule: '',
                testcase: '',
                requestType: '',
                requestParam: '',
                requestaddress: '',
                project:'',
                assertField:'',
                creater:'',
                requestParamType:'',
                asserInfo:'',
                assertString:'',
                isParameterize:"false",
                type:1

            },
        }
    },
    props: {
        model: Object,
        'default-text': String, // 填加节点时显示的默认文本．
        'current-highlight': Boolean, // 当前节点高亮
        'hover-color': String,
        'highlight-color': String,
    },
    computed: {
        isFolder() {
            return this.model.children &&
                this.model.children.length
        },
    },
    methods: {

        assertConfigAdd(index,row){
            this.assertConfig.push({asserField:"",expectedValue:""});
        },

        assertConfigDelete(index,row){
            this.assertConfig.splice(index,1);
        },

        requestParamValuesAdd(index,row){

            this.requestParamValues_kv.push({key:"",value:""});

        },

        requestParamValuesDelete(index,row){

            this.requestParamValues_kv.splice(index,1);
        },

        addParamDiv(value){


            this.requestParamTypeSeen_json = false;
            this.requestParamTypeSeen_kv = false;

            if(value=="Json" | value=="Raw"){
                this.requestParamTypeSeen_json = true;

            }else if(value=="Key-Value"){
                this.requestParamTypeSeen_kv = true;
            }else{
            }
        },

        getAllProjects_modules(value){
            //alert("value:"+value);
            let para = {id:this.HttpTestCaseAddForm.project};
            if(this.HttpTestCaseAddForm.project==""|this.HttpTestCaseAddForm.project==null){
                alert('-------------');
            }else{
                getAllProjectsModuleList(para).then((res) => {
                    this.projects_modules = Object.assign({}, res.data);
                });
            }

        },

        getAllusers(value){
            let para = {};
            getAllUserList(para).then((res) => {
                this.users = Object.assign({}, res.data);
            });
        },


        getAllProjects(value){
            //alert("value:"+value);
            let para = {};
            getAllProjectsList(para).then((res) => {
                this.projects = Object.assign({}, res.data);
            });
        },

        toggle() {
            if (this.isFolder) {
                this.open = !this.open
            }
            // 调用vue-drag-tree的父组件中的方法,以传递出当前被点击的节点的id值
            let rootTree = this.findRoot()
            //　API: 对外开放的当前被点击节点的信息
            rootTree.$parent.curNodeClicked(this.model, this)

            // 纪录节点被点击的状态
            this.isClicked = !this.isClicked

            // 用户需要节点高亮？　-->　this.currentHighlight ? 高亮 : 不高亮
            if (this.currentHighlight) {
                // 第一次点击当前节点．当前节点高亮，遍历重置其他节点的样式
                if (nodeClicked != this.model.id) {
                    let treeParent = rootTree.$parent

                    // 遍历重置所有树组件的高亮样式
                    let nodeStack = [treeParent.$children[0]]
                    while (nodeStack.length != 0) {
                        let item = nodeStack.shift()
                        item.styleObj.background = 'white'
                        if (item.$children && item.$children.length > 0) {
                            nodeStack = nodeStack.concat(item.$children)
                        }
                    }
                    // 然后把当前节点的样式设置为高亮
                    this.styleObj.background = this.highlightColor ? this.highlightColor : '#99A9BF'

                    // 设置为当前节点
                    nodeClicked = this.model.id
                }
            }
        },
        exchangeData(rootCom, from, to) {
            //如果drag的目的地是 + - 符号的话，退出。
            if (!to || !from || typeof to == 'string' || from.id == to.id) {
                return
            }

            from = JSON.parse(JSON.stringify(from))
            to = JSON.parse(JSON.stringify(to))
            // copy一个,最后再赋值给state.treeData.这样能保证值的变化都会触发视图刷新(因为JS判断引用类型是否相同是根据内存地址.)
            let treeData = JSON.parse(JSON.stringify(this.model))
            let nodeStack = [treeData]
            let status = 0

            // 如果from或者to节点存在父子/祖辈关系，会报id of undefined的错。这种情况不考虑拖拽功能，所以catch住，返回/return就行
            try {
                // 广度优先遍历,找到涉及数据交换的两个对象.然后交换数据.
                while (!(status === 2)) {
                    let item = nodeStack.shift()
                    if (item.id == from.id) {
                        item.id = to.id
                        item.name = to.name
                        if (to.children && to.children.length > 0) {
                            item['children'] = to.children
                        } else {
                            item.children = []
                        }
                        status++
                        //找到后,跳出当前循环.
                        continue;
                    }
                    if (item.id == to.id) {
                        item.id = from.id
                        item.name = from.name
                        if (from.children && from.children.length > 0) {
                            item['children'] = from.children
                        } else {
                            item.children = []
                        }
                        status++
                        //找到后,跳出当前循环.
                        continue;
                    }
                    if (item.children && item.children.length > 0) {
                        nodeStack = nodeStack.concat(item.children)
                    }
                }
            } catch (e) {
                return
            }
            //API: 对外开放交换后的数据的赋值操作
            rootCom.assignData(treeData)
        },
        changeType() {
            // 用户需要高亮-->才纪录当前被点击节点
            if (this.currentHighlight) {
                nodeClicked = this.model.id
            }
            if (!this.isFolder) {
                this.$set(this.model, 'children', [])
                this.addChild()
                this.open = true
                this.isClicked = true
            }
        },
        mouseOver(e) {

            if ((this.styleObj.background != '#99A9BF' || this.styleObj.background != this.hightlightColor) && e.target.className === 'treeNodeText') {
                e.target.style.background = this.hoverColor ? this.hoverColor : '#E5E9F2'
            }
        },
        mouseOut(e) {
            if ((this.styleObj.background != '#99A9BF' || this.styleObj.background != this.hightlightColor) && e.target.className === 'treeNodeText') {
                e.target.style.background = 'white'
            }
        },
        findRoot() {
            // 返回Tree的根,即递归Tree时的最顶层那个vue-drag-tree组件
            let ok = false
            let that = this
            while (!ok) {
                // 如果父组件有data属性，说明当前组件是Tree组件递归调用发生时的第一个组件。
                // Warning: 因为是判断data属性是否存在，所有在别人使用该组件时，属性名必须得是data
                // v1.0.9-update: add another judgement method.
                if (!/VueDragTreeCom42/.test(that.$parent.$vnode.tag) || that.$parent.data) {
                    ok = true
                    // 交换两者的数据 
                    break
                }
                that = that.$parent
            }
            return that
        },
        addChild() {
            //alert(JSON.stringify(this.model))
            this.AddProjectForm.projectName = '';
            this.AddScenarioForm.scenarioName = '';
            if(this.model.type=="root"){
                this.ProjectFormVisible = true;
            }
            if(this.model.type=="project"){
                this.ScenarioFormVisible = true;
            }
            if(this.model.type=="scenario"){
                this.selectTargetTestCaseCatagoryVisible = true;
            }


        },
        AddProjectFormSubmit(){
            //alert(JSON.stringify(this.model));
            this.model.children.push({
                name: this.AddProjectForm.projectName,
                id: id++,
                type:'project'
            })
            this.ProjectFormVisible = false;

        },

        AddScenarioFormSubmit(){

            //alert(JSON.stringify(this.model));
            this.model.children.push({
                name: this.AddScenarioForm.scenarioName,
                id: id++,
                type:'scenario'
            })
            this.ScenarioFormVisible = false;


        },

        addSubmit(){
            this.model.children.push({
                name: this.HttpTestCaseAddForm.testcase,
                id: id++,
                type:'testcase',

            })
            this.testcaseDatas.push(this.HttpTestCaseAddForm);
            this.HttpTestCaseAddForm = {
                module: '',
                submodule: '',
                testcase: '',
                requestType: '',
                requestParam: '',
                requestaddress: '',
                project:'',
                assertField:'',
                creater:'',
                requestParamType:'',
                asserInfo:'',
                assertString:'',
                isParameterize:"false",
                type:1

            };
            this.selectTargetTestCaseCatagoryVisible = false;

            alert("testcaseDatas"+JSON.stringify(this.testcaseDatas));
        },
        removeChild(id) {
            // 获取父组件的model.children
            let parent_model_children = this.$parent.model.children

            // 在父组件model.children里删除
            for (let index in parent_model_children) {
                // 找到该删的id
                if (parent_model_children[index].id == id) {
                    parent_model_children = parent_model_children.splice(index, 1)
                    break
                }
            }
        },
        dragStart(e) {
            // fromData = this.model
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("nottext", e.target.innerHTML);
            return true
        },
        dragEnd(e) {
            fromData = undefined
            toData = undefined
            fromParentModelChildren = undefined
        },
        dragOver(e) {
            e.preventDefault()
            return true
        },
        dragOverPlus(e) {
            e.preventDefault()
        },
        dragEnterPlus(e) {
        },
        dragEnter(e) {
            toData = this.model
            let rootTree = this.findRoot()
            rootTree.exchangeData(rootTree.$parent, fromData, toData)
        },
        dragLeave(e) {
            fromData = this.model
            fromParentModelChildren = this.$parent.model.children
            // e.target.style.background = '#7B1FA2'
        },
        drop(e) {
            // toData = this.model
            // e.target.style.background = '#7B1FA2'
        },
        dropPlus(e) {
            // 把from节点插入到当前层级节点的最后一个
            if (this.model.hasOwnProperty('children')) {
                this.model.children.push(fromData)
            } else {
                this.model.children = [fromData]
            }

            // 把from节点从之前的节点删除
            for (let i in fromParentModelChildren) {
                if (fromParentModelChildren[i].id == fromData.id) {
                    fromParentModelChildren.splice(i, 1)
                }
            }
        }
    },
    beforeCreate() {
        this.$options.components.item = require('./vue-drag-tree')
    },
    created() {
        // console.log('this.hig', this.highlightColor, '|', this.hoverColor)
    }


}
</script>

<style>
.item {
    cursor: pointer;
}

.bold {
    font-weight: bold;
}

.treeNodeText {
    margin: 2px;
    padding: 0.2rem 0.5rem;
    width: fit-content;
    background: #F9FAFC;
    font-size: 18px;
    color: #324057;
}

.treeMargin {
    margin-left: 2rem;
}

.changeTree {
    width: 1rem;
    color: #324057;
}

.vue-drag-node-icon {
    display: inline-block;
    width: 0;
    height: 0;
    padding-right: 3px;
    border-left: 6px solid black;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 0 solid yellow;
    transition: transform .3s ease-in-out;
}

.nodeClicked {
    transform: rotate(90deg);
}
</style>

