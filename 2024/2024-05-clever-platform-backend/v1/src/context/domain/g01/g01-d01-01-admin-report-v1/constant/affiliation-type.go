package constant

var (
	Obec = "obec"
	Lao  = "lao"
	Doe  = "doe"
	Opec = "opec"
	Etc  = "etc"
)

func AffiliationTypeToThai(affiliationType string) string {
	switch affiliationType {
	case Obec:
		return "สพฐ"
	case Lao:
		return "อปท"
	case Doe:
		return "สนศ. กทม."
	case Opec:
		return "สช"
	case Etc:
		return "อื่นๆ"
	default:
		return ""
	}
}
