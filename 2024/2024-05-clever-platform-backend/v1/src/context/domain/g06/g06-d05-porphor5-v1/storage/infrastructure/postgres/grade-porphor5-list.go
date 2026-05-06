package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetListPorphor5ByFormID(formID int, ids ...int) ([]constant.Porphor5DataEntity, error) {
	maskJsonData := len(ids) == 0 // mask when get all rows
	query := `
		SELECT 
			pd.id,
			pd.form_id,
			pd."order",
			pd.name,
			pd.data_json,
			pd.created_at,
			COALESCE("gt"."additional_data", "efge"."additional_data") AS "additional_data"
		FROM
			grade.porphor5_data pd
		LEFT JOIN "grade"."evaluation_form_general_evaluation" efge ON "pd"."form_id" = "efge"."form_id" AND "efge"."template_type" = ANY($2) AND "efge"."template_type" = "pd"."name"
		LEFT JOIN "grade"."template_general_evaluation" tge ON "efge"."template_general_evaluation_id" = "tge"."id"
		LEFT JOIN "grade"."general_template" gt ON "tge"."general_template_id" = "gt"."id"
		WHERE pd.form_id = $1
	`

	args := []interface{}{formID, []constant.Porphor5Category{constant.NutritionalStatus, constant.Attendance}}

	if len(ids) > 0 {
		query += " AND pd.id = ANY($3)"
		args = append(args, ids)
	}

	query += ` ORDER BY "pd"."order" ASC, id DESC`

	var entities []constant.Porphor5DataEntity
	err := postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if maskJsonData {
		for i := range entities {
			entities[i].DataJson = ""
		}
	}

	return entities, nil
}
