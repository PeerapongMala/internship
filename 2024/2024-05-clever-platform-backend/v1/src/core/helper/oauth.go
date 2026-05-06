package helper

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
	"log"
	"os"
	"strings"

	"github.com/pkg/errors"
)

func BuildOAuthUrl(provider constant.OAuthProvider) (*string, error) {
	authUrl := os.Getenv(fmt.Sprintf("%s_AUTH_URL", strings.ToUpper(string(provider))))
	clientId := os.Getenv(fmt.Sprintf("%s_CLIENT_ID", strings.ToUpper(string(provider))))
	redirectUri := os.Getenv(fmt.Sprintf("%s_REDIRECT_URI", strings.ToUpper(string(provider))))

	if authUrl == "" || clientId == "" || redirectUri == "" {
		err := fmt.Errorf("oauth provider: %s not supported", string(provider))
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	url := fmt.Sprintf("%s?response_type=code&client_id=%s&redirect_uri=%s&state=state&scope=profile", authUrl, clientId, redirectUri)

	return &url, nil
}

func BuildTokenRequestFormData(provider constant.OAuthProvider, code string) (map[string]string, error) {
	redirectUri := os.Getenv(fmt.Sprintf("%s_REDIRECT_URI", strings.ToUpper(string(provider))))
	clientId := os.Getenv(fmt.Sprintf("%s_CLIENT_ID", strings.ToUpper(string(provider))))
	clientSecret := os.Getenv(fmt.Sprintf("%s_CLIENT_SECRET", strings.ToUpper(string(provider))))

	if redirectUri == "" || clientId == "" || clientSecret == "" {
		err := fmt.Errorf("oauth provider: %s not supported", string(provider))
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	formData := map[string]string{
		"grant_type":    "authorization_code",
		"code":          code,
		"redirect_uri":  redirectUri,
		"client_id":     clientId,
		"client_secret": clientSecret,
	}

	return formData, nil
}

func GetTokenUrl(provider constant.OAuthProvider) (*string, error) {
	tokenUrl := os.Getenv(fmt.Sprintf("%s_TOKEN_URL", strings.ToUpper(string(provider))))
	if tokenUrl == "" {
		err := fmt.Errorf("oauth from %s not supported", provider)
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &tokenUrl, nil
}

func GetProfileURL(provider constant.OAuthProvider) (*string, error) {
	profileUrl := os.Getenv(fmt.Sprintf("%s_PROFILE_URL", strings.ToUpper(string(provider))))
	if profileUrl == "" {
		err := fmt.Errorf("oauth from %s not supported", provider)
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return &profileUrl, nil
}
