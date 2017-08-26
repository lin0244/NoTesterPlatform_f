<template>

	<div>
			<div>
				<vue-drag-tree :model='data' :current-highlight='true' :default-text='"New A Girl"' :hover-color='"lightblue"' :highlight-color='green'></vue-drag-tree>

				<el-button type="primary" @click="add">添加</el-button>
			</div>


		<div>
			<el-dialog title="新增" v-model="selectTestcase" :close-on-click-modal="false">
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

		</div>


		<!--场景列表界面-->
		<div>
			<el-table :data="allScenariosData" highlight-current-row v-loading="queryTestCaseLoading" @selection-change="" style="width: 100%;" >
				<el-table-column type="selection" width="55" >
				</el-table-column>
				<el-table-column prop="scenarioId" width="100" label="场景编号">
				</el-table-column>


				<el-table-column prop="scenarioName" label="场景名称" width="120" sortable>
				</el-table-column>


				<el-table-column prop="createtime" label="创建时间" min-width="180" sortable>
				</el-table-column>

				<el-table-column prop="lastRuntime" label="上次运行时间" min-width="180" sortable>
				</el-table-column>

				<el-table-column prop="runResult" label="运行结果" min-width="120" :formatter="formatRunResult" sortable>
				</el-table-column>

				<el-table-column label="操作" width="500">
					<template scope="scope">

						<el-button size="small" @click="getRunResultDetail(scope.$index, scope.row)">查看执行结果</el-button>
					</template>
				</el-table-column>


			</el-table>


		</div>>

	</div>

</template>
<script>


	import { addTreeScenarioApi,getTargetScenariosDataApi } from '../../api/api';

	export default{
		data(){
			return{
				data:{
					name: 'Project',
					id: 0,
					type:'root',
					children: [

					]
				},
				allScenariosData:[],
				selectTestcase:false,
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

				}
			}
		},
		methods: {
			assignData(data) {
				// data is a json object that node infomation was exchanged inside.You need to assign to finish the last step of exchange.

				// If you have not use vuex or something similar, you can just assign data to this.data
				this.data = data

				// If you have used vuex or something similar, you need to write assign code by yourselft.
				// vuex as an example:
				// updateData function is a mutation of vuex.

				// this.updateData(data)
			},
			curNodeClicked(model,component) {

//				if(model.type == "testcase"){
//					this.selectTestcase = true;
//					this.addForm = model.testcaseData;
//					//this.model.testcaseData = this.addForm;
//				}
				//alert("model:"+JSON.stringify(model));
				//alert("component:"+JSON.stringify(component));
				// information of the node clicked just now.
			},
			add(){

				this.loading = true;
				let para = {tree:this.data};
				alert(JSON.stringify(this.data));
				addTreeScenarioApi(para).then((res) => {
					this.loading = false;
					this.data = {
						name: 'Project',
								id: 0,
								type:'root',
								children: [

						]
					}

				});
			},
			getTargetScenariosData(){
				this.loading = true;
				let para = {};
				getTargetScenariosDataApi(para).then((res) => {
					this.loading = false;
					this.data = res.data;
				});
			}

		},
		mounted() {
			this.getTargetScenariosData();
		}
	}
	</script>