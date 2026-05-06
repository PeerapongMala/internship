package storageRepository

type Repository interface {
	TextToSpeechCaseGenerateSpeech(text string, languageCode string) ([]byte, error)
}
