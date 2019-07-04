var CHANNEL_ACCESS_TOKEN =   "PY63nbdTA6495ad2kZfXCLjnBAtfxAnbzz44GbXz4NfnkUOVDdDc9EvrYEob/RlfdTtUZb8dqyLG8goaFDTdYVPMgan/6Sxpk0wnDGZwH+he4/AZSU62Zcr+4aNczjMydrtPkZul3wqRwJIm0lsvOgdB04t89/1O/w1cDnyilFU=";

//line-apiからの送信処理
function doPost(e) {
  try{
  var reply_token= JSON.parse(e.postData.contents).events[0].replyToken;
  var usersMessage = JSON.parse(e.postData.contents).events[0].message['text'];
  
  // キーワード
  var keyword = [['大阪', 'ランキング', '関西'], ['A1', 'B1'], ['A1', 'B1'], ['A1', 'B1'], ['A1', 'B1']];
                   
  // URL
  if(keyword[0].indexOf(usersMessage) > -1){
    var eventUrl = 'https://www.walkerplus.com/ranking/event/ar0727/';
  }

  if(eventUrl = undefined){
    return;
  }
  //イベント情報取得
  var mes = event(eventUrl);
  //メッセージを取得
  var line_json = [];
  for (i = 0; i < 10; i++){
    //イベント情報作成処理
    var event = (
      {
        "thumbnailImageUrl": mes[5][i],
        "title": mes[0][i],
        "text": mes[1][i] + '\n' + mes[2][i] + '~' + mes[3][i],
        "actions": [
          {
            "type": "uri",
            "label": "詳細",
            "uri": mes[4][i]
          }
        ]
      }
    );
    line_json.push(event);
  }
  var url = 'https://api.line.me/v2/bot/message/reply';//リプライのurl
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': reply_token,
      'messages': [{       
        "type": "template",
        "altText": "大阪府のイベント情報一覧",
        "template": {
          "type": "carousel",
          "columns": line_json
        }
      }],
    }),
  });
    return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
  } catch(er){
    var logText = "例外が発生しました :" + er.message;
    addLog(logText);
  }
  
  function event(eventUrl) {
    // 接続情報
    const URL = eventUrl;
    var response = UrlFetchApp.fetch(URL); 
    var source = response.getContentText(); 
    
    var title_list = [];
    var location_list = [];
    var start_date_list = [];
    var end_date_list = [];
    var url_list = [];
    var image_url_list = [];
    
    // タイトルと場所
    var myRegexp = /"name" : "([\s\S]*?)",/g;
    var event_title = source.match(myRegexp);
    var location = new Array();
    var location_count = 0;
    var title = new Array();
    var title_count = 0;
    
    for(var i=0; i < event_title.length; i++){
      event_title[i] = event_title[i].replace(/"name" : "/g,'');
      event_title[i] = event_title[i].replace(/",/g,'');
      // タイトル
      if(i % 2 == 0){
        title[title_count] = "【第"+ (title_count+1) + "位】" + event_title[i];
        title_list.push(title[title_count]);
        title_count++;
        
      } else {
        // 場所
        location[location_count] = event_title[i];
        location_list.push(location[location_count]);
        location_count++;
      }
    }
    
    // 開始日時
    var myRegexp = /"startDate" : "([\s\S]*?)",/g;
    var event_startdate = source.match(myRegexp);
    var start_date = new Array();
    for(var i=0; i < event_startdate.length; i++){
      start_date[i] = event_startdate[i].replace(/"startDate" : "/g,'');
      start_date[i] = start_date[i].replace(/",/g,'');
      start_date[i] = start_date[i].replace(/-/g,'/');
      start_date_list.push(start_date[i]);
    }
    
    // 終了日時
    var myRegexp = /"endDate" : "([\s\S]*?)",/g;
    var event_enddate = source.match(myRegexp);
    var end_date = new Array();
    for(var i=0; i < event_enddate.length; i++){
      end_date[i] = event_enddate[i].replace(/"endDate" : "/g,'');
      end_date[i] = end_date[i].replace(/",/g,'');
      end_date[i] = end_date[i].replace(/-/g,'/');
      end_date_list.push(end_date[i]);
    }
    
    // URL
    var myRegexp = /"url" : "([\s\S]*?)"/g;
    var event_url = source.match(myRegexp);
    var url = new Array();
    for(var i=0; i < event_url.length; i++){
      url[i] = event_url[i].replace(/"url" : "/g,'');
      url[i] = url[i].replace(/"/g,'');
      url_list.push(url[i]);
    }
    
    // 画像URL
    var myRegexp = /"image" : "([\s\S]*?)"/g;
    var image_url_data = source.match(myRegexp);
    var image_url = new Array();
    for(var i=0; i < image_url_data.length; i++){
      image_url[i] = image_url_data[i].replace(/"image" : "/g,'');
      image_url[i] = image_url[i].replace(/"/g,'');
      image_url_list.push(image_url[i]);
    }
    
    // メッセージ内容の作成
    var mes = [];
    mes[0] = title_list;
    mes[1] = location_list;
    mes[2] = start_date_list;
    mes[3] = end_date_list;
    mes[4] = url_list;
    mes[5] = image_url_list;
    
    return mes;
  }
}
  

function addLog(text/*ログ内容*/) {
  var spreadsheetId = "1N10nLwrOW8y1reA1N2nk4uMsAGGyxLVItmZF03r-ZEQ";
  var sheetName = "log";
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  sheet.appendRow([new Date()/*タイムスタンプ*/,text]);
  return text;
}