package service

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

type LinkWithRichMenuInput struct {
	UserId     string
	RichMenuId string
}

func (service *serviceStruct) LinkWithRichMenu(in *LinkWithRichMenuInput) error {
	chanAccessToken := os.Getenv("CHANNEL_ACCESS_TOKEN")
	url := fmt.Sprintf("https://api.line.me/v2/bot/user/%s/richmenu/%s", in.UserId, in.RichMenuId)

	req, err := http.NewRequest(http.MethodPost, url, nil)
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "Bearer "+chanAccessToken)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{
		Timeout: 30 * time.Second,
		Transport: &http.Transport{
			TLSHandshakeTimeout: 30 * time.Second,
		},
	}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(body))
	}

	return nil
}
