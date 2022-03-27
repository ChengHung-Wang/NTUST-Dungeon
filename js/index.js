let app = new Vue({
    el: "#root",
    data() {
        return {
            hideLoading: false,
            teachMode: false,
            teachIndex: 0,
            teachConfig: [
                {
                    img: "./img/teach/home_withNum.png",
                    shadow: true,
                    main: `
                        <h3>主頁控制項：</h3>
                        <p>
                            1. 玩家姓名，您可以輸入您的遊戲名稱<br>
                            2. 遊戲難度，不同的難度將會對應不同的Ghost數量<br>
                            3. 遊戲模式選擇<br>
                            4. 字體大小調整區，點擊「A+」來放大字體，點擊「A-」來縮小字體</p>
                    `
                },
                {
                    img: "./img/teach/statusBar.png",
                    shadow: true,
                    main: `
                        <h3>遊戲畫面狀態列</h3>
                        <p>
                            1. 指北標示<br>
                            2. 遊戲難度<br>
                            3. 分數<br>
                            4. 經過時間<br>
                            5. 玩家名稱<br>
                            6. 生命值<br>
                        </p>
                    `
                },
                {
                    img: "./img/teach/close_alert.png",
                    shadow: true,
                    main: `
                       <p class="text-danger">
                            當Ghost在方圓兩格中發現您（不包含牆壁阻擋的前提下），遊戲將會出現紅底告警標示，如果您仍然不幸撞上Ghost，您將會被扣除血量（生命值），扣除三次生命值後，將結束遊戲。
                       </p>
                    `
                },
                {
                    img: "./img/teach/command+key_Map.svg",
                    shadow: false,
                    main: `
                       <h3>瞬移功能</h3>
                       <p class="">
                            您可以在遊戲進行中按下Command + G組合鍵或Option + G，可以輸入<br>
                            <strong class="text-danger">Move (a,b) 來移動方圓一格的距離，每一次的移動會扣除50分</strong>輸入<br>
                            <strong class="text-danger">Jump (a,b) 直接跳到該位置，每一次的移動會扣除200分</strong>。<br>
                            如果輸入未知的格式將由最後一個字判斷移動方向(WASD)<br>
                            若您輸入的位置或是您的積分不合理，我們將有權拒絕您的請求。
                       </p>
                    `
                },
                {
                    img: "./img/teach/role.png",
                    shadow: true,
                    main: `
                       <h3>角色介紹</h3>
                       <p class="">
                            碰到鬼：扣除一個生命值<br>
                            碰到石頭：+10分<br>
                            碰到星星：+50分
                       </p>
                    `
                }
            ],
            move: {
               newPosition: "",
               displayModal: false
            },
            plist: plist
        }
    },
    created() {
        setTimeout(() => {
            this.hideLoading = true;
        }, 2000);
        $(window).on("keydown", (e) => {
            if ((e.metaKey || e.altKey) && (e.originalEvent.code == "KeyG")) {
                window.event.preventDefault();
                window.event.cancelBubble = true//IE
                e.preventDefault();
                if (this.plist.state) {
                    this.moveAction();
                }
            }
        });
    },
    methods: {
        startGame() {
            this.teachMode = false;
            // from traditional js
            this.hideLoading = false;
            setTimeout(() => {
                plist.initGame();
                hasStart = true;
                setTimeout(() => {
                    this.hideLoading = true;
                }, 800);
            }, 1400);
        },
        // week 4 作業需求
        moveAction() {
            this.plist.state = false;
            this.plist.anyGoOperation = true;

            let pacman = {
                obj: this.plist.drawables.filter(e => e instanceof PacMan)[0],
                row: 0,
                col: 0
            }
            // update pacman info
            pacman.row = pacman.obj.css.top / this.plist.width;
            pacman.col = pacman.obj.css.left / this.plist.width;
            this.$prompt(
                '請輸入目的地: <br>' +
                '方圓一格內移動格式：Move(a, b)，扣50分<br>' +
                '跳躍至指定位置格式：Jump(a, b)，扣200分<br>' +
                '<strong class="text-danger">' +
                '您現在位於(' +  pacman.col +  ', ' + pacman.row + ')' +
                '</strong>', '提示',
                {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true,
                beforeClose: (action, instance, done) => {
                    if (action != 'confirm') {
                        done();
                    }else {
                        if (instance.inputValue.match(/Jump\s*\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/i) != null) {
                            let input = instance.inputValue.match(/Jump\s*\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/i);
                            if (this.plist.score < 200) {
                                this.$message({
                                    type: 'error',
                                    showClose: true,
                                    message: '積分不足'
                                });
                            }else {
                                if (pacman.obj.anyGo(input[2] * this.plist.width, input[1] * this.plist.width)) {
                                    instance.confirmButtonLoading = true;
                                    instance.confirmButtonText = '執行中...';
                                    setTimeout(() => {
                                        done();
                                        this.plist.score -= 200;
                                        setTimeout(() => {
                                            instance.confirmButtonLoading = false;
                                        }, 300);
                                    }, 1000)
                                }else {
                                    this.$message({
                                        type: 'error',
                                        showClose: true,
                                        message: '不合理的位置'
                                    });
                                }
                            }
                        } else if (instance.inputValue.match(/Move\s*\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/i) != null) {
                            let input = instance.inputValue.match(/Move\s*\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/i);
                            if (this.plist.score < 50) {
                                this.$message({
                                    type: 'error',
                                    showClose: true,
                                    message: '積分不足'
                                });
                            }else if(Math.abs(pacman.col - input[1]) > 1 || Math.abs(pacman.row - input[2]) > 1) {
                                this.$message({
                                    type: 'error',
                                    showClose: true,
                                    message: '移動超過方圓一格限制'
                                });
                            }else if (pacman.obj.anyGo(input[2] * this.plist.width, input[1] * this.plist.width)) {
                                instance.confirmButtonLoading = true;
                                instance.confirmButtonText = '執行中...';
                                setTimeout(() => {
                                    done();
                                    this.plist.score -= 50;
                                    setTimeout(() => {
                                        instance.confirmButtonLoading = false;
                                    }, 300);
                                }, 1000)
                            }else {
                                this.$message({
                                    type: 'error',
                                    showClose: true,
                                    message: '不合理的位置'
                                });
                            }
                        } else {
                            let input = instance.inputValue.split("").pop();
                            let offset = {
                                col: 0,
                                row: 0
                            }
                            input = input.toUpperCase();
                            switch (input) {
                                case "W": // up
                                    offset.row = -1;
                                    break;
                                case "A": // left
                                    offset.col = -1;
                                    break;
                                case "S": // down
                                    offset.row = 1;
                                    break;
                                case "D": // right
                                    offset.col = 1;
                                    break;
                                default:
                                    done();
                            }
                            if (pacman.obj.anyGo((pacman.row + offset.row) * this.plist.width, (pacman.col + offset.col) * this.plist.width)) {
                                done();
                            }else {
                                this.$message({
                                    type: 'error',
                                    showClose: true,
                                    message: '不合理的位置'
                                });
                            }
                        }
                    }

                }
            }).then(({ value }) => {
                pacman = {
                    obj: this.plist.drawables.filter(e => e instanceof PacMan)[0],
                    row: 0,
                    col: 0
                }
                // update pacman info
                pacman.row = pacman.obj.css.top / this.plist.width;
                pacman.col = pacman.obj.css.left / this.plist.width;
                this.$message({
                    type: 'success',
                    showClose: true,
                    dangerouslyUseHTMLString: true,
                    message: `成功執行瞬移指令: ${value}<br>您現在位於(${pacman.col}, ${pacman.row})`
                });
                this.plist.state = true;
                this.plist.anyGoOperation = false;
            }).catch(() => {
                this.$message({
                    type: 'error',
                    showClose: true,
                    message: '取消输入'
                });
                this.plist.state = true;
                this.plist.anyGoOperation = false;
            });

        }
    },
    watch: {
        teachMode() {
            if (this.teachMode) {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                }
            }
        }
    }
})