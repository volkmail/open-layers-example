import React from 'react';
import OlMap from "ol/Map";

const isMap = (map: React.MutableRefObject<OlMap | null>): map is React.MutableRefObject<OlMap> => {
    return (map as React.MutableRefObject<OlMap>).current !== null;
}

export { isMap };