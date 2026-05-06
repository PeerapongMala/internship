package googleTextToSpeech

import (
	"cloud.google.com/go/texttospeech/apiv1/texttospeechpb"
	"context"
	"fmt"
	"github.com/pkg/errors"
	"log"
)

func (googleTextToSpeechRepository *googleTextToSpeechRepository) TextToSpeechCaseGenerateSpeech(text string, languageCode string) ([]byte, error) {
	if googleTextToSpeechRepository.googleTextToSpecchClient != nil {
		req := texttospeechpb.SynthesizeSpeechRequest{
			Input: &texttospeechpb.SynthesisInput{
				InputSource: &texttospeechpb.SynthesisInput_Text{Text: text},
			},
			Voice: &texttospeechpb.VoiceSelectionParams{
				LanguageCode: languageCode,
				SsmlGender:   texttospeechpb.SsmlVoiceGender_NEUTRAL,
			},
			AudioConfig: &texttospeechpb.AudioConfig{
				AudioEncoding: texttospeechpb.AudioEncoding_MP3,
			},
		}

		ctx := context.Background()
		resp, err := googleTextToSpeechRepository.googleTextToSpecchClient.SynthesizeSpeech(ctx, &req)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		return resp.AudioContent, nil
	} else {
		return []byte(fmt.Sprintf(`%s speech in language %s`, text, languageCode)), nil
	}
}
