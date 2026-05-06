package constant

type SchoolAffiliationGroup string

const (
	Doe    SchoolAffiliationGroup = "สนศ. กทม."
	Others SchoolAffiliationGroup = "อื่นๆ"
	Obec   SchoolAffiliationGroup = "สพฐ"
	Opec   SchoolAffiliationGroup = "สช"
	Lao    SchoolAffiliationGroup = "อปท"
)

var (
	SchoolAffiliationGroupList = []SchoolAffiliationGroup{Doe, Others, Obec, Opec, Lao}
)
