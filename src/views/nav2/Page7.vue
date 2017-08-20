<template>
	<section>
		<div>
			<el-transfer
					v-model="value3"
					filterable
					:left-default-checked="[]"
					:right-default-checked="[]"
					:titles="['测试用例', '场景用例']"
					:button-texts="['到左边', '到右边']"
					:footer-format="{
			  noChecked: '${total}',
			  hasChecked: '${checked}/${total}'
			}"
					@change="handleChange"
					:data="data">
				<el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
				<el-button class="transfer-footer" slot="right-footer" size="small"  @click.native="SaveScenario">保存</el-button>
			</el-transfer>

		</div>

		<div>
		<!--编辑界面-->
			<el-dialog title="新增场景" v-model="ScenarioFormVisible" :close-on-click-modal="false">
				<el-form :model="AddScenarioForm" label-width="80px" :rules="AddScenarioForm" ref="AddScenarioForm">

					<el-form-item label="场景名称" prop="scenarioName">
						<el-input v-model="AddScenarioForm.scenarioName" auto-complete="off"></el-input>
					</el-form-item>

				</el-form>

				<div slot="footer" class="dialog-footer">
					<el-button @click.native="editFormVisible = false">取消</el-button>
					<el-button type="primary" @click.native="AddScenarioFormSubmit" :loading="editLoading">提交</el-button>
				</div>
			</el-dialog>

		</div>


		<div>
			<el-row :gutter="20">
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters">
						<el-form-item>
							<el-input v-model="filters.scenarioName" placeholder="场景名称"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" v-on:click="getTargetTestcases()">查询</el-button>
						</el-form-item>

					</el-form>
				</el-col>

			</el-row>
		</div>


		<div>
			<el-table :data="allScenariosData" highlight-current-row v-loading="queryTestCaseLoading" @selection-change="handleSelectionChange" style="width: 100%;" >
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
						<el-button size="small" @click="runSelectedCaseOuter(scope.$index, scope.row)">执行</el-button>
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
						<el-button size="small" @click="getRunResultDetail(scope.$index, scope.row)">查看执行结果</el-button>
					</template>
				</el-table-column>


			</el-table>
		</div>>

	</section>
</template>

<style>
	.transfer-footer {
		margin-left: 80px;
		padding: 6px 5px;
	}
</style>

<script>

	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getAllTestCaseNameAndIdApi,addScenarioApi,getAllScenarioApi } from '../../api/api';

	export default {
		data() {

			return {
				allScenariosData:[],
				filters: {
					scenarioName: ''
				},
				ScenarioFormVisible:false,
				listLoading:false,
				data: [],
				value3: [],
				AddScenarioForm:{
					idStr:'',
					scenarioName:''
				}

			};
		},

		methods: {
			handleChange(value, direction, movedKeys) {
				//console.log(value, direction, movedKeys);
				//alert("value:"+value);
				//alert("movedKeys:"+movedKeys);
				this.AddScenarioForm.idStr = movedKeys.join(",");
			},
			SaveScenario(){
				this.ScenarioFormVisible = true;
			},

			 generateData() {
				this.listLoading = true;
				let para = {};
				 getAllTestCaseNameAndIdApi(para).then((res) => {
					this.data = res.data;
					this.listLoading = false;
					//NProgress.done();
				});
			 },
			//新增
			AddScenarioFormSubmit: function () {
				this.$refs.AddScenarioForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;

							let para = Object.assign({}, this.AddScenarioForm);
							addScenarioApi(para).then((res,err) => {
								this.addLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.ScenarioFormVisible = false;
								this.getAllScenario();

							});
						});
					}
				});
			},

			getAllScenario(){

				let para = {};
				getAllScenarioApi(para).then((res,err) => {
					this.allScenariosData = res.data;
				});

			}
		},
		mounted() {
			this.generateData();
			this.getAllScenario();
		}
	};
</script>