package postgres

func (postgresRepository *postgresRepository) ValidateTeacher(teacherId string, schoolId int) (bool, error) {
	query := `
		SELECT EXISTS (
			SELECT 1 FROM "school"."school_teacher" st
			WHERE "user_id" = $1
			AND "school_id" = $2	
		)
	`
	isValid := false
	err := postgresRepository.Database.QueryRowx(query, teacherId, schoolId).Scan(&isValid)
	if err != nil {
		return false, err
	}

	return isValid, nil
}
