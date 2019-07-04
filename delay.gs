function fetchDelayInfo() {
 
  //電車遅延情報をJSON形式で取得
  var json = JSON.parse(UrlFetchApp.fetch("https://rti-giken.jp/fhc/api/train_tetsudo/delay.json").getContentText());
 
  var name="京都本線";
  var company="阪急電鉄";
  
  var body="";

  // スプレッドシートのオブジェクトを取得
  var spreadSheet =   SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Ly6_XTdO_TTgaX4IOVXBC0DOmwXlZRPZii8NgqEV2BU/edit#gid=0");
  var targetSheet = spreadSheet.getSheetByName("kyoto");
  // 値の取得
  var delayFlag = targetSheet.getRange(2,1).getValue();

  var count = 1;
  for each(var obj in json){
    if(obj.name === name && obj.company === company){

      // LINEに送信（フラグが変わるときにLINEに送信）
      if(delayFlag != 1){
        body = company + name + "が遅延してるみたい(^^;)\n http://www.hankyu.co.jp/railinfo/";
        sendMessage(body);
        // 値を設定
        targetSheet.getRange(2,1).setValue(1);
        break;
      }  
    } else {
      // LINEに送信（フラグが変わるときにLINEに送信）
      if((delayFlag != 0) && (count == json.length)){
        body = company + name + "が遅延が解除されたよ！\n http://www.hankyu.co.jp/railinfo/";
        sendMessage(body);
        // 値を設定
        targetSheet.getRange(2,1).setValue(0);
      }  
      count++;
    }
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