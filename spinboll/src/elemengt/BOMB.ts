class BOMB extends egret.Sprite{
    private _bmp:egret.Bitmap;
    public constructor( texture:egret.SpriteSheet ){
        super();
        this._bmp = new egret.Bitmap();
        this._bmp.texture = texture .getTexture("bomb");
        this.width = 100;
        this.height = 100;
        this.addChild(this._bmp);
    }
    public getValue():number{
        return Math.round(Math.random()*3)+2;
    }
}