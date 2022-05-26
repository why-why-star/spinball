

class ViewManage extends egret.EventDispatcher {

    private _rootView: egret.DisplayObjectContainer;//根
    private _texture: egret.SpriteSheet;//纹理集


    private spintimer: egret.Timer;//小球旋转的定时器
    private linetimer: egret.Timer;//小球直线运动的定时器
    private _dot: egret.Shape;//点击位置以小圆点表示
    private _ball: egret.Shape;//旋转的主体-球

    private _mouseX: number = 0;//鼠标点击位置
    private _mouseY: number = 0;

    private speed: number = 0.05; //旋转的速度
    private radius: number = 50; //半径, 小球距离鼠标的距离
    private angle: number = 0; //角度

    private line_K: number = 0;//斜率
    private line_B: number = 0;//截距
    private have_line_K: number = 0; //有无斜率
    private runway: number = 0;//运动方式x或者y为因变量   +|-   0x+ 1x- 2y+ 3y-


    //一些道具
    private _goldCoin: GOLDCOIN;
    private _goldBag: GOLDBAG;
    private _treasureBox: TREASUREBOX;
    private _stone: STONE;
    private _skull: SKULL;
    private _bomb: BOMB;
    //游戏内记分文本
    private _txInfo: egret.TextField;
    //积分数据管理
    private _datamanage: DataManage;


    private _tools: Array<number>;//选三个道具
    private _threePoint: Array<egret.Point>;//选三个位置


    private _timer: egret.Timer;//游戏计时器
    private _time: number = 0;//计时单位

    private _restartgame: ReStartGame;//重新开始游戏界面


    private _hitwall:number = 0;//撞墙次数


    public constructor(root: egret.DisplayObjectContainer, textures: egret.SpriteSheet) {
        super();
        this._rootView = root;
        this._texture = textures;
        // console.log("viewmanage");
        this.onAddToStage();
    }


    private onAddToStage() {

        this._dot = new egret.Shape;
        this._dot.graphics.beginFill(0x00ff00);
        this._dot.graphics.drawCircle(0, 0, 3);
        this._dot.graphics.endFill();

        this._ball = new egret.Shape;
        this._ball.graphics.beginFill(0xffff00);
        this._ball.graphics.drawCircle(0, 0, 15);
        this._ball.graphics.endFill();
        this._ball.x = egret.MainContext.instance.stage.stageWidth / 2;
        this._ball.y = egret.MainContext.instance.stage.stageHeight / 2;

        this._rootView.addChild(this._ball);
        this._rootView.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);

        this.spintimer = new egret.Timer(10, 0);
        this.spintimer.addEventListener(egret.TimerEvent.TIMER, this.spinrun, this);

        this.linetimer = new egret.Timer(10, 0);
        this.linetimer.addEventListener(egret.TimerEvent.TIMER, this.linerun, this);

        this._timer = new egret.Timer(50, 0);
        this._timer.addEventListener(egret.TimerEvent.TIMER, this.timeLapses, this);

        this.creatAllElement();


        this._threePoint = this.shufflePoint();
        this._tools = this.shuffleTools();
        this.placeTo0ls(this._tools, this._threePoint);
        this._timer.start();

    }

    private creatAllElement() {

        this._goldCoin = new GOLDCOIN(this._texture);
        this._goldBag = new GOLDBAG(this._texture);
        this._treasureBox = new TREASUREBOX(this._texture);
        this._stone = new STONE(this._texture);
        this._skull = new SKULL(this._texture);
        this._bomb = new BOMB(this._texture);


        this._restartgame = new ReStartGame(this._texture);

        this._datamanage = new DataManage();

        this._txInfo = new egret.TextField;
        this._rootView.addChild(this._txInfo);

        this._txInfo.size = 28;
        this._txInfo.x = 50;
        this._txInfo.y = 50;
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT;
        this._txInfo.textColor = 0x000000;
        this._txInfo.type = egret.TextFieldType.DYNAMIC;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;
        this._txInfo.touchEnabled = true;

        this._txInfo.text = this._datamanage.getScore() + "";


    }

    private shufflePoint(): Array<egret.Point> {
        var point: Array<egret.Point> = [];
        for (var i = 0; i < 3; i++) {
            point.push(new egret.Point(Math.random() * 1170 + 585, Math.random() * 540 + 270));
        }

        while (true) {
            if (

                Math.abs(point[0].x - point[1].x) > 200 && Math.abs(point[0].x - point[2].x) > 200 && Math.abs(point[1].x - point[2].x) > 200
                &&
                Math.abs(point[0].y - point[1].y) > 200 && Math.abs(point[0].y - point[2].y) > 200 && Math.abs(point[1].y - point[2].y) > 200
                &&
                Math.abs(point[0].x - this._ball.x) > 200 && Math.abs(point[1].x - this._ball.x) > 200 && Math.abs(point[2].x - this._ball.x) > 200
                &&
                Math.abs(point[0].y - this._ball.y) > 200 && Math.abs(point[1].y - this._ball.y) > 200 && Math.abs(point[2].y - this._ball.y) > 200
                // &&
                // point[0].x>585&&point[1].x>585&&point[2].x>585&&point[0].x<1755&&point[1].x<1755&&point[2].x<1755
                // &&
                // point[0].y>270&&point[1].y>270&&point[2].y>270&&point[0].y<810&&point[1].y<810&&point[2].y<810
            ) {
                break;
            }
            else {
                for (var i = 0; i < 3; i++) {
                    point[i] = (new egret.Point(Math.random() * 2140 + 100, Math.random() * 880 + 100));
                }
            }
        }

        return point;
    }

    private shuffleTools() {
        var mytools: Array<number> = [];
        var x: number = 0;
        var i = 0;

        while (1) {
            if (i >= 2) {
                break;
            }
            x = Math.round(Math.random() * 5);
            switch (x) {
                case 0:
                case 1:
                case 2:
                    if (mytools.indexOf(0) == -1) {
                        i++;
                        // console.log("现在有");
                        // console.log(mytools);
                        // console.log("要添加0"+x);
                        mytools.push(0);
                    }
                    break;
                case 3:
                case 4:
                    if (mytools.indexOf(1) == -1) {
                        i++;
                        // console.log("现在有");
                        // console.log(mytools);
                        // console.log("要添加1"+x);
                        mytools.push(1);
                    }
                    break;
                case 5:
                    if (mytools.indexOf(2) == -1) {
                        i++;
                        // console.log("现在有");
                        // console.log(mytools);
                        // console.log("要添加2"+x);
                        mytools.push(2);
                    }
                    break;
            }
        }




        console.log(mytools);
        switch (Math.round(Math.random() * 5)) {
            case 0:
            case 1:
            case 2:
                mytools.push(3)
                break
            case 3:
            case 4:
                mytools.push(4)
                break
            case 5:
                mytools.push(5)
                break
        }

        // console.log(mytools);
        return mytools;
    }


    private placeTo0ls(Tools: Array<number>, threePoint: Array<egret.Point>) {
        // console.log(Tools);
        if (Tools.length < 3) {
            console.log("???");
        }
        console.log(threePoint);
        for (var i = 0; i < 3; i++) {
            switch (Tools[i]) {
                case 0:
                    this._rootView.addChild(this._goldCoin);
                    this._goldCoin.x = threePoint[i].x;
                    this._goldCoin.y = threePoint[i].y;
                    break;
                case 1:
                    this._rootView.addChild(this._goldBag);
                    this._goldBag.x = threePoint[i].x;
                    this._goldBag.y = threePoint[i].y;
                    break;
                case 2:
                    this._rootView.addChild(this._treasureBox);
                    this._treasureBox.x = threePoint[i].x;
                    this._treasureBox.y = threePoint[i].y;
                    break;
                case 3:
                    this._rootView.addChild(this._stone);
                    this._stone.x = threePoint[i].x;
                    this._stone.y = threePoint[i].y;
                    break;
                case 4:
                    this._rootView.addChild(this._bomb);
                    this._bomb.x = threePoint[i].x;
                    this._bomb.y = threePoint[i].y;
                    break;
                case 5:
                    this._rootView.addChild(this._skull);
                    this._skull.x = threePoint[i].x;
                    this._skull.y = threePoint[i].y;
                    break;

            }
        }
    }

    private collisionDetection() {


        if (this._ball.x < 0 || this._ball.x > 2340 || this._ball.y < 0 || this._ball.y > 1080) {
            this.linetimer.stop();
            this.spintimer.stop();
            this._datamanage.subtraction(20);
            this._ball.x = egret.MainContext.instance.stage.stageWidth / 2;
            this._ball.y = egret.MainContext.instance.stage.stageHeight / 2;
            this._rootView.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
            this._hitwall+=1;
            if(this._hitwall>=5){
                this.stopGame();
            }
        }

        var touchPanel: number = 0;
        var die: number = 0;

        if (this._tools.indexOf(0) > -1) {
            if (this._goldCoin.hitTestPoint(this._ball.x, this._ball.y)) {
                this._datamanage.add(this._goldCoin.getValue());
                touchPanel = 1;
            }
        }
        if (this._tools.indexOf(1) > -1) {
            if (this._goldBag.hitTestPoint(this._ball.x, this._ball.y)) {
                this._datamanage.add(this._goldBag.getValue());
                touchPanel = 1;
            }
        }
        if (this._tools.indexOf(2) > -1) {
            if (this._treasureBox.hitTestPoint(this._ball.x, this._ball.y)) {
                if(this._datamanage.getScore()<0){  
                    this._datamanage.setGold(0);
                }
                this._datamanage.multiplication(this._treasureBox.getValue());
                touchPanel = 1;
            }
        }
        if (this._tools.indexOf(3) > -1) {
            if (this._stone.hitTestPoint(this._ball.x, this._ball.y)) {
                this._datamanage.subtraction(this._stone.getValue());
                touchPanel = 1;
            }
        }
        if (this._tools.indexOf(4) > -1) {
            if (this._bomb.hitTestPoint(this._ball.x, this._ball.y)) {
                this._datamanage.division(this._bomb.getValue());
                touchPanel = 1;
            }
        }
        if (this._tools.indexOf(5) > -1) {
            if (this._skull.hitTestPoint(this._ball.x, this._ball.y)) {
                die = 1;
            }
        }

        if (die) {
            this.stopGame();
        }
        if (touchPanel) {

            if (this._tools.indexOf(0) > -1) {
                this._rootView.removeChild(this._goldCoin);
            }
            if (this._tools.indexOf(1) > -1) {
                this._rootView.removeChild(this._goldBag);
            }
            if (this._tools.indexOf(2) > -1) {
                this._rootView.removeChild(this._treasureBox);
            }
            if (this._tools.indexOf(3) > -1) {
                this._rootView.removeChild(this._stone);
            }
            if (this._tools.indexOf(4) > -1) {
                this._rootView.removeChild(this._bomb);
            }
            if (this._tools.indexOf(5) > -1) {
                this._rootView.removeChild(this._skull);
            }

            this._threePoint = this.shufflePoint();
            this._tools = this.shuffleTools();
            this.placeTo0ls(this._tools, this._threePoint);
        }
        this._txInfo.text = this._datamanage.getScore() + "";

    }


    private touchHandler(evt: egret.TouchEvent) {
        switch (evt.type) {
            case egret.TouchEvent.TOUCH_MOVE:
                break;
            case egret.TouchEvent.TOUCH_BEGIN:

                if (!this._ball.hitTestPoint(evt.stageX, evt.stageY)) { /// if代码确保触摸开始位置移动球内
                    this.speed = 0.1
                    this.linetimer.stop();
                    console.log("？？？？");
                    this._rootView.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
                    this._rootView.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
                    this._dot.x = evt.stageX;
                    this._dot.y = evt.stageY;
                    this._mouseX = evt.stageX;
                    this._mouseY = evt.stageY;
                    this.radius = Math.pow(Math.pow(this._dot.x - this._ball.x, 2) + Math.pow(this._dot.y - this._ball.y, 2), 0.5)
                    console.log(this._dot.x, this._ball.x, this._dot.y, this._ball.y, this.radius);
                    this._rootView.addChild(this._dot);
                    this.linetimer.stop();
                    this.spintimer.start();
                }
                break;
            case egret.TouchEvent.TOUCH_END:
                this._rootView.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
                this._rootView.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
                if (this._dot.parent) {
                    this._dot.parent.removeChild(this._dot);
                }
                this.spintimer.stop();


                if (this._ball.y - this._mouseY == 0) {
                    this.have_line_K = 0;
                }
                else {
                    this.have_line_K = 1;
                    this.line_K = (this._mouseX - this._ball.x) / (this._ball.y - this._mouseY);
                    this.line_B = this._ball.y - this.line_K * this._ball.x;
                }

                if (this.have_line_K != 0) {
                    if (Math.abs(this.line_K) >= 1) {
                        if (this._ball.x > this._mouseX) {
                            this.runway = 2;
                            // this._ball.y+=this.speed*50;
                            // this._ball.x = (this._ball.y - this.line_B)/this.line_K;
                        }
                        else {
                            this.runway = 3;
                            // this._ball.y-=this.speed*50;
                            // this._ball.x = (this._ball.y - this.line_B)/this.line_K;
                        }
                    }
                    else {
                        if (this._ball.y < this._mouseY) {
                            this.runway = 0;
                            // this._ball.x+=this.speed*50;
                            // this._ball.y = this.line_K*this._ball.x+this.line_B;
                        }
                        else {
                            this.runway = 1;
                            // this._ball.x-=this.speed*50;
                            // this._ball.y = this.line_K*this._ball.x+this.line_B;
                        }
                    }
                }
                else {
                    if (this._ball.x > this._mouseX) {
                        this._ball.y += this.speed * 50;
                    }
                    else {
                        this._ball.y -= this.speed * 50;
                    }
                }


                this.linetimer.start();
                break;
        }
    }

    private spinrun() {
        this._ball.x = this._mouseX + Math.cos(this.angle) * this.radius;
        this._ball.y = this._mouseY + Math.sin(this.angle) * this.radius;
        this.collisionDetection();

        this.angle += this.speed; //角度越大 转动的越快
        if (this.speed <= 0.15) {
            this.speed += 0.0005;
        }
        if (this._datamanage.GameOverPanel()) {
            this.stopGame();
            this._time = 0;
        }
    }

    private linerun() {


        switch (this.runway) {
            case 0:
                this._ball.x += this.speed * 50;
                this._ball.y = this.line_K * this._ball.x + this.line_B;
                break;
            case 1:
                this._ball.x -= this.speed * 50;
                this._ball.y = this.line_K * this._ball.x + this.line_B;
                break;
            case 2:
                this._ball.y += this.speed * 50;
                this._ball.x = (this._ball.y - this.line_B) / this.line_K;
                break;
            case 3:
                this._ball.y -= this.speed * 50;
                this._ball.x = (this._ball.y - this.line_B) / this.line_K;
                break;
        }
        this.collisionDetection();
        if (this._datamanage.GameOverPanel()) {
            this.stopGame();
            this._time = 0;
        }
    }


    private restartGame() {

        this._rootView.removeChild(this._restartgame);
        this._rootView.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
        this._rootView.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
        this._rootView.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
        this.init();
        this._threePoint = this.shufflePoint();
        this._tools = this.shuffleTools();
        this.placeTo0ls(this._tools, this._threePoint);
        this._datamanage.init();
        this._txInfo.text = 0 + "";
        this.spintimer.addEventListener(egret.TimerEvent.TIMER, this.spinrun, this);
        this.linetimer.addEventListener(egret.TimerEvent.TIMER, this.linerun, this);

    }

    private stopGame() {
        this.linetimer.stop();
        this.spintimer.stop();
        this._timer.stop();

        this._rootView.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
        this._rootView.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
        this._rootView.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
        this.showGameOver();
    }

    private timeLapses() {
        this._time += 1;//50毫秒一次，一秒20次，200次十秒，18个十秒3分钟。
        console.log('50毫秒过去了');
        if (this._datamanage.GameOverPanel() || this._time > 18*200) {
            this.stopGame();
            this._time = 0;
        }
    }

    private showGameOver() {
        console.log("你需要重新开始了");
        this._restartgame.setScore(this._datamanage.getScore());
        this._rootView.addChild(this._restartgame);
        this._restartgame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restartGame, this);
    }

    private init() {
        console.log("正在初始化");
        this._hitwall = 0;
        this._time = 0;
        this._timer.start();
        this.spintimer.removeEventListener(egret.TimerEvent.TIMER, this.spinrun, this);
        this.linetimer.removeEventListener(egret.TimerEvent.TIMER, this.linerun, this);

        this._ball.x = egret.MainContext.instance.stage.stageWidth / 2;
        this._ball.y = egret.MainContext.instance.stage.stageHeight / 2;
        if (this._goldCoin.parent) {
            this._rootView.removeChild(this._goldCoin);
        }
        if (this._goldBag.parent) {
            this._rootView.removeChild(this._goldBag);
        }
        if (this._treasureBox.parent) {
            this._rootView.removeChild(this._treasureBox);
        }
        if (this._stone.parent) {
            this._rootView.removeChild(this._stone);
        }
        if (this._bomb.parent) {
            this._rootView.removeChild(this._bomb);
        }
        if (this._skull.parent) {
            this._rootView.removeChild(this._skull);
        }
    }

}

