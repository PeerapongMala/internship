package helper

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgconn"
)

var isProd bool

func init() {
	env := os.Getenv("ENV")
	if env == "PROD" {
		isProd = true
	}
}

const (
	ErrorCodeUniqueViolation     = "23505"
	ErrorCodeForeignKeyViolation = "23503"
	ErrorCodeNotNullViolation    = "23502"

	ErrorMessageConflict       = "Conflict"
	ErrorMessageBadRequest     = "Bad request"
	ErrorMessageUnauthorized   = "Unauthorized"
	ErrorMessageNotfound       = "Not found"
	ErrorMessageForbidden      = "Forbidden"
	ErrorMessageInternalServer = "Internal server error"
)

type HttpError struct {
	StatusCode   int
	Message      string
	ErrorMessage string
}

func (err HttpError) Error() string {
	return err.Message
}

type HttpErrorResponse struct {
	StatusCode   int    `json:"status_code"`
	Message      string `json:"message"`
	ErrorMessage string `json:"error_message,omitempty"`
} // @name FailureResponse

func NewHttpError(statusCode int, message *string) HttpError {
	if message == nil {
		defaultMessage := getDefaultStatusMessage(statusCode)
		message = &defaultMessage
	}
	return HttpError{
		StatusCode: statusCode,
		Message:    *message,
	}
}
func NewHttpErrorWithDetail(statusCode int, message *string, err error) HttpError {
	if message == nil {
		defaultMessage := getDefaultStatusMessage(statusCode)
		message = &defaultMessage
	}
	errMsg := ""
	if !isProd && err != nil {
		errMsg = err.Error()
	}
	return HttpError{
		StatusCode:   statusCode,
		Message:      *message,
		ErrorMessage: errMsg,
	}
}

func RespondHttpError(context *fiber.Ctx, err error) error {
	// if err != nil {
	// 	log.Printf("%+v", e.WithStack(err))
	// }
	var errMessage string
	if !isProd {
		errMessage = err.Error()
	}
	var httpError HttpError
	ok := errors.As(err, &httpError)
	if ok {
		return context.Status(httpError.StatusCode).JSON(HttpErrorResponse{
			StatusCode:   httpError.StatusCode,
			Message:      httpError.Message,
			ErrorMessage: errMessage,
		})
	}

	var pgError *pgconn.PgError
	ok = errors.As(err, &pgError)
	if ok {
		switch pgError.Code {
		case ErrorCodeUniqueViolation:
			return context.Status(http.StatusConflict).JSON(HttpErrorResponse{
				StatusCode:   http.StatusConflict,
				Message:      fmt.Sprintf(`Unique field violation (%s)`, pgError.Detail),
				ErrorMessage: errMessage,
			})
		case ErrorCodeForeignKeyViolation:
			return context.Status(http.StatusConflict).JSON(HttpErrorResponse{
				StatusCode:   http.StatusConflict,
				Message:      fmt.Sprintf(`Foreign key violation (%s)`, pgError.Detail),
				ErrorMessage: errMessage,
			})
		case ErrorCodeNotNullViolation:
			return context.Status(http.StatusConflict).JSON(HttpErrorResponse{
				StatusCode:   http.StatusConflict,
				Message:      fmt.Sprintf(`Not null violation (%s)`, pgError.ColumnName),
				ErrorMessage: errMessage,
			})
		}
	}

	var validatorError validator.ValidationErrors
	ok = errors.As(err, &validatorError)
	if ok {
		var errMessages []string
		for _, err := range validatorError {
			errMessage := fmt.Sprintf(`Field validation for %s failed on the %s condition`, err.Field(), err.Tag())
			errMessages = append(errMessages, errMessage)
		}
		return context.Status(http.StatusBadRequest).JSON(HttpErrorResponse{
			StatusCode:   http.StatusBadRequest,
			Message:      strings.Join(errMessages, ","),
			ErrorMessage: errMessage,
		})
	}

	if errors.Is(err, sql.ErrNoRows) {
		return context.Status(http.StatusNotFound).JSON(HttpErrorResponse{
			StatusCode:   http.StatusNotFound,
			Message:      ErrorMessageNotfound,
			ErrorMessage: errMessage,
		})
	}

	if strings.Contains(err.Error(), "CSVFile") {
		return context.Status(http.StatusBadRequest).JSON(HttpErrorResponse{
			StatusCode:   http.StatusInternalServerError,
			Message:      err.Error(),
			ErrorMessage: errMessage,
		})
	}

	return context.Status(http.StatusInternalServerError).JSON(HttpErrorResponse{
		StatusCode:   http.StatusInternalServerError,
		Message:      ErrorMessageInternalServer,
		ErrorMessage: errMessage,
	})
}

func getDefaultStatusMessage(statusCode int) string {
	message := ""
	switch statusCode {
	case http.StatusConflict:
		message = ErrorMessageConflict
	case http.StatusBadRequest:
		message = ErrorMessageBadRequest
	case http.StatusUnauthorized:
		message = ErrorMessageUnauthorized
	case http.StatusNotFound:
		message = ErrorMessageNotfound
	case http.StatusForbidden:
		message = ErrorMessageForbidden
	default:
		message = ErrorMessageInternalServer
	}

	return message
}
