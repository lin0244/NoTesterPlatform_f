<template>
	<section>
		<!--工具条-->




		<el-row :gutter="20">
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.testcase" placeholder="用例名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.project" placeholder="项目名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.module" placeholder="模块名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.subModule" placeholder="子模块"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.creater" placeholder="创建人"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.runResult" placeholder="运行结果"></el-input>
                    </el-form-item>

                </el-form>
            </el-col>

        </el-row>

		<el-row :gutter="20">
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="blockArea">
                    <el-form-item>
                        <el-button type="primary" v-on:click="getTargetTestcases()">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleAdd">新增</el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-upload
                          class="upload-demo"
                          action="http://localhost:8011/file/testUploadFile"
                          :headers="{'enctype':'multipart/form-data'}"
                          :on-success="fileUploadSuccess"
                          :on-error="fileUploadError">
                          <el-button type="primary" @click="fileUploadIndex(index)">上传用例Excel</el-button>
                        </el-upload>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="addTab(editableTabsValue2)">添加Tab</el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="setFilterProjectTabSeen()">{{FilterProjectTabSeenName}}</el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="setBeanShellSamplerSeen()">新增BeanShell Sampler</el-button>
                    </el-form-item>



                </el-form>
            </el-col>

            <div  v-if="filterProjectTabSeen">

                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" :model="blockArea">
                        <el-tabs v-model="editableTabsValue2" type="card" closable @tab-remove="removeTab">
                            <el-tab-pane
                                    v-for="(item, index) in editableTabs2"
                                    :key="item.name"
                                    :label="item.title"
                                    :name="item.name"
                            >
                                {{item.content}}
                            </el-tab-pane>
                        </el-tabs>
                    </el-form>
                </el-col>
            </div>>
        </el-row>




        <!--环境变量配置下拉框-->
        <el-row :gutter="20">
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :model="environmentConfigForm" label-width="150px" :rules="addFormRules" ref="addForm">
                    <el-form-item label="项目变量配置" prop="project" >
                        <keep-alive>
                            <el-select v-model="environmentConfigForm.project" filterable placeholder="请选择项目" @click.native="getAllProjects(value)" @change="setEnvironmentConfigForm(environmentConfigForm.project)">
                                <el-option
                                        v-for="item in this.projects"
                                        :label="item.desc"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </keep-alive>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>


        <!--环境变量配置界面-->
        <el-dialog title="环境变量配置" v-model="environmentConfigVisible" :close-on-click-modal="false">

            <el-table
                    :data="environmentTableData"
                    border
                    style="width: 100%">
                <el-table-column
                        label="Key"
                        width="180">
                    <template scope="scope">
                        <span  class="cell-edit-input"  ><el-input v-model="scope.row.key"   ></el-input></span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="Value"
                        width="180">
                    <template scope="scope">
                        <span  class="cell-edit-input"  ><el-input v-model="scope.row.value"   ></el-input></span>
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button
                                size="small"
                                @click="handleEnvironmentConfigAdd(scope.$index,scope.row)">添加</el-button>
                        <el-button
                                size="small"
                                type="danger"
                                @click="handleEnvironmentConfigDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="environmentConfigFormSubmit" :loading="editLoading">提交</el-button>
            </div>

        </el-dialog>



        <!--列表-->
		<el-table :data="allTestCases" highlight-current-row v-loading="queryTestCaseLoading" @selection-change="handleSelectionChange" style="width: 100%;" >
			<el-table-column type="selection" width="55" >
			</el-table-column>
			<el-table-column prop="testCaseId" width="100" label="用例编号">
			</el-table-column>


            <el-table-column prop="project" label="项目" width="120" sortable>
            </el-table-column>
			<el-table-column prop="module" label="模块" width="120" sortable>
            </el-table-column>
            <el-table-column prop="subModule" label="子模块" width="120" sortable>
            </el-table-column>
            <el-table-column prop="testcase" label="用例名称" width="200" sortable>
			</el-table-column>
		    <el-table-column prop="creater" label="创建人" width="120" sortable>
            </el-table-column>
			<el-table-column prop="requestType" label="请求类型" width="120" sortable>
            </el-table-column>
            <el-table-column prop="requestParamType" label="参数类型" width="120" sortable>
            </el-table-column>
            <el-table-column prop="requestParam" label="请求参数" width="120" sortable >

                <template scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>参数值: {{ scope.row.requestParam }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag>{{ scope.row.requestParam }}</el-tag>
                        </div>
                    </el-popover>
                </template>

            </el-table-column>
            <el-table-column prop="requestAddress" label="请求地址" width="240" sortable>
            </el-table-column>

            <el-table-column prop="assertField" label="断言字段" width="200" sortable>
            </el-table-column>

            <el-table-column prop="expectedValue" label="期望值" width="120" sortable>
                <template scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>期望值: {{ scope.row.expectedValue }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag>{{ scope.row.expectedValue }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>

            <el-table-column prop="assertValue" label="断言结果值" width="150" sortable>
            </el-table-column>

            <el-table-column prop="createtime" label="创建时间" min-width="180" sortable>
            </el-table-column>

			<el-table-column prop="lastRuntime" label="上次运行时间" min-width="180" sortable>
            </el-table-column>

            <el-table-column prop="runResult" label="运行结果" min-width="120" :formatter="formatRunResult" sortable>
            </el-table-column>




			<el-table-column label="操作" width="500">
				<template scope="scope">
				    <el-button size="small" @click="runSelectedCaseOuter(scope.$index, scope.row)">执行</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="small" @click="handleAdvConfig(scope.$index, scope.row)">高级配置</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					<el-button size="small" @click="getRunResultDetail(scope.$index, scope.row)">查看执行结果</el-button>
                    <el-button size="small" @click="downloadCsvFile(scope.$index, scope.row)" >下载Csv</el-button>
				</template>
			</el-table-column>

            <div v-if="false">
                <el-table-column prop="assertInfo" label="断言信息" width="200" sortable >
                    <template scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>断言信息: {{ scope.row.assertInfo }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag>{{ scope.row.expectedValue }}</el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
            </div>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRunSelected" :disabled="this.multipleSelection.length===0">批量执行</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="addFormRules" ref="addForm">

                <el-form-item label="项目" prop="project" >
                    <keep-alive>
                        <el-select v-model="editForm.project" filterable placeholder="请选择活动" @click.native="getAllProjects(value)" >
                            <el-option
                                    v-for="item in this.projects"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </keep-alive>
                </el-form-item>

                <el-form-item label="模块" prop="module">
                    <el-input v-model="editForm.module" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="子模块" prop="subModule">
                    <el-input v-model="editForm.subModule" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="用例名称" prop="testcase">
                    <el-input v-model="editForm.testcase" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="创建人" prop="testcase">
                    <el-input v-model="editForm.creater" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="请求地址" prop="requestAddress">
                    <el-input v-model="editForm.requestAddress" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="请求类型" prop="requestType" >
                    <keep-alive>
                        <el-select v-model="editForm.requestType">
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
                        <el-select v-model="editForm.requestParamType"  @change="addParamDiv" >
                            <el-option
                                    v-for="item in this.requestParamTypeList"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </keep-alive>
                </el-form-item>

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



			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>



	    <!--运行结果详情界面-->
        <el-dialog title="运行结果详情" v-model="runResultDetailVisible" :close-on-click-modal="false">
        	<el-form :model="runResultDetailForm" label-width="100px" :rules="runResultDetailRules" ref="runResultDetailForm">

                <el-form-item label="运行结果" prop="runResult"  >
                    <el-input v-model="runResultDetailForm.runResult" auto-complete="off" ></el-input>
                </el-form-item>
                <el-form-item label="断言字段" prop="assertField">
                    <el-input v-model="runResultDetailForm.assertField" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="期望值" prop="expectedValue">
                    <el-input v-model="runResultDetailForm.expectedValue" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="断言结果值" prop="assertValue">
                    <el-input v-model="runResultDetailForm.assertValue" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="耗时" prop="elapsedTime">
                    <el-input v-model="runResultDetailForm.elapsedTime" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="ResponseData" prop="serverResponseData" >
                	<el-input type="textarea" v-model="runResultDetailForm.serverResponseData" auto-complete="off"></el-input>
                </el-form-item>

            </el-form>

         </el-dialog>




        <!--添加beanshell sampler界面-->
        <el-dialog title="Beanshell Sampler" v-model="beanShellSamplerlVisible" :close-on-click-modal="false">
            <el-form :model="beanShellSamplerForm" label-width="100px" :rules="runResultDetailRules" ref="beanShellSamplerForm">

                <el-form-item label="用例名称" prop="testcase"  >
                    <el-input v-model="beanShellSamplerForm.testcase" auto-complete="off" ></el-input>
                </el-form-item>

                <el-form-item label="脚本" prop="script" >
                    <el-input type="textarea" v-model="beanShellSamplerForm.script" auto-complete="off"></el-input>
                </el-form-item>

            </el-form>


            <div slot="footer" class="dialog-footer">
                <el-button @click.native="beanShellSamplerlVisible = false">取消</el-button>
                <el-button type="primary" @click.native="beanShellSamplerFormSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>


        <!--高级配置界面-->
        <el-dialog title="高级配置" v-model="advConfigVisible" :close-on-click-modal="false">

        	    <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="Headers" name="first">

                <el-table
                    :data="headerTableData"
                    border
                    style="width: 100%">
                    <el-table-column
                      label="Key"
                      width="180">
                      <template scope="scope">
                              <span  class="cell-edit-input"  ><el-input v-model="scope.row.key"   ></el-input></span>
                      </template>
                    </el-table-column>

                    <el-table-column
                          label="Value"
                          width="180">
                          <template scope="scope">
                              <span  class="cell-edit-input"  ><el-input v-model="scope.row.value"   ></el-input></span>
                          </template>
                    </el-table-column>

                    <el-table-column label="操作">
                      <template scope="scope">
                        <el-button
                          size="small"
                          @click="handleHeaderAdd(scope.$index,scope.row)">添加</el-button>
                        <el-button
                          size="small"
                          type="danger"
                          @click="handleHeaderDelete(scope.$index, scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>



                </el-tab-pane>



                <el-tab-pane label="Authorization" name="second">Authorization</el-tab-pane>

              </el-tabs>

                  <div slot="footer" class="dialog-footer">
                  		<el-button @click.native="editFormVisible = false">取消</el-button>
                  		<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
                  </div>

         </el-dialog>



		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">

               <el-form-item label="项目" prop="project" >
                             <keep-alive>
                                 <el-select v-model="addForm.project" filterable placeholder="请选择项目" @click.native="getAllProjects(value)" >
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
                        <el-select v-model="addForm.creater" filterable placeholder="请选择创建人" @click.native="getAllusers(value)" >
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
                        <el-select v-model="addForm.module" filterable placeholder="请选择模块" @click.native="getAllProjects_modules(value)" >
                            <el-option
                                    v-for="item in this.projects_modules"
                                    :label="item.desc"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </keep-alive>
                </el-form-item>



				<el-form-item label="子模块" prop="subModule">
					<el-input v-model="addForm.subModule" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="用例名称" prop="testcase">
					<el-input v-model="addForm.testcase" auto-complete="off"></el-input>
				</el-form-item>



				<el-form-item label="请求地址" prop="requestAddress">
					<el-input v-model="addForm.requestAddress" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="请求类型" prop="requestType" >
					<keep-alive>
                            <el-select v-model="addForm.requestType">
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
                            <el-select v-model="addForm.requestParamType"  @change="addParamDiv" >
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
                          <el-radio-group v-model="addForm.isParameterize" @change="handleParameterize()">
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

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>





	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import {getTestCaseListPage, getUserListPage,getTargetTestcaseList, removeUser, batchRemoveUser, editUser, addTestCase,editTestCase,getAllProjectsList,getAllProjectsModuleList,getAllUserList,runSelectedCase,runResultDetailApi,downloadCsvFileApi,addenvironmentConfigApi,getEnvironmentConfigApi,batchRunTestCaseApi } from '../../api/api';

	export default {
		data() {
			return {

                beanShellSamplerlVisible:false,
                environmentConfigVisible:false,
			    queryTestCaseLoading:'false',

                FilterProjectTabSeenName:'显示Tab',
			    //
                editableTabsValue2: '2',
                editableTabs2: [{
                    title: 'Tab 1',
                    name: '1',
                    content: 'Tab 1 content'
                }, {
                    title: 'Tab 2',
                    name: '2',
                    content: 'Tab 2 content'
                }],
                tabIndex: 2,







				filters: {
					testcase: '',
					project:'',
					module:'',
					subModule:'',
					creater:'',
					runResult:''
				},
                filterProjectTabSeen:false,
                multipleSelection:[],
				requestParamTypeSeen_json:false,
				requestParamTypeSeen_kv:false,
                parameterize_csvFile:false,
				projects : [],
                projects_modules:[],
                users:[],
				requestTypeList:[{name:"Get",id:"Get"},{name:"Post",id:"Post"}],
				requestParamTypeList:[{name:"Json",id:"Json"},{name:"Key-Value",id:"Key-Value"},{name:"Raw",id:"Raw"}],
				requestParamValues_kv:[{key:'',value:''}],
                requestParamValues_json:'',
                assertConfig:[{asserField:'',expectedValue:''}],
				allTestCases: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
                selected : 'zhi',
                //编辑界面是否显示
				editFormVisible: false,
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},

				advConfigForm:{
				    Key:'',
				    Value:''
				},

				headerTableData: [{
                                           key: '王小虎',
                                           value: '上海市普陀区金沙江路 1518 弄'
                                         }, {
                                           key: '王小虎',
                                           value: '上海市普陀区金沙江路 1517 弄'
                                         }],

                environmentTableData:[{
                    key: '',
                    value: ''
                }],
                advConfigVisible:false,


                //执行结果详情页面是否显示
                runResultDetailVisible: false,
				runResultDetailRules: {

				},
				//执行结果详情页面数据
				runResultDetailForm: {
					runResult: '',
					assertField: '',
					assertValue: '',
					serverResponseData:'',
					startRuntime:'',
					endRuntime:'',
					elapsedTime:''


				},


				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
                //编辑界面数据
                editForm: {
                    id: 0,
                    module: '',
                    submodule: '',
                    testcase: '',
                    requestType: '',
                    requestParam: '',
                    requestaddress: '',
                    project:'',
                    assertField:'',
                    assertValue:'',
                    creater:''

                },
				//新增界面数据
				addForm: {

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
                environmentConfigForm:{

				    project:''
                },
                beanShellSamplerForm:{
                    testcase:'',
                    script:''
                }

			}
		},


		methods: {

			/**
			 * [handleFileChange description]
			 * 文件上传
			 * @return {[type]} [description]
			 */

            beanShellSamplerFormSubmit: function () {
                alert("1111111111111");
                this.$refs.beanShellSamplerForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;


                            let para = Object.assign({}, this.beanShellSamplerForm);
                            alert(JSON.stringify(para));
                            addTestCase(para).then((res,err) => {
                                this.addLoading = false;
                                //NProgress.done();

                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getTestCaseByPage();

                            });
                        });
                    }
                });
            },


            setBeanShellSamplerSeen(){

                this.beanShellSamplerlVisible = true;
            },

            setEnvironmentConfigForm(value){
                this.environmentConfigVisible = true;
                this.listLoading = true;
                let para = {project_id:value};
                getEnvironmentConfigApi(para).then((res) => {
                    this.environmentTableData = res.data;

                    if(res.data.length==0){
                        this.environmentTableData = [{
                            key: '',
                            value: ''
                        }]
                    }
                    this.listLoading = false;
                    //NProgress.done();
                });

            },


            ParameterizeCsvFilePathSuccess(response, file, fileList){

                this.addForm.requestParam = response;//JSON.stringify(response);
                alert(JSON.stringify(this.addForm.requestParam));
            },

            handleParameterize(value){

                if(this.addForm.isParameterize=="true"){
                    this.requestParamTypeSeen_json = false;
                    this.requestParamTypeSeen_kv = false;
                    this.parameterize_csvFile = true;
                }else{
                    this.requestParamTypeSeen_kv = true;
                    this.parameterize_csvFile = false;
                }
            },


			//
            addTab(targetName) {
                let newTabName = ++this.tabIndex + '';
                this.editableTabs2.push({
                    title: 'New Tab',
                    name: newTabName,
                    content: 'New Tab content'
                });
                this.editableTabsValue2 = newTabName;
            },
            removeTab(targetName) {
                let tabs = this.editableTabs2;
                let activeName = this.editableTabsValue2;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }

                this.editableTabsValue2 = activeName;
                this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);},






            setFilterProjectTabSeen(){
                if(this.filterProjectTabSeen == true){
                    this.FilterProjectTabSeenName = '显示Tab';
                    this.filterProjectTabSeen = false;
                }else if(this.filterProjectTabSeen == false){
                    this.FilterProjectTabSeenName = '隐藏Tab';
                    this.filterProjectTabSeen = true;
                }

            },


            handleSelectionChange(val){
                this.multipleSelection = val;
            },

            batchRunSelected(){
                if (this.multipleSelection) {
                    this.listLoading = true;

                    var testCaseIds = [];

                    this.multipleSelection.forEach(function (element, index, array) {
                        testCaseIds.push(element.testCaseId);
                    });
                    let para = {ids:testCaseIds};
                    batchRunTestCaseApi(para).then((res) => {

                        this.listLoading = false;
                        //NProgress.done();
                    });
                } else {
                    //this.$refs.multipleTable.clearSelection();
                }
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

			 getTargetTestcases(){

                let para = Object.assign({}, this.filters);
			    alert("query:"+JSON.stringify(para));
			    getTargetTestcaseList(para).then((res) => {
                	this.total = res.data.total;
                	this.allTestCases = res.data;
                	this.listLoading = false;
                	//NProgress.done();
                	});
			 },

            handleHeaderAdd(index,row){

                this.headerTableData.push({key:"",value:""});

            },

            handleHeaderDelete(index,row){
                alert("handleHeaderDelete:"+index);
                this.headerTableData.splice(index,1);
            },


            handleEnvironmentConfigAdd(index,row){

                this.environmentTableData.push({key:"",value:""});

            },

            handleEnvironmentConfigDelete(index,row){

                this.environmentTableData.splice(index,1);
            },

            requestParamValuesAdd(index,row){

                this.requestParamValues_kv.push({key:"",value:""});

            },

            requestParamValuesDelete(index,row){

                this.requestParamValues_kv.splice(index,1);
            },


            assertConfigAdd(index,row){
                this.assertConfig.push({asserField:"",expectedValue:""});
            },

            assertConfigDelete(index,row){
                this.assertConfig.splice(index,1);
            },


			fileUploadSuccess(response,file,fileList){
				this.$set(this.groups[this._fileIndex],'whiteUrl',response.data);
				this.$message({
					type : 'success',
					message : '文件上传成功'
				});
			},
			fileUploadError(err,file,fileList){
				console.log(err);
				this.$message({
					type : 'error',
					message : '文件上传失败'
				});
			},

			fileUploadIndex(index){

				this._fileIndex = index;
			},

			//性别显示转换
			formatRunResult: function (row, column) {
				return (row.runResult == true) ? '通过' :  '不通过';
			},
			handleCurrentChange(val) {
				this.page = val;
				//this.getUsers();
			},
			//获取用户列表
			getTestCaseByPage() {

                this.queryTestCaseLoading = true;
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getTestCaseListPage(para).then((res) => {
					this.total = res.data.total;
					this.allTestCases = res.data;
					this.listLoading = false;
					//NProgress.done();
                    this.queryTestCaseLoading = false;
                });
			},

            getAllProjects(value){
                //alert("value:"+value);
				let para = {};
				getAllProjectsList(para).then((res) => {
					this.projects = Object.assign({}, res.data);
				});
            },

            getAllusers(value){
                let para = {};
                getAllUserList(para).then((res) => {
                    this.users = Object.assign({}, res.data);
                });
            },

            getAllProjects_modules(value){
                //alert("value:"+value);
                let para = {id:this.addForm.project};
                if(this.addForm.project==""|this.addForm.project==null){
                    alert('-------------');
                }else{
                    getAllProjectsModuleList(para).then((res) => {
                        this.projects_modules = Object.assign({}, res.data);
                    });
                }

            },

			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						//this.getUsers();
					});
				}).catch(() => {

				});
			},

			//执行选中的测试用例
            runSelectedCaseOuter: function (index, row) {

                this.queryTestCaseLoading = true;

                let para  = {"testCaseId":row.testCaseId,"project":row.project};

                runSelectedCase(para).then((res) => {
                    this.allTestCases[index] = res.data;
                    this.queryTestCaseLoading = false;
                });
            },




			//显示运行结果详情界面
			getRunResultDetail: function (index, row) {

            	let para = {id:row.testCaseId};
            	runResultDetailApi(para).then((res) => {
            		this.listLoading = false;
            		//NProgress.done();
                    this.runResultDetailForm = Object.assign({}, res.data);
                    this.runResultDetailVisible = true;
            	});

            },

            downloadCsvFile(index, row){
                let para = {csv_file_name:row.requestParam};
                alert(JSON.stringify(para));
                downloadCsvFileApi(para).then((res) => {
                    this.listLoading = false;
                    alert(res);
                    //NProgress.done();
                    //this.runResultDetailForm = Object.assign({}, res.data);
                    //this.runResultDetailVisible = true;
                });

            },

            //handleAdvConfig

            handleAdvConfig: function (index, row) {
                this.advConfigVisible = true;

            },

            //显示编辑界面
            handleEdit: function (index, row) {

                if(row.requestParamType=='Json'|row.requestParamType=='Raw'){
                    this.requestParamTypeSeen_json = true;
                }else if(row.requestParamType=='Key-Value'){
                    this.requestParamTypeSeen_kv = true;

                }


                this.requestParamValues_kv = JSON.parse(row.requestParam);
                this.requestParamValues_json =row.requestParam;
                this.assertConfig = JSON.parse(row.assertInfo);

                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },

			//显示新增界面
			handleAdd: function () {
			    this.requestParamValues_kv = [{key:'',value:''}];
                this.requestParamValues_json = '';
                assertConfig:[{asserField:'',expectedValue:''}],
				this.addFormVisible = true;

			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editTestCase(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								//this.getUsers();
							});
						});
					}
				});
			},

            //提交环境变量配置表单
            environmentConfigFormSubmit: function () {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.editLoading = true;
                    let para = {};//Object.assign({}, this.environmentTableData);

                    para.project_id=this.environmentConfigForm.project;
                    para.data = JSON.stringify(this.environmentTableData);
                    //alert(JSON.stringify(this.environmentTableData));


                    addenvironmentConfigApi(para).then((res) => {
                        this.editLoading = false;
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.environmentTableData = [{
                            key: '',
                            value: ''
                        }];
                        this.environmentConfigVisible = false;
                        //this.getUsers();
                    });
                });
            },
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
                            if(this.addForm.requestParamType=='Json'|this.addForm.requestParamType=='Raw'){
                                this.addForm.requestParam = this.requestParamValues_json;
                            }else if(this.addForm.requestParamType=='Key-Value'&&this.addForm.isParameterize=="false"){
                                this.addForm.requestParam = JSON.stringify(this.requestParamValues_kv);

                            }else{

                            }

                            this.addForm.assertInfo = JSON.stringify(this.assertConfig);
                            //this.addForm.assertString =
                            //alert(JSON.stringify(this.addForm.assertInfo));

							let para = Object.assign({}, this.addForm);
                            alert(JSON.stringify(para));
							addTestCase(para).then((res,err) => {
								this.addLoading = false;
								//NProgress.done();

								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
                                this.getTestCaseByPage();

                            });
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						//this.getUsers();
					});
				}).catch(() => {

				});
			}
		},




		mounted() {
			this.getTestCaseByPage();
		}
	}

</script>

<style scoped>

</style>