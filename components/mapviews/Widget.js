import { useState, useEffect, useRef } from 'react';
import { AppstoreOutlined } from '@ant-design/icons';

const Widget = ({ map, selectedKey, onLayer}) => {
    const [ layer, setLayer ] = useState({
        'vec-aid': true
    });
    const [ popup, setPopup ] = useState(null);

    /**
     * 위젯 토글 버튼
     */
    const onPopup = () => {
        if(popup) {
            setPopup(null);
        } else {
            setPopup('Activation');
        }
    };

    /**
     * 레이어 활성화에 따라 위젯 변경
     */
    const reLayers = () => {
        const ly = {...layer};
        map.getLayers().forEach( l => {
            const vecLayer = l.get('viewKey').split('-')[0];
            if (vecLayer === 'vec') {
                ly[l.get('viewKey')] = l.getVisible();
            }
        });
        setLayer(ly);
    }
    useEffect(() => {
        reLayers();
    }, [map]);

    useEffect(() => {
        setTimeout(() => {
            reLayers();
            onLayer(layer);
        }, 100);
    }, [selectedKey]);
    
    const widgetData = [
        { key: '100', title: '', sub: [
            { key: '110', icon: <></>, layer: 'vec-100-a', title: '100-a' },
            { key: '120', icon: <></>, layer: 'vec-100-b', title: '100-b' },
            { key: '130', icon: <></>, layer: 'vec-100-c', title: '100-c' },
        ]},
        { key: '200', title: '', sub: [
            { key: '210', icon: <></>, layer: 'vec-200-a', title: '200-a' },
            { key: '220', icon: <></>, layer: 'vec-200-b', title: '200-b' },
            { key: '230', icon: <></>, layer: 'vec-200-c', title: '200-c' },
        ]},
        { key: '300', title: '', sub: [
            { key: '310', icon: <></>, layer: 'vec-300-a', title: '300-a' },
            { key: '320', icon: <></>, layer: 'vec-300-b', title: '300-b' },
            { key: '330', icon: <></>, layer: 'vec-300-c', title: '300-c' },
        ]},
    ];

    /**
     * 위젯 클릭 시 레이어 토글
     * @param {string} target 
     */
    const toggleLayer = (target) => {
        const ly = {...layer};
        ly[target] = !ly[target];
        setLayer(ly);
        onLayer(ly);
        let isLayer;
        map.getLayers().forEach( l => {
            if (l.get('viewKey') === target) {
                isLayer = l;
            }
        });
        if (isLayer) {
            isLayer.setVisible(ly[target]);
        }
    };

    /**
     * 위젯 클릭 시 레이어 토글
     * @param {object} obj 
     */
    const onClick = (obj) => {
        toggleLayer(obj['layer']);
    };

    return (
        <React.Fragment>
            <MapWidget>
                <AppstoreOutlined onClick={onPopup} />
            </MapWidget>
            {popup &&
                <WidgetPopup>
                    { widgetData.map ( widget => {
                        return (
                            <section key={widget.key}>
                                <strong>{widget.title}</strong>
                                <ul>
                                    { widget.sub.map ( w => {
                                        return (
                                            <li
                                                key={w.key}
                                                layer={w.layer}
                                                onClick={e => onClick(w)}
                                                className={layer[w.layer] ? 'active' : ''}
                                            >
                                                <a>
                                                    {w.icon}
                                                    <p>{w.title}</p>
                                                </a>
                                            </li>
                                        );
                                    } ) }
                                </ul>
                            </section>
                        );
                    } ) }
                </WidgetPopup>
            }
        </React.Fragment>
    );
};

export default Widget;