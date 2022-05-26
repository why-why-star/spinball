class DataManage {


    private GoldNumber:number = 0;
    private score:number=0;
    public constructor(){
    }

    public add(x:number){
        this.GoldNumber+=x;
        this.score = this.GoldNumber;
    }
    public division(x:number){
        this.GoldNumber = Math.round(this.GoldNumber/x);
        this.score = this.GoldNumber;
    }
    public subtraction(x:number){
        this.GoldNumber -=x;
        this.score = this.GoldNumber;
    }   
    public multiplication(x:number){
        this.GoldNumber *=x;
        this.score = this.GoldNumber;
    }

    public GameOverPanel(){
        if(this.GoldNumber<-100){
            this.score = this.GoldNumber;
            this.init();
            return 1;
        }
    }

    public setGold(x:number){
        this.GoldNumber = x;
        this.score = x;
    }

    public init(){
        this.score = this.GoldNumber;
        this.GoldNumber = 0;
    }

    public getScore():number{
        console.log(this.score);
        return this.score ;
    }
}