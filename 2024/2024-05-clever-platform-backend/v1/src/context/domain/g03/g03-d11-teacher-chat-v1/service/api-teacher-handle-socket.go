package service

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"log"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
var (
	connMap = make(map[RoomKey]*websocket.Conn)
	// broadcast  = make(chan constant.MessageList)
	broadcast  = make(chan Broadcast)
	register   = make(chan constant.Client)
	unregister = make(chan constant.Client)
	mu         sync.Mutex
	// users      = []*string{}
)

type RoomKey struct {
	SchoolID int
	RoomType string
	RoomID   string
	UserID   string
	isActive bool
}

type Broadcast struct {
	constant.MessageList
	Users []*string
}

func (api *APIStruct) HandleWebSocket(context *fiber.Ctx) error {
	return websocket.New(func(conn *websocket.Conn) {
		subjectId, ok := conn.Locals("subjectId").(string)
		if !ok {
			log.Println("subjectId error")
			return
		}

		role, ok := conn.Locals("roles").([]int)
		if !ok {
			log.Println("role error")
			return
		}

		schoolIDStr := conn.Params("school_id")
		schoolID, err := strconv.Atoi(schoolIDStr)
		if err != nil {
			log.Println("Invalid school_id:", err)
			return
		}

		validateReq := &constant.ValidateRequest{
			RoomType: conn.Params("room_type"),
			Role:     role,
			SchoolID: schoolID,
			UserID:   subjectId,
		}

		var receivers []string
		if conn.Params("room_id") == "-" { // Send message to multiple users
			receiverParam := conn.Query("receivers")
			receivers = strings.Split(receiverParam, ",")
			for _, receiver := range receivers {
				validateReq.OtherID = strings.TrimSpace(receiver)
				exists, err := api.Service.ValidatePrivilege(validateReq)
				if err != nil || !exists {
					log.Println("Validation error or Unauthorized")
					return
				}
			}
		} else { // Send message to one users
			validateReq.OtherID = conn.Params("room_id")
			exists, err := api.Service.ValidatePrivilege(validateReq)
			if err != nil || !exists {
				log.Println("Validation error or Unauthorized")
				return
			}
		}

		var roomIDs []string
		var receiversID []*string
		roomType := conn.Params("room_type")
		roomID := conn.Params("room_id")

		if roomType == "private" && roomID != "-" {
			recv_id := conn.Params("room_id")
			receiversID = append(receiversID, &recv_id)
			roomIDs = append(roomIDs, hashUUIDs(subjectId, conn.Params("room_id")))

		} else if roomType == "private" && roomID == "-" {
			for _, receiver := range receivers {
				roomIDs = append(roomIDs, hashUUIDs(subjectId, receiver))
				receiversID = append(receiversID, &receiver)
			}
		} else {
			receiversID = nil
			roomIDs = append(roomIDs, roomID)
		}

		clientObj := constant.Client{
			SenderID:   subjectId,
			SchoolID:   schoolID,
			RoomID:     roomIDs,
			RoomType:   roomType,
			ReceiverID: receiversID,
			Conn:       conn,
		}

		defer func() {
			unregister <- clientObj
			conn.Close()
		}()

		// Register the client
		register <- clientObj

		// Delegate message handling to the service
		err = api.Service.HandleWebSocket(conn, &clientObj)
		if err != nil {
			log.Println("Error handling client messages:", err)
		}
	})(context)
}

// ==================== Service ==========================
func (service *serviceStruct) HandleWebSocket(conn *websocket.Conn, client *constant.Client) error {
	log.Println("service socket handler")

	go func() {
		ticker := time.NewTicker(pingPeriod)
		defer ticker.Stop()

		for {
			<-ticker.C

			conn.SetWriteDeadline(time.Now().Add(writeTimeout))
			if err := conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				log.Println("Ping error:", err)
				conn.Close()
				return
			}
		}
	}()

	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Println("read error:", err)
			}
			return err
		}

		messageStr := string(message)
		payload := constant.Message{
			Content:   &messageStr,
			CreatedAt: time.Now().UTC(),
			SchoolID:  client.SchoolID,
			SenderID:  client.SenderID,
			RoomType:  client.RoomType,
		}

		// -------------------------------------------------------------------------------------------------------
		for idx, roomID := range client.RoomID {
			if client.ReceiverID != nil {
				payload.ReceiverID = client.ReceiverID[idx]
			}
			payload.RoomID = roomID

			save_message, err := service.teacherChatStorage.SaveMessage(&payload)
			if err != nil {
				return err
			}
			payload.ID = save_message.ID

			info, err := service.teacherChatStorage.GetInformationSender(client.SenderID)
			info.Message = payload

			var users []*string
			if client.RoomType == "private" {
				users = append(users, info.Message.ReceiverID)
			} else {
				users, err = service.teacherChatStorage.FindAllUsersByFilter(info.Message.SchoolID, info.Message.RoomType, info.Message.RoomID)
				if err != nil {
					log.Println("Error finding users by filter:", err.Error())
					return err
				}
			}

			broadcastMsg := Broadcast{
				MessageList: *info,
				Users:       users,
			}

			if messageType == websocket.TextMessage {
				// broadcast <- *info
				broadcast <- broadcastMsg
			}
		}
	}
}

func SocketHandler() {
	log.Println(" --- socket handler --- ")
	for {
		select {
		case message := <-broadcast:
			messageBytes, err := json.Marshal(message)
			if err != nil {
				log.Println("Error marshalling message:", err)
				break
			}

			for key, conn := range connMap {
				if key.SchoolID == message.Message.SchoolID &&
					key.RoomType == message.Message.RoomType &&
					key.RoomID == message.Message.RoomID {

					if err := conn.WriteMessage(websocket.TextMessage, messageBytes); err != nil {
						RemoveClient(key.RoomID, key.UserID, key.RoomType, key.SchoolID)
					}

				}
			}

			// Update chat list for the user
			updateChat := UpdateChatListMessage{
				MessageID: message.Message.ID,
				SenderID:  message.Message.SenderID,
				FirstName: message.FirstName,
				LastName:  message.Lastname,
				RoomType:  message.Message.RoomType,
				RoomID:    message.Message.RoomID,
				TimeStamp: message.Message.CreatedAt,
				SchoolID:  message.Message.SchoolID,
				Message:   *message.Message.Content,
			}

			updateChatBytes, err := json.Marshal(updateChat)
			if err != nil {
				log.Println("Error marshalling message:", err)
				break
			}

			if err != nil {
				log.Println("Error finding users by filter:", err)
				break
			}
			for _, userID := range message.Users {
				user := UserKey{
					UserID:   *userID,
					SchoolID: message.Message.SchoolID,
				}

				if con, ok := rooms[user]; ok {
					if err := con.WriteMessage(websocket.TextMessage, updateChatBytes); err != nil {
						RemoveClient_(
							*userID,
							message.Message.SchoolID,
						)

						log.Println("write:", err)
						con.Close()
						break
					}
				}
			}

		case client := <-register:
			mu.Lock()
			for _, roomID := range client.RoomID {
				key := RoomKey{
					SchoolID: client.SchoolID,
					RoomType: client.RoomType,
					RoomID:   roomID,
					UserID:   client.SenderID,
				}
				connMap[key] = client.Conn
			}
			mu.Unlock()

		case client := <-unregister:
			// RemoveClient(client.RoomID, client.SenderID)
			for _, roomID := range client.RoomID {
				RemoveClient(roomID, client.SenderID, client.RoomType, client.SchoolID)
			}
		}

	}
}

func RemoveClient(roomID, userID, roomType string, schoolID int) {
	// ------ Remove from connMap ------
	key := RoomKey{
		SchoolID: schoolID,
		RoomID:   roomID,
		UserID:   userID,
		RoomType: roomType,
	}

	mu.Lock()
	if conn, ok := connMap[key]; ok {
		conn.Close()
		delete(connMap, key)
	}
	mu.Unlock()
}

func hashUUIDs(sender, receiver string) string {

	var data string
	data = sender + receiver
	if receiver < sender {
		data = receiver + sender
	}

	hash := sha256.New()
	hash.Write([]byte(data))
	hashed := hash.Sum(nil)

	return hex.EncodeToString(hashed)[:8]
}
