import AMapLoader from '@amap/amap-jsapi-loader';

export interface createAMapParams {
	key: string
	version?: string
	plugins?: string[]
}

export const createAMap = (): Promise<any> => {
	return new Promise((resolve, reject) => {
		if ((window as any).AMap) {
			resolve((window as any).AMap)
		} else {
			AMapLoader.load({
				"key": "05274b363af7cb9cbeb61009e0cf6c7a",              // 申请好的Web端开发者Key，首次调用 load 时必填
				"version": "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
				"plugins": ["AMap.DistrictSearch", "AMap.Geolocation", "AMap.MarkerClusterer", "AMap.Geocoder"],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
			}).then((AMap) => {
				resolve(AMap)
			}).catch((err) => {
				reject(err)
			})
		}

	})
}

/**
 判断纬度是否在中国境内
 @param { Object } record 表格行数据
 @return
 */
export const checkLat = (lat: any) => {
	if (0 == lat || lat == null || lat == "" || lat == "null") {
		return true;
	}
	if (lat > 53 || lat < 3) {
		return true;
	}
	return false;
}

/**
 判断纬度是否在中国境内
 @param { Object } record 表格行数据
 @return
 */
export const checkLng = (lng: any) => {
	if (0 == lng || lng == null || lng == "" || lng == "null") {
		return true;
	}
	if (lng > 135 || lng < 73) {
		return true;
	}
	return false;
}

