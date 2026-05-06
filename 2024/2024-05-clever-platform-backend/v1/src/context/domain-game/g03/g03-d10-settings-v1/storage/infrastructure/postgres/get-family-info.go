package postgres

import (
	"database/sql"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d10-settings-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetFamilyInfo(userID string) (*constant.FamilyInfo, error) {
	query := `
		with cte_family as (
		SELECT
			fm.family_id,
			fm.user_id
		FROM family.family_member fm
		WHERE fm.user_id = $1
		)
		SELECT 
			fm.family_id,
			fm.user_id,
			u.first_name,
			u.last_name
		FROM family.family_member fm
		INNER JOIN cte_family cf
			ON fm.family_id = cf.family_id
		INNER JOIN "user".user u
			ON u.id = fm.user_id
		WHERE fm.is_owner = true
	`

	args := []interface{}{userID}
	family := constant.FamilyInfo{}
	err := postgresRepository.Database.QueryRowx(query, args...).StructScan(&family)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}

		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	family.StudentUID = userID

	return &family, nil
}
