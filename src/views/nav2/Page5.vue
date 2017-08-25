<template>
	<div id="log-container" style="height: 100%; overflow-y: scroll; background: #333; color: #aaa; padding: 10px;" >
		<div>
		</div>
	</div>
</template>
<script src="//cdn.bootcss.com/jquery/2.1.4/jquery.js"></script>
<script>
	import $ from 'jquery'

	export default {
		data() {

			return {

				arrData:[],

			}
		},

		methods: {

			getTestCaseByPage(){
				var websocket = new WebSocket('ws://localhost:8011/log');
				//var websocket = new WebSocket('ws://192.168.3.80:8011/log');
				websocket.onmessage = function(event) {


					// 接收服务端的实时日志并添加到HTML页面中
					$("#log-container div").append(event.data);
					// 滚动条滚动到最低部
					$("#log-container").scrollTop($("#log-container div").height() - $("#log-container").height());
				};
			}

		},
		mounted() {
			this.getTestCaseByPage();
		}
	};
</script>