package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d10-teacher-announcement-v1/constant"

func (postgresRepository *postgresRepository) SChoolList() ([]constant.SchoolListResponse, error) {
	query := `
	SELECT 
	id,
	name
	FROM "school"."school"
	`
	rows, err := postgresRepository.Database.Query(query)
	if err != nil {
		return nil, err
	}
	responses := []constant.SchoolListResponse{}
	for rows.Next() {
		response := constant.SchoolListResponse{}
		err := rows.Scan(
			&response.Id,
			&response.Name,
		)
		if err != nil {
			return nil, err
		}
		responses = append(responses, response)
	}
	return responses, nil
}
