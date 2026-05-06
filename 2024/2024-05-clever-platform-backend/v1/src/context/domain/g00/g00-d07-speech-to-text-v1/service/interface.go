package service

type ServiceInterface interface {
	SpeechToTextCaseTranscribe(in *SpeechToTextCaseTranscribeInput) (*SpeechToTextCaseTranscribeOutput, error)
}
