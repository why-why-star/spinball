/**
 * 以下示例演示了事件的捕获冒泡。
 */
 class Main extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }



    private onAddToStage(event:egret.Event) {
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }


    private onConfigComplete(event:RES.ResourceEvent){
        
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.loadGroup("gameres");

    }

    private once_game: StartGame;//开始界面(只出现一次)
    private bg:BackGround;//背景
    private _viewManage:ViewManage;//其他内容在这里显示
    private onResourceLoadComplete(){
        this.bg = new BackGround(RES.getRes("myresource_json"));
        this.addChild(this.bg);
        this.once_game = new StartGame(RES.getRes("myresource_json"));
        this.addChild(this.once_game);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.once_start, this);

    }

    private once_start(evt: egret.TouchEvent) {
        console.log("开始游戏");
        this.removeChild(this.once_game);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.once_start, this)
        this._viewManage = new ViewManage(this,RES.getRes("myresource_json"));
    }


     
}