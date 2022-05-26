class StartGame extends egret.Sprite{

    public restart:egret.Bitmap;

    public constructor( texture:egret.SpriteSheet ){
        super();

        var StartGame =new egret.Bitmap();
        StartGame.texture = texture.getTexture("start_1");
        this.addChild(StartGame);
        this.restart = new egret.Bitmap;
        this.restart.texture = texture.getTexture("start_2");
        this.addChild(this.restart);
        this.restart.x = egret.MainContext.instance.stage.stageWidth -400;
        this.restart.y = (egret.MainContext.instance.stage.stageHeight-this.restart.height)/2;
    }



}