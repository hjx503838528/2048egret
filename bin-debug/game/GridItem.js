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
/**
 *
 */
var GridItem = (function (_super) {
    __extends(GridItem, _super);
    function GridItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "GameGridItem";
        _this.touchEnabled = false; //不能点击
        _this.anchorOffsetX = _this.width >> 1;
        _this.anchorOffsetY = _this.height >> 1;
        return _this;
    }
    GridItem.prototype.setData = function (data) {
        this.data = data;
        this.grid.fillColor = data.bg;
        if (data.num > 0) {
            this.numTxt.visible = true;
            this.numTxt.text = data.num + "";
            this.numTxt.size = data.size;
            this.numTxt.textColor = data.color;
        }
        else {
            this.numTxt.visible = false;
        }
    };
    Object.defineProperty(GridItem.prototype, "num", {
        get: function () {
            return this.data.num;
        },
        enumerable: true,
        configurable: true
    });
    GridItem.prototype.moveTo = function (deltaX, deltaY, time, animateState) {
        // animateState.increase();
        egret.Tween.get(this).to({
            x: this.x + deltaX,
            y: this.y + deltaY
        }, time).call(function () {
            // animateState.descrease();
            Game2048.self.addNewGrids(1);
        }, this);
    };
    GridItem.prototype.change = function (delay, numInfo, animateState) {
        var _this = this;
        animateState.increase();
        var that = this;
        egret.Tween.get(this).wait(delay).call(function () {
            _this.numTxt.text = "" + numInfo.num;
            _this.numTxt.size = numInfo.fontSize;
            _this.numTxt.textColor = numInfo.color;
            _this.grid.fillColor = numInfo.backgroundColor;
            animateState.descrease();
        }, this);
    };
    GridItem.prototype.moveToAndFadeOut = function (deltaX, deltaY, time, animateState) {
        animateState.increase();
        var that = this;
        egret.Tween.get(this).to({
            x: this.x + deltaX,
            y: this.y + deltaY
        }, time).to({ alpha: 1 }, 250).call(function () {
            animateState.descrease();
        }, this);
    };
    return GridItem;
}(eui.Component));
__reflect(GridItem.prototype, "GridItem");
// class GridItem extends eui.ItemRenderer {
//     public grid: eui.Rect;
//     public numTxt: eui.Label;
//     public constructor(data) {
//         super();
//         this.skinName = "GameGridItem";
//         this.touchEnabled = false;//不能点击
//     }
//     public dataChanged(): void {
//         let data: any = Util.numStyle[this.data];
//         this.grid.fillColor = data.bg;
//         if (this.data > 0) {
//             this.numTxt.visible = true;
//             this.numTxt.text = data.num + "";
//             this.numTxt.size = data.size;
//             this.numTxt.textColor = data.color;
//         } else {
//             this.numTxt.visible = false;
//         }
//     }
// } 
//# sourceMappingURL=GridItem.js.map