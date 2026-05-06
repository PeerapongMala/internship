package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) MemberInFamily(userID string) (*constant.FamilyMembers, error) {
	query := `
		WITH get_family_id as (
			SELECT 
				family_id
			FROM family.family_member fm
			WHERE fm.user_id = $1
		)
		SELECT
			fm.family_id,
			CASE 
				WHEN p.user_id IS NOT NULL THEN 'parent'
				ELSE 'student'   
			END as role,
			fm.user_id,
			u.title,
			u.first_name,
			u.last_name,
			u.image_url,
			fm.is_owner
		FROM family.family_member fm
		INNER JOIN get_family_id gf
			ON fm.family_id = gf.family_id
		INNER JOIN "user".user u
			ON u.id = fm.user_id
		LEFT JOIN "user".student st
			ON st.user_id = fm.user_id
		LEFT JOIN "user".parent p
			ON p.user_id = fm.user_id
	`

	args := []interface{}{userID}
	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	var family constant.FamilyMembers
	members := []*constant.Member{}

	for rows.Next() {
		var member constant.Member
		if err := rows.Scan(
			&family.FamilyID,
			&member.Role,
			&member.UserID,
			&member.Title,
			&member.FirstName,
			&member.LastName,
			&member.ImageUrl,
			&member.IsOwner,
		); err != nil {
			return nil, err
		}

		members = append(members, &member)
	}

	// if members == nil {
	// 	members = []*constant.Member{}
	// }

	family.Member = members
	return &family, nil
}
