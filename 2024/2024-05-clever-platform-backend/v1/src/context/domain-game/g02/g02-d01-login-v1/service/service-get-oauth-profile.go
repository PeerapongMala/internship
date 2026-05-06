package service

import (
	"encoding/json"
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"io"
	"log"
	"net/http"
	"time"
)

type GetOauthProfileInput struct {
	Provider         string
	OauthAccessToken string
}

type GetOauthProfileOutput struct {
	SubjectId string
}

func (service *serviceStruct) GetOauthProfile(in *GetOauthProfileInput) (*GetOauthProfileOutput, error) {
	profileUrl, err := helper.GetProfileURL(constant.OAuthProvider(in.Provider))
	if err != nil {
		return nil, err
	}

	client := &http.Client{
		Timeout: 1 * time.Minute,
		Transport: &http.Transport{
			TLSHandshakeTimeout: 1 * time.Minute,
		},
	}

	req, err := http.NewRequest(http.MethodGet, *profileUrl, nil)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	req.Header.Set("Authorization", fmt.Sprintf(`Bearer %s`, in.OauthAccessToken))
	start := time.Now()
	res, err := client.Do(req)
	log.Println("0201V1: ", time.Since(start))
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
		msg := "Invalid code / provider"
		return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
	}

	profile := map[string]interface{}{}
	err = json.Unmarshal(body, &profile)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	var subjectId string
	switch constant.OAuthProvider(in.Provider) {
	case constant.Line:
		id, ok := profile["userId"].(string)
		if !ok {
			msg := "Unable to get OAuth profile"
			return nil, helper.NewHttpError(http.StatusInternalServerError, &msg)
		}
		subjectId = id
	case constant.Google:
		id, ok := profile["sub"].(string)
		if !ok {
			msg := "Unable to get OAuth profile"
			return nil, helper.NewHttpError(http.StatusInternalServerError, &msg)
		}
		subjectId = id
	}

	return &GetOauthProfileOutput{
		SubjectId: subjectId,
	}, nil
}
