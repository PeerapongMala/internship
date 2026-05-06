package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SavedTextGet(groupId string) (*constant.SavedTextDataEntity, error) {
	query := `
		SELECT 
			*
		FROM
			"curriculum_group"."saved_text"
		WHERE
			"group_id" = $1
	`
	savedTextEntities := []constant.SavedTextEntity{}
	err := postgresRepository.Database.Select(&savedTextEntities, query, groupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	savedTextDataEntity := constant.SavedTextDataEntity{
		GroupId:      groupId,
		Translations: map[string]constant.SavedTextEntity{},
	}
	for _, savedTextEntity := range savedTextEntities {
		savedTextDataEntity.Translations[savedTextEntity.Language] = savedTextEntity
	}

	return &savedTextDataEntity, nil
}
