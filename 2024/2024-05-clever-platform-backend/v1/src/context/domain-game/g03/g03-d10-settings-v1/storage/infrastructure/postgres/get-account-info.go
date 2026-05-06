package postgres

import (
	"database/sql"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d10-settings-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetAccountInfo(userID string) (*constant.AccountInfo, error) {
	query := `
		SELECT
			st.user_id,
			st.school_id,
			st.student_id,
			sc.name as school_name,
			u.first_name,
			u.last_name
		FROM "user".user u
		INNER JOIN "user".student st
			ON u.id = st.user_id
		INNER JOIN school.school sc
			ON st.school_id = sc.id
		WHERE st.user_id = $1
	`

	args := []interface{}{userID}
	account := constant.AccountInfo{}
	err := postgresRepository.Database.QueryRowx(query, args...).StructScan(&account)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}

		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return &account, nil
}
