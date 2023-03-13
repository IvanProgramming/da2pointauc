package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
)

type RequestBody struct {
	Url string `json:"url"`
}

type R map[string]interface{}

func Handler(w http.ResponseWriter, r *http.Request) {
	// Unpacking json body
	var body RequestBody
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	log.Print(body.Url)
	// Checking if url is valid
	if strings.HasPrefix("https://donationalerts.com/r/", body.Url) || strings.HasPrefix("https://www.donationalerts.com/r/", body.Url) {
		// If url is valid, we can make a request to the url with that nickname
		nick := strings.Trim(strings.TrimPrefix(body.Url, "https://donationalerts.com/r/"), "/ ")
		if nick == "" {
			http.Error(w, `{"error": "Invalid url"}`, http.StatusBadRequest)
			return
		}
		// Making a request to the url
		resp, err := http.Get("https://www.donationalerts.com/api/v1/user/" + nick + "/donationpagesettings")
		if err != nil {
			http.Error(w, `{"error": "Something went wrong"}`, http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()
		respJson := R{}
		json.NewDecoder(resp.Body).Decode(&respJson)
	} else {
		http.Error(w, `{"error": "Invalid url"}`, http.StatusBadRequest)
		return
	}

}
