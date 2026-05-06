package constant

import (
	"fmt"
	"log"
	"net/http"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

var (
	Thai    string = "th"
	English string = "en"
	Chinese string = "zh"

	LanguageList []string = []string{Thai, English, Chinese}
)

func ValidateLanguages(languages []string) error {
	if languages == nil {
		return nil
	}
	for _, language := range languages {
		if !slices.Contains(LanguageList, language) {
			msg := fmt.Sprintf(`Invalid language %s`, language)
			err := helper.NewHttpError(http.StatusBadRequest, &msg)
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}
	return nil
}
