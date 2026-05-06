package postgres

func (postgresRepository postgresRepository) GetStudentCount(classIds []int) (count int, err error) {
	query := `
		SELECT
			COUNT(*)
		FROM
			"school"."class_student"
	`

	args := []interface{}{}
	if len(classIds) > 0 {
		args = append(args, classIds)
		query += ` WHERE "school"."class_student"."class_id" = ANY($1)`
	}

	row := postgresRepository.Database.QueryRowx(query, args...)
	if row.Err() != nil {
		err = row.Err()
		return
	}

	type queryResult struct {
		Count int `db:"count"`
	}
	result := queryResult{}
	err = row.StructScan(&result)
	if err != nil {
		return
	}
	count = result.Count
	return
}
