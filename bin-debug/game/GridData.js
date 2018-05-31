var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 格子数据
 */
var GridItemData = (function () {
    function GridItemData() {
        this.value = 0; //值
    }
    Object.defineProperty(GridItemData.prototype, "disX", {
        /**x的位置 */
        get: function () {
            /**修改锚点为中心点用来动画处理 */
            var _half = 125 >> 1;
            var disX = 20 + (20 + 125) * this.j + _half;
            return disX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridItemData.prototype, "disY", {
        /**y的位置 */
        get: function () {
            /**修改锚点为中心点用来动画处理 */
            var _half = 125 >> 1;
            var disY = 20 + (20 + 125) * this.i + _half;
            return disY;
        },
        enumerable: true,
        configurable: true
    });
    return GridItemData;
}());
__reflect(GridItemData.prototype, "GridItemData");
//# sourceMappingURL=GridData.js.map