package service

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d05-redeem-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================

type UploadCouponCSVRequest struct {
	constant.CSVUploadRequest
	SubjectId    string
	AdminLoginAs *string
}

func (api *APIStruct) CouponUploadCSV(context *fiber.Ctx) error {

	request := &UploadCouponCSVRequest{}

	csvFile, err := context.FormFile("csv_file")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	adminLoginAs := context.FormValue("admin_login_as")

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, err)
	}

	request.Csvfile = csvFile
	request.SubjectId = subjectId
	if adminLoginAs != "" {
		request.AdminLoginAs = &adminLoginAs
	}

	err = api.Service.CouponUploadCSV(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: http.StatusCreated,
		Message:    "OK",
	})
}

func (service *serviceStruct) CouponUploadCSV(req *UploadCouponCSVRequest) error {

	tx, err := service.redeemStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	//"No", "ID(ห้ามแก้)", "รหัสโค้ดคูปอง", "วันที่เวลาเริ่มเผยแพร่", "วันที่เวลาหมดอายุ", "จำนวนคูปองสูงสุด (ใส่-1 ถ้าต้องการเป็นแบบไม่จำกัด)", "เหรียญทอง", "เหรียญ arcade", "น้ำแข็ง"
	callback := func(record []string) error {
		row0 := record[0] //No
		row1 := record[1] //Id
		row2 := record[2] //couponCode
		row3 := record[3] //startDate
		row4 := record[4] //endDate
		row5 := record[5] //coupon count
		row6 := record[6] //goldCoin
		row7 := record[7] //arcadeCoin
		row8 := record[8] //iceCube
		row9 := record[9] //status

		//validate Status
		err := constant.ValidateStatus(row9)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return errors.Errorf("CSVFile RowNo: %s is error by invalid status", record[0])
		}

		var id int
		if row1 != "" {
			id, err = strconv.Atoi(row1)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return errors.Errorf("CSVFile RowNo: %s is error by id is not integer", row0)
			}
		}

		startTime, err := helper.ConvertTimeStringToTime(row3)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return errors.Errorf("CSVFile RowNo: %s is error by time format not support", row0)
		}

		endTime, err := helper.ConvertTimeStringToTime(row4)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return errors.Errorf("CSVFile RowNo: %s is error by time format not support", row0)
		}

		stock := 0
		if row5 != "" {
			stock, err = strconv.Atoi(row5)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return errors.Errorf("CSVFile RowNo: %s is error by coupon count is not integer", row0)
			}
		}

		goldCoin := 0
		if row6 != "" {
			goldCoin, err = strconv.Atoi(row6)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return errors.Errorf("CSVFile RowNo: %s is error by gold coin is not integer", row0)
			}
		}

		arcadeCoin := 0
		if row7 != "" {
			arcadeCoin, err = strconv.Atoi(row7)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return errors.Errorf("CSVFile RowNo: %s is error by arcade coin is not integer", row0)
			}
		}

		iceAmount := 0
		if row8 != "" {
			iceAmount, err = strconv.Atoi(row8)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return errors.Errorf("CSVFile RowNo: %s is error by iceAmount is not integer", row0)
			}
		}

		//prepare Struct to save
		now := time.Now().UTC()
		couponEntity := constant.CouponEntity{
			Id:        &id,
			Code:      &row2,
			StartedAt: startTime,
			EndedAt:   endTime,
			InitialStock: &stock,
			Stock:  		&stock,
			GoldCoinAmount: &goldCoin,
			ArcadeCoinAmount: &arcadeCoin,
			IceAmount: &iceAmount,
			Status: 	&row9,
			CreatedAt: &now,
			UpdatedAt: &now,
			CreatedBy: &req.SubjectId,	
			UpdatedBy: &req.SubjectId,
		}

		if id != 0 {
			//update
			err = service.redeemStorage.UpdateCoupon(tx, &couponEntity)	
		} else {
			//create
			_, err = service.redeemStorage.InsertCoupon(tx, &couponEntity)
		}

		if err != nil {
			return errors.Errorf("CSVFile RowNo: %s is %s", record[0], err.Error())
		}

		return nil
	}

	file, err := req.Csvfile.Open()
	if err != nil {
		return err
	}
	defer file.Close()

	err = helper.ReadCSVFileWithValidateHeaders(&file, callback, nil, constant.CouponCsvHeader)
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
