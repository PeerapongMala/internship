package constant

var Enabled = "enabled"

type StatusResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}
