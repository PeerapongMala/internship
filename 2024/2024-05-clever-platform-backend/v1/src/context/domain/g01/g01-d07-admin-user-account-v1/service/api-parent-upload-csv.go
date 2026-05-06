package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
)

// ==================== Endpoint ==========================

func (api *APIStruct) ParentUploadCSV(context *fiber.Ctx) error {
	// request, err := helper.ParseAndValidateRequest(context, &constant.UploadCSVRequest{})
	// if err != nil {
	// 	return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	// }

	request := constant.UploadCSVInput{}

	csvFile, err := context.FormFile("csv_file")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	request.Csvfile = csvFile

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	request.SubjectId = subjectId

	err = api.Service.ParentUploadCSV(&request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: http.StatusCreated,
		Message:    "Success",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) ParentUploadCSV(req *constant.UploadCSVInput) error {
	tx, err := service.adminUserAccountStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	callback := func(record []string) error {
		// row0 := record[0] //No
		id := record[1]           //Id(ห้ามแก้)
		title := record[2]        //คำนำหน้า
		firstName := record[3]    //ชื่อ
		lastName := record[4]     //นามสกุล
		email := record[5]        // Email
		status := record[6]       //Status
		relationShip := record[7] //ความเกี่ยวข้อง

		userEntity := constant.UserEntity{
			Title:     title,
			FirstName: firstName,
			LastName:  lastName,
			Email:     &email,
			Status:    status,
		}

		// In case create parent
		if len(id) == 0 {
			userEntity.Id = uuid.NewString()
			userEntity.CreatedAt = time.Now().UTC()
			userEntity.CreatedBy = &req.SubjectId

			user, err := service.adminUserAccountStorage.UserCreate(tx, &userEntity)
			if err != nil {
				return err
			}

			_, err = service.adminUserAccountStorage.UserCaseAddUserRole(tx, user.Id, []int{int(constant.Parent)})
			if err != nil {
				return err
			}

			_, err = service.adminUserAccountStorage.ParentCreate(tx, &constant.ParentEntity{
				UserId:       user.Id,
				Relationship: relationShip,
			})
			if err != nil {
				return err
			}

			// In case update parent
		} else {
			now := time.Now().UTC()
			userEntity.Id = id
			userEntity.UpdatedAt = &now
			userEntity.UpdatedBy = &req.SubjectId

			_, err = service.adminUserAccountStorage.UserUpdate(tx, &userEntity)
			if err != nil {
				return err
			}

			err = service.adminUserAccountStorage.ParentUpdate(tx, &constant.ParentEntity{
				UserId:       id,
				Relationship: relationShip,
			})
			if err != nil {
				return err
			}

		}

		return nil
	}

	file, err := req.Csvfile.Open()
	if err != nil {
		return err
	}
	defer file.Close()

	err = helper.ReadCSVFileWithValidateHeaders(&file, callback, nil, constant.ParentCSVHeader)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
