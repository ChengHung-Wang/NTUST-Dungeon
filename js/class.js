class  Finder {
    constructor() {
        this.drawables = [];
        this.map = [];
        this.startTime = null;
        this.pauseTime = null;
        this.times = 0;
        this.score = 0;
        this.col = 0;
        this.row = 0;
        this.width = 0;
        this.level = 2;
        this.lives = 3;
        this.state =  false;
        this.teach = false;
        this.loopEvent = null;
        this.username = "B11015020";
        this.pacmanCanMove = true;
        this.ghostCanMove = true;
        this.pacmanLastMove = null;
        this.ghostLastMove = null;
        this.anyGoOperation = false;
        this.lastFindPacman = Date.now();
        this.fontsize = 16;
        this.levelPlist = [
            {
                ghost: [2],
                star: 10
            },
            {
                ghost: [1, 3],
                star: 8
            },
            {
                ghost: [1, 2, 3],
                star: 6
            }
        ]
        this.ghostDoorPosition = {
            top: 0,
            left: 0
        }
    }
    reset() {
        clearInterval(this.loopEvent);
        this.map = [];
        this.startTime = null;
        this.pauseTime = null;
        this.times = 0;
        this.score = 0; 
        this.width = 0;
        this.lives = 3;
        this.state =  false;
        this.teach = false;
        this.loopEvent = null;
        this.username = "玩家姓名";
        this.pacmanCanMove = true;
        this.ghostCanMove = true;
        this.pacmanLastMove = null;
        this.ghostLastMove = null;
        $("#map").empty();
    }
    get fontsize() {
        return this._fontsize;
    }
    set fontsize(value) {
        value = parseInt(value);
        if(value <= 25 && value >= 12) {
            this._fontsize = value;
            $("*").css("font-size", value + "px");
        }
    }
    get score() {
        return this._score;
    }
    set score(value) {
        value = parseInt(value);
        this._score = value;
        $("#score").text(value);
    }
    get lives() {
        return this._lives;
    }
    set lives(value) {
        value = parseInt(value);
        this._lives = value;
        // game over
        if(value <= 0){
            $("#score_main").append(`<h3 class='text-center'>遊戲結束</h3><h3 class='text-center'>您總共花了(分:秒)` + (parseInt(this.times / 60)).toString().padStart(2, "00") + ":" + (this.times % 60).toString().padStart(2, "00") + `</h3><br>`);
            $("#score_board").addClass("fcc").fadeIn(250);
            this.state = false;
            document.exitFullscreen;
        }else{
            $("#lives").empty();
            for(let i = 0;i < this.lives; i ++) {
                $("#lives").append(`<div class='cube pacman'><div class="img"></div></div>`)
            }
        }
    }
    get level() {
        return this._level;
    }
    set level(value) {
        value = parseInt(value);
        $("#level").text(["簡單", "正常", "困難"][value]);
        this._level = value;
    }
    get username() {
        return this._username;
    }
    set username(value) {
        $("#username").text(value);
        this._username = value;
    }

    get width() {
        return this._width;
    }
    set width(width) {
        this._width = width;
    }

    get anyGoOperation() {
        return this._anyGoOperation;
    }
    set anyGoOperation(bool) {
        this._anyGoOperation = bool;
    }

    init() {
        this.username = this._username;
        $("*").css("font-size", this.fontsize);

    }

    initGame() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
        this.state = true;
        this.startTime = Date.now();
        this.mapProcess();
        this.loop();
        $(".mask").fadeOut(500);
        $("#lives").empty();
        for(let i = 0; i < 3; i++){
            $("#lives").append(`<div class='cube pacman'><div class="img"></div></div>`);
        }
        $(".cube").css("width", this.width);
        $(".cube").css("height", this.width + "px");
    }

    mapProcess() {
        // $.ajax({
        //     url: "map.txt",
        //     type: "get",
        //     async: false,
        //     success: (data) => {
                // ajax這個map.txt會讓直接雙擊index.html的人引起cors問題(when no server status)
                let data = `0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0\n0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0\n0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0\n0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0\n0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0\n0,1,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,1,0\n0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0\n0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,0\n2,2,2,0,1,0,1,1,1,1,1,1,1,0,1,0,2,2,2\n0,0,0,0,1,0,1,0,0,3,0,0,1,0,1,0,0,0,0\n2,2,2,2,1,1,1,0,3,3,3,0,1,1,1,2,2,2,2\n0,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0\n2,2,2,0,1,0,1,1,1,2,1,1,1,0,1,0,2,2,2\n0,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0\n0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0\n0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0\n0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0\n0,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0\n0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0\n0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0\n0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0`;
                data = data.split("\r").join("").split("\n").map(e => e.split(",").map(d => parseInt(d))).filter(e => e.length > 3);
                this.map = data;
                this.col = data[0].length;
                this.row = data.length;
                this.width =  Math.floor(738 / this.col);
                $("#map").css("width", this.width * this.col);
                $("#map").css("height", this.width * this.row + "px");
                //$("#map").css("margin", "0 " + (768 - this.width * this.col) / 2 + "px");
                let ghost_round = 0;
                data.forEach((row, row_index) => {
                    row.forEach((col, col_index) => {
                        if(col == 0) {
                            this.drawables.push(new Wall(plist, row_index * this.width, col_index * this.width));
                        }else if(col == 1) {
                            this.drawables.push(new Bean(plist, row_index * this.width, col_index * this.width));
                        }else if(col == 2) {
                            if (
                                this.map[row_index][col_index + 1] != 2 &&
                                this.map[row_index][col_index - 1] != 2
                            ) {
                                this.drawables.push(new PacMan(plist, row_index * this.width, col_index * this.width));
                            }
                        }else if(col == 3) {
                            if(ghost_round == 0) {
                                this.ghostDoorPosition = {
                                    top: row_index * this.width,
                                    left: col_index * this.width
                                }
                            }
                            let ghost_index = this.levelPlist[this.level].ghost.indexOf(ghost_round);
                            if(ghost_index != -1) {
                                this.drawables.push(new Ghost(plist, row_index * this.width, col_index * this.width, ghost_index + 1));
                            }
                            ghost_round++;
                        }
                    })
                })
                let all_bean = this.drawables.filter(data => data instanceof Bean);
                all_bean.sort((a, b) => Math.floor(Math.random() - 0.5));
                for(let i = 0; i < this.levelPlist[this.level].star; i++) {
                    all_bean[i].remove();
                    this.drawables.push(new Star(plist, all_bean[i].css.top, all_bean[i].css.left));
                }
            // }
        // })
    }
    loop() {
        this.loopEvent = setInterval(() => {
            if(this.state) {
                $(".cube>.img").removeClass("pause");
                this.count();
                this.ghostMove();
                this.moveState();
                this.checkTouch();
            }else {
                $(".cube>.img").addClass("pause");
            }
        }, 25);
    }

    count() {
        this.times = Math.floor((Date.now() - this.startTime) / 1000);
        $("#times").text((parseInt(this.times / 60)).toString().padStart(2, "00") + ":" + (this.times % 60).toString().padStart(2, "00"));
    }

    ghostMove() {
        if(this.ghostCanMove){
            this.drawables.filter(e => e.constructor.name == "Ghost").forEach((this_obj) => {
                setTimeout(() => {
                    this_obj.move();
                }, 100)
            });
            this.ghostLastMove = Date.now();
        }
    }

    moveState() {
        if(this.ghostLastMove != null){
            this.ghostCanMove =  Date.now() - this.ghostLastMove > 500 ? true : false;
        }
        if(this.pacmanLastMove != null){
            this.pacmanCanMove =  Date.now() - this.pacmanLastMove > 500 ? true : false;
        }
    }

    checkTouch() { // check collection
        let pacman_obj = this.drawables.filter(e => e instanceof PacMan)[0];
        let can_touch_obj = this.drawables.filter(e => e instanceof Star || e instanceof Bean || e instanceof Ghost)
        can_touch_obj.forEach((data) => {
            if(pacman_obj.isTouchme(data)){
                data.touch(pacman_obj);
            }
        })
    }

    start_pause() {
        if(this.state){
            $(".stateSet").val("繼續");
            this.pauseTime = Date.now();
            this.state = false;
        }else{
            this.startTime = this.startTime + (Date.now() - this.pauseTime);
            $(".stateSet").val('暫停');
            this.state = true;
        }
    }

}
class Drawable {
    constructor(plist, top, left, $html) {
        this.plist = plist;
        this.css = {
            top: top,
            left: left
        };
        $("#map").append($html);
        this.$html = $($html);
        this.$html.css(this.css);
    }
    remove() {
        this.plist.drawables = this.plist.drawables.filter(e => !(
            this.css.top == e.css.top &&
            this.css.left == e.css.left &&
            this.constructor.name == e.constructor.name
        ));
        setTimeout(() => {
            this.$html.remove();
        }, this.constructor.name == "Bean" ? 500 : 300);
    }
}
class Wall extends Drawable{
    constructor(plist, top, left) {
        let $html = $(`<div class='cube wall'></div>`);
        super(plist, top, left, $html);
    }
}
class Bean extends Drawable{
    constructor(plist, top, left) {
        let $html = $(`<div class='cube bean'></div>`);
        super(plist, top, left, $html);
    }
    touch(obj) {
        this.plist.score = this.plist.score + 10;
        if(obj instanceof PacMan) {
            setInterval(() => {
            }, 500);
            this.remove();
        }
    }
}
class Star extends Drawable{
    constructor(plist, top, left) {
        let $html = $(`<div class='cube star'><div class="img"></div></div>`);
        super(plist, top, left, $html);
    }
    touch(obj) {
        this.plist.score += 50;
        if(obj instanceof PacMan) {
            // setInterval(() => {
            //     if(this.plist.teach) {
            //         this.plist.reset();
            //         $("#home").show();
            //     }
            // }, 500);
            this.remove();
        }
    }
}
class Movable extends Drawable{
    constructor(plist, top, left, $html) {
        super(plist, top, left, $html);
        this.moveOption = [ // 0 => up, 1 => left, 2 => down, 3 => right
            {
                top: 0 - this.plist.width,
                left: 0
            },
            {
                top: 0,
                left: 0 - this.plist.width
            },
            {
                top: this.plist.width,
                left: 0
            },
            {
                top: 0,
                left: this.plist.width
            }
        ];
    }
    checkCanVia(top, left) {
        if(left < 0){
            return false;
        }else if(left > this.plist.width * this.plist.col - 1){
            return false;
        }
        return this.plist.drawables.every((e) => {
            if(e instanceof Wall) {
                if(e.css.top == top && e.css.left == left){
                    return false;
                }else{
                    return true;
                }
            }else{
                return true;
            }
        })
    }
}

class Ghost extends Movable {
    constructor(plist, top, left, index) {
        let $html = $(`<div class='cube ghost${index} z-index9999'><div class="img"></div></div>`);
        super(plist, top, left, $html);
        this.relativePacmanSide = ["南", "東", "北", "西"];
        this.defaultTo = 1;
    }
    move() {
        /*
            ======================
            update at 2022/03/15
            ======================
        */
        let pacmanLocation = this.plist.drawables.filter(e => e instanceof PacMan)[0];
        // 0 => up, 1 => left, 2 => down, 3 => right
        for (let index = 0; index < 4; index ++) {
            if (
                (
                    // 方圓一格
                    (this.css.top + this.moveOption[index].top == pacmanLocation.css.top) &&
                    (this.css.left + this.moveOption[index].left == pacmanLocation.css.left)
                ) 
                || 
                (
                    // 方圓兩格
                    (this.css.top + ((this.moveOption[index].top) * 2) == pacmanLocation.css.top) &&
                    (this.css.left + ((this.moveOption[index].left) * 2) == pacmanLocation.css.left)
                )
            ) {
                // check it can through
                if (this.checkCanVia(this.css.top + this.moveOption[index].top, this.css.left + this.moveOption[index].left)) {
                    this.defaultTo = index;
                    this.css.top = this.css.top + this.moveOption[index].top;
                    this.css.left = this.css.left + this.moveOption[index].left;
                    this.$html.css(this.css);
                    $("#nearPacman").show();
                    $("#ghost-side").text(`鬼位於您的${this.relativePacmanSide[index]}方`);
                    this.plist.lastFindPacman = Date.now();
                    // force exit
                    return;
                }
            }
        }
        if (Date.now() - this.plist.lastFindPacman >= 1500) {
            $("#nearPacman").hide();
        }
        if(
            (this.css.top == this.plist.ghostDoorPosition.top && this.css.left == this.plist.ghostDoorPosition.left) ||
            (this.css.top == this.plist.ghostDoorPosition.top + this.plist.width && this.css.left == this.plist.ghostDoorPosition.left)
        ){
            this.defaultTo = 0;
            this.css.top = this.css.top + this.moveOption[this.defaultTo].top;
            this.css.left = this.css.left + this.moveOption[this.defaultTo].left;
            this.$html.css(this.css);
        }else {
            let newTo = {
                top: this.css.top + this.moveOption[this.defaultTo].top,
                left: this.css.left + this.moveOption[this.defaultTo].left
            }
            while(!this.checkCanVia(newTo.top, newTo.left)){
                this.defaultTo = parseInt(Math.random() * 4);
                newTo = {
                    top: this.css.top + this.moveOption[this.defaultTo].top,
                    left: this.css.left + this.moveOption[this.defaultTo].left
                }
            }
            if(this.checkCanVia(newTo.top, newTo.left)){
                this.css = newTo;
                this.$html.css(this.css);
            }
        }
    }
    touch(obj) {
        if(obj instanceof PacMan && !obj.GGState){
            obj.GGState = true;
            setTimeout(() => {
                obj.back();
            }, 500)
        }
    }
}
class PacMan extends Movable {
    constructor(plist, top, left) {
        let $html = $(`<div class='pacman cube'><div class="img"></div></div>`);
        super(plist, top, left, $html);
        this.startPosition = {
            top: top,
            left: left
        }
        this.GGState = false;
        this.sideControl();
    }
    isTouchme(obj) {
        return this.css.top == obj.css.top && this.css.left == obj.css.left;
    }
    move(top, left) {
        if(this.plist.pacmanCanMove){
            if(this.checkCanVia(top, left) && this.plist.state){
                this.css.top = top;
                this.css.left = left;
                this.$html.css(this.css);
                this.plist.pacmanLastMove = Date.now();
            }
        }
    }
    back() {
        if(this.GGState) {
            setTimeout(() => {
                this.plist.lives --;
                this.css = JSON.parse(JSON.stringify(this.startPosition));
                this.$html.css(this.css);
                this.GGState = false;
            }, 100);
        }
    }

    // week 4 作業需求
    anyGo(targetTop, targetLeft) {
        if (this.checkCanVia(targetTop, targetLeft)) {
            this.css.top = targetTop;
            this.css.left = targetLeft;
            this.$html.css(this.css);
            return true;
        }else {
            return false;
        }
    }

    sideControl() {
        $("body").on('keydown', (e) => {
            if(this.plist.state) {
                if (e.originalEvent.code == "ArrowUp") {
                    $(".pacman>.img").css('transform', 'rotate(-90deg)');
                    this.move(this.css.top + this.moveOption[0].top, this.css.left + this.moveOption[0].left);
                } else if (e.originalEvent.code == "ArrowLeft") {
                    $(".pacman>.img").css('transform', 'rotate(-180deg)');
                    this.move(this.css.top + this.moveOption[1].top, this.css.left + this.moveOption[1].left);
                } else if (e.originalEvent.code == "ArrowDown") {
                    $(".pacman>.img").css('transform', 'rotate(-270deg)');
                    this.move(this.css.top + this.moveOption[2].top, this.css.left + this.moveOption[2].left);
                } else if (e.originalEvent.code == "ArrowRight") {
                    $(".pacman>.img").css('transform', 'rotate(0deg)');
                    this.move(this.css.top + this.moveOption[3].top, this.css.left + this.moveOption[3].left);
                }
            }
        })
        $(".side-control").click((e) => {
            if(this.plist.state) {
                if(e.target.attributes.side.nodeValue == "ArrowUp"){
                    $(".pacman>.img").css('transform', 'rotate(-90deg)');
                    this.side = this.plist.controlOption[0];
                    this.move(this.css.top + this.moveOption[0].top, this.css.left + this.moveOption[0].left);
                }else  if(e.target.attributes.side.nodeValue == "ArrowLeft"){
                    $(".pacman>.img").css('transform', 'rotate(-180deg)');
                    this.side = this.plist.controlOption[1];
                    this.move(this.css.top + this.moveOption[1].top, this.css.left + this.moveOption[1].left);
                }else if(e.target.attributes.side.nodeValue == "ArrowDown"){
                    this.side = this.plist.controlOption[2];
                    $(".pacman>.img").css('transform', 'rotate(-270deg)');
                    this.move(this.css.top + this.moveOption[2].top, this.css.left + this.moveOption[2].left);
                }else if(e.target.attributes.side.nodeValue == "ArrowRight"){
                    this.side = this.plist.controlOption[3];
                    $(".pacman>.img").css('transform', 'rotate(0deg)');
                    this.move(this.css.top + this.moveOption[3].top, this.css.left + this.moveOption[3].left);
                }
            }
        })
    }
}