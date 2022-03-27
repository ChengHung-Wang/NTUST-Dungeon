let plist = new Finder();
let hasStart = false;

$(function() {
    plist.init();

    $("body").on('keydown', (e) => {
        if (e.originalEvent.code == "Space" && hasStart && ! plist.anyGoOperation) {
            plist.start_pause();
        }
    });
    //plist.initGame();
    $(".fontSet").click(function() {
        plist.fontsize += parseInt($(this).attr('data'));
    })
    $(".nameSet").on("keydown", function() {
        plist.username = "" + $(this).val();
    })
    $(".levelSet").click(function() {
        plist.level = $(this).attr('data');
    })

    $(".stateSet").click(function() {
        plist.start_pause();
    })
    if(!("ontouchstart" in document)) {
        $(".side-control").hide();
    }
    $(".startTeach").click(function() {
        teach();
    })
    $(".exit_teach").click(function() {
        $("#teach").fadeOut();
        plist.teach = false;
        teach_now = 0;
    })
    $(".next_teach").click(function() {
        teach_next();
    })
})
let teach_plist = [
    "你可以設定遊戲難度 字體大小，玩家姓名",
    "碰到Trigger+10分，碰到星星+50分。如果碰到鬼您將返回起始點，並且扣除一個生命值(血量)，扣三次生命值則結束遊戲。得到的分數將是您的攻擊能力（戰績）",
    "注意：如果如果靠近鬼方圓兩格內，鬼將會自動追蹤您的位置，並且上方會出現告警",
    "上面為遊戲狀態欄位，有: 分數（攻擊能力、戰績），玩家姓名，難度，遊戲時間，血量(生命值)",
    "下方為控制方向用按鈕（僅於觸控模式中顯示），遊戲開始、暫停按鈕，字體大小調整"
];
let teach_now = 0;
function teach() {
    plist.teach = true;
    $("#teach").show();
    teach_next();
    $(".startGram").removeClass('btn-outline-warning');
    $(".startGram").addClass("btn-warning");

}
function teach_next() {
    if(teach_now <= teach_plist.length - 1){
        $("#teach_img").attr("src", "img/" + teach_now + ".png");
        $("#teach_description").text(teach_plist[teach_now]);
        teach_now++;
    }else {
        plist.initGame();
        teach_now = 0;
    }
}