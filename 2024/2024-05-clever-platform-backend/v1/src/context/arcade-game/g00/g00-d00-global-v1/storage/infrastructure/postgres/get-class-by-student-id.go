package postgres

func (postgresRepository *postgresRepository) GetClassByStudentId(studentId string) (int, error) {
	query := `
	SELECT 
	"c"."id"
	FROM "school"."class_student" cs
	LEFT JOIN "class"."class" c
	ON "cs"."class_id" = "c"."id"

	WHERE 
	"cs"."student_id" = $1
	ORDER BY "c"."academic_year" DESC
	LIMIT 1
	`
	var class int
	err := postgresRepository.Database.QueryRow(query, studentId).Scan(&class)
	if err != nil {
		return 0, err
	}
	return class, nil
}
