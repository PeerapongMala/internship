package postgres

import (
	"database/sql"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/g00/g00-d00-global-v1/constant"
)

func (postgresRepository *postgresRepository) GetUserModelByUserId(studentId string) (*constant.AvatarResponse, error) {
	query := `SELECT
	"ia"."avatar_id",
	"a"."model_id",
	"a"."level",
	"ia"."is_equipped"
	FROM "inventory"."inventory" i
	LEFT JOIN "inventory"."inventory_avatar" ia
	ON "i"."id" = "ia"."inventory_id"
	LEFT JOIN "game"."avatar" a
	ON "ia"."avatar_id" = "a"."id"
	WHERE "i"."student_id" = $1 AND "ia"."is_equipped" = true
	`
	row := postgresRepository.Database.QueryRow(query, studentId)
	response := constant.AvatarResponse{}
	err := row.Scan(
		&response.AvatarId,
		&response.ModelId,
		&response.LevelId,
		&response.Is_equipped,
	)
	if err != nil {
		if err == sql.ErrNoRows {

			return nil, err
		} else {
			return nil, err
		}

	}
	return &response, nil
}
