#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <Wire.h>
#include "Adafruit_SGP40.h"
#include "config.h"

#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

Adafruit_SGP40 sgp;
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
int count = 0;

void setup() {
  Serial.begin(115200);
  delay(2000);
  
  if (!sgp.begin()) {
    Serial.println("Sensor not found!");
    while (1);
  }

  // Use the defines from config.h
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nWiFi Connected!");

  config.database_url = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  if (millis() - sendDataPrevMillis > 1000) {
    sendDataPrevMillis = millis();
    
    uint16_t raw = sgp.measureRaw();
    int32_t voc_index = sgp.measureVocIndex();
    
    String path = "/sensor_data/" + String(count);
    
    FirebaseJson json;
    json.set("raw", raw);
    json.set("voc_index", voc_index);
    json.set("timestamp", millis());
    
    if (Firebase.RTDB.setJSON(&fbdo, path, &json)) {
      Serial.print("✓ Sent #");
      Serial.print(count);
      Serial.print(" | Raw: ");
      Serial.print(raw);
      Serial.print(" | VOC Index: ");
      Serial.println(voc_index);
      count++;
    } else {
      Serial.print("✗ Failed: ");
      Serial.println(fbdo.errorReason());
    }
  }
}