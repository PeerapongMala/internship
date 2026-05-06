package service

type ServiceInterface interface {
	LevelCreate(in *LevelCreateInput) (*LevelCreateOutput, error)
	LevelGet(in *LevelGetInput) (*LevelGetOutput, error)
	LevelUpdate(in *LevelUpdateInput) (*LevelUpdateOutput, error)
	LevelList(in *LevelListInput) (*LevelListOutput, error)
	LevelCaseListQuestion(in *LevelCaseListQuestionInput) (*LevelCaseListQuestionOutput, error)
	LevelCaseSort(in *LevelSortInput) error
	LevelCaseUploadCsv(in *LevelCaseUploadCsvInput) (*LevelCaseUploadCsvOutput, error)
	CleverMathLevelCaseUploadCsv(in *CleverMathLevelCaseUploadCsvInput) (*CleverMathLevelCaseUploadCsvOutput, error)
	LevelCaseBulkEdit(in *LevelCaseBulkEditInput) error

	SavedTextCreate(in *SavedTextCreateInput) (*SavedTextCreateOutput, error)
	SavedTextGet(in *SavedTextGetInput) (*SavedTextGetOutput, error)
	SavedTextUpdate(in *SavedTextUpdateInput) (*SavedTextUpdateOutput, error)
	SavedTextList(in *SavedTextListInput) (*SavedTextListOutput, error)
	SavedTextCaseUpdateSpeech(in *SavedTextCaseUpdateSpeechInput) (*SavedTextCaseUpdateSpeechOutput, error)
	SavedTextCaseTranslate(in *SavedTextCaseTranslateInput) (*SavedTextCaseTranslateOutput, error)
	SavedTextCaseDeleteSpeech(in *SavedTextCaseDeleteSpeechInput) (*SavedTextCaseDeleteSpeechOutput, error)

	QuestionGet(in *QuestionGetInput) (*QuestionGetOutput, error)
	QuestionDelete(in *QuestionDeleteInput) error
	QuestionCaseSort(in *QuestionCaseSortInput) error
	QuestionCaseDeleteImage(in *QuestionCaseDeleteImageInput) error

	QuestionMultipleChoiceCreate(in *QuestionMultipleChoiceCreateInput) (*QuestionMultipleChoiceCreateOutput, error)
	QuestionMultipleChoiceUpdate(in *QuestionMultipleChoiceUpdateInput) (*QuestionMultipleChoiceUpdateOutput, error)

	QuestionSortCreate(in *QuestionSortCreateInput) (*QuestionSortCreateOutput, error)
	QuestionSortUpdate(in *QuestionSortUpdateInput) (*QuestionSortUpdateOutput, error)

	QuestionGroupCreate(in *QuestionGroupCreateInput) (*QuestionGroupCreateOutput, error)
	QuestionGroupUpdate(in *QuestionGroupUpdateInput) (*QuestionGroupUpdateOutput, error)

	QuestionPlaceholderCreate(in *QuestionPlaceholderCreateInput) (*QuestionPlaceholderCreateOutput, error)
	QuestionPlaceholderUpdate(in *QuestionPlaceholderUpdateInput) (*QuestionPlaceholderUpdateOutput, error)

	QuestionInputCreate(in *QuestionInputCreateInput) (*QuestionInputCreateOutput, error)
	QuestionInputUpdate(in *QuestionInputUpdateInput) (*QuestionInputUpdateOutput, error)

	LessonCaseListBySubject(in *LessonCaseListBySubjectInput) (*LessonCaseListBySubjectOutput, error)
	SubLessonCaseListByLesson(in *SubLessonCaseListByLessonInput) (*SubLessonCaseListByLessonOutput, error)
	TagCaseListBySubject(in *TagCaseListBySubjectInput) (*TagCaseListBySubjectOutput, error)
	SubCriteriaCaseListByCurriculumGroup(in *SubCriteriaCaseListByCurriculumGroupInput) (*SubCriteriaCaseListByCurriculumGroupOutput, error)
	SubLessonCaseGetStandard(in *SubLessonCaseGetStandardInput) (*SubLessonCaseGetStandardOutput, error)

	QuestionCaseTranslate(in *QuestionCaseTranslateInput) (*QuestionCaseTranslateOutput, error)
	QuestionCaseTextSave(in *QuestionCaseTextSaveInput) error
	QuestionCaseCreateSpeech(in *QuestionCaseCreateSpeechInput) error
	QuestionCaseTextToAiSave(in *QuestionCaseTextToAiSaveInput) error

	LevelCaseListStudentAnswer(in *LevelCaseListStudentAnswerInput) (*LevelCaseListStudentAnswerOutput, error)

	// service
	CheckContentCreator(in *CheckContentCreatorInput) error
	DeleteQuestions(in *DeleteQuestionsInput) (*DeleteQuestionsOutput, error)
	DeleteLevels(in *DeleteLevelsInput) (*DeleteLevelsOutput, error)
	ShiftLevel(in *ShiftLevelsInput) error
	GetQuestionText(in *GetQuestionTextInput) (*GetQuestionTextOutput, error)
	GetFullQuestionMultipleChoice(in *GetFullQuestionMultipleChoiceInput) (*GetFullQuestionMultipleChoiceOutput, error)
	GetFullQuestionSort(in *GetFullQuestionSortInput) (*GetFullQuestionSortOutput, error)
	GetFullQuestionPlaceholder(in *GetFullQuestionPlaceholderInput) (*GetFullQuestionPlaceholderOutput, error)
	CreateQuestion(in *CreateQuestionInput) (*CreateQuestionOutput, error)
	CreateQuestionGroupGroups(in *CreateQuestionGroupGroupInput) (*CreateQuestionGroupGroupOutput, error)
	CreateQuestionGroupGroupMember(in *CreateQuestionGroupGroupMemberInput) error
	CreateQuestionText(in *CreateQuestionTextInput) error
	CreateQuestionInputDescriptions(in *CreateQuestionInputDescriptionsInput) error
	CreateQuestionPlaceholderTextChoices(in *CreateQuestionPlaceholderTextChoicesInput) error
	CreateQuestionPlaceholderDescriptions(in *CreateQuestionPlaceholderDescriptionsInput) error
	CreateQuestionMultipleChoiceChoices(in *CreateQuestionMultipleChoiceChoicesInput) error
	CreateQuestionSortTextChoices(in *CreateQuestionSortTextChoicesInput) error
	GetSubjectLanguage(in *GetSubjectLanguageInput) (*GetSubjectLanguageOutput, error)
	UpdateQuestion(in *UpdateQuestionInput) (*UpdateQuestionOutput, error)
	UpdateQuestionText(in *UpdateQuestionTextInput) (*UpdateQuestionTextOutput, error)
	UpdateQuestionMultipleChoiceChoices(in *UpdateQuestionMultipleChoiceChoicesInput) (*UpdateQuestionMultipleChoiceChoicesOutput, error)
	UpdateQuestionGroupGroups(in *UpdateQuestionGroupGroupsInput) error
	UpdateQuestionGroupChoices(in *UpdateQuestionGroupChoicesInput) (*UpdateQuestionGroupChoicesOutput, error)
	UpdateQuestionSortTextChoices(in *UpdateQuestionSortTextChoicesInput) (*UpdateQuestionSortTextChoicesOutput, error)
	UpdateQuestionPlaceholderTextChoices(in *UpdateQuestionPlaceholderTextChoicesInput) (*UpdateQuestionPlaceholderTextChoicesOutput, error)
	UpdateQuestionPlaceholderDescriptions(in *UpdateQuestionPlaceholderDescriptionsInput) (*UpdateQuestionPlaceholderDescriptionsOutput, error)
	ParseAndValidateNotEmptyCsvCell(in *ParseAndValidateNotEmptyCsvCellInput) error
	BuildLevelCsvGeneralError(in *BuildLevelCsvGeneralErrorInput) error
	MapLanguageFromCsv(in *MapLanguageFromCsvInput) (*MapLanguageFromCsvOutput, error)
	MapQuestionTypeFromCsv(in *MapQuestionTypeFromCsvInput) (*MapQuestionTypeFromCsvOutput, error)
	MapBloomFromCsv(in *MapBloomFromCsvInput) (*MapBloomFromCsvOutput, error)
	MapLevelTypeFromCsv(in *MapLevelTypeFromCsvInput) (*MapLevelTypeFromCsvOutput, error)
	MapDifficultyFromCsv(in *MapDifficultyFromCsvInput) (*MapDifficultyFromCsvOutput, error)
	MapLockNextLevelFromCsv(in *MapLockNextLevelFromCsvInput) (*MapLockNextLevelFromCsvOutput, error)
	MapTimerTypeFromCsv(in *MapTimerTypeFromCsvInput) (*MapTimerTypeFromCsvOutput, error)
	MapLayoutTypeFromCsv(in *MapLayoutTypeFromCsvInput) (*MapLayoutTypeFromCsvOutput, error)
	MapLayoutRatioFromCsv(in *MapLayoutRatioFromCsvInput) (*MapLayoutRatioFromCsvOutput, error)
	MapChoiceGridFromCsv(in *MapChoiceGridFromCsvInput) (*MapChoiceGridFromCsvOutput, error)
	MapDescriptionGridFromCsv(in *MapDescriptionGridFromCsvInput) (*MapDescriptionGridFromCsvOutput, error)
	MapChoiceHintFromCsv(in *MapChoiceHintFromCsvInput) (*MapChoiceHintFromCsvOutput, error)
	MapChoiceTypeFromCsv(in *MapChoiceTypeFromCsvInput) (*MapChoiceTypeFromCsvOutput, error)
	CheckRequiredFields(in *CheckRequiredFieldsInput) error

	LevelListByIndicatorId(in *LevelListByIndicatorIdInput) (*LevelListByIndicatorIdOutput, error)
	LevelCaseDownloadZip(in *LevelCaseDownloadZipInput) (*LevelCaseDownloadZipOutput, error)
	UpdateSubLessonFile(in *UpdateSubLessonFileInput) error
	SubLessonUrlList(in *SubLessonUrlListInput) (*SubLessonUrlListOutput, error)
	SubLessonUrlCaseCheck(in *SubLessonUrlCaseCheckInput) (*SubLessonUrlCaseCheckOutput, error)
	SubLessonFileStatusUpdate(in *SubLessonFileStatusUpdateInput) error
	LessonLevelCaseBulkEdit(in *LessonLevelCaseBulkEditInput) error
	SubLessonFileStatusBulkEdit(in *SubLessonFileStatusBulkEditInput) error

	LessonCaseDownloadJson(in *LessonCaseDownloadJsonInput) (*LessonCaseDownloadJsonOutput, error)

	QuestionLearnCreate(in *QuestionLearnCreateInput) (*QuestionLearnCreateOutput, error)
	QuestionLearnUpdate(in *QuestionLearnUpdateInput) (*QuestionLearnUpdateOutput, error)
}
