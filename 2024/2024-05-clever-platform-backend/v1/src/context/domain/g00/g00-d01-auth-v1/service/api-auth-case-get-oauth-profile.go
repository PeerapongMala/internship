package service

import (
	"encoding/json"
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
	"io"
	"log"
	"net/http"
	"net/url"
	"slices"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type AuthCaseGetOAuthProfileResponse struct {
	StatusCode int                `json:"status_code"`
	Data       []OAuthProfileData `json:"data"`
	Message    string             `json:"message"`
}

type OAuthProfileData struct {
	ProviderAccessToken *string `json:"provider_access_token"`
}

// ==================== Endpoint ==========================

// @Id AuthCaseGetOAuthProfile
// @Tags Auth
// @Summary Get OAuth profile
// @Description Get OAuth profile
// @Accept json
// @Produce json
// @Param provider path string true "provider e.g. line, google, thaid"
// @Param code query string true "code"
// @Success 200 {object} AuthCaseGetOAuthProfileResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /auth/v1/oauth/{provider}/profile [get]
func (api *APIStruct) AuthCaseGetOAuthProfile(context *fiber.Ctx) error {
	provider := context.Params("provider")
	if !slices.Contains(constant.OAuthProviderList, constant.OAuthProvider(provider)) {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	code := context.Query("code")

	out, err := api.Service.AuthCaseGetOAuthProfile(&AuthCaseGetOAuthProfileInput{
		Provider: &provider,
		Code:     &code,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AuthCaseGetOAuthProfileResponse{
		StatusCode: http.StatusOK,
		Data: []OAuthProfileData{{
			ProviderAccessToken: out.ProviderAccessToken,
		}},
		Message: "Data retrieved",
	})
}

// ==================== Service ==========================

type AuthCaseGetOAuthProfileInput struct {
	Provider *string
	Code     *string
}

type AuthCaseGetOAuthProfileOutput struct {
	SubjectId           *string
	ProviderAccessToken *string
}

func (serviceStruct *serviceStruct) AuthCaseGetOAuthProfile(in *AuthCaseGetOAuthProfileInput) (*AuthCaseGetOAuthProfileOutput, error) {
	authCaseExchangeCodeForTokenOutput, err := serviceStruct.AuthCaseExchangeCodeForToken(&AuthCaseExchangeCodeForTokenInput{
		Provider: in.Provider,
		Code:     in.Code,
	})
	if err != nil {
		return nil, err
	}

	authCaseFindOAuthProfileOutput, err := serviceStruct.AuthCaseFindOAuthProfile(&AuthCaseFindOAuthProfileInput{
		Provider:            in.Provider,
		ProviderAccessToken: authCaseExchangeCodeForTokenOutput.ProviderAccessToken,
	})

	return &AuthCaseGetOAuthProfileOutput{SubjectId: authCaseFindOAuthProfileOutput.SubjectId, ProviderAccessToken: authCaseExchangeCodeForTokenOutput.ProviderAccessToken}, nil
}

type AuthCaseExchangeCodeForTokenInput struct {
	Provider *string
	Code     *string
}

type AuthCaseExchangeCodeForTokenOutput struct {
	ProviderAccessToken *string
}

func (service *serviceStruct) AuthCaseExchangeCodeForToken(in *AuthCaseExchangeCodeForTokenInput) (*AuthCaseExchangeCodeForTokenOutput, error) {
	formData, err := helper.BuildTokenRequestFormData(constant.OAuthProvider(*in.Provider), *in.Code)
	if err != nil {
		return nil, err
	}

	values := url.Values{}
	for key, value := range formData {
		values.Set(key, value)
	}

	tokenUrl, err := helper.GetTokenUrl(constant.OAuthProvider(*in.Provider))
	if err != nil {
		return nil, err
	}

	client := &http.Client{}
	// Exchange code for token

	req, err := http.NewRequest("POST", *tokenUrl, strings.NewReader(values.Encode()))
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	res, err := client.Do(req)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if res.StatusCode != http.StatusOK {
		log.Printf("%+v", errors.WithStack(fmt.Errorf("code or provider is invalid")))
		return nil, fmt.Errorf("code or provider is invalid")
	}

	result := map[string]interface{}{}
	contentType := res.Header.Get("Content-Type")

	if strings.Contains(contentType, "application/json") {
		err = json.Unmarshal(body, &result)
		if err != nil {
			log.Printf("%+v", err)
			return nil, err
		}
	} else if strings.Contains(contentType, "application/x-www-form-urlencoded") {
		values, err := url.ParseQuery(string(body))
		if err != nil {
			log.Printf("%+v", err)
			return nil, err
		}
		result["access_token"] = values.Get("access_token")
	} else {
		log.Printf("unsupported content type")
		return nil, fmt.Errorf("unsupported content type")
	}

	accessToken, ok := result["access_token"].(string)
	if !ok {
		log.Printf("%+v", fmt.Errorf("code or provider is invalid"))
		return nil, fmt.Errorf("code or provider is invalid")
	}
	if accessToken == "" {
		return nil, fmt.Errorf("code or provider is invalid")
	}

	return &AuthCaseExchangeCodeForTokenOutput{ProviderAccessToken: &accessToken}, nil
}

type AuthCaseFindOAuthProfileInput struct {
	Provider            *string
	ProviderAccessToken *string
}

type AuthCaseFindOAuthProfileOutput struct {
	SubjectId *string
}

func (service *serviceStruct) AuthCaseFindOAuthProfile(in *AuthCaseFindOAuthProfileInput) (*AuthCaseFindOAuthProfileOutput, error) {
	profileUrl, err := helper.GetProfileURL(constant.OAuthProvider(*in.Provider))
	if err != nil {
		return nil, err
	}

	client := &http.Client{}

	req, err := http.NewRequest("GET", *profileUrl, nil)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", *in.ProviderAccessToken))

	res, err := client.Do(req)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if res.StatusCode != http.StatusOK {
		log.Printf("%+v", errors.WithStack(fmt.Errorf("failed to get user profile")))
		return nil, fmt.Errorf("failed to get user profile")
	}

	profile := map[string]interface{}{}
	err = json.Unmarshal(body, &profile)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	var subjectId string
	switch constant.OAuthProvider(*in.Provider) {
	case constant.Line:
		id, ok := profile["userId"].(string)
		if !ok {
			return nil, errors.New("error getting oauth profile")
		}
		subjectId = id
	case constant.Google:
		id, ok := profile["sub"].(string)
		if !ok {
			return nil, errors.New("error getting oauth profile")
		}
		subjectId = id
	}

	return &AuthCaseFindOAuthProfileOutput{SubjectId: &subjectId}, nil
}
