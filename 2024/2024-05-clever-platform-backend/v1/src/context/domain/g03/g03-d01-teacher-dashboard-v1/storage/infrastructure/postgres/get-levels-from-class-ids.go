package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
)

func (postgresRepository postgresRepository) GetLevelsFromClassIds(classIds []int) (entites []constant.LevelEntity, err error) {
	entites = []constant.LevelEntity{}

	query := `
		SELECT DISTINCT ON (l.id)
			"l".*
		FROM
			"level"."level" "l"
				LEFT JOIN "school"."school_sub_lesson" "ssl" ON 
					"l"."sub_lesson_id" = "ssl"."sub_lesson_id"
		WHERE
			"class_id" = ANY($1)
	`
	args := []interface{}{classIds}

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.LevelEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entites = append(entites, item)
	}

	return
}
