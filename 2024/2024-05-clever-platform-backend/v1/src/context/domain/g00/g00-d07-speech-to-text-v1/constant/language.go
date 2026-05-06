package constant

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"net/http"
)

var (
	Thai    string = "th"
	English string = "en"
	Chinese string = "zh"
)

var (
	LanguageList []string = []string{Thai, English, Chinese}
)

func ConvertToLocale(language string) (*string, error) {
	languageToLocale := map[string]string{
		Thai:    "th-TH",
		English: "en-US",
		Chinese: "zh-CN",
	}

	locale, exists := languageToLocale[language]
	if !exists {
		msg := "Language not supported"
		return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
	}

	return &locale, nil
}
