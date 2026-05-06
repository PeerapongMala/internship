package constant

var (
	QuestionChoiceTypeTextSpeech string = "text-speech"
	QuestionChoiceTypeImage      string = "image"
	QuestionChoiceTypeSpeech     string = "speech"
)

func MapQuestionChoiceTypeFromCsv(questionChoiceType string) string {
	switch questionChoiceType {
	case "text":
		return QuestionChoiceTypeTextSpeech
	case "image":
		return QuestionChoiceTypeImage
	case "audio":
		return QuestionChoiceTypeSpeech
	}
	return ""
}
