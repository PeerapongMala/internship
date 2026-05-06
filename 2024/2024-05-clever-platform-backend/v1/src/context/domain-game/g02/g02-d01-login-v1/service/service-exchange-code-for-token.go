package service

import (
	"encoding/json"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"
)

// ==================== Service ==========================

type ExchangeCodeForTokenInput struct {
	Provider string
	Code     string
}

type ExchangeCodeForTokenOutput struct {
	OauthAccessToken string `json:"oauth_access_token"`
}

func (service *serviceStruct) ExchangeCodeForToken(in *ExchangeCodeForTokenInput) (*ExchangeCodeForTokenOutput, error) {
	formData, err := helper.BuildTokenRequestFormData(constant.OAuthProvider(in.Provider), in.Code)
	if err != nil {
		return nil, err
	}

	values := url.Values{}
	for key, value := range formData {
		values.Set(key, value)
	}

	tokenUrl, err := helper.GetTokenUrl(constant.OAuthProvider(in.Provider))
	if err != nil {
		return nil, err
	}

	client := &http.Client{
		Timeout: 30 * time.Second,
		Transport: &http.Transport{
			TLSHandshakeTimeout: 30 * time.Second,
		},
	}

	req, err := http.NewRequest(http.MethodPost, *tokenUrl, strings.NewReader(values.Encode()))
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	req.Header.Set(fiber.HeaderContentType, "application/x-www-form-urlencoded")

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

	test := map[string]interface{}{}
	err = json.Unmarshal(body, &test)
	if err != nil {
		return nil, err
	}
	log.Println(test)

	if res.StatusCode != http.StatusOK {
		msg := "Invalid code / provider"
		return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
	}

	result := map[string]interface{}{}
	contentType := res.Header.Get(fiber.HeaderContentType)

	if strings.Contains(contentType, "application/json") {
		err = json.Unmarshal(body, &result)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
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
		msg := "Unsupported response content-type from oauth server"
		return nil, helper.NewHttpError(http.StatusInternalServerError, &msg)
	}

	accessToken, ok := result["access_token"].(string)
	if !ok {
		msg := "Unable to extract access_token from response"
		return nil, helper.NewHttpError(http.StatusInternalServerError, &msg)
	}

	return &ExchangeCodeForTokenOutput{
		accessToken,
	}, nil
}
