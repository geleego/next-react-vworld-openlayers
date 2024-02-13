import { useState, useEffect } from 'react';
import { Tile } from 'ol/layer';
import { XYZ } from 'ol/source';

// worldview api key
const API_KEY = process.env.VWORLD_KEY;
// worldview map-theme info
const vWorldInfo = {
    satellite: { layer: 'Satellite', format: 'jpeg', zIndex: 0 },
    base: { layer: 'Base', format: 'png', zIndex: 0 },
    gray: { layer: 'gray', format: 'png', zIndex: 0 },
    midnight: { layer: 'midnight', format: 'png', zIndex: 0 },
    hybrid: { layer: 'Hybrid', format: 'png', zIndex: 1 }
};

/**
 * create WorldView Layers
 * @param {string} name 레이어명 
 * @param {string} theme 테마명 (wVorldInfo 변수의 키값)
 * @param {boolean} visible 가시화 여부
 * @param {string} type 레이어 타입; 기본값: basemap
 */
export const createVWLayer = (name, theme, visible=false, type='basemap') => {
    const url = `http://api.vworld.kr/req/wmts/1.0.0/${API_KEY}/${vWorldInfo[theme]['layer']}/{z}/{y}/{x}.${vWorldInfo[theme]['format']}`;
    const layer = new Tile({
    opacity: 1,
    source: new XYZ({
        url,
    }),
    name,
    viewKey: name,
    themeType: theme,
    key: 'vworld',
    type: type,
    visible,
    zIndex: vWorldInfo[theme]['zIndex']
    });

    return layer;
}

/**
 * BaseMap Module
 * @param {*} props 
 */
const BaseMap = ({map}) => {
    const [base, setBase] = useState('base');
    const [hybrid, setHybrid] = useState(false);
    useEffect(() => {
        if (map) {
            map.addLayer(createVWLayer('base', 'base', true));
        }
    }, []);
    /**
     * 베이스맵 theme 변경
     * @param {string} vwInfo 
     */
    const onClick = (vwInfo) => {
        setBase(vwInfo);
        let isLayer;
        let otherLayer;
        map.getLayers().forEach( l => {
            if (l.get('key') === 'vworld' && l.get('themeType') !== 'hybrid') {
                if (l.get('themeType') !== vwInfo) {
                    otherLayer = l;
                } else {
                    isLayer = l;
                }
            }
        });
        if (isLayer) {
            isLayer.setVisible(true);
            if (otherLayer) {
                otherLayer.setVisible(false);
            }
        } else {
            map.addLayer(createVWLayer(vwInfo, vwInfo, true));
            if (otherLayer) {
                otherLayer.setVisible(false);
            }
        }
    }
    const onAdd = () => {
        let isLayer;
        const show = !hybrid;
        map.getLayers().forEach( l => {
            if ( l.get('themeType') === 'hybrid') {
                isLayer = l;
            }
        });
        if (isLayer) {
            isLayer.setVisible(show);
        } else {
            map.addLayer(createVWLayer('hybrid', 'hybrid', show));
        }
        setHybrid(!hybrid);
    }
    return (
        <React.Fragment>
            <MapWidget >
                <a className={base === 'base' ? 'active' : ''} onClick={e => onClick('base')}>기본지도</a>
                <a className={base === 'satellite' ? 'active' : ''} onClick={e => onClick('satellite')}>위성지도</a>
                <a className={hybrid ? 'active' : ''} onClick={onAdd}>하이브리드</a>
            </MapWidget>
        </React.Fragment>
    );
}

export default BaseMap;