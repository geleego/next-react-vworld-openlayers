import { Zoom, ZoomSlider } from 'ol/control';

/**
 * Zoom Module
 */
export const zoom = new Zoom({
    className: 'custom-zoom',
});

/**
 * Zoom Slider Module
 */
export const zoomSlider = new ZoomSlider({
    className: 'ol-zoomslider'
});
