import { ImageWMS } from "ol/source";
import { Overlay } from "ol";

export default class CommonFn {
    /**
    * map에 존재하는 레이어 찾기
    * @param {string} key 
    * @param {string|*} val 
    * @return {object|undefined}
    */
    static findLayer = (map, key, val) => {
        return map.getLayers().getArray().find( l => l.get(key) === val );
    }

    /**
    * map에 존재하는 모든 레이어 찾기
    * @param {string} key 
    * @param {string|*} val 
    * @return {object|undefined}
    */
    static allFindLayer = (map, key, val) => {
        return map.getLayers().getArray().filter( l => l.get(key) === val );
    }

    /**
    * map에 존재하는 레이어 그룹 찾기
    * @param {string} key 
    * @param {string|*} val 
    * @return {object|undefined}
    */
   static findLayerGroup = (map, key, val) => {
        return map.getLayerGroup().getLayersArray().find( l => l.get(key) === val);
    }

   /**
     * 줌 레벨에 따른 해상도 설정
     * @param {number} zoomLevel
     * @param {string|number} type epsg number
     * @return {number}
     */
    static getRes = (zoomLevel, type) => {
        let res = 0;
        const resolutions = setProjResolution(type);
        res = resolutions[Math.round(zoomLevel)];

        return res;
    }

    /**
     * wms source 생성
     * @param {string} url
     * @param {string} layer
     * @param {string} srs
     * @param {object|undefined} params
     * @return {ol.source.ImageWMS}
     */
    static getWms = (url, layers, srs='EPSG:4326', params=undefined) => {
        return new ImageWMS({
            url,
            params: {
                layers,
                srs,
                format: 'image/png',
                ...params
            },
            projection: 'EPSG:3857'
        });
    }


    /**
     * overlayer 생성
     */
    static addOverlay = (element='', id='vec-overlay') => {
        return new Overlay({
            element,
            positioning: 'bottom-center',
            autoPan: true,
            autoPanAnimation: {
                duration: 250,
            },
            autoPanMargin: 100,
            id
        });
    }

    /**
     * 좌표별 해상도 계산
     * @param {string|number} type 
     * @param {number} max 
     * @param {number} min 
     * @return {Array<number}
     */
    static setProjResolution = (type, max=22, min=0) => {
        const startResolution = getWidth(getProj(`EPSG:${type}`).getExtent()) / 256;
        const resolutions = new Array(max);
        for (let i = min; i < resolutions.length; ++i) {
            resolutions[i] = startResolution / Math.pow(2, i + 1);
        }
    
        return resolutions;
    }

    /**
     * 레이어 타입별 zindex 제어
     * @param {string} type 
     * @return {number}
     */
    static setZIndex = (type) => {
        const zIndex = {
            basemap: 1,
            basevec: 2,
            line: 3,
            point: 4,
            icon: 5,
            select: 10,
            draw: 11
        };

        return +zIndex[type];
    }
}





