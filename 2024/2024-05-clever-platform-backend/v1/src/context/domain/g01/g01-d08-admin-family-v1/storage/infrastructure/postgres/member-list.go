package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) FamilyMember(familyID int) ([]*constant.Member, error) {
	query := `
		SELECT 
			   fm.family_id,
			   fm.user_id,
			   u.first_name, 
			   u.last_name,
               fm.is_owner
		FROM family.family_member fm
        INNER JOIN "user".parent p
        	ON fm.user_id = p.user_id
		INNER JOIN "user".user u
			ON p.user_id = u.id
		WHERE fm.family_id = $1
	`

	args := []interface{}{familyID}
	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	var members []*constant.Member
	for rows.Next() {
		member := constant.Member{}
		err := rows.StructScan(&member)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		members = append(members, &member)
	}

	log.Println("Member: ", members)

	return members, nil
}
