package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"

func (postgresRepository *postgresRepository) GetTeacherItem(teacherId string) ([]constant.ItemList, error) {
	query := `
	SELECT
	"i"."id",
	"i"."name"
	FROM "item"."item" i
	LEFT JOIN "teacher_item"."teacher_item_group" tig
	ON "i"."teacher_item_group_id" = "tig"."id" 
	WHERE "tig"."teacher_id" = $1
	`
	response := []constant.ItemList{}
	err := postgresRepository.Database.Select(&response, query, teacherId)
	if err != nil {
		return nil, err

	}
	return response, nil

}
