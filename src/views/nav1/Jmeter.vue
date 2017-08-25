<template>
	<section>
		<!--环境变量配置界面-->

		<div>
			<el-table
					:data="jmeterConfigTableData"
					border
					style="width: 100%">

				<el-table-column
						label="Id"
						width="180">
					<template scope="scope">
						<span  class="cell-edit-input"  ><el-input v-model="scope.row.id"   ></el-input></span>
					</template>
				</el-table-column>


				<el-table-column
						label="Ip"
						width="180">
					<template scope="scope">
						<span  class="cell-edit-input"  ><el-input v-model="scope.row.ip"   ></el-input></span>
					</template>
				</el-table-column>

				<el-table-column
						label="Port"
						width="180">
					<template scope="scope">
						<span  class="cell-edit-input"  ><el-input v-model="scope.row.port"   ></el-input></span>
					</template>
				</el-table-column>



				<el-table-column
						label="主/从"
						width="180">
					<template scope="scope">
							<el-select v-model="scope.row.type"  placeholder="请选择项目" @click.native="" >
								<el-option
										v-for="item in jmeterMasterSlaveOptions"
										:label="item.label"
										:value="item.value">
								</el-option>

							</el-select>
					</template>
				</el-table-column>


				<el-table-column label="操作">
					<template scope="scope">
						<el-button
								size="small"
								@click="handleJmeterConfigCheckStatus(scope.$index,scope.row)">查看状态</el-button>
						<el-button
								size="small"
								@click="handleJmeterConfigSave(scope.$index,scope.row)">保存</el-button>
						<el-button
								size="small"
								@click="handleJmeterConfigAdd(scope.$index,scope.row)">添加</el-button>

						<el-button
								size="small"
								type="danger"
								@click="handleJmeterConfigDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</section>
</template>
<script>
	import { jmeterMasterSlaveConfigAddApi,getAllMasterSlaveConfigApi } from '../../api/api';
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {

				jmeterMasterSlaveOptions: [{
					value: 'slave',
					label: 'Slave'
				}, {
					value: 'master',
					label: 'Master'
				}],
				HostConfigSeen:true,
				jmeterConfigTableData:[{ip:"",port:"",id:"",type:""}],
				filters: {
					name: ''
				},
				loading: false,

			}
		},
		methods: {

			handleJmeterConfigAdd(index,row){

				this.jmeterConfigTableData.push({ip:"",port:""});

			},
			handleJmeterConfigDelete(index,row){
				this.jmeterConfigTableData.splice(index,1);
			},
			environmentConfigFormSubmit(){

			},
			handleJmeterConfigCheckStatus(index,row){

			},
			handleJmeterConfigSave(index,row){
				this.loading = true;
				let para = {ip:row.ip,port:row.port,id:row.id,type:row.type};
				alert(JSON.stringify(para));
				jmeterMasterSlaveConfigAddApi(para).then((res) => {
					this.loading = false;

				});
			},

			getAllJmeterConfig(){
				this.loading = true;
				let para = {};
				getAllMasterSlaveConfigApi(para).then((res) => {
					this.jmeterConfigTableData = res.data;
					this.loading = false;

				});
			}

		},
		mounted() {
			this.getAllJmeterConfig();
		}
	};

</script>

<style scoped>

</style>