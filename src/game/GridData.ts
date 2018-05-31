/**
 * 格子数据
 */
class GridItemData {
    public i: number;//横
    public j: number;//竖
    public value: number = 0;//值
    public item: GridItem;//显示对象

    /**x的位置 */
    public get disX(): number {
        /**修改锚点为中心点用来动画处理 */
        let _half: number = 125 >> 1;
        let disX: number = 20 + (20 + 125) * this.j + _half;
        return disX;
    }
    /**y的位置 */
    public get disY(): number {
        /**修改锚点为中心点用来动画处理 */
        let _half: number =  125 >> 1;
        let disY: number = 20 + (20 + 125) * this.i + _half;
        return disY;
    }
}