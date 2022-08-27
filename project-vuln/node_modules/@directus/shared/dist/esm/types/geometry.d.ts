import { Point, Polygon, LineString, MultiPoint, MultiPolygon, MultiLineString, GeometryCollection, Geometry, Feature, FeatureCollection } from 'geojson';
import { GeometryType, GeometryFormat } from './fields';
export declare type GeometryOptions = {
    geometryField: string;
    geometryFormat: GeometryFormat;
    geometryType?: GeometryType;
};
export declare type SimpleGeometry = Point | Polygon | LineString;
export declare type MultiGeometry = MultiPoint | MultiPolygon | MultiLineString;
export declare type AnyGeometry = Geometry | GeometryCollection;
export declare type AllGeoJSON = Geometry & GeometryCollection & Feature & FeatureCollection;
export declare type GeoJSONParser = (entry: any) => AnyGeometry | undefined;
export declare type GeoJSONSerializer = (entry: AllGeoJSON) => any;
export declare type Coordinate = [number, number];
//# sourceMappingURL=geometry.d.ts.map