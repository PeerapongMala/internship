package constant

var (
	School = "school"
	Year   = "year"

	// OBEC
	InspectionArea = "inspection-area"
	AreaOffice     = "area-office"

	// DOE
	DistrictZone = "district-zone"
	District     = "district"
	DoeSchool    = "doe-school"

	// LAO
	Province    = "province"
	LaoDistrict = "lao-district"
	LaoSchool   = "lao-school"

	// OPEC
	OpecSchool = "opec-school"

	// etc
	EtcSchool = "etc-school"

	ScopeList = []string{InspectionArea, AreaOffice, Province, LaoDistrict, LaoSchool, DistrictZone, District, School, DoeSchool, OpecSchool, EtcSchool, Year}
)
