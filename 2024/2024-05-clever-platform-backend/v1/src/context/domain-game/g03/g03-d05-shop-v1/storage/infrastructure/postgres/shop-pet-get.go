package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/constant"
)

func (postgresRepository *postgresRepository) GetShopPet(studentId string, petId int) (r constant.ShopPetResponse, err error) {
	query := `
			SELECT inv_pet.inventory_id, inv_pet.pet_id, g_pet.model_id
			FROM "inventory"."inventory_pet" inv_pet
			LEFT JOIN "game"."pet" g_pet ON g_pet."id" = inv_pet.pet_id
			WHERE inv_pet.inventory_id = (SELECT id FROM "inventory"."inventory" inv WHERE inv.student_id = $1)
			AND inv_pet.pet_id = $2
			`
	if err = postgresRepository.Database.Get(&r, query, studentId, petId); err != nil {
		log.Printf("err: %s", err.Error())
		return r, err
	}

	return r, nil

}
