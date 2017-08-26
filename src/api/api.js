import axios from 'axios';

//let base = '';
var base = 'http://localhost:8011'
//var base = 'http://192.168.3.80:8011'

const API = {
    getAbCategory: `${base}/testcase/category/html`,
    getAbActivities: `${base}/abtest/activities`,
    addAb: `${base}/testcase/add`,
    getAbList: `${base}/abtest/list`,
    deleteAb: `${base}/abtest/delete`,
    onlineAb: `${base}/abtest/online`,
    getAbDetail: `${base}/abtest/detail`,
    login: `${base}/login`,
    getTestCaseByPage: `${base}/testcase/getTestCaseListPage`,
    addtest: `${base}/testcase/addTestCase`,
    edittest: `${base}/testcase/addTestCase`,
    getproject: `${base}/code/getAllProjectsList`,
    getprojectModule:`${base}/code/getAllProjectsModuleList`,
    getAllUser:`${base}/user/getAllUserList`,
    getTargetTestcase:`${base}/testcase/getTargetTestcaseList`,
    runonecase:`${base}/testcase/runSelectedCase`,
    runhistory:`${base}/history/getRunHistoryList`,
    runresultdetail:`${base}/testcase/getRunResultDetail`,
    downloadCsv:`${base}/download`,
    addenvironmentConfig:`${base}/config/addenvironmentConfig`,
    getenvironmentConfig:`${base}/config/getenvironmentConfig`,
    batchruntestcase:`${base}/testcase/batchRunTestCase`,
    getTestCaseNameAndId:`${base}/testcase/getAllTestCaseNameAndId`,
    addScenario:`${base}/scenario/addScenario`,
    getAllScenario:`${base}/scenario/getAllScenario`,
    batchRunScenario:`${base}/scenario/batchRunScenario`,
    jmeterMasterSlaveConfigAdd:`${base}/jmeter/jmeterMasterSlaveConfigAdd`,
    getAllMasterSlaveConfig:`${base}/jmeter/getAllMasterSlaveConfig`,
    getTestCaseByScenarioId:`${base}/testcase/getTestCaseByScenarioId`,
    getTargetScenariosData:`${base}/scenario/getTreeScenarioInfo`,




}

export const requestLogin = params => { return axios.post(API.login, params).then(res => res.data); };

export const getTargetTestcaseList = params => { return axios.post(API.getTargetTestcase, params); };

export const getTestCaseListPage = params => { return axios.post(API.getTestCaseByPage, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editTestCase = params => { return axios.get(API.edittest, params); };

export const getAllProjectsList = params => { return axios.post(API.getproject, params); };

export const getAllProjectsModuleList = params => { return axios.post(API.getprojectModule, params); };

export const getAllUserList = params => { return axios.post(API.getAllUser, params); };

export const getRunHistoryList = params => { return axios.post(API.runhistory, params); };

export const downloadCsvFileApi = params => { return axios.post(API.downloadCsv, params); };

export const addenvironmentConfigApi = params => { return axios.post(API.addenvironmentConfig, params); };

export const getEnvironmentConfigApi = params => { return axios.post(API.getenvironmentConfig, params); };

export const batchRunTestCaseApi = params => { return axios.post(API.batchruntestcase, params); };

export const getAllTestCaseNameAndIdApi = params => { return axios.post(API.getTestCaseNameAndId, params); };

export const addScenarioApi = params => { return axios.post(API.addScenario, params); };

export const getAllScenarioApi = params => { return axios.post(API.getAllScenario, params); };

export const batchRunScenarioApi = params => { return axios.post(API.batchRunScenario, params); };

export const jmeterMasterSlaveConfigAddApi = params => { return axios.post(API.jmeterMasterSlaveConfigAdd, params); };

export const getAllMasterSlaveConfigApi = params => { return axios.post(API.getAllMasterSlaveConfig, params); };

export const getTestCaseByScenarioIdApi = params => { return axios.post(API.getTestCaseByScenarioId, params); };

export const addTreeScenarioApi = params => { return axios.post(API.addTreeScenario, params); };

export const getTargetScenariosDataApi = params => { return axios.post(API.getTargetScenariosData, params); };


//

//export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };
//export const addTestCase = params => { return axios.post(API.addtest, { params: params }); };
export const addTestCase = params => { return axios.post(API.addtest, params); };

export const runSelectedCase = params => { return axios.post(API.runonecase, params); };

export const runResultDetailApi = params => { return axios.post(API.runresultdetail, params); };

export const getTestcasePieChart = params => { return axios.get(`${base}/user/getTestcasePieChart`, { params: params }); };

export const getTestcaseIncreLineChart = params => { return axios.get(`${base}/user/getTestcaseIncreLineChart`, { params: params }); };

export const getTestcaseByOnePersonColumnChart = params => { return axios.get(`${base}/user/getTestcaseByOnePersonColumnChart`, { params: params }); };