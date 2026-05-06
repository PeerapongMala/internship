package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) AdditionalPersonWithPersonalDataGet(formId int) ([]constant.AdditionalPersonWithPersonDataEntity, error) {
	query := `
		SELECT 
			efap.id,
			efap.value_type,
			efap.value_id,
			efap.user_type,
			uu.id as user_id,
			uu.email,
			uu.title,
			uu.first_name,
			uu.last_name,
			ARRAY(SELECT uta.teacher_access_id FROM "user".user_teacher_access uta WHERE uta.user_id = uu.id) as teacher_roles 
		from 
			grade.evaluation_form_additional_person efap 
		left join 
			"user"."user" uu
		on efap.user_id = uu.id
		where efap.form_id = $1
		order by uu.id
	`

	var entities []constant.AdditionalPersonWithPersonDataEntity
	err := postgresRepository.Database.Select(&entities, query, formId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
