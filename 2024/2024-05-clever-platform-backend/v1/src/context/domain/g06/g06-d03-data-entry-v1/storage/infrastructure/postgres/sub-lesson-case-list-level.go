package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"

func (postgresRepository *postgresRepository) SubLessonCaseListLevel(subLessonIds []int) ([]constant.SubLessonLevel, error) {
	query := `
		SELECT
			"sl"."id" AS "sub_lesson_id",
			"l"."level_type",
			"l"."difficulty"
		FROM "subject"."sub_lesson" sl
		LEFT JOIN "level"."level" l ON "sl"."id" = "l"."sub_lesson_id"
		WHERE sl.id = ANY($1)
	`
	subLessonLevels := []constant.SubLessonLevel{}
	err := postgresRepository.Database.Select(&subLessonLevels, query, subLessonIds)
	if err != nil {
		return nil, err
	}
	return subLessonLevels, nil
}
