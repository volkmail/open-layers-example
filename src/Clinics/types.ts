type ClinicType = {
    id: string;
    name: string;
    address?: string;
    addressLat: number;
    addressLon: number;
    selected: boolean;
}

type ClinicsPropsType = {}

type ClinicsStateType = {}

export type {ClinicType, ClinicsPropsType, ClinicsStateType}