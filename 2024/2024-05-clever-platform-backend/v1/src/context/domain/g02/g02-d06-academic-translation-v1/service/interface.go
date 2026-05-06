package service

type ServiceInterface interface {
	SavedTextCreate(in *SavedTextCreateInput) (*SavedTextCreateOutput, error)
	SavedTextGet(in *SavedTextGetInput) (*SavedTextGetOutput, error)
	SavedTextUpdate(in *SavedTextUpdateInput) (*SavedTextUpdateOutput, error)
	SavedTextCaseTranslate(in *SavedTextCaseTranslateInput) (*SavedTextCaseTranslateOutput, error)
	SavedTextList(in *SavedTextListInput) (*SavedTextListOutput, error)
	SavedTextCaseUpdateSpeech(in *SavedTextCaseUpdateSpeechInput) (*SavedTextCaseUpdateSpeechOutput, error)
	SavedTextCaseUpdateStatus(in *SavedTextCaseUpdateStatusInput) (*SavedTextCaseUpdateStatusOutput, error)
	SaveTextCaseToggleSpeech(in *SavedTextCaseToggleSpeechInput) (*SavedTextCaseToggleSpeechOutput, error)
	SavedTextCaseBulkEdit(in *SavedTextBulkEditInput) error
	SavedTextCaseDownloadCsv(in *SavedTextCaseDownloadCsvInput) (*SavedTextCaseDownloadCsvOutput, error)
	SavedTextCaseUploadCsv(in *SavedTextCaseUploadCsvInput) error
}
