package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
	"log"
)

func (postgresRepository postgresRepository) GetLevelsFromHomeworkTemplateIds(homeworkIds []int) (homeworkLevels []constant.HomeworkLevels, err error) {
	query := `
		SELECT
			"h"."id" AS "homework_id",
			ARRAY_AGG("htl"."level_id") AS "level_ids"
		FROM
		    "homework"."homework" h
		INNER JOIN "homework"."homework_template_level" htl ON "h"."homework_template_id" = "htl"."homework_template_id"
		WHERE
		    "h"."id" = ANY($1)
		GROUP BY "h"."id"
	`
	err = postgresRepository.Database.Select(&homeworkLevels, query, homeworkIds)
	if err != nil {
		log.Printf("%+v", err)
		return homeworkLevels, err
	}
	return homeworkLevels, nil
}
