import { format, toStringHDMS } from 'ol/coordinate';
import MousePosition from 'ol/control/MousePosition';
import { useEffect } from 'react';

/**
 * Mouse Position Module
 * @param {*} obj 
 */
const MousePos = ({map}) => {
    useEffect(() => {
        const mousePosition = new MousePosition({
            coordinateFormat: (coord) => {
                return format(coord, `Geographic (WGS84) : ${toStringHDMS(coord, 2)}`)
            },
            projection: 'EPSG:4326',
            className: 'custom-mouse-position',
            target: 'mouse-position',
            undefinedHTML: 'Geographic (WGS84) : lon,&nbsp;lat'
        });
        let isMousePosition;
        map.getControls().forEach( c => {
            if (c instanceof MousePosition) {
                isMousePosition = c;
            }
        });
        if (!isMousePosition) {
            map.addControl(mousePosition);
        }
        return () => {
            let isMousePosition;
            map.getControls().forEach( c => {
                if (c instanceof MousePosition) {
                    isMousePosition = c;
                }
            });
            if (isMousePosition) {
                map.removeControl(isMousePosition);
            }
        }
    }, []);
    return (
        <>
            <MousePositionStyle >
                <div className={'mouse-position-outline'}>
                    <span id="mouse-position"></span>
                </div>
            </MousePositionStyle>
        </>
    );
}

export default MousePos;