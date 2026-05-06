package postgres

import (
	"fmt"
	"log"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SavedTextCaseListByDate(curriculumGroupId int, startDate *time.Time, endDate *time.Time) ([]constant.SavedTextEntity, error) {
	query := `
		SELECT
			*
		FROM
			"curriculum_group"."saved_text"
		WHERE
			"curriculum_group_id" = $1
	`
	args := []interface{}{curriculumGroupId}
	argsIndex := 2

	if startDate != nil {
		query += fmt.Sprintf(` AND "created_at" >= $%d`, argsIndex)
		args = append(args, startDate)
		argsIndex++
	}
	if endDate != nil {
		query += fmt.Sprintf(` AND "created_at" <= $%d`, argsIndex)
		args = append(args, endDate)
		argsIndex++
	}

	savedTextEntities := []constant.SavedTextEntity{}
	err := postgresRepository.Database.Select(&savedTextEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return savedTextEntities, nil
}
