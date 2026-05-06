package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"

func (postgresRepository *postgresRepository) GetLevelsFromSubLessonIds(subLessonIds []int) (entities []constant.LevelEntity, err error) {
	query := `
		SELECT
			l.*
		FROM
			level.level AS l
		WHERE
			l.sub_lesson_id = ANY($1)
	`
	args := []interface{}{subLessonIds}
	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return
	}
	defer rows.Close()

	entities = []constant.LevelEntity{}
	for rows.Next() {
		item := constant.LevelEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
