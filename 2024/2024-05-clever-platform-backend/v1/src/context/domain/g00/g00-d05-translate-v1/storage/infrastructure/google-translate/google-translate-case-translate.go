package googleTranslate

import (
	"context"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"golang.org/x/text/language"
	"log"
	"net/http"
)

func (googleTranslateRepository *googleTranslateRepository) GoogleTranslateCaseTranslate(targetLanguage, text string) (*string, error) {
	if googleTranslateRepository.googleTranslateClient != nil {
		ctx := context.Background()

		lang, err := language.Parse(targetLanguage)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		resp, err := googleTranslateRepository.googleTranslateClient.Translate(ctx, []string{text}, lang, nil)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		if len(resp) == 0 {
			msg := "Empty response from google translate API"
			err := helper.NewHttpError(http.StatusInternalServerError, &msg)
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		return &resp[0].Text, nil
	} else {
		output := text + " " + targetLanguage
		return &output, nil
	}
}
