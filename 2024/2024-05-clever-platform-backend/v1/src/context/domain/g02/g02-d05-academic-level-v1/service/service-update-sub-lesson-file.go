package service

import (
	"archive/zip"
	"bytes"
	"compress/flate"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"sync"
	"time"

	fileType "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type UpdateSubLessonFileInput struct {
	subjectId       string
	subLessonId     int
	EmbeddedFile    bool
	LevelFile       bool
	GroupLevelFiles bool
}

type DownloadedFile struct {
	Filename string
	Data     []byte
}

func (service *serviceStruct) UpdateSubLessonFile(in *UpdateSubLessonFileInput) error {
	levels, err := service.LevelCaseDownloadZip(&LevelCaseDownloadZipInput{
		LevelCaseDownloadZipRequest: &LevelCaseDownloadZipRequest{
			SubLessonId: in.subLessonId,
			LevelFilter: &constant.LevelFilter{},
		},
	})
	if err != nil {
		return err
	}

	subLesson, err := service.academicLevelStorage.SubLessonGet(in.subLessonId)
	if err != nil {
		return err
	}
	levels.SubLessonId = subLesson.Id
	levels.UpdatedAt = helper.ToPtr(time.Now().UTC())

	meta, err := service.academicLevelStorage.SubLessonCaseGetSubjectMeta(subLesson.Id)
	if err != nil {
		return err
	}
	levels.LessonCount = meta.LessonCount
	levels.SubjectSubLessonCount = meta.SubLessonCount

	subLessonCount, err := service.academicLevelStorage.LessonCaseGetSubLessonCount(subLesson.LessonId)
	if err != nil {
		return err
	}
	levels.LessonSubLessonCount = subLessonCount

	err = service.academicLevelStorage.SubLessonFileStatusUpdate(in.subLessonId, true, in.subjectId, levels.UpdatedAt)
	if err != nil {
		return err
	}

	data, err := json.Marshal(levels)
	if err != nil {
		return err
	}

	urls := extractURLsFromLevelsJSON(data)

	var finalData []byte
	var files map[string]DownloadedFile

	if in.EmbeddedFile {
		finalData, files, err = service.processWithEmbeddedFiles(data, urls)
	} else {
		finalData, files, err = service.processWithSeparateFiles(data, urls)
	}

	if err != nil {
		return err
	}

	return service.createAndUploadZip(in.subLessonId, finalData, files, in.LevelFile, in.GroupLevelFiles)
}

func (service *serviceStruct) processWithEmbeddedFiles(originalData []byte, urls []string) ([]byte, map[string]DownloadedFile, error) {
	type downloadResult struct {
		url         string
		base64Data  string
		contentType string
		err         error
	}

	var wg sync.WaitGroup
	results := make(chan downloadResult, len(urls))

	for _, url := range urls {
		wg.Add(1)
		go func(url string) {
			defer wg.Done()
			fileData, contentType, err := fetchFile(url)
			var base64Data string
			if err == nil {
				base64Data = base64.StdEncoding.EncodeToString(fileData)
			}
			results <- downloadResult{url: url, base64Data: base64Data, contentType: contentType, err: err}
		}(url)
	}

	go func() {
		wg.Wait()
		close(results)
	}()

	urlToBase64 := make(map[string]string)
	for result := range results {
		if result.err != nil {
			continue
		}
		urlToBase64[result.url] = result.base64Data
	}

	var jsonData interface{}
	if err := json.Unmarshal(originalData, &jsonData); err != nil {
		return nil, nil, err
	}

	addBase64Fields(jsonData, urlToBase64)

	modifiedData, err := json.Marshal(jsonData)
	if err != nil {
		return nil, nil, err
	}

	return modifiedData, nil, nil
}

func (service *serviceStruct) processWithSeparateFiles(originalData []byte, urls []string) ([]byte, map[string]DownloadedFile, error) {
	type downloadResult struct {
		url      string
		filename string
		data     []byte
		err      error
	}

	var wg sync.WaitGroup
	results := make(chan downloadResult, len(urls))

	for _, url := range urls {
		wg.Add(1)
		go func(url string) {
			defer wg.Done()
			fileData, contentType, err := fetchFile(url)
			filename := getFilenameFromURL(url, contentType)
			results <- downloadResult{url: url, filename: filename, data: fileData, err: err}
		}(url)
	}

	go func() {
		wg.Wait()
		close(results)
	}()

	downloadedFiles := make(map[string]DownloadedFile)
	for result := range results {
		if result.err != nil {
			continue
		}
		downloadedFiles[result.url] = DownloadedFile{
			Filename: result.filename,
			Data:     result.data,
		}
	}

	return originalData, downloadedFiles, nil
}

func (service *serviceStruct) createAndUploadZip(subLessonId int, jsonData []byte, files map[string]DownloadedFile, splitLevels bool, groupLevelFiles bool) error {
	zipBuffer := new(bytes.Buffer)
	zipWriter := zip.NewWriter(zipBuffer)

	zipWriter.RegisterCompressor(zip.Deflate, func(w io.Writer) (io.WriteCloser, error) {
		return flate.NewWriter(w, flate.BestCompression)
	})

	filesAddedToLevels := make(map[string]bool)

	if splitLevels {
		var dataMap map[string]interface{}
		if err := json.Unmarshal(jsonData, &dataMap); err != nil {
			return err
		}

		if levelsRaw, ok := dataMap["levels"]; ok {
			if levelsList, ok := levelsRaw.([]interface{}); ok {
				var levelMetaList []map[string]interface{}
				for _, levelRaw := range levelsList {
					if levelMap, ok := levelRaw.(map[string]interface{}); ok {
						var id int
						var index int
						if idVal, ok := levelMap["id"]; ok {
							if idFloat, ok := idVal.(float64); ok {
								id = int(idFloat)
							} else if idInt, ok := idVal.(int); ok {
								id = idInt
							}
						}
						if indexVal, ok := levelMap["index"]; ok {
							if indexFloat, ok := indexVal.(float64); ok {
								index = int(indexFloat)
							} else if indexInt, ok := indexVal.(int); ok {
								index = indexInt
							}
						}

						levelBytes, err := json.Marshal(levelMap)
						if err != nil {
							return err
						}

						// Create inner zip
						innerZipBuffer := new(bytes.Buffer)
						innerZipWriter := zip.NewWriter(innerZipBuffer)
						innerZipWriter.RegisterCompressor(zip.Deflate, func(w io.Writer) (io.WriteCloser, error) {
							return flate.NewWriter(w, flate.BestCompression)
						})

						innerFileName := fmt.Sprintf("level-%d.json", id)
						innerFile, err := innerZipWriter.Create(innerFileName)
						if err != nil {
							return err
						}
						_, err = innerFile.Write(levelBytes)
						if err != nil {
							return err
						}

						if groupLevelFiles && files != nil {
							levelUrls := extractURLsFromLevelsJSON(levelBytes)
							levelAddedFiles := make(map[string]bool)
							for _, url := range levelUrls {
								if file, ok := files[url]; ok {
									if !levelAddedFiles[file.Filename] {
										fileWriter, err := innerZipWriter.Create(file.Filename)
										if err != nil {
											continue
										}
										_, err = fileWriter.Write(file.Data)
										if err != nil {
											continue
										}
										levelAddedFiles[file.Filename] = true
										filesAddedToLevels[file.Filename] = true
									}
								}
							}
						}

						if err := innerZipWriter.Close(); err != nil {
							return err
						}

						// Write inner zip to outer zip
						outerFileName := fmt.Sprintf("level-%d.zip", id)
						header := &zip.FileHeader{
							Name:   outerFileName,
							Method: zip.Store, // Store without compression as inner zip is already compressed
						}
						zipFile, err := zipWriter.CreateHeader(header)
						if err != nil {
							return err
						}
						_, err = zipFile.Write(innerZipBuffer.Bytes())
						if err != nil {
							return err
						}

						levelMetaList = append(levelMetaList, map[string]interface{}{
							"id":        id,
							"index":     index,
							"file_name": outerFileName,
						})
					}
				}
				dataMap["levels"] = levelMetaList
			}
		}

		indexBytes, err := json.Marshal(dataMap)
		if err != nil {
			return err
		}

		zipFile, err := zipWriter.Create("index.json")
		if err != nil {
			return err
		}
		_, err = zipFile.Write(indexBytes)
		if err != nil {
			return err
		}

	} else {
		zipFile, err := zipWriter.Create("levels.json")
		if err != nil {
			return err
		}
		_, err = zipFile.Write(jsonData)
		if err != nil {
			return err
		}
	}

	if files != nil {
		addedFilenames := make(map[string]bool)
		for _, file := range files {
			if addedFilenames[file.Filename] {
				continue
			}
			if splitLevels && groupLevelFiles && filesAddedToLevels[file.Filename] {
				continue
			}

			fileWriter, err := zipWriter.Create(file.Filename)
			if err != nil {
				continue
			}
			_, err = fileWriter.Write(file.Data)
			if err != nil {
				continue
			}
			addedFilenames[file.Filename] = true
		}
	}

	err := zipWriter.Close()
	if err != nil {
		return err
	}

	env := os.Getenv("ENV")
	key := fmt.Sprintf(`%s-sub-lesson-id-%d.zip`, env, subLessonId)
	err = service.cloudStorage.ObjectDelete(key)
	if err != nil {
		return err
	}

	err = service.cloudStorage.ObjectCreate(zipBuffer.Bytes(), key, fileType.Zip)
	if err != nil {
		return err
	}

	return nil
}

func addBase64Fields(data interface{}, urlToBase64 map[string]string) {
	switch v := data.(type) {
	case map[string]interface{}:
		for key, value := range v {
			if isURLFieldName(key) {
				if strVal, ok := value.(string); ok && strVal != "" {
					if base64Data, found := urlToBase64[strVal]; found {
						newFieldName := key + "_data"
						v[newFieldName] = "data:;base64," + base64Data
					}
				}
			}
			addBase64Fields(value, urlToBase64)
		}
	case []interface{}:
		for _, item := range v {
			addBase64Fields(item, urlToBase64)
		}
	}
}

func extractURLsFromLevelsJSON(data []byte) []string {
	urlSet := make(map[string]bool)
	var result []string

	var jsonData interface{}
	if err := json.Unmarshal(data, &jsonData); err != nil {
		return result
	}

	findURLsInJSON(jsonData, urlSet)

	for url := range urlSet {
		result = append(result, url)
	}
	return result
}

func findURLsInJSON(data interface{}, urlSet map[string]bool) {
	switch v := data.(type) {
	case map[string]interface{}:
		for key, value := range v {
			if isURLFieldName(key) {
				if strVal, ok := value.(string); ok && strVal != "" && isHTTPURL(strVal) {
					urlSet[strVal] = true
				}
			}
			findURLsInJSON(value, urlSet)
		}
	case []interface{}:
		for _, item := range v {
			findURLsInJSON(item, urlSet)
		}
	}
}

func isURLFieldName(key string) bool {
	urlFields := []string{
		"image_url",
		"image_description_url",
		"image_hint_url",
		"speech_url",
	}
	for _, field := range urlFields {
		if key == field {
			return true
		}
	}
	return false
}

func isHTTPURL(str string) bool {
	return len(str) > 8 && (str[:7] == "http://" || str[:8] == "https://")
}

func getFilenameFromURL(url string, contentType string) string {
	filename := url
	if len(filename) > 8 && filename[:8] == "https://" {
		filename = filename[8:]
	} else if len(filename) > 7 && filename[:7] == "http://" {
		filename = filename[7:]
	}

	for i := 0; i < len(filename); i++ {
		if filename[i] == '?' {
			filename = filename[:i]
			break
		}
	}

	result := make([]byte, len(filename))
	for i := 0; i < len(filename); i++ {
		if filename[i] == '/' {
			result[i] = '_'
		} else {
			result[i] = filename[i]
		}
	}
	finalName := string(result)

	if !hasExtension(finalName) {
		ext := getExtensionFromContentType(contentType)
		if ext != "" {
			finalName = finalName + ext
		}
	}

	return finalName
}

func hasExtension(filename string) bool {
	extensions := []string{".png", ".jpg", ".jpeg", ".gif", ".webp", ".mp3", ".wav", ".ogg", ".mp4", ".pdf"}
	for _, ext := range extensions {
		if len(filename) > len(ext) && filename[len(filename)-len(ext):] == ext {
			return true
		}
	}
	return false
}

func getExtensionFromContentType(contentType string) string {
	if len(contentType) >= 5 && contentType[:5] == "audio" {
		return ".mp3"
	}
	if len(contentType) >= 5 && contentType[:5] == "image" {
		return ".png"
	}
	return ""
}

func fetchFile(url string) ([]byte, string, error) {
	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	resp, err := client.Get(url)
	if err != nil {
		return nil, "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, "", fmt.Errorf("failed to download: status %d", resp.StatusCode)
	}

	contentType := resp.Header.Get("Content-Type")
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, "", err
	}

	return data, contentType, nil
}
