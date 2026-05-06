package constant

const (
	LaoTypePao                     string = "อบจ"
	LaoTypeSao                     string = "อบต"
	LaoTypeCityMunicipality        string = "เทศบาลนคร"
	LaoTypeDistrictMunicipality    string = "เทศบาลอำเภอ"
	LaoTypeSubDistrictMunicipality string = "เทศบาลตำบล"
)

var (
	LaoTypeList = []string{LaoTypePao, LaoTypeSao, LaoTypeCityMunicipality, LaoTypeDistrictMunicipality, LaoTypeSubDistrictMunicipality}
)
