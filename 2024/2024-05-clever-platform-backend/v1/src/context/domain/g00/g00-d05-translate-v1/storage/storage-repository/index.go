package storageRepository

type Repository interface {
	GoogleTranslateCaseTranslate(targetLanguage, text string) (*string, error)
}
