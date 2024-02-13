import { useState } from 'react';
import { Tooltip, Select } from 'antd';
import Draw, { createBox } from 'ol/interaction/Draw';
import { Vector } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Stroke } from 'ol/style';
import CommonFn from './CommonFn';

/**
 * Drawing Module
 * @param {*} props 
 */
const Drawing = (props) => {
    const { map } = props;
    const [ draw, setDraw ] = useState();
    const [ drawing, setDrawing ] = useState(false);
    const source = new VectorSource({ wrapX: false });
    const { Option } = Select;

    /**
     * 그리기 스타일
     */
    const styleFunctions = () => {
        return new Style({
            fill: new Fill({
                color: 'rgba(255, 0, 0, 0.1)'
            }),
            stroke: new Stroke({
                color: 'rgba(255, 0, 0, 0.8)',
                width: 4
            })
        });
    };

    const drawLayer = new Vector({
        source,
        style: styleFunctions,
        name: 'draw',
        zIndex: CommonFn.setZIndex('draw'),
    });

    const addInteractions = (value) => {
        const drawer = new Draw({
            source,
            type: value,
            freehand: true,
            stopClick: true,
            name: 'draw',
        });
        setDraw(drawer);
        map.addInteraction(drawer);
    };

    const onChange = (value) => {
        const allLayer = CommonFn.allFindLayer(map, 'name', 'draw');
        map.removeInteraction(draw);

        if (value !== 'None' && value !== 'Clear' && value !== 'Box') {
            setDrawing(true);
            map.addLayer(drawLayer);
            addInteractions(value);
        }

        if (value === 'Box') {
            setDrawing(true);
            map.addLayer(drawLayer);
            
            const boxDrawer = new Draw({
                source,
                type: 'Circle',
                freehand: true,
                stopClick: true,
                geometryFunction: createBox(),
                name: 'draw',
            });
            setDraw(boxDrawer);
            map.addInteraction(boxDrawer);
        }

        if (value === 'Clear' && allLayer) {
            setDrawing(false);
            allLayer.map( t => {
                map.removeLayer(t);
            });
            map.removeLayer(drawLayer);
            map.removeInteraction(draw);
        }
    }

    return (
        <>
            <Tooltip placement="left" title="그리기 선택">
                <DrawSelect
                    id="type"
                    optionFilterProp="children"
                    onChange={onChange}
                    defaultValue="None"
                >
                    <Option value='None'>기본</Option>
                    <Option value='Clear'>모두 지우기</Option>
                    <Option value='LineString'>자유 그리기</Option>
                    <Option value='Circle'>원형 그리기</Option>
                    <Option value='Box'>사각형 그리기</Option>
                </DrawSelect>
            </Tooltip>
        </>
    );
};

export default Drawing;