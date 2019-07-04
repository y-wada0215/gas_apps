/* 指定のカレンダーの本日の予定をLINEに送る */
function sendSchedule() {

  var myCals=CalendarApp.getCalendarById('yukawada35@gmail.com'); //特定のIDのカレンダーを取得
  var myEvents=myCals.getEventsForDay(new Date());　//カレンダーの本日のイベントを取得

  
  /* LINEに送る文字列のヘッダー */
  var strBody = "\n" + "本日の予定：" + Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd');

  /* イベントの数だけ繰り返し */
  for(var i=0;i<myEvents.length;i++){
    var strDescription=myEvents[i].getDescription();
    var strTitle=myEvents[i].getTitle(); //イベントのタイトル
    strBody=strBody + "\n" + strTitle + '\n' + '*.゜｡:+*.゜｡:+*.゜｡:+*.゜｡:+*.゜｡:+' + '\n' + strDescription　+ '\n' + '*.゜｡:+*.゜｡:+*.゜｡:+*.゜｡:+*.゜｡:+';
  }
  if(myEvents.length == 0){
    strBody += '\n' + "特になし";
  }

  /* LINEにメッセージを送る */
  sendScheduleMessage(strBody);

}


function sendScheduleMessage(message){
  var token = "58WmyPoD6yFP6A0PfcCUC7vQlaJNErDgwH3Y5NNUrnG";
  var options =
   {
     "method"  : "post",
     "payload" : "message=" + message,
     "headers" : {"Authorization" : "Bearer "+ token}

   };

   UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
}


// トリガーを設定(7:00)
function setScheduleTriggerMorning(){
  delTrigger();
  var setTime = new Date();
  setTime.setHours(7);
  setTime.setMinutes(30); 
  ScriptApp.newTrigger('sendSchedule').timeBased().at(setTime).create();
}

// トリガーの削除
function delTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for(var i=0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() == "setScheduleTriggerMorning") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}