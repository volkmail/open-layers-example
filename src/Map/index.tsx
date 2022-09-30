import React, { useState, useEffect, useRef } from "react";
//@ts-ignore
import style from './map.module.css';
//@ts-ignore
import MarkerImg from '../assets/marker32.png';
//@ts-ignore
import SelectedMarkerImg from '../assets/selectedMarker32.png';
import OlMap from "ol/Map";
import OlView from "ol/View";
import OlLayerTile from "ol/layer/Tile";
import OlSourceOSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import RegularShape from "ol/style/RegularShape";
import { Icon, Style, Fill } from "ol/style";
import { Geometry } from "ol/geom";
import {Feature} from "ol";
import {Point} from "ol/geom";
import {MapPropsType, MapStateType} from "./types";
import { transform } from "ol/proj";
import Text from 'ol/style/Text';
import { ClinicType } from "src/Clinics/types";
import { isMap } from "src/utils";

const defaultStyle: Style = new Style({
  image: new Icon({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: MarkerImg
  })
});

const selectStyle: Style = new Style({
  image: new Icon({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: SelectedMarkerImg
  })
});

const tooltipStyle: Style = new Style({
  text: new Text({
    font: "14px Calibri,sans-serif",
    fill: new Fill({
      color: "rgba(255, 255, 255, 1)"
    }),
    backgroundFill: new Fill({
      color: "rgba(0, 0, 0, 0.7)"
    }),
    padding: [3, 3, 3, 3],
    textBaseline: "bottom",
    offsetY: -15
  }),
  image: new RegularShape({
    radius: 8,
    points: 3,
    angle: Math.PI,
    displacement: [0, 10],
    fill: new Fill({
      color: "rgba(0, 0, 0, 0.7)"
    })
  }),
  geometry: new Point([])
});

const Map: React.FC<MapPropsType> = (props) => {
    const [state, setState] = useState<MapStateType>({
        center: [15037014.27335283, 6186134.711730205],
        zoom: 12.6,
    });

    const map = useRef<OlMap|null>(null);

    //Эффект инициализации карты
    useEffect(() => {
      if (!map.current) {
        map.current = new OlMap({
          // target = id контейнера, куда помещяем карту
          target: "ol-map",
          layers: [
            // Слой карты
            new OlLayerTile({
              source: new OlSourceOSM(),
            }),
            // Также динамически здесь будет добавлен слой маркеров
          ],
          // View - это позиционирование карты
          view: new OlView({
            center: state.center,
            zoom: 12.6,
          }),
          controls: [],
        });

        if (isMap(map)) {
          // Обработчики событий на карте
          map.current.on("moveend", () =>
            setState((prevState) => {return {
              center: map.current.getView().getCenter() || prevState.center,
              zoom: map.current.getView().getZoom() as number,
            }})
          );
          map.current.on("click", (e) =>
            console.log(transform(e.coordinate, "EPSG:4326", "EPSG:4326"))
          );

          let selectedMarker: Feature<Point> | null = null;
          let currentStyle: Style[] | null = null;
          map.current.on("pointermove", function (e) {
            if (selectedMarker !== null && currentStyle !== null) {
              selectedMarker.setStyle(currentStyle[0]);
              selectedMarker = null;
            }

            map.current.forEachFeatureAtPixel(e.pixel, function (feature) {
              selectedMarker = feature as Feature<Point>;

              (tooltipStyle.getGeometry() as Point).setCoordinates(e.coordinate);
              tooltipStyle.getText().setText(feature.get("name"));

              currentStyle = [
                selectedMarker.get("selected") ? selectStyle : defaultStyle,
                tooltipStyle,
              ];

              selectedMarker.setStyle(currentStyle);

              return true;
            });
          });

          map.current.on("singleclick", function (e) {
            map.current.forEachFeatureAtPixel(e.pixel, function (feature) {
              props.setFocusOnClinic(feature.get("id"));
            });
          });
        }
      }       
    }, []);

    //for drag Effect, Обновляем координаты карты
    useEffect(()=>{
      if(isMap(map)){
        const mapView = map.current.getView();
        mapView.setCenter(state.center);
        mapView.setZoom(state.zoom);
      }      
    }, [state.center, state.zoom]);

    //Будем рисовать маркеры в зависимоти от пропсов с объектами (props.clinicList) для указания маркеров на карте
    useEffect(()=>{
        if (map.current) {   
          let markers: Feature<Point>[] = [];
          
          props.clinicList.forEach((el: ClinicType) => {
            const feature = new Feature({
              geometry: new Point([el.addressLat, el.addressLon]),
              id: el.id,
              name: el.name,
              selected: el.selected
            });

            feature.setStyle(el.selected ? selectStyle : defaultStyle);
            el.selected && setState((prevState) => {return {...prevState, center: [el.addressLat, el.addressLon]}})
            markers.push(feature);
          });
          const currentMarkerLayer: VectorLayer<VectorSource<Geometry>> | undefined = map.current.getLayers().getArray()[1] as VectorLayer<VectorSource<Geometry>>;

          // Смотрим есть ли у нас слой маркеров, если есть обновляем features в нем, иначе создаем новый слой
          if(currentMarkerLayer !== undefined){
            currentMarkerLayer.getSource()!.clear();
            currentMarkerLayer.getSource()!.addFeatures([...markers]);
          } else {
            let newMarkerLayer: VectorLayer<VectorSource<Geometry>> = new VectorLayer({
              source: new VectorSource({
                features: [...markers],
              }),
            });
            map.current.addLayer(newMarkerLayer);
          }         
        }   
    }, [props.clinicList]);

    return (
        <>
            <div id="ol-map" className={style.map}></div>
        </>
    );
}

export default Map;