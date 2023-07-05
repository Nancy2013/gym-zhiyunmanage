import { defineComponent, reactive, toRefs, ref } from "vue";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import { tableColumns } from './config'
import { isEmpty } from '@/utils/common'
import { createAMap, checkLat, checkLng } from '@/utils/map'
import { antiFakeTemplateAuditStatusOptions, antiFakeTemplateTypeOptions } from '@/utils/config'
import mapIcon from '@/assets/image/main/antiFake/record/map_icon.png'
import dayjs from 'dayjs'


export default defineComponent({
	setup() {

		const state = reactive({
			columns: tableColumns,
			query: {
				dates: []
			} as any,
			visible: false,
			dataSource: [],
			loading: false,
			pagination: {
				total: 0,
				current: 1,
				pageSize: 10,
			},
			tabIndex: 0,
			mapObj: null as any
		})

		let markerClusterer: any = null, markers: any[] = [], markercc: any[] = [], numflag = 0, refreshflag = false, buslicdatas_show: any = [], cachep = 0, infoWindow: any = null

		/**
		 * 获取表格数据
		 * @param
		 * @return
		 */
		const getTableList = async () => {
			state.loading = true;
			let { pagination: { current, pageSize }, query: { idisCode, dates } } = state;
			const params: any = {
				pageNum: current,
				pageSize,
				idisCode
			}
			if (!isEmpty(dates)) {
				params.beginTime = dayjs(dates[0]).format('YYYY-MM-DD')
				params.endTime = dayjs(dates[1]).format('YYYY-MM-DD')
			}
			let res: any = await request({
				url: import.meta.env.VITE_NODE_URL + "/checkCode/record",
				type: "json",
				method: "post",
				data: params,
			});
			if (res.code == 200) {
				state.loading = false;
				state.dataSource = res.rows.map((item: any, key: number) => {
					item.tableIndex = (current - 1) * pageSize + key + 1
					return item
				});
				state.pagination = {
					total: res.total,
					current,
					pageSize,
				};
			} else {
				state.loading = false;
			}
		}


		/**
		 * 初始化地图
		 * @param
		 * @return
		 */
		const initMap = () => {
			createAMap().then(() => {
				const AMap = (window as any).AMap
				state.mapObj = new AMap.Map('container', {
					//center: [116.397428, 39.90923],//地图中心点
					//mapStyle: 'amap://styles/blue', //设置地图的显示样式
					viewMode: '3D',//使用3D视图
					zoom: 4 //地图显示的缩放级别
				})
				let geolocation = null, geocoder = null
				// 加载定位插件
				state.mapObj.plugin('AMap.Geolocation', function () {
					// 初始化定位插件
					geolocation = new AMap.Geolocation({
						enableHighAccuracy: true, // 是否使用高精度定位，默认:true
						timeout: 10000, // 超过10秒后停止定位，默认：无穷大
						maximumAge: 0, // 定位结果缓存0毫秒，默认：0
						convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
						showButton: false, // 显示定位按钮，默认：true
						buttonPosition: 'LB', // 定位按钮停靠位置，默认：'LB'，左下角
						buttonOffset: new AMap.Pixel(20, 50), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10,20)
						showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
						showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
						panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
						zoomToAccuracy: true
						// 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
					});
					// 把定位插件加入地图实例
					//map.addControl(geolocation);

					// 添加地图全局定位事件
					// AMap.event.addListener(geolocation, 'complete',
					//onComplete); // 返回定位信息
					//AMap.event.addListener(geolocation, 'error', onError); // 返回定位出错信息
					console.log(geolocation)
					// 调用定位
					geolocation.getCurrentPosition();
				});
				if (markerClusterer) {
					markerClusterer.setMap(null);
				}
				state.mapObj.plugin(["AMap.MarkerClusterer"], function () {
					markerClusterer = new AMap.MarkerClusterer(state.mapObj, markers, {
						gridSize: 110,
						maxZoom: 13,
						minClusterSize: 10
						//设置最小聚合
					});
				});
			})
		}

		initMap()

		/**
		 * 获取热力数据
		 * @param
		 * @return
		 */
		const getThermalMapData = async () => {
			let { query: { idisCode, dates } } = state;
			const params: any = {
				idisCode
			}
			if (!isEmpty(dates)) {
				params.beginTime = dayjs(dates[0]).format('YYYY-MM-DD')
				params.endTime = dayjs(dates[1]).format('YYYY-MM-DD')
			}

			let res: any = await request({
				url: import.meta.env.VITE_NODE_URL + "/checkCode/getCheckLngLat",
				type: "json",
				method: "post",
				data: params,
			});
			changePoints(res.data)

		}

		getTableList()

		getThermalMapData()

		/**
		 * 获取对象列表
		 * @param
		 * @return
		 */
		const handleSearch = () => {
			state.pagination.current = 1
			getTableList()
			state.mapObj.remove(markers)
			if (infoWindow.close && typeof infoWindow.close === 'function') {
				infoWindow.close()
			}
			markerClusterer.clearMarkers();
			getThermalMapData()
		}

		/**
		 * 
		 * @param
		 * @return
		 */
		const changePoints = (res: any[]) => {
			createAMap().then((AMap) => {
				refreshflag = true;
				var pointstr = '';
				buslicdatas_show = [];
				numflag = 0;
				for (var i = (numflag * 99999999); i < res.length && i < ((numflag + 1) * 99999999); i++) { //分组解析
					//...toInsertDb
					if (!checkLng(res[i].accessLongitude) && !checkLat(res[i].accessLatitude)) {
						buslicdatas_show.push({
							'lng': res[i].accessLongitude,
							'lat': res[i].accessLatitude,
							'id': res[i].id
						});
						continue;
					}
					if (checkLng(res[i].accessLongitude) || checkLat(res[i].accessLatitude)) {
						//console.log("污点:" + nullpointer++);//无效的经纬度为污点
						continue;
					}
					//将其他坐标转换成高德坐标
					pointstr += res[i].accessLongitude + "," + res[i].accessLatitude + "|";
					buslicdatas_show.push(res[i]);

				}
				//处理缓存点
				cachep += buslicdatas_show.length;

				if (pointstr != '') {
					pointstr = pointstr.substring(0, pointstr.length - 1);
					numflag++;
					//changePosition(pointstr);
					console.log(pointstr)
					AMap.convertFrom(pointstr, 'gps', function (status: string, result: any) {
						console.log(result)
						if ("complete" == status) {
							positionFormat(result);
						}
					});
				} else {
					dealResult(buslicdatas_show);
					numflag++;
					if ((numflag * 99999999) < res.length) {
						changePoints(res);
					}
				}
			})
		}

		/**
		 * 格式化点位
		 * @param
		 * @return
		 */
		const positionFormat = (res: any) => {
			console.log(res)
			//用来获取id
			var getDate = res.locations
			for (var i = 0; i < getDate.length; i++) {
				var positions = {
					'lng': getDate[i].lng,
					'lat': getDate[i].lat,
					'id': getDate[i].id
				};
				buslicdatas_show.push(positions);
			}
			dealResult(buslicdatas_show);
		}

		/**
		 * 地图打点
		 * @param
		 * @return
		 */
		const dealResult = (ress: any) => {
			createAMap().then((AMap) => {
				markercc = [];
				for (var i = 0; i < ress.length; i++) {
					var tem = ress[i];
					var pointMarker = new AMap.Marker({
						position: [tem.lng, tem.lat],
						icon: new AMap.Icon({
							image: mapIcon,
							imageSize: new AMap.Size(20, 32),
						}),
						offset: new AMap.Pixel(-13, -6.5)
					});

					pointMarker.lng = tem.lng
					pointMarker.lat = tem.lat
					pointMarker.id = tem.id
					pointMarker.setRotation(tem.direction)
					markercc.push(pointMarker);
					pointMarker.on('click', onMarkerClick);
					// XXX 后续功能还要测试
					//state.mapObj.add(markercc)
				}
				markerClusterer.addMarkers(markercc);
			})
		}

		/**
		 * 根据id获取码的相关信息
		 * @param
		 * @return
		 */
		const onMarkerClick = async (e: any) => {
			console.log(e.target)
			const { id, lng, lat } = e.target
			let res: any = await request({
				url: import.meta.env.VITE_NODE_URL + "/checkCode/getCheckCodeRecordInfo",
				params: {
					id: id
				},
			});
			createAMap().then((AMap) => {
				var address;
				var lnglat = [e.target.lng, e.target.lat]
				request({
					url: 'https://restapi.amap.com/v3/geocode/regeo',
					params: {
						key: 'f751aff38707f53f57b61405db8abf0a',
						location: `${lng},${lat}`,
						radius: 50
					},
					notToken: true,
					notCheck: true
				}).then((result) => {
					console.log(result)
					address = result.regeocode.formattedAddress;
					// $('#address').html("<font color='red' size='3'>&nbsp;&nbsp;&nbsp;当前位置：" + address + "</font>");
					// 信息窗体的内容
					var codeInfo = res.data;
					console.log(codeInfo)
					var content = ["<div style=\"width: 350px;height: 180px;background: white;"
						+ "border: 1px solid #cdcdcd; font-size: 13px; box-shadow: 0 2px 2px rgba(0,0,0,.30); border-radius: 3px;\">"
						+ "<div style=\"margin-left: 5px; margin-top:3px; color: #2c2c2c \">"
						+ "<img id = 'closeWwww' src=\"https://webapi.amap.com/images/close2.gif\"  style=\"position: absolute;right: 5px;top: 5px;\">"
						+ "</div>"
						+ "<table style=\"margin-left: 20px;margin-top: 18px;table-layout:fixed ;width: 320px;\" class=\"infoView\">"
						// + "<tr><th width='80px'>产品名称：</th><td>" + formatStr(codeInfo.productName)
						// + "</td></tr> "
						+ "<tr><th width='80px'>工业标识：</th><td style ='white-space: nowrap;text-overflow:ellipsis;overflow:hidden;'>"
						+ formatStr(codeInfo.idisCode)
						+ "</td></tr>"
						// + "<tr><th width='80px'>产品编码：</th><td>" + formatStr(codeInfo.productNo)
						// + "</td></tr>"
						// + "<tr><th width='80px'>批次编码：</th><td>" + formatStr(codeInfo.batchNo)
						// + "</td></tr>"
						+ "<tr><th width='80px'>微信昵称：</th><td>" + formatStr(codeInfo.wxNickName)
						+ "</td></tr>"
						+ "<tr><th width='80px'>防伪码：</th><td>" + formatStr(codeInfo.checkCode)
						+ "</td></tr>"
						+ "<tr><th width='80px'>查验地点：</th><td>" + formatStr(codeInfo.accessAddress)
						+ "</td></tr>"
						+ "<tr><th width='80px'>查验时间：</th><td>" + formatStr(codeInfo.createdTime)
						+ "</td></tr>"
						+ "</table></div></div>"];

					// 实现自定义窗体内容，返回拼接后的字符串
					function createInfoWindow(title: any, content: any) {
						// 内容拼接 ...
						return content;
					}

					var position = new AMap.LngLat(e.target.lng, e.target.lat);
					// 创建 infoWindow 实例
					infoWindow = new AMap.InfoWindow({
						isCustom: true, //使用自定义窗体
						content: createInfoWindow("gaga", content.join("<br>")), //传入 dom 对象，或者 html 字符串
						offset: new AMap.Pixel(4, -15)
					});
					infoWindow.open(state.mapObj, position);
					setTimeout(() => {
						console.log(document.getElementById('closeWwww'));
						(document.getElementById('closeWwww') as any).onclick = () => {
							infoWindow.close()
						}
					}, 200)
					
				})
			})
		}

		/**
		 * 字符型判空赋值
		 * @param { String } str 待格式化的字符串
		 * @return { String } 格式化后的字符串
		 */
		const formatStr = (str: string) => {
			if (str == null || str == undefined || str == 'undefined') {
				return '';
			}
			return str;
		}

		/**
		 * 列表重置
		 * @return
		 */
		const reset = () => {
			state.query = {};
			getTableList()
		};

		/**
		 * 分页查询
		 * @param { Object } pagination
		 * @return
		 */
		const paginationChange = (pagination: any) => {
			let { current, pageSize, total } = pagination;
			state.pagination = { current, pageSize, total };
			getTableList()
		};

		/**
		 * 处理tab项改变事件
		 * @param { Event } event 事件参数
		 * @return
		 */
		const handleChangeTab = (event: any) => {
			// const tabIndex = event.target.value
			// if (tabIndex == 1 && !state.mapObj) {
			// 	initMap()
			// }
			// const tabIndex = event.target.value
			// if (tabIndex == 0) {
			// 	state.pagination.current = 1
			// 	getTableList()
			// } else if (tabIndex == 1) {
			// 	getThermalMapData()
			// }
		}



		return {
			...toRefs(state),
			handleSearch,
			reset,
			handleChangeTab,
			paginationChange,
			antiFakeTemplateTypeOptions,
			antiFakeTemplateAuditStatusOptions
		}
	}
})
