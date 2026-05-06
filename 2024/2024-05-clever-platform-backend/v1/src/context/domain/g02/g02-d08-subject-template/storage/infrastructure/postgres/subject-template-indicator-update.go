package postgres

import (
	"encoding/json"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d08-subject-template/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubjectTemplateIndicatorUpdate(tx *sqlx.Tx, subjectTemplateId int, indicators []constant.SubjectTemplateIndicatorEntity) error {
	baseQuery := `
		DELETE FROM "grade"."subject_template_indicator"
		WHERE "subject_template_id" = $1
	`
	_, err := tx.Exec(baseQuery, subjectTemplateId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	if len(indicators) == 0 {
		return nil
	}

	baseQuery = `
		INSERT INTO "grade"."subject_template_indicator" (
			"subject_template_id",
			"sub_lesson_id",
			"name",
			"type",
			"index",
			"value"
		)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING "id"
	`

	for _, indicator := range indicators {
		var indicatorId int
		err := tx.QueryRowx(baseQuery, subjectTemplateId, indicator.SubLessonId, indicator.Name, indicator.Type, indicator.Index, indicator.Value).Scan(&indicatorId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}

		query := `
			DELETE FROM "grade"."indicator_level_setting"
			WHERE "subject_template_indicator_id" = $1
		`
		_, err = tx.Exec(query, indicatorId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}

		if len(indicator.Levels) == 0 {
			continue
		}

		query = `
			INSERT INTO "grade"."indicator_level_setting" (
				"subject_template_indicator_id",
				"level_type",
				"weight",
				"levels",
				"level_count"
			)
			VALUES ($1, $2, $3, $4, $5)
		`
		for _, level := range indicator.Levels {
			levelsJson, err := json.Marshal(level.Levels)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
			_, err = tx.Exec(query, indicatorId, level.LevelType, level.Weight, string(levelsJson), level.LevelCount)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
		}
	}

	return nil
}
