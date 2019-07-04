function fetchWheatherInfo() {
  var response = UrlFetchApp.fetch("http://weather.livedoor.com/forecast/webservice/json/v1?city=270000");
  var json=JSON.parse(response.getContentText());

  // 天気（雨だったら通知）
  var osakaWheather = json["forecasts"][0]["telop"];
  if(osakaWheather.match(/雨/)){
    sendMessage("\n" + "今日の大阪の天気は雨かも！傘を忘れずに！！");
  }
}


function sendMessage(message){
  var token = "qO1czDCbrCx15etCdKMiyEWMiv5Q2HE7YhtD9Z4KL3n";
  var options =
   {
     "method"  : "post",
     "payload" : "message=" + message,
     "headers" : {"Authorization" : "Bearer "+ token}

   };

   UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
}

// トリガーを設定(7:30)
function setWheatherTriggerMorning(){
  delTrigger();
  var setTime = new Date();
  setTime.setHours(7);
  setTime.setMinutes(30); 
  ScriptApp.newTrigger('fetchWheatherInfo').timeBased().at(setTime).create();
}

// トリガーの削除
function delTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for(var i=0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() == "setWheatherTriggerMorning") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}