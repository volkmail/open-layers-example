type MapPropsType = {
    markers: Array<{
        coordinates: [number, number],
        name: string
    }>;
    focusCoordinates: [number, number];
};
type MapStateType = {};

export type {MapPropsType, MapStateType}