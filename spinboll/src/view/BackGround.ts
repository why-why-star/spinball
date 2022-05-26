class BackGround extends egret.Sprite{

    private text:egret.TextField;
    public restart:egret.Bitmap;

    public constructor( texture:egret.SpriteSheet ){
        super();

        var ReStartGame =new egret.Bitmap();
        ReStartGame.texture = texture.getTexture("bg");
        this.addChild(ReStartGame);
        this.text = new egret.TextField();
        this.addChild(this.text);
    }

}