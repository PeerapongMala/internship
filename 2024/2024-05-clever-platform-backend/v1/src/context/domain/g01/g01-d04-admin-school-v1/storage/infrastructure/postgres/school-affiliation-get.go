package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"

func (postgresRepository *postgresRepository) GetSchoolAffiliation(SchoolAffiliationId int) (constant.SchoolAffilation, error) {
	query := `
	SELECT 
		id,
		school_affiliation_group,
		type,
		name,
		short_name,
		status,
		created_at,
		created_by,
		updated_at,
		updated_by
		FROM "school_affiliation"."school_affiliation"
		WHERE id = $1
	`

	response := constant.SchoolAffilation{}
	row := postgresRepository.Database.QueryRow(query, SchoolAffiliationId)

	err := row.Scan(
		&response.Id,
		&response.SchoolAffiliationGroup,
		&response.Type,
		&response.Name,
		&response.ShortName,
		&response.Status,
		&response.CreatedAt,
		&response.CreatedBy,
		&response.UpdatedAt,
		&response.UpdatedBy,
	)
	if err != nil {
		return response, err
	}
	return response, nil

}
