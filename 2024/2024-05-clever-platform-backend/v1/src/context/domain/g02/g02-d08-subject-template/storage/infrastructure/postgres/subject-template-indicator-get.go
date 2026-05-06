package postgres

import (
	"encoding/json"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d08-subject-template/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubjectTemplateIndicatorGet(id int) (*constant.SubjectTemplateIndicatorEntity, error) {
	indicatorQuery := `
			SELECT
				"sti"."id",
				"sti"."subject_template_id",
				"sti"."sub_lesson_id",
				"sti"."name",
				"sti"."type",
				"sti"."index",
				"sti"."value",
				ls.id AS "lesson_id"
			FROM "grade"."subject_template_indicator" sti
			INNER JOIN "subject"."sub_lesson" sl ON "sti"."sub_lesson_id" = "sl"."id"
			INNER JOIN "subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id"
			WHERE sti."id" = $1
		`

	levelQuery := `
		SELECT
			"subject_template_indicator_id",
			"level_type",
			"weight",
			"levels",
			COALESCE("level_count", 0) AS "level_count"
		FROM "grade"."indicator_level_setting"
		WHERE "subject_template_indicator_id" = $1
	`
	indicator := constant.SubjectTemplateIndicatorEntity{}
	err := postgresRepository.Database.QueryRowx(indicatorQuery, id).StructScan(&indicator)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	err = postgresRepository.Database.Select(&indicator.Levels, levelQuery, indicator.Id)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	for k, level := range indicator.Levels {
		err = json.Unmarshal([]byte(level.LevelsString), &indicator.Levels[k].Levels)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	return &indicator, nil
}
