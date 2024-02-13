import { useEffect, useState, useRef } from 'react';
import { Map, View } from 'ol';
import { defaults as defaultControls } from 'ol/control';
import { fromLonLat, get as getProj } from 'ol/proj';
import BaseMap from '../commons/maps/BaseMap';
import CenterPos from '../commons/maps/CenterPosition';
import Drawing from '../commons/maps/Drawing';
import MousePos from '../commons/maps/MousePosition';
import { scaleLine } from '../commons/maps/ScaleLine';
import { zoom } from '../commons/maps/ZoomSlider';
import Widget from './Widget';
import CommonFn from '../commons/maps/CommonFn';

const maps = new Map({
  controls: defaultControls({
    attribution: false,
    zoom: false,
  }).extend([scaleLine, zoom]),
  target: 'map',
  layers: [],
  view: new View({
    center: fromLonLat([126.9778222, 37.5664056]),
    zoom: 10,
    constrainOnlyCenter: true,
  }),
});

let ele = {};

/**
 * Webview Map Module
 * @param {*} props
 */
const Maps = (props) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(maps);
  const [selectedKey, setSelectedKey] = useState('110');
  const [layer, setLayer] = useState({});
  const [feature, setFeature] = useState();
  const [show, setShow] = useState();

  /**
   * openlayers map canvas 생성
   */
  useEffect(() => {
    map.setTarget(mapRef.current);
    window['map'] = map;

    let isOvrly = map.getOverlayById('vec-overlay');
    if (!isOvrly) {
      const ovrly = CommonFn.addOverlay();
      map.addOverlay(ovrly);
      isOvrly = ovrly;
    }
  }, [mapRef.current]);

  /**
   * 지도에서 선택한 피처에 대하여 overlay 처리
   * @param {*} pixel
   * @param {*} coordinate
   */
  const mapFeature = (pixel, coordinate) => {
    let isOvrly = map.getOverlayById('vec-overlay');
    if (!isOvrly) {
      const ovrly = CommonFn.addOverlay();
      map.addOverlay(ovrly);
      isOvrly = ovrly;
    }
    const feats = map.getFeaturesAtPixel(pixel, {
      layerFilter: (layer) => layer.get('type') === 'overlay',
    });
    if (!feats.length) {
      isOvrly.setPosition();
    } else {
      const eleRef = { ...ele };
      let feat = feats[0];
      if (feat.get('features').length) {
        // 클러스터인 경우
        feat = feat.get('features')[0];
      }
      const type = feat.get('featType');
      if (eleRef[type]) {
        isOvrly.setElement(eleRef[type]);
        isOvrly.setPosition(coordinate);
        setFeature(feat);
      }
    }
  };

  useEffect(() => {
    map.on('singleclick', (evt) => {
      if (evt.dragging) {
        return;
      }
      mapFeature(evt.pixel, evt.coordinate);
    });
  }, [map]);

  return (
    <>
      <MapLayout ref={mapRef}>
        {!!map && <BaseMap map={map} />}
        {!!map && <Widget map={map} selectedKey={selectedKey} onLayer={setLayer} />}
        {!!map && <CenterPos />}
      </MapLayout>
      {!!map && show && <Drawing map={map} />}
      {!!map && <MousePos map={map} />}
    </>
  );
};

export default Maps;
