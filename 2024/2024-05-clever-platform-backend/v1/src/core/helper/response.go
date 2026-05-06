package helper

// BaseResponse represents a standard response structure used across the API.
// It includes a status code and a human-readable message indicating the outcome of the request.
type BaseResponse struct {
	// StatusCode is the HTTP status code of the response (e.g., 200, 400, 500).
	StatusCode int `json:"status_code"`
	// Message is a human-readable message providing additional context about the response.
	Message string `json:"message"`
}
