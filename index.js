"use strict";
const Alexa = require('alexa-sdk');

var APP_ID = 'amzn1.ask.skill.af900d3a-7e03-46e4-94c0-bc84c16faa77';

var HOME_WORD = [
    "天才だね",
    "笑顔がいいね",
    "可愛いね",
    "イキイキしてるね",
    "表情がいいね",
    "元気だね",
    "よく頑張るね",
    "偉いね",
    "才能があるね",
    "明るいね",
    "センスがいいね",
    "優しいね",
    "頑張ってるね"
];

// ステートの定義
var STATES = {
    STANDBY_MODE: '',
    SYNASTRY_MODE: '_SYNASTRYMODE'
};

var MORE_WORD = [
    "ちょー天才だね",
    "ちょー笑顔がいいね",
    "ちょー可愛いね",
    "ちょーイキイキしてるね",
    "ちょー表情がいいね",
    "ちょー元気だね",
    "ちょーよく頑張るね",
    "ちょー偉いね",
    "ちょー才能があるね",
    "ちょー明るいね",
    "ちょーセンスがいいね",
    "ちょー優しいね",
    "ちょー頑張ってるね"
];

// Lambda関数のメイン処理
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context); // Alexa SDKのインスタンス生成
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers, synastriesHandlers); // ハンドラの登録
    alexa.execute();                  // インスタンスの実行
};

var handlers = {
    // インテントに紐付かないリクエスト
    'LaunchRequest': function () {
        this.emit('Unhandled');
    },
    'AMAZON.HelpIntent': function () {
        var message = 'あなたを褒めます' + b(1) + '名前の後に' + b(0.5) + 'を褒めてって言ってね';
        tell(this, message);
    },
    // 対話モデルで定義したインテント
    'HomexaIntent': function () {
        home(this);
    },
    'Unhandled': function() {
        var message = 'ごめんね' + b(0.5) + '聞き取れなかった' + b(1) + '名前の後に' + b(0.5) + 'を褒めてって言ってね';
        tell(this, message);
    }
};

var synastriesHandlers = Alexa.CreateStateHandler(STATES.SYNASTRY_MODE, {
    'HomexaIntent': function () {
        toStandby(this);
        home(this);
    },
    'YesIntent': function() {
        toStandby(this);
        more(this);
    },
    'NoIntent': function() {
        toStandby(this);
        var message = 'わかった' + b(0.5) + 'バイバイ';
        tell(this, message);
    },
    'Unhandled': function() {
        toStandby(this);
        var message = 'ごめんね' + b(0.5) + '聞き取れなかった' + b(1) + 'また褒めて欲しかったら言ってね';
        tell(this, message);
    }
});

var home = function(handler) {
    var name = handler.event.request.intent.slots.FirstName.value;
    var message = name + 'は' + homeWord();
    if (isMore()) {
        handler.attributes.name = name
        toSynastry(handler);
        var reprompt = 'もっと褒める？';
        message = message + b(1) + reprompt;
        ask(handler, message, reprompt);
    } else {
        tell(handler, message);
    }
};

var homeWord = function() {
    return HOME_WORD[Math.floor(Math.random() * HOME_WORD.length)];
};

var more = function(handler) {
    var name = handler.attributes['name'];
    var message = moderate(name + 'は' + moreWord());
    tell(handler, message);
};

var moreWord = function() {
    return MORE_WORD[Math.floor(Math.random() * MORE_WORD.length)];
};

var b = function(s) {
    return '<break time="' + s + 's"/>'
};

var moderate = function(word) {
    return '<emphasis level="moderate">' + word + '</emphasis>';
};

var isMore = function() {
    return true;
    // return 6 < Math.floor(Math.random() * 10);
};

var tell = function(handler, message) {
    handler.emit(':tell', moderate(message));
};

var ask = function(handler, message, reprompt) {
    handler.emit(':ask', moderate(message), moderate(reprompt));
};

var toStandby = function(handler) {
    handler.handler.state = STATES.STANDBY_MODE;
    handler.attributes.STATE = undefined;
};

var toSynastry = function(handler) {
    handler.handler.state = STATES.SYNASTRY_MODE;
};
