package postgres

import (
	"database/sql"
	"fmt"
	"log"
)

func (postgresRepository *postgresRepository) CheckContentCreator(CurriculumGroupId int, SubjectId string) (bool, error) {
	query := `
	SELECT
		"u"."id"	
	FROM "curriculum_group"."curriculum_group_content_creator" cgcc
	LEFT JOIN "user"."user" u
		ON "cgcc"."content_creator_id" = "u"."id"
	WHERE "cgcc"."curriculum_group_id" = $1 AND "cgcc"."content_creator_id" = $2
	`

	var userId string
	err := postgresRepository.Database.QueryRow(query, CurriculumGroupId, SubjectId).Scan(&userId)

	if err != nil {

		if err == sql.ErrNoRows {
			return false, fmt.Errorf("user not allowed")
		}
		log.Print(err)
		return false, err
	}

	return true, nil
}
