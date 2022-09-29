import React, { useState, useCallback } from 'react';
// @ts-ignore
import style from './clinics.module.css'
import Map from "../Map";
import {ClinicType} from "./types";

const Clinics: React.FC = () => {

    const [clinicsList, setClinicsList] = useState<ClinicType[]>([
        {
            id: "7fcbccb6-07f4-11ed-861d-0242ac120002",
            name: "ФГБУ \"Больница с поликлиникой\"",
            address: "ул. Остоженка, 26, Москва, 133702",
            addressLat: 15037014.27335283,
            addressLon: 6186134.711730205,
            selected: true
        },
        {
            id: "e6d8d958-07f4-11ed-861d-0242ac120002",
            name: "ООО \"Ю.С. Дентал Клиник\"",
            address: "Мясницкая ул., 78, Москва, 191505",
            addressLat: 15039045.535039535, 
            addressLon: 6170316.948076886,
            selected: false
        },
        {
            id: "eac38496-07f4-11ed-861d-0242ac120002",
            name: "ФГБУ \"КБ №1\" УДП РФ",
            address: "ул. Остоженка, 26, Москва, 133702",
            addressLat: 15042156.014097217, 
            addressLon: 6174036.949819142,
            selected: false 
        },
        {
            id: "f032b4ba-07f4-11ed-861d-0242ac120002",
            name: "ООО \"Медикал Клаб Консилиум\"",
            address: "Малая Бронная ул., 80, Москва, 154863",
            addressLat: 15039280.597626515,  
            addressLon: 6179723.745783236,
            selected: false
        },
        {
            id: "f4dfed66-07f4-11ed-861d-0242ac120002",
            name: "ООО \"Семейная поликлиника №4\"",
            address: "Климентовский пер., 94, Москва, 156289",
            addressLat: 15040002.185029792, 
            addressLon: 6190419.150365809,
            selected: false 
        }]);

    const focusClinic = useCallback((id: string) => {
        const newClinicsList = [...clinicsList].map((clinic) => {return {...clinic, selected: clinic.id === id ? true : false}});
        setClinicsList([...newClinicsList]);
    }, [clinicsList]);

    return (
        <div className={style.clinics}>
            <div className={style.clinics_list}>
                <h3>Список клиник</h3>
                <ul>
                    {clinicsList.map((el: ClinicType) => <li key={el.id} onClick={() => focusClinic(el.id)} className={`${style.clinic_item} ${el.selected ? style.clinic_item__selected : ''}`}>
                            <h4>{el.name}</h4>
                            <span>{el.address}</span>
                    </li>)}
                </ul>
            </div>
            <div className={style.clinics_map}>
                <Map clinicList={clinicsList} setFocusOnClinic={focusClinic}/>
            </div>
        </div>
    )
}

export default Clinics;