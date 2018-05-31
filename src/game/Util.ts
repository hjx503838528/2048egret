/**
 * 工具类
 */
class Util {
    /**
     * 绘制Rect
     * @param x
     * @param y
     * @param size 大小
     * @param radius 圆角
     * @param color 颜色
     * @param alpha 透明度
     */
    public static createRect(x: number, y: number, size: number, radius: number, color: number, alpha: number = 1): eui.Rect {
        let rect: eui.Rect = new eui.Rect(size, size, color);
        rect.x = x;
        rect.y = y;
        rect.alpha = alpha;
        rect.ellipseWidth = radius;
        rect.ellipseHeight = radius;
        return rect;
    }

    public static createLable(text: string, x: number, y: number, size: number, w: number, color: number, textAlign: string): eui.Label {
        let label: eui.Label = new eui.Label();
        label.text = `${text}`;
        label.x = x;
        label.y = y;
        label.width = w;
        label.bold = true;
        label.size = size;
        label.textColor = color;
        label.textAlign = textAlign;
        return label;
    }

    /**颜色 */
    public static numStyle: any =
    {
        "0": { "num": 0, "color": 0x7c736a, "bg": 0xcdc1b4, "size": 65 },
        "2": { "num": 2, "color": 0x7c736a, "bg": 0xeee4da, "size": 65 },
        "4": { "num": 4, "color": 0x7c736a, "bg": 0xede0c8, "size": 65 },
        "8": { "num": 8, "color": 0xfff7eb, "bg": 0xf2b179, "size": 65 },
        "16": { "num": 16, "color": 0xfff7eb, "bg": 0xf59563, "size": 62 },
        "32": { "num": 32, "color": 0xfff7eb, "bg": 0xf57c5f, "size": 62 },
        "64": { "num": 64, "color": 0xfff7eb, "bg": 0xf65d3b, "size": 62 },
        "128": { "num": 128, "color": 0xfff7eb, "bg": 0xedce71, "size": 60 },
        "256": { "num": 256, "color": 0xfff7eb, "bg": 0xedcc61, "size": 60 },
        "512": { "num": 512, "color": 0xfff7eb, "bg": 0xecc850, "size": 60 },
        "1024": { "num": 1024, "color": 0xfff7eb, "bg": 0xedc53f, "size": 50 },
        "2048": { "num": 2048, "color": 0xfff7eb, "bg": 0xeec22e, "size": 50 },
        "4096": { "num": 4096, "color": 0xfff7eb, "bg": 0x3d3a33, "size": 50 },
        "8192": { "num": 8192, "color": 0xfff7eb, "bg": 0x0c0b0a, "size": 50 },
        "16384": { "num": 16384, "color": 0xfff7eb, "bg": 0x0fbcbc, "size": 40 },
    };

}