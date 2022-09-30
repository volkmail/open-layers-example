import { Coordinate } from "ol/coordinate";
import { ClinicType } from "src/Clinics/types";

type MapPropsType = {
    clinicList: ClinicType[];
    setFocusOnClinic: (id: string) => void;
};
type MapStateType = {
    center: Coordinate,
    zoom: number,
};

export type {MapPropsType, MapStateType}