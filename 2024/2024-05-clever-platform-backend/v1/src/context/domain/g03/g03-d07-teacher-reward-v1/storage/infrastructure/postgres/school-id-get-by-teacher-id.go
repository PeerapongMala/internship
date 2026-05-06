package postgres

func (postgresRepository *postgresRepository) GetSchoolIdByTeacherId(teacherId string) (int, error) {
	query := `
	SELECT
	school_id
	FROM "school"."school_teacher"
	WHERE user_id = $1
	`
	var schoolId int
	err := postgresRepository.Database.QueryRow(query, teacherId).Scan(&schoolId)
	if err != nil {
		return schoolId, err
	}
	return schoolId, nil
}
