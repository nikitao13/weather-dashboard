export function metersToKM(visibilityMeters: number): string {
    const visibilityInKm = visibilityMeters / 1000;
    return `${visibilityInKm.toFixed(0)}km`;
}