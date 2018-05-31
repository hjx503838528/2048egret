class Game2048 extends eui.Component {
    private contentCon: eui.Group;
    private newBtn: eui.Button;
    private gameOver: eui.Group;
    private newGame: eui.Label;
    private gradeTxt: eui.Label;
    private scoreTxt: eui.Label;
    private bestTxt: eui.Label;
    private gridBg: eui.Rect;
    private gridList: eui.List;

    private _startPoint: egret.Point;//开始
    private _endPoint: egret.Point;//结束

    public gridNum: number = 16;
    private _size: number = 125;//格子大小
    private _radius: number = 15;//格子圆角
    private _space: number = 20;//格子间隔
    private _grade: number = 0;//分数
    private _best: number = 0;//最佳分数

    public static self: Game2048;
    private items: GridItemData[][] = [[], [], [], []];

    public constructor() {
        super();
        this.skinName = "Game2048Skin";
        Game2048.self = this;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addFromStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);
    }

    public addFromStage(): void {
        /**创建16个方格背景 */
        for (let i: number = 0; i < this.gridNum; i++) {
            let row: number = i % 4;
            let col: number = Math.floor(i / 4);
            let gridX: number = this._space + (this._space + this._size) * (i % 4);
            let gridY: number = this._space + (this._space + this._size) * Math.floor(i / 4);
            let grid: eui.Rect = Util.createRect(gridX, gridY, this._size, this._radius, 0xcdc1b4);
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
    }

    /**键盘事件 */
    public onKeyup(e: KeyboardEvent): void {
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
    }

    /**滑动事件 */
    private onclick(e: egret.TouchEvent): void {
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
                } else if (e.type == egret.TouchEvent.TOUCH_MOVE) {
                    this._endPoint = new egret.Point(e.stageX, e.stageY);
                    let disX: number = this._endPoint.x - this._startPoint.x;
                    let disY: number = this._endPoint.y - this._startPoint.y;
                    //方向区分不太明确，忽略操作
                    if (Math.abs(disX - disY) <= 40) {
                        return;
                    }
                    // 0:上, 1:右, 2:下, 3:左
                    let direction: number = Math.abs(disX) > Math.abs(disY) ? (disX > 0 ? 1 : 3) : (disY > 0 ? 2 : 0);
                    this.doMove(direction);
                    this.contentCon.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onclick, this);
                }
                break;
        }
    }

    /**新游戏 */
    private resetGrids() {
        /**清空 */
        for (let i = 0; i < this.items.length; i++) {
            for (let j: number = 0; j < this.items[i].length; j++) {
                if (this.items[i][j].item) {
                    this.items[i][j].item.setData(Util.numStyle[0]);
                    this.items[i][j].value = 0;
                    this.removeFromParent(this.items[i][j].item);

                }
            }
        }
        this._grade = 0;
        this.scoreTxt.text = `${this._grade}`;
        /**新建 */
        for (let i = 0; i < this.items.length; i++) {
            for (let j: number = 0; j < 4; j++) {
                if (!this.items[i]) this.items[i] = [];
                let data: GridItemData = new GridItemData();
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
            egret.Tween.get(this.gameOver).to({ scaleX: 0, scaleY: 0 }, 300).call(() => {
                this.gameOver.visible = false;
            }, this);
        }

    }

    /**记录空的格子数据 */
    private usefulCell(): GridItemData[] {
        let cells: GridItemData[] = [];
        for (let i: number = 0; i < 4; i++) {
            for (let j: number = 0; j < 4; j++) {
                if (this.items[i][j] && this.items[i][j].value == 0) {
                    this.items[i][j].j = j;
                    this.items[i][j].i = i;
                    cells.push(this.items[i][j]);
                }
            }
        }
        return cells;
    }

    /**随机获取一个格子数据 */
    private selectCell(): GridItemData {
        let cells: GridItemData[] = this.usefulCell();
        /**随机获取 */
        if (cells.length) {
            return cells[Math.floor(Math.random() * cells.length)];
        }
    }

    /**
     * 随机创建数字
     * @param size 数量
     */
    public addNewGrids(size: number): void {
        if (!this.isOver()) {
            for (let i: number = 0; i < size; i++) {
                let cells: GridItemData = this.selectCell();
                if (!cells) return;
                /**为4的概率 */
                let num: number = Math.random() < 0.9 ? 2 : 4;
                let grid: GridItem = new GridItem();
                grid.setData(Util.numStyle[num]);
                grid.x = cells.disX;
                grid.y = cells.disY;
                this.contentCon.addChild(grid);
                this.items[cells.i][cells.j].item = grid;
                this.items[cells.i][cells.j].value = num;
            }
        }
    }

    // 根据滑动方向生成list的四个数组（方便计算）
    private formList(dir): GridItemData[][] {
        let list: GridItemData[][] = [[], [], [], []];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
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
    }

    private running: number = 0;
    private record: number = 0;
    private bestRecord: number = 0;
    private doMove(type): void {
        if (this.isOver()) return;
        let arr: GridItemData[][] = this.formList(type);
        let nextI: number;
        for (let i: number = 0; i < arr.length; i++) {
            for (let j: number = 0; j < arr[i].length; j++) {
                nextI = -1;
                for (let m: number = j + 1; m < arr[i].length; m++) {
                    if (arr[i][m].value != 0) {
                        nextI = m;
                        break;
                    }
                }

                if (nextI !== -1) {
                    let curData: GridItemData = arr[i][j];
                    let nextData: GridItemData = arr[i][nextI];
                    let time = Math.abs(j - nextI) * 60;
                    if (curData.value == 0) {
                        this.running += 1;
                        let value: number = nextData.value;
                        curData.value = value;
                        curData.item = nextData.item;
                        nextData.item = null;
                        nextData.value = 0;
                        j--;
                        egret.Tween.get(curData.item).to({ x: curData.disX, y: curData.disY }, time).call(() => {
                            this.running -= 1;
                            if (this.running <= 0) {
                                this.addNewGrids(1);
                            }
                        }, this);
                    } else if (curData.value == nextData.value) {
                        this.running += 1;
                        if (this.contentCon.getChildIndex(nextData.item) < this.contentCon.getChildIndex(curData.item)) {
                            this.contentCon.swapChildren(nextData.item, curData.item);
                        }
                        let nextItem: GridItem = nextData.item;
                        let curItem: GridItem = curData.item;
                        let value: number = nextData.value * 2;
                        nextData.value = 0;
                        nextData.item = null;
                        curData.value = value;
                        egret.Tween.get(nextItem).to({ x: curData.disX, y: curData.disY }, time).to(
                            { scaleX: 1.2, scaleY: 1.2 }, 50).to(
                            { scaleX: 0.8, scaleY: 0.8 }, 50).to(
                            { scaleX: 1, scaleY: 1 }, 50).call(
                            (curItem: GridItem, itemData: GridItem) => {
                                this.running -= 1;
                                curItem.setData(Util.numStyle[value]);
                                this.removeFromParent(nextItem);
                                /**小弹幕 */
                                if (value >= 2048) {
                                    let lable: eui.Label = Util.createLable(`恭喜达到${value}!`, 0, 500, 40, 640, 0xf57c5f, "center");
                                    this.addChild(lable)
                                    egret.Tween.get(lable).to({ y: 400 }, 1200).call(() => {
                                        this.removeFromParent(lable);
                                    }, this);
                                }

                                /**分数显示 */
                                this.record += value;
                                this._grade += value;
                                let g: number = this._grade;
                                let b: number = this._best;
                                if (g > b) {
                                    this.bestRecord += value;
                                    g = b;
                                }
                                if (this.running <= 0) {
                                    this.addNewGrids(1);
                                    let num: number = this.record;
                                    this.record = 0;
                                    let label: eui.Label = Util.createLable(`+${num}`, 360, 100, 30, 120, 0x7c736a, "center");
                                    this.addChild(label);
                                    egret.Tween.get(label).to({ y: 50 }, 300).to({ alpha: 0 }, 200).call((label) => {
                                        this.scoreTxt.text = `${this._grade}`;
                                        this.removeFromParent(label);
                                    }, this, [label]);
                                    if (this._grade > this._best) {
                                        this._best = this._grade;
                                        let num: number = this.bestRecord;
                                        this.bestRecord = 0;
                                        let bestLabel: eui.Label = Util.createLable(`+${num}`, 490, 100, 30, 120, 0xf59563, "center");
                                        this.addChild(bestLabel);
                                        egret.Tween.get(bestLabel).to({ y: 50 }, 300).to({ alpha: 0 }, 200).call((label) => {
                                            this.bestTxt.text = `${this._best}`;
                                            this.removeFromParent(label);
                                        }, this, [label]);
                                    }

                                }

                            }, this, [curItem, nextItem]);
                    }
                }
            }
        }
    }

    /**游戏是否结束 */
    private isOver(): boolean {
        if (this.usefulCell().length > 0) {
            return false;
        } else {
            for (let i: number = 0; i < this.items.length; i++) // 左右不等
                for (let j: number = 1; j < this.items[i].length; j++) {
                    if (this.items[i][j].value == this.items[i][j - 1].value)
                        return false;
                }
            for (let j: number = 0; j < this.items.length; j++)  // 上下不等
                for (let i: number = 1; i < this.items[j].length; i++) {
                    if (this.items[i][j].value == this.items[i - 1][j].value)
                        return false;
                }
        }
        /**结束弹窗动画 */
        this.gameOver.scaleX = this.gameOver.scaleY = 0;
        this.gameOver.visible = true;
        egret.Tween.get(this.gameOver).to({ scaleX: 1, scaleY: 1 }, 300).call(() => {
            this.gradeTxt.text = `${this._grade}`;
        }, this);
        return true;
    }

    /**移除组件 */
    public removeFromParent(child: egret.DisplayObject) {
        if (!child || child.parent == null)
            return;
        child.parent.removeChild(child);
    }

    /**移除舞台操作 */
    public removeFromStage(): void {
        this.contentCon.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onclick, this);
        this.newBtn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onclick, this);
        this.newGame.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onclick, this);
    }

}

