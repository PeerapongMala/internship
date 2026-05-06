package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
	"time"
)

func (postgresRepository *postgresRepository) ClassBulkCreate(tx *sqlx.Tx, schoolId int, userId string, studentClassMap map[string]constant.ClassEntity) (map[string]constant.ClassEntity, error) {
	query := `
        INSERT INTO "class"."class" (
            "school_id",
            "academic_year",
            "year",
            "name",
            "status",
            "created_at",
            "created_by"
        )	
        VALUES
    `
	args := []interface{}{}
	placeholders := []string{}

	keys := make([]string, 0, len(studentClassMap))
	classes := make([]constant.ClassEntity, 0, len(studentClassMap))

	for key, class := range studentClassMap {
		keys = append(keys, key)
		classes = append(classes, class)
	}

	for i := 0; i < len(classes); i++ {
		start := i*7 + 1
		placeholders = append(placeholders, fmt.Sprintf(`($%d, $%d, $%d, $%d, $%d, $%d, $%d)`, start, start+1, start+2, start+3, start+4, start+5, start+6))
		args = append(args,
			schoolId,
			classes[i].AcademicYear,
			classes[i].Year,
			classes[i].Name,
			"enabled",
			time.Now().UTC(),
			userId,
		)
	}

	query += fmt.Sprintf(`%s ON CONFLICT ("school_id", "academic_year", "year", "name") DO NOTHING RETURNING id, academic_year, year, name;`, strings.Join(placeholders, ","))

	rows, err := tx.Query(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	defer rows.Close()

	idMap := map[string]int{}

	for rows.Next() {
		var id int
		var academicYear int
		var year string
		var name string

		if err := rows.Scan(&id, &academicYear, &year, &name); err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		compositeKey := fmt.Sprintf("%d-%s-%s", academicYear, year, name)
		idMap[compositeKey] = id
	}

	if err := rows.Err(); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	updatedMap := make(map[string]constant.ClassEntity)
	for studentId, class := range studentClassMap {
		compositeKey := fmt.Sprintf("%d-%s-%s", class.AcademicYear, class.Year, class.Name)
		if id, exists := idMap[compositeKey]; exists {
			class.Id = id
			updatedMap[studentId] = class
			studentClassMap[studentId] = class
		} else {
			delete(updatedMap, studentId)
		}
	}

	return updatedMap, nil
}
