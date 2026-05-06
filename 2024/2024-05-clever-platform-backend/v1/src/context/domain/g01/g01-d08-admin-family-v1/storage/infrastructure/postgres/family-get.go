package postgres

import (
	"database/sql"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) FamilyGet(familyID int) (*constant.FamilyResponse, error) {
	query := `
		WITH countUser AS (
			SELECT family_id, COUNT(user_id) AS member_count
			FROM family.family_member
			WHERE family_id = $1
			GROUP BY family_id
		)
		SELECT 
			c.family_id,
			fm.user_id,
			u.first_name,
			u.last_name,
			MAX(a.subject_id) FILTER (WHERE a.provider = 'line') AS line_id,
			c.member_count,
			f.status,
			f.created_at
		FROM countUser c
		JOIN family.family f
			ON f.id = c.family_id
		LEFT JOIN family.family_member fm
			ON c.family_id = fm.family_id
		LEFT JOIN "user".user u
			ON u.id = fm.user_id
		LEFT JOIN auth.auth_oauth a
			ON fm.user_id = a.user_id
		WHERE fm.is_owner = TRUE
		GROUP BY 
			c.family_id, 
			c.member_count, 
			u.first_name,
			u.last_name,
			f.status,
			f.created_at,
			fm.user_id LIMIT 100
	`

	args := []interface{}{familyID}
	family := constant.FamilyResponse{}
	err := postgresRepository.Database.QueryRowx(query, args...).StructScan(&family)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}

		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &family, nil
}
