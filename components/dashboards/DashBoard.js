import { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { SettingFilled, UndoOutlined } from '@ant-design/icons';
import useWindowSize from '../commons/useWindowSize';
import DashRegion from './DashRegion';
import DashMap from './DashMap';

const DashBoard = () => {
    const [showToolbox, setShowToolbox] = useState(false);
    const [resizeTarget, setResizeTarget] = useState();
    const [region, setRegion] = useState();
    const comps = [
        { key: 'map', titleColor: '#1890ff', className: 'AdministrativeMap', title: '단위 지도', comp: <DashMap propRegion={region} resizeTarget={resizeTarget} onChange={e => setRegion(e)} onChangeResize={e => setResizeTarget()} /> },
        { key: 'a', titleColor: '#ffd75a', className: 'AdministrativeInfo', title: '지역 정보', comp: <DashRegion propRegion={region} onChangeRegion={e => setRegion(e)}/> },
        { key: 'b', titleColor: '', className: '', title: '', comp: <></> },
        { key: 'c', titleColor: '', className: '', title: '', comp: <></> },
        { key: 'd', titleColor: '', className: '', title: '', comp: <></> },
    ];
    const originalLayout = [
        { i: 'a', x: 0, y: 0, h: 4, w: 4, minW: 2, minH: 2 },
        { i: 'b', x: 0, y: 4, h: 4, w: 4, minW: 2, minH: 2 },
        { i: 'map', x: 4, y: 0, h: 8, w: 4, minW: 2, minH: 2, isDraggable: true },
        { i: 'c', x: 8, y: 0, h: 4, w: 4, minW: 2, minH: 2 },
        { i: 'd', x: 8, y: 4, h: 4, w: 4, minW: 2, minH: 4 },
    ];

    const [layouts, setLayouts] = useState();
    const [currentComps, setCurrentComps] = useState();
    const [currentLayout, setCurrentLayout] = useState();
    const size = useWindowSize();

    useEffect(() => {
        let loadLayout = {};
        let layout = [];
        
        if (localStorage) {
            try {
                loadLayout = JSON.parse(localStorage.getItem('dashboard')) || {};
            } catch (e) {
                /* Ignore */
            }
        }

        if (!loadLayout['layouts']) {
            layout = originalLayout;
        } else {
            layout = loadLayout['layouts'];
        }
        setLayouts(layout);
    }, []);

    /**
     * typeof() === object 변수로부터 원하는 키의 값 추출
     * @param {object|Array<*>} obj 
     * @param {string|number} findKey Array > keyName | Object > Index
     * @param {*} findVal 
     */
    const findObjVal = (obj, findKey, findVal = undefined) => {
        if (obj.length !== void 0) {    // obj 가 Array 라면
            return obj.find( o => o[findKey] === findVal ) || undefined;
        } else {
            return obj[findKey] || undefined;
        }
    };

    /**
     * dnd Component DOM
     */
    const generateDOM = () => {
        return layouts.map( o => 
            <StyledLayout key={o.i} style={{
                'borderTopColor': findObjVal(comps, 'key', o.i).titleColor,
            }}>
                <div className='dash-header draggable fnt-nsqre' style={{'color': findObjVal(comps, 'key', o.i).titleColor}}>
                        {findObjVal(comps, 'key', o.i).title}
                    { o.i !== 'map' && !!showToolbox && <div className='hideBtn' onClick={e => onPutItem(o)}>x</div> }
                </div>
                <div className='dash-body' style={{'overflow': 'auto'}}>
                    { findObjVal(comps, 'key', o.i).comp }
                </div>
            </StyledLayout> 
        );
    };

    /**
     * dnd change event
     * @param {Array<object>} layout 
     */
    const onLayoutChange = (layout) => {
        const tempLayout = layout.filter( o =>  o.i !== '__dropping-elem__' ); // 임의로 제거
        if (!!currentLayout) {
            tempLayout.unshift({...currentLayout});
            setCurrentLayout(); //초기화
        }
        setLayouts(tempLayout);
    };

    /**
     * dnd remove(hide) layout event
     * @param {object} item 
     */
    const onPutItem = item => {
        const tempLayout = layouts.filter( o =>  o.i !== item.i );
        setLayouts(tempLayout);
    };

    /**
     * dnd drag layout event
     * @param {MouseEvent} e 
     * @param {object} item 
     */
    const onTakeItem = (e, item ) => {
        setCurrentComps(item);
        e.dataTransfer.setData("text/plain", "")
    };

    /**
     * dnd drop event
     * @param {object} elemParams 
     */
    const onDrop = elemParams  => {
        if (!currentComps) {
            return;
        }
        const tempLayout = {i: currentComps.key || 'z', ...elemParams};
        tempLayout['w'] = 2;
        tempLayout['h'] = 4;
        tempLayout['x'] = Math.round((tempLayout['x'] - 1) / 2) * 2;
        tempLayout['y'] = Math.round((tempLayout['y'] - 1) / 4) * 4;
        tempLayout['minW'] = 2;
        tempLayout['minH'] = 2;
        setCurrentLayout(tempLayout);
        setCurrentComps();  // 초기화
    };

    /**
     * dash board layout resize stop handler
     * @param {Array<*>} layout 
     * @param {Object} oldItem 
     * @param {Object} newItem 
     * @param {*} placeholder 
     * @param {MouseEvent} e 
     * @param {Element} element 
     */
    const onResizeStop = (layout, oldItem, newItem, placeholder, e, element) => {
        setResizeTarget(newItem.i);
    };

    /**
     * layout 설정 버튼 클릭
     * (설정 종료시 자동 저장 (localStorage))
     */
    const onClick = () => {
        const show = !showToolbox;
        setShowToolbox(show);
        if (!show) {
            localStorage.setItem('dashboard', JSON.stringify({'layouts': layouts}));
        }
    };
    const onReset = () => {
        setShowToolbox(false);
        if (localStorage) {
            try {
                localStorage.removeItem('dashboard');
            } catch (e) {
                /* Ignore */
            }
        }
        setLayouts(originalLayout);
    };
    
    return (
        <>
            <StyledDashBoard 
                layout={layouts} 
                cols={12} 
                rowHeight={((size.height - 60 - 48 - 32 - 6 - 10 - (size.height * 0.08) ) / 8 ) } /** window.innerHeight - GNB  - padding - x / (rows + 1)  */ 
                width={(size.width)}
                containerPadding={[5, 3]}
                onDrop={onDrop}
                onLayoutChange={onLayoutChange}
                onResizeStop={onResizeStop}
                isDroppable={true}
                draggableHandle={'.draggable'}
            >
                { layouts && generateDOM() }
            </StyledDashBoard>
            <Tooltip placement="topRight" title="대시보드 레이아웃 설정">
                <StyledSettingBtn className="settingBtn" size="small" shape="circle" icon={<SettingFilled />} onClick={onClick}/>
            </Tooltip>
            {showToolbox && <StyledToolbox>
                { comps && layouts && 
                comps.filter( o => !layouts.find( l => l.i === o.key ))
                .map( o => 
                        <div draggable={true} unselectable="on" className='unUseComp' key={o.key} onDragStart={e => {onTakeItem(e, o)}}>
                            {o.title}
                        </div>
                    )
                }
                <Tooltip placement="topRight" title="&#9888; 대시보드 레이아웃 초기화">
                    <StyledSettingBtn className="resetBtn" size="small" shape="circle" icon={<UndoOutlined rotate={90} />} onClick={onReset}/>
                </Tooltip>
            </StyledToolbox>}
        </>
    );
};

export default DashBoard;