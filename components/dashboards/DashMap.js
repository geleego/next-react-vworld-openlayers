import { useRef, useEffect, useState } from "react";
import { Map, View } from "ol";
import { defaults as defaultControls } from 'ol/control';
import { WKT } from 'ol/format';
import { Image, Vector, Group as LayerGroup } from "ol/layer";
import { Style, Stroke, Fill, Text } from "ol/style";
import VectorSource from "ol/source/Vector";
import useWindowSize from "../commons/useWindowSize";
import CommonFn from "../commons/maps/CommonFn";
import { getAPIData, cancel } from "../../lib/api";

const view = new View({
    center:  [14379290.309896348, 4236927.674031626],
    zoom: 12,
    minZoom: 11,
    extent: [14355212.645986518, 4204136.188897286, 14403367.973806178, 4269719.159165967]
});

const map = new Map({
    controls: defaultControls({
        attribution: false,
        zoom: false
    }),
    layers: [
        createVWLayer('dash-base', 'gray', true)
    ],
    view
});

const DashMap = ({propRegion, resizeTarget, onChange, onChangeResize}) => {
    const mapRef = useRef(undefined);
    const [region, setRegion] = useState(propRegion);
    const [data, setData] = useState();
    let hovered = undefined;
    let selected = undefined;
    /**
     * 마우스오버 스타일
     */
    const highlightStyle = (feature) => {
        return new Style({
            fill: new Fill({
                color: 'rgba(24, 144, 255, 0)'
            }),
            stroke: new Stroke({
                color: '#fff',
                width: 3
            }),
            text: new Text({
                font: '15px',
                fill: new Fill({
                    color: '#3d3d3d'
                  }),
                stroke: new Stroke({
                    color: 'white',
                    width: 3
                }),
                overflow: true,
                text: `${feature.get('region')}`
            })
        })
    };
    const selectStyle = (feature) => {
        return new Style({
            fill: new Fill({
                color: 'rgba(24, 144, 255, 0.1)'
            }),
            stroke: new Stroke({
                color: 'rgba(24, 144, 255, 1)',
                width: 3
            }),
            text: new Text({
                font: '15px bold',
                fill: new Fill({
                    color: 'rgb(24, 144, 255)'
                  }),
                stroke: new Stroke({
                    color: 'white',
                    width: 2
                }),
                overflow: true,
                text: `${feature.get('region')}`
            })
        })
    };
    const selectedLayer = new Vector({
        source: new VectorSource(),
        name: 'selected',
        zIndex: CommonFn.setZIndex('select'),
        style: selectStyle
    })
    useEffect(() => {
        map.setTarget(mapRef.current);
        map.on(['click', 'pointermove'], e => {
            if (e.type === 'pointermove') {
                if (hovered !== void 0) {
                    hovered.setStyle(undefined);
                    hovered = undefined;
                }

                map.forEachFeatureAtPixel(e.pixel, f => {
                    hovered = f;
                    f.setStyle(highlightStyle);
                    return true;
                });
            }
            if (e.type === 'click') {
                let selectLayer = CommonFn.findLayer(map, 'name', 'selected');
                if (!selectLayer) {
                    map.addLayer(selectedLayer);
                    selectLayer = selectedLayer;
                }
                selectLayer.getSource().clear();
                selected = map.forEachFeatureAtPixel(e.pixel, f => f);
                
                if (selected) {
                    selectLayer.getSource().addFeature(selected);
                    onChange(selected.get('region_cd'));
                }
            }
        });
    }, [mapRef.current]);

    useEffect(() => {
        setRegion(propRegion);
        let isLayer = CommonFn.findLayer(map, 'name', 'base_adminarea');
        let selectLayer = CommonFn.findLayer(map, 'name', 'selected');

        if(isLayer) {
            if (!selectLayer) {
                map.addLayer(selectedLayer);
                selectLayer = selectedLayer;
            }
            selectLayer.getSource().clear();
            const vector = isLayer.getLayersArray().find( l => l instanceof Vector);
            const feature = vector.getSource().getFeatures().find( f => f.get('region_cd') === propRegion);
            if (feature) {
                selectLayer.getSource().addFeature(feature);
            }
        }
    }, [propRegion]);
    /**
     * 벡터 스타일 (임시)
     * @param {ol.feature} feature 
     */
    const polygonStyleFunction = (feature) => {
        return new Style({
            stroke: new Stroke({
              color: 'rgb(24, 144, 255, 0)',
              width: 1
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0)'
            }),
          });
    }

    useEffect(() => {
        getAPIData('/api/region')
        .then( list => {
            if (list) {
                setData(list);
            }
        })
        .catch( e => {
            console.log('failed get region info :: ', e.message);
        })

        return () => {
            cancel();
            if (map) {
                let isLayer = CommonFn.findLayer(map, 'name', 'base_adminarea');
                if(isLayer) {
                    map.removeLayer(isLayer);
                }
            }
        }
    }, []);

    useEffect(() => {
        if (data) {
            let isLayer = CommonFn.findLayer(map, 'name', 'base_adminarea');
            const features = data.map( o => {
                const feature = new WKT().readFeature(o.wkt);
                feature.setProperties({...o});
                feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
                return feature;
            }) || [];

            if (!isLayer) {
                const geo_url = process.env.GEO_URL;
                const source = CommonFn.getWms(`${geo_url}/geoserver/wms`, '', 'EPSG:5181', { style: 'main_style' });
                const img = new Image({
                    source: source,
                    zIndex: CommonFn.setZIndex('basemap'),
                    type: ''
                })
                const vectorSource = new VectorSource({
                    features: []
                })
                if (features.length) {
                    vectorSource.addFeatures(features);
                }
                const vector = new Vector({
                    vectorSource,
                    declutter: true,
                    renderMode: 'image',
                    style: polygonStyleFunction,
                    zIndex: CommonFn.setZIndex('basevec')
                });
                const groupLayer = new LayerGroup({
                    layers: [img, vector],
                    zIndex: CommonFn.setZIndex('basevec'),
                    name: 'base_adminarea'
                })
                map.addLayer(groupLayer);
            }
        }
    }, [data]);


    useEffect(() => {
        if (resizeTarget === 'map') {
            map.updateSize();
            onChangeResize(false);
        }
    }, [resizeTarget]);
    
    const size = useWindowSize();
    useEffect(() => {
        map.updateSize();
    }, [size]);

    return (
        <MapLayout ref={mapRef} />
    );
};

export default DashMap;