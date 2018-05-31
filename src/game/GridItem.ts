/**
 * 
 */
class GridItem extends eui.Component {
    public grid: eui.Rect;
    public numTxt: eui.Label;
    public data: { num, color, bg, size };
    private _num: number;
    public constructor() {
        super();
        this.skinName = "GameGridItem";
        this.touchEnabled = false;//不能点击
        this.anchorOffsetX = this.width >> 1;
        this.anchorOffsetY = this.height >> 1;
    }

    public setData(data: { num, color, bg, size }): void {
        this.data = data;
        this.grid.fillColor = data.bg;
        if (data.num > 0) {
            this.numTxt.visible = true;
            this.numTxt.text = data.num + "";
            this.numTxt.size = data.size;
            this.numTxt.textColor = data.color;
        } else {
            this.numTxt.visible = false;
        }
    }

    public get num(): number {
        return this.data.num;
    }

    public moveTo(deltaX: number, deltaY: number, time: number, animateState) {
        // animateState.increase();
        egret.Tween.get(this).to({
            x: this.x + deltaX,
            y: this.y + deltaY
        }, time).call(() => {
            // animateState.descrease();
            Game2048.self.addNewGrids(1)
        }, this);
    }

    public change(delay: number, numInfo, animateState) {
        animateState.increase();
        let that = this;
        egret.Tween.get(this).wait(delay).call(() => {
            this.numTxt.text = "" + numInfo.num;
            this.numTxt.size = numInfo.fontSize;
            this.numTxt.textColor = numInfo.color;
            this.grid.fillColor = numInfo.backgroundColor;
            animateState.descrease();
        }, this);
    }

    public moveToAndFadeOut(deltaX: number, deltaY: number, time: number, animateState) {
        animateState.increase();
        let that = this;
        egret.Tween.get(this).to({
            x: this.x + deltaX,
            y: this.y + deltaY
        }, time).to({ alpha: 1 }, 250).call(() => {
            animateState.descrease();
        }, this);
    }
}


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