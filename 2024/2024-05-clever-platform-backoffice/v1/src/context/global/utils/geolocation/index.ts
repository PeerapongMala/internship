import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import regionsJson from './data/regions.json';
import provincesJson from './data/provinces.json';
import districtsJson from './data/districts.json';
import subdistrictsJson from './data/subdistricts.json';

interface RegionData {
  id: number;
  regionNameEn: string;
  regionNameTh: string;
}

interface ProvinceData {
  id: number;
  regionCode: number;
  provinceCode: number;
  provinceNameEn: string;
  provinceNameTh: string;
}

interface DistrictData {
  id: number;
  provinceCode: number;
  districtCode: number;
  districtNameEn: string;
  districtNameTh: string;
  postalCode: number;
}

interface SubdistrictData {
  id: number;
  provinceCode: number;
  districtCode: number;
  subdistrictCode: number;
  subdistrictNameEn: string;
  subdistrictNameTh: string;
  postalCode: number;
}

interface UseGelocationReturn {
  listRegions: RegionData[];
  selectedRegion?: RegionData;
  setSelectedRegion: Dispatch<SetStateAction<RegionData | undefined>>;
  listProvinces: ProvinceData[];
  selectedProvince?: ProvinceData;
  setSelectedProvince: Dispatch<SetStateAction<ProvinceData | undefined>>;
  listDistricts: DistrictData[];
  selectedDistrict?: DistrictData;
  setSelectedDistrict: Dispatch<SetStateAction<DistrictData | undefined>>;
  listSubdistricts: SubdistrictData[];
  selectedSubdistricts?: SubdistrictData;
  setSelectedSubdistricts: Dispatch<SetStateAction<SubdistrictData | undefined>>;
}

export function useGeolocation(): UseGelocationReturn {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | undefined>();
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | undefined>();
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | undefined>();
  const [selectedSubdistricts, setSelectedSubdistricts] = useState<
    SubdistrictData | undefined
  >();

  // provinces depends on regions
  const listProvinces = useMemo(() => {
    setSelectedProvince(undefined);
    // update list of provinces
    if (!selectedProvince) return [];
    return provincesJson.filter((region) => region.id === selectedProvince?.regionCode);
  }, [selectedRegion]);

  // districts depends on provinces
  const listDistricts = useMemo(() => {
    setSelectedDistrict(undefined);
    // update list of districts
    if (!selectedProvince) return [];
    return districtsJson.filter(
      (district) => district.provinceCode === selectedProvince?.provinceCode,
    );
  }, [selectedProvince]);

  // subdistricts depends on districts
  const listSubdistricts = useMemo(() => {
    setSelectedSubdistricts(undefined);
    // update list of subdistricts
    if (!selectedDistrict) return [];
    return subdistrictsJson.filter(
      (subdistrict) => subdistrict.districtCode === selectedDistrict?.districtCode,
    );
  }, [selectedDistrict]);

  return {
    listRegions: regionsJson,
    selectedRegion,
    setSelectedRegion,
    listProvinces,
    selectedProvince,
    setSelectedProvince,
    listDistricts,
    selectedDistrict,
    setSelectedDistrict,
    listSubdistricts,
    selectedSubdistricts,
    setSelectedSubdistricts,
  };
}

export function useRegionLocation(): RegionData[] {
  return regionsJson;
}

interface UseProvinceLocationProps {
  regionCode?: number;
}

export function useProvinceLocation({
  regionCode,
}: UseProvinceLocationProps): ProvinceData[] {
  if (!regionCode) return provincesJson;
  return provincesJson.filter((province) => province.regionCode === regionCode);
}

interface UseProvinceLocationByNameProps {
  regionNameTh?: string;
}

export function useProvinceLocationByName({
  regionNameTh,
}: UseProvinceLocationByNameProps): ProvinceData[] {
  const targetRegion = regionsJson.find((region) => region.regionNameTh === regionNameTh);
  if (!targetRegion) return provincesJson;
  return provincesJson.filter((province) => province.regionCode === targetRegion.id);
}

interface UseDistrictLocationProps {
  provinceCode: number;
}

export function useDistrictLocation({
  provinceCode,
}: UseDistrictLocationProps): DistrictData[] {
  return districtsJson.filter((district) => district.provinceCode === provinceCode);
}

interface UseDistrictLocationByNameProps {
  provinceNameTH?: string;
}

export function useDistrictLocationByName({
  provinceNameTH,
}: UseDistrictLocationByNameProps): DistrictData[] {
  if (!provinceNameTH) return [];
  const targetProvince = provincesJson.find(
    (province) => province.provinceNameTh === provinceNameTH,
  );

  if (!targetProvince) return [];
  return districtsJson.filter(
    (district) => district.provinceCode === targetProvince.provinceCode,
  );
}

interface UseSubdistrictLocationProps {
  districtCode: number;
}

export function useSubdistrictLocation({
  districtCode,
}: UseSubdistrictLocationProps): SubdistrictData[] {
  return subdistrictsJson.filter(
    (subdistrict) => subdistrict.districtCode === districtCode,
  );
}

interface UseSubdistrictLocationByNameProps {
  districtNameTH?: string;
}

export function useSubdistrictLocationByName({
  districtNameTH,
}: UseSubdistrictLocationByNameProps): SubdistrictData[] {
  if (!districtNameTH) return [];
  const targetDistrict = districtsJson.find(
    (district) => district.districtNameTh === districtNameTH,
  );

  if (!targetDistrict) return [];
  return subdistrictsJson.filter(
    (subdistrict) => subdistrict.districtCode === targetDistrict.districtCode,
  );
}
