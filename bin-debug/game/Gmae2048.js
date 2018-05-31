var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Game2048 = (function (_super) {
    __extends(Game2048, _super);
    function Game2048() {
        var _this = _super.call(this) || this;
        _this.gridNum = 16;
        _this._size = 125; //格子大小
        _this._radius = 15; //格子圆角
        _this._space = 20; //格子间隔
        _this._grade = 0; //分数
        _this._best = 0; //最佳分数
        _this.items = [[], [], [], []];
        _this.running = 0;
        _this.record = 0;
        _this.bestRecord = 0;
        _this.skinName = "Game2048Skin";
        Game2048.self = _this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.addFromStage, _this);
        _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.removeFromStage, _this);
        return _this;
    }
    Game2048.prototype.addFromStage = function () {
        /**创建16个方格背景 */
        for (var i = 0; i < this.gridNum; i++) {
            var row = i % 4;
            var col = Math.floor(i / 4);
            var gridX = this._space + (this._space + this._size) * (i % 4);
            var gridY = this._space + (this._space + this._size) * Math.floor(i / 4);
            var grid = Util.createRect(gridX, gridY, this._size, this._radius, 0xcdc1b4);
            this.contentCon.addChild(grid);
        }
        this.contentCon.touchChildren = false;
        this.gameOver.anchorOffsetX = this.gameOver.width >> 1;
        this.gameOver.anchorOffsetY = this.gameOver.height >> 1;
        this.gameOver.x = this.width >> 1;
        this.gameOver.y = this.height >> 1;
        this.gameOver.visible = false;
        this.bestTxt.text = "0";
        this.gradeTxt.text = "0";
        /**注册事件 */
        this.contentCon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onclick, this);
        this.newBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onclick, this);
        this.newGame.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onclick, this);
        document.addEventListener("keydown", this.onKeyup);
        /**游戏初始化 */
        this.resetGrids();
    };
    /**键盘事件 */
    Game2048.prototype.onKeyup = function (e) {
        // 0:上, 1:右, 2:下, 3:左
        switch (e.keyCode) {
            case 37://left
                Game2048.self.doMove(3);
                break;
            case 38://up
                Game2048.self.doMove(0);
                break;
            case 39://right
                Game2048.self.doMove(1);
                break;
            case 40://down
                Game2048.self.doMove(2);
                break;
        }
    };
    /**滑动事件 */
    Game2048.prototype.onclick = function (e) {
        switch (e.target) {
            case this.newBtn:
                this.resetGrids();
                break;
            case this.newGame:
                this.resetGrids();
                break;
            case this.contentCon:
                if (e.type == egret.TouchEvent.TOUCH_BEGIN) {
                    this._startPoint = new egret.Point(e.stageX, e.stageY);
                    this.contentCon.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onclick, this);
                }
                else if (e.type == egret.TouchEvent.TOUCH_MOVE) {
                    this._endPoint = new egret.Point(e.stageX, e.stageY);
                    var disX = this._endPoint.x - this._startPoint.x;
                    var disY = this._endPoint.y - this._startPoint.y;
                    //方向区分不太明确，忽略操作
                    if (Math.abs(disX - disY) <= 40) {
                        return;
                    }
                    // 0:上, 1:右, 2:下, 3:左
                    var direction = Math.abs(disX) > Math.abs(disY) ? (disX > 0 ? 1 : 3) : (disY > 0 ? 2 : 0);
                    this.doMove(direction);
                    this.contentCon.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onclick, this);
                }
                break;
        }
    };
    /**新游戏 */
    Game2048.prototype.resetGrids = function () {
        var _this = this;
        /**清空 */
        for (var i = 0; i < this.items.length; i++) {
            for (var j = 0; j < this.items[i].length; j++) {
                if (this.items[i][j].item) {
                    this.items[i][j].item.setData(Util.numStyle[0]);
                    this.items[i][j].value = 0;
                    this.removeFromParent(this.items[i][j].item);
                }
            }
        }
        this._grade = 0;
        this.scoreTxt.text = "" + this._grade;
        /**新建 */
        for (var i = 0; i < this.items.length; i++) {
            for (var j = 0; j < 4; j++) {
                if (!this.items[i])
                    this.items[i] = [];
                var data = new GridItemData();
                data.value = 0;
                data.i = 0;
                data.j = 0;
                this.items[i][j] = data;
            }
        }
        /**开始添加2个随机格子 */
        this.addNewGrids(2);
        /**设置结束弹窗状态 */
        if (this.gameOver.visible) {
            egret.Tween.get(this.gameOver).to({ scaleX: 0, scaleY: 0 }, 300).call(function () {
                _this.gameOver.visible = false;
            }, this);
        }
    };
    /**记录空的格子数据 */
    Game2048.prototype.usefulCell = function () {
        var cells = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.items[i][j] && this.items[i][j].value == 0) {
                    this.items[i][j].j = j;
                    this.items[i][j].i = i;
                    cells.push(this.items[i][j]);
                }
            }
        }
        return cells;
    };
    /**随机获取一个格子数据 */
    Game2048.prototype.selectCell = function () {
        var cells = this.usefulCell();
        /**随机获取 */
        if (cells.length) {
            return cells[Math.floor(Math.random() * cells.length)];
        }
    };
    /**
     * 随机创建数字
     * @param size 数量
     */
    Game2048.prototype.addNewGrids = function (size) {
        if (!this.isOver()) {
            for (var i = 0; i < size; i++) {
                var cells = this.selectCell();
                if (!cells)
                    return;
                /**为4的概率 */
                var num = Math.random() < 0.9 ? 2 : 4;
                var grid = new GridItem();
                grid.setData(Util.numStyle[num]);
                grid.x = cells.disX;
                grid.y = cells.disY;
                this.contentCon.addChild(grid);
                this.items[cells.i][cells.j].item = grid;
                this.items[cells.i][cells.j].value = num;
            }
        }
    };
    // 根据滑动方向生成list的四个数组（方便计算）
    Game2048.prototype.formList = function (dir) {
        var list = [[], [], [], []];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                switch (dir) {
                    case 0:
                        list[i].push(this.items[j][i]);
                        break;
                    case 1:
                        list[i].push(this.items[i][3 - j]);
                        break;
                    case 2:
                        list[i].push(this.items[3 - j][i]);
                        break;
                    case 3:
                        list[i].push(this.items[i][j]);
                        break;
                }
            }
        }
        return list;
    };
    Game2048.prototype.doMove = function (type) {
        var _this = this;
        if (this.isOver())
            return;
        var arr = this.formList(type);
        var nextI;
        for (var i = 0; i < arr.length; i++) {
            var _loop_1 = function (j) {
                nextI = -1;
                for (var m = j + 1; m < arr[i].length; m++) {
                    if (arr[i][m].value != 0) {
                        nextI = m;
                        break;
                    }
                }
                if (nextI !== -1) {
                    var curData = arr[i][j];
                    var nextData = arr[i][nextI];
                    var time = Math.abs(j - nextI) * 60;
                    if (curData.value == 0) {
                        this_1.running += 1;
                        var value = nextData.value;
                        curData.value = value;
                        curData.item = nextData.item;
                        nextData.item = null;
                        nextData.value = 0;
                        j--;
                        egret.Tween.get(curData.item).to({ x: curData.disX, y: curData.disY }, time).call(function () {
                            _this.running -= 1;
                            if (_this.running <= 0) {
                                _this.addNewGrids(1);
                            }
                        }, this_1);
                    }
                    else if (curData.value == nextData.value) {
                        this_1.running += 1;
                        if (this_1.contentCon.getChildIndex(nextData.item) < this_1.contentCon.getChildIndex(curData.item)) {
                            this_1.contentCon.swapChildren(nextData.item, curData.item);
                        }
                        var nextItem_1 = nextData.item;
                        var curItem = curData.item;
                        var value_1 = nextData.value * 2;
                        nextData.value = 0;
                        nextData.item = null;
                        curData.value = value_1;
                        egret.Tween.get(nextItem_1).to({ x: curData.disX, y: curData.disY }, time).to({ scaleX: 1.2, scaleY: 1.2 }, 50).to({ scaleX: 0.8, scaleY: 0.8 }, 50).to({ scaleX: 1, scaleY: 1 }, 50).call(function (curItem, itemData) {
                            _this.running -= 1;
                            curItem.setData(Util.numStyle[value_1]);
                            _this.removeFromParent(nextItem_1);
                            /**分数显示 */
                            _this.record += value_1;
                            _this._grade += value_1;
                            var g = _this._grade;
                            var b = _this._best;
                            if (g > b) {
                                _this.bestRecord += value_1;
                                g = b;
                            }
                            if (_this.running <= 0) {
                                _this.addNewGrids(1);
                                var num = _this.record;
                                _this.record = 0;
                                var label = new eui.Label();
                                label.text = "+" + num;
                                label.x = 360;
                                label.y = 75;
                                label.width = 120;
                                label.bold = true;
                                label.size = 30;
                                label.textColor = 0x7c736a;
                                label.textAlign = "center";
                                _this.addChild(label);
                                egret.Tween.get(label).to({ y: 30 }, 300).to({ alpha: 0 }, 200).call(function (label) {
                                    _this.scoreTxt.text = "" + _this._grade;
                                    _this.removeFromParent(label);
                                }, _this, [label]);
                                if (_this._grade > _this._best) {
                                    _this._best = _this._grade;
                                    var num_1 = _this.bestRecord;
                                    _this.bestRecord = 0;
                                    var bestLabel = new eui.Label();
                                    bestLabel.text = "+" + num_1;
                                    bestLabel.x = 490;
                                    bestLabel.y = 75;
                                    bestLabel.size = 30;
                                    bestLabel.width = 120;
                                    bestLabel.bold = true;
                                    bestLabel.textColor = 0xf59563;
                                    bestLabel.textAlign = "center";
                                    _this.addChild(bestLabel);
                                    egret.Tween.get(bestLabel).to({ y: 30 }, 300).to({ alpha: 0 }, 200).call(function (label) {
                                        _this.bestTxt.text = "" + _this._best;
                                        _this.removeFromParent(label);
                                    }, _this, [label]);
                                }
                            }
                        }, this_1, [curItem, nextItem_1]);
                    }
                }
                out_j_1 = j;
            };
            var this_1 = this, out_j_1;
            for (var j = 0; j < arr[i].length; j++) {
                _loop_1(j);
                j = out_j_1;
            }
        }
    };
    /**游戏是否结束 */
    Game2048.prototype.isOver = function () {
        var _this = this;
        if (this.usefulCell().length > 0) {
            return false;
        }
        else {
            for (var i = 0; i < this.items.length; i++)
                for (var j = 1; j < this.items[i].length; j++) {
                    if (this.items[i][j].value == this.items[i][j - 1].value)
                        return false;
                }
            for (var j = 0; j < this.items.length; j++)
                for (var i = 1; i < this.items[j].length; i++) {
                    if (this.items[i][j].value == this.items[i - 1][j].value)
                        return false;
                }
        }
        /**结束弹窗动画 */
        this.gameOver.scaleX = this.gameOver.scaleY = 0;
        this.gameOver.visible = true;
        egret.Tween.get(this.gameOver).to({ scaleX: 1, scaleY: 1 }, 300).call(function () {
            _this.gradeTxt.text = "" + _this._grade;
        }, this);
        return true;
    };
    /**移除组件 */
    Game2048.prototype.removeFromParent = function (child) {
        if (!child || child.parent == null)
            return;
        child.parent.removeChild(child);
    };
    /**移除舞台操作 */
    Game2048.prototype.removeFromStage = function () {
        this.contentCon.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onclick, this);
        this.newBtn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onclick, this);
        this.newGame.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onclick, this);
    };
    return Game2048;
}(eui.Component));
__reflect(Game2048.prototype, "Game2048");
//# sourceMappingURL=Gmae2048.js.map