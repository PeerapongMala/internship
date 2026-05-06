package service

import (
	"bytes"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"

	constant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d05-redeem-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

// ==================== Request ==========================
func (api *APIStruct) CouponDownloadCSV(context *fiber.Ctx) error {

	request := &constant.CsvDowloadRequest{}
	err := context.QueryParser(request)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if request.StartDate == "" {
		textMsg := "start_date is required"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &textMsg))
	}

	if request.EndDate == "" {
		textMsg := "end_date is required"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &textMsg))
	}

	fileBytes, err := api.Service.CouponDownloadCSV(request)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	reader := bytes.NewReader(fileBytes)
	context.Attachment("download.csv")

	return context.SendStream(reader)
}

func (service *serviceStruct) CouponDownloadCSV(req *constant.CsvDowloadRequest) ([]byte, error) {

	response, err := service.redeemStorage.GetCouponDataList()
	if err != nil {
		return nil, err
	}

	startTime, err := helper.ConvertTimeStringToTime(req.StartDate)
	if err != nil {
		return nil, err
	}

	endTime, err := helper.ConvertTimeStringToTime(req.EndDate)
	if err != nil {
		return nil, err
	}

	//filter by date
	response, err = helper.FilterStructWithDate(*startTime, *endTime, response, "CreatedAt")
	if err != nil {
		return nil, err
	}

	//prepare csv data
	//"No", "ID(ห้ามแก้)", "รหัสโค้ดคูปอง", "วันที่เวลาเริ่มเผยแพร่", "วันที่เวลาหมดอายุ", "จำนวนคูปองสูงสุด (ใส่-1 ถ้าต้องการเป็นแบบไม่จำกัด)", "เหรียญทอง", "เหรียญ arcade", "น้ำแข็ง"
	csvData := [][]string{constant.CouponCsvHeader}
	for i, item := range response {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			helper.HandleIntPointerField(item.Id),
			helper.HandleStringPointerField(item.Code),
			helper.HandleTimePointerToField(item.StartedAt),
			helper.HandleTimePointerToField(item.UpdatedAt),
			helper.HandleIntPointerField(item.InitialStock),
			helper.HandleIntPointerField(item.GoldCoinAmount),
			helper.HandleIntPointerField(item.ArcadeCoinAmount),
			helper.HandleIntPointerField(item.IceAmount),
			helper.HandleStringPointerField(item.Status),
		})
	}

	//convert to csv
	dataBytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return dataBytes, nil
}
