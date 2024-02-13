import dynamic from 'next/dynamic';
import Headers from '../components/commons/Headers';

const MapView = dynamic(() => import('../components/mapviews/Maps'), {ssr: false});

const Map = () => {
  return (
    <>
      <Headers />
      <MapView proj={'EPSG:4326'} />
    </>
  );
};
export default Map;