package service

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/gorilla/websocket"
)

type SendMessageRequest struct {
	UsersID  []string `json:"users_id"`
	Message  string   `json:"message"`
	SchoolID int      `params:"school_id"`
}

func (api *APIStruct) SendMessage(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SendMessageRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	tokenString := context.Get("Authorization")
	tokenParts := strings.Split(tokenString, " ")
	if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
		log.Printf("Invalid authorization header format")
		return helper.NewHttpError(http.StatusUnauthorized, nil)
	}
	port := os.Getenv("PORT")
	users := strings.Join(request.UsersID, ",")
	url := fmt.Sprintf("ws://localhost:%s/teacher-chat/v1/ws/school/%s/room/private/id/-?token=%s&receivers=%s", port, strconv.Itoa(request.SchoolID), tokenParts[1], users)

	headers := http.Header{}
	conn, _, err := websocket.DefaultDialer.Dial(url, headers)
	if err != nil {
		log.Fatal("dial error:", err)
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}
	defer conn.Close()

	err = conn.WriteMessage(websocket.TextMessage, []byte(request.Message))
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: http.StatusOK,
		Message:    "Data retrieved",
	})
}
