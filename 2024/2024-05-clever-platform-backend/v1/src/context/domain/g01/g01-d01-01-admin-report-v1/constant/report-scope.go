package constant

var (
	// OBEC (สพฐ)
	InspectionArea = "inspection-area"
	AreaOffice     = "area-office"

	// DOE (สนศ.กทม.)
	DistrictZone = "district-zone"
	District     = "district"
	DoeSchool    = "doe-school"

	// LAO (อปท)
	Province    = "province"
	LaoDistrict = "lao-district"
	LaoSchool   = "lao-school"

	// OPEC (สช)
	OpecSchool = "opec-school"

	// etc (อื่น ๆ)
	EtcSchool = "etc-school"

	ScopeList = []string{InspectionArea, AreaOffice, Province, LaoDistrict, LaoSchool, DistrictZone, District, DoeSchool, OpecSchool, EtcSchool}
)
