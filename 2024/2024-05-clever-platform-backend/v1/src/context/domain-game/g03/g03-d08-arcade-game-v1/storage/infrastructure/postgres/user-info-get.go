package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d08-arcade-game-v1/constant"

func (postgresRepository *postgresRepository) UserInfoGet(studentId string) (*constant.UserResponse, error) {
	query := `
	SELECT
	"u"."id",
	"u"."first_name",
	"u"."image_url",
	"i"."arcade_coin"
	FROM "user"."user" u
	LEFT JOIN "inventory"."inventory" i
	ON "u"."id" = "i"."student_id"
	WHERE "u"."id" = $1
	`

	response := constant.UserResponse{}
	err := postgresRepository.Database.Get(&response, query, studentId)
	if err != nil {
		return nil, err

	}
	return &response, nil
}
