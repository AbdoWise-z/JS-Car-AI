class Road{
    constructor(x , width , laneCount=3){
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width /2;
        this.right = x + width /2;

        this.top    = -1000000;
        this.bottom =  1000000;
        

        const topLeft  = new vec2(this.left , this.top);
        const topRight = new vec2(this.right , this.top);
        const bottomLeft  = new vec2(this.left , this.bottom);
        const bottomRight = new vec2(this.right , this.bottom);

        this.borders = [
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ];
    }

    getLaneCenter(laneIndex){
        return this.left + this.width / this.laneCount * (laneIndex + 0.5); 
    }

    draw(ctx){
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        for (let i = 1;i < this.laneCount;i++){
            const x = lerp(this.left , this.right , i / this.laneCount);
            ctx.beginPath();
            ctx.setLineDash([20,20]);
            ctx.moveTo(x , this.top);
            ctx.lineTo(x , this.bottom);
            ctx.stroke();
            ctx.closePath();
        }
        
        ctx.setLineDash([]);

        this.borders.forEach((border) => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x , border[1].y);
            ctx.stroke();
            ctx.closePath();
        });
    }
}