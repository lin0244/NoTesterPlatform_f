<template>
  <div>
    <el-collapse v-model="activeNames" @change="handleChange">

        <div id="apppp" >

                  <el-collapse-item :title="data.titleName"  v-for="data in runHistoryData" >
                    <el-table
                        ref="multipleTable"
                        :data="data.data"
                        height="250"
                        border
                        tooltip-effect="dark"
                        >

                        <el-table-column prop="testCaseId" width="100" label="用例编号">
                        </el-table-column>


                        <el-table-column prop="testcase" label="用例名称" width="200" sortable>
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




                        <el-table-column prop="runResult" label="运行结果" min-width="120" :formatter="formatRunResult" sortable>
                        </el-table-column>




                        <el-table-column label="操作" width="500">
                            <template scope="scope">
                                <el-button size="small" @click="runSelectedCaseOuter(scope.$index, scope.row)">再次执行</el-button>

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
                  </el-collapse-item>


        </div>




    </el-collapse>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { mapActions } from 'vuex'
  import { getRunHistoryList } from '../../api/api';


  export default {

      data() {
            return {
              activeNames: ['1'],
              runHistoryData: []
            };
          },


    methods: {

        //性别显示转换
        formatRunResult: function (row, column) {
            return (row.runResult == true) ? '通过' :  '不通过';
        },

        getRunHistory(){

            let para = {};
            getRunHistoryList(para).then((res) => {
            this.listLoading = false;
            this.runHistoryData = res.data ;
            });

        },

        handleHeaderAdd(index,row){

            alert("index:"+index);
            alert("row:"+JSON.stringify(row));
        }

    },
    mounted() {
    			this.getRunHistory();
    		}
  }

</script>