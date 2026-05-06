package middleware

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	zlog "github.com/rs/zerolog/log"
)

func RequestLogger(c *fiber.Ctx) error {

	start := time.Now()

	// Generate a unique request ID for tracing
	requestID := uuid.New().String()
	c.Locals("requestid", requestID) // Store it in Fiber's locals for handlers to access

	err := c.Next()

	// After the request has been processed (or an error occurred)
	duration := time.Since(start)
	latencyMs := float64(duration.Nanoseconds()) / float64(time.Millisecond)

	statusCode := c.Response().StatusCode()
	if statusCode == 0 {
		if err != nil {
			statusCode = fiber.StatusInternalServerError
		} else {
			// Default success status
			statusCode = fiber.StatusOK
		}
	}

	// Get any error message from Fiber's context, if available
	var errorMessage string
	if err != nil {
		errorMessage = err.Error()
	}

	logEvent := zlog.Info() // Default to info level for successful requests

	if statusCode >= 400 && statusCode < 500 {
		logEvent = zlog.Warn() // Client errors
	} else if statusCode >= 500 {
		logEvent = zlog.Error() // Server errors
	}

	logEvent.
		Str("log_type", "request"). // Custom type for filtering in Loki
		Str("request_id", requestID).
		Time("timestamp", start).
		Int("status", statusCode).
		Str("method", c.Method()).
		Str("path", c.Path()).
		Float64("latency_ms", latencyMs)

	if errorMessage != "" {
		logEvent.Str("error_message", errorMessage)
	}

	logEvent.Send()

	return err
}
