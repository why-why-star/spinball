class ReStartGame extends egret.Sprite{

    private text:egret.TextField;
    public restart:egret.Bitmap;

    public constructor( texture:egret.SpriteSheet ){
        super();

        var ReStartGame =new egret.Bitmap();
        ReStartGame.texture = texture.getTexture("restart_1");
        this.addChild(ReStartGame);
        this.text = new egret.TextField();
        this.addChild(this.text);

        this.restart = new egret.Bitmap;
        this.restart.texture = texture.getTexture("restart_2");
        this.addChild(this.restart);
        this.restart.x = (egret.MainContext.instance.stage.stageWidth - this.restart.width)/2;
        this.restart.y = egret.MainContext.instance.stage.stageHeight - 300;
    }


    public setScore(x:number) {

        console.log("??????????????????????????????????????????????????");
        this.text.text = "你的分数为\n" + x;
        this.text.size = 280;
        this.text.x = 50;
        this.text.y = 50;
        this.text.textAlign = egret.HorizontalAlign.LEFT;
        this.text.textColor = 0x522452;
        this.text.type = egret.TextFieldType.DYNAMIC;
        this.text.lineSpacing = 6;
        this.text.multiline = true;
        this.text.touchEnabled = true;
        
    }

}