const TILE_SIZE = 256;
export const MAX_ZOOM = 19;

export function latLngToGlobalPixel(lat: number, lng: number, zoom: number = MAX_ZOOM) {
    const scale = 1 << zoom;
    const worldCoord = project(lat, lng);

    return {
        x: Math.floor(worldCoord.x * scale),
        y: Math.floor(worldCoord.y * scale),
    };
}


function project(lat: number, lng: number) {
    let siny = Math.sin((lat * Math.PI) / 180);

    siny = Math.min(Math.max(siny, -0.9999), 0.9999);

    const x = TILE_SIZE * (0.5 + lng / 360);
    const y = TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI));

    return { x, y };
}