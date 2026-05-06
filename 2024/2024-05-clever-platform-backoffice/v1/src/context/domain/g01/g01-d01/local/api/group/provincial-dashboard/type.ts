export interface ScoreOverviewResponse {
  total_school_count: number;
  total_class_room_count: number;
  total_student_count: number;
  country_maximum_star_count: number;
  avg_star_count: number;
  percentage_star: number;
  maximum_star_count: number;
  minimum_star_count: number;
}

export interface CompareProvinceDistrictResponse {
  stat_usage: StatUsage[];
  over_all_province: OverallProvince;
  tree_district: TreeDistrict[];
}

export interface OverallProvince {
  avg_country_star_count: number;
  max_country_star_count: number;
  percentage_star: number;
  avg_star_count: number;
  max_star_count: number;
  min_star_count: number;
}

// export interface TreeDistrict {
//   SchoolId: number;
//   ClassRoomId: number;
//   Name: string;
//   Type: string;
//   MaxStarCount: number;
//   AvgStarCount: number;
//   AvgPassLevel: number;
//   children: TreeDistrict[];
// }
export interface TreeDistrict {
  name?: string; // บาง node ไม่มี name เช่น node แรกสุด
  type: 'DistrictZone' | 'District' | 'School' | 'Year';
  max_star_count?: number;
  avg_star_count?: number;
  avg_pass_level?: number;
  children?: TreeDistrict[];
}

export interface StatUsage {
  label: string;
  value: number;
}
