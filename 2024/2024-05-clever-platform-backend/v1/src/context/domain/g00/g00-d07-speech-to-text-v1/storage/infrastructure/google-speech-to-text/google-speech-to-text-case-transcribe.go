package googleSpeechToText

import (
	"cloud.google.com/go/speech/apiv1/speechpb"
	"context"
	"fmt"
	"github.com/pkg/errors"
	"io"
	"log"
	"mime/multipart"
	"strings"
)

func (googleSpeechToTextRepository *googleSpeechToTextRepository) GoogleSpeechToTextCaseTranscribe(targetLanguage string, audioFile *multipart.FileHeader) (*string, error) {
	if googleSpeechToTextRepository.googleSpeechToTextClient != nil {
		file, err := audioFile.Open()
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		defer file.Close()

		audioData, err := io.ReadAll(file)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		ctx := context.Background()

		resp, err := googleSpeechToTextRepository.googleSpeechToTextClient.Recognize(ctx, &speechpb.RecognizeRequest{
			Config: &speechpb.RecognitionConfig{Encoding: speechpb.RecognitionConfig_MP3, LanguageCode: targetLanguage, SampleRateHertz: 16000},
			Audio: &speechpb.RecognitionAudio{
				AudioSource: &speechpb.RecognitionAudio_Content{Content: audioData},
			}},
		)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		arr := []string{}
		transcript := ""
		for _, result := range resp.Results {
			for _, alt := range result.Alternatives {
				arr = append(arr, alt.Transcript)
			}
		}
		transcript = strings.Join(arr, " ")
		return &transcript, nil
	} else {
		transcript := fmt.Sprintf(`Speech to text %s mock`, targetLanguage)
		return &transcript, nil
	}
}
