package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetCountPassLevelByStudentId(homeworkId int, studentIds []string) ([]constant.ContPassLevelEntity, error) {

	query := `
		WITH homework_levels AS ( 
			SELECT 
				htl.level_id 
			FROM "homework"."homework" h 
			JOIN "homework"."homework_template_level" htl ON h.homework_template_id = htl.homework_template_id 
			WHERE h.id = $1 
		) 
		SELECT 
			student_ids.id AS student_id, 
			MAX(lpl.played_at) AS max_played_at, 
			COUNT(lpl.id) AS count 
		FROM ( 
			SELECT 
				UNNEST($2::text[]) AS id 
		) student_ids 
		LEFT JOIN "level"."level_play_log" lpl ON lpl.student_id = student_ids.id 
			AND lpl.homework_id = $1 
			AND lpl.level_id IN ( 
				SELECT 
					level_id 
				FROM homework_levels 
			) 
		GROUP BY student_ids.id 
		ORDER BY student_ids.id;
	`

	entities := []constant.ContPassLevelEntity{}
	err := postgresRepository.Database.Select(&entities, query, homeworkId, studentIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
