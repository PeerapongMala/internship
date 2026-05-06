package constant

type OAuthProvider string

const (
	Line   OAuthProvider = "line"
	ThaiId OAuthProvider = "thaiid"
	Google OAuthProvider = "google"
)

var (
	OAuthProviderList = []OAuthProvider{Line, ThaiId, Google}
)
