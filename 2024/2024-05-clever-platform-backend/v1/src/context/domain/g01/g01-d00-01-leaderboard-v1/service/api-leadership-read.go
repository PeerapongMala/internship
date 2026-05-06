package service

// func (api *APIStruct) LeaderboardGet(context *fiber.Ctx) error {
// 	response, error := api.Service.LeaderboardGet()
// 	if error != nil {
// 		return context.Status(fiber.StatusInternalServerError).JSON(constant.StatusResponse{
// 			StatusCode: fiber.StatusInternalServerError,
// 			Message:    error.Error(),
// 		})
// 	}
// 	return context.Status(fiber.StatusOK).JSON(constant.ListResponse{
// 		StatusCode: fiber.StatusOK,
// 		Total:      len(response),
// 		Data:       response,
// 	})
// }

// func (service *serviceStruct) LeaderboardGet() ([]constant.LeaderboardGetResponse, error) {
// 	response, err := service.leaderboardStorage.LeaderboardGet()
// 	if err != nil {
// 		log.Printf("Error Get announce: %v", err)
// 		return nil, err
// 	}

// 	return response, nil
// }
