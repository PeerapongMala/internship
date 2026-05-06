package postgres

func (postgresRepository *postgresRepository) GetClassByYear(Year string, schoolId int) ([]int, error) {
	query := `
	SELECT 
    id
FROM 
    "class"."class"
WHERE 
    year = $1
    AND school_id = $2
    AND academic_year IN (
        SELECT academic_year
        FROM "class"."class"
        WHERE year = $3 AND school_id = $4
    );
	`
	rows, err := postgresRepository.Database.Query(query, Year, schoolId, Year, schoolId)
	if err != nil {
		return nil, err
	}
	responses := []int{}
	for rows.Next() {
		var id int
		rows.Scan(
			&id,
		)
		responses = append(responses, id)
	}
	return responses, nil
}
