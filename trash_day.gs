function fetchTrashDayInfo() {
  // 曜日
  var week = ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"];
  // ごみの日
  var trashDay = ["","","普通ごみ","","容器包装・衣類","普通ごみ",""];

  // 今日の曜日の取得
  var date = new Date();
  var weekDay = date.getDay();
  
  if(trashDay[weekDay] != ''){
    var body="\n"+ week[weekDay] +"は"+ trashDay[weekDay] +"の日だよ！忘れずに！！";
    sendMessage(body);
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

// トリガーを設定(8:40)
function setTrashTriggerMorning(){
  delTrigger();
  var setTime = new Date();
  setTime.setHours(8);
  setTime.setMinutes(40); 
  ScriptApp.newTrigger('fetchTrashDayInfo').timeBased().at(setTime).create();
}

// トリガーの削除
function delTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for(var i=0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() == "setTrashTriggerMorning") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}