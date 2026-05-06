package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LevelCaseAutoSort(tx *sqlx.Tx, subLessonId int) error {
	query := `
		UPDATE "level"."level" l
		SET 
		    "index" = "sorted"."row_num"
		FROM (
		    SELECT 
				"id",
				"index",
				"status",
				ROW_NUMBER() OVER (
           			ORDER BY 
               			CASE 
							WHEN "status" = 'enabled' THEN 0
               			    WHEN "status" = 'disabled' THEN 2
							ELSE 1
						END,
               			"status",
               			"index"
       			) AS "row_num" 
		    FROM "level"."level"
		    WHERE "sub_lesson_id" = $1
		) AS "sorted"
		WHERE "l"."id" = "sorted"."id"
	`
	_, err := tx.Exec(query, subLessonId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
