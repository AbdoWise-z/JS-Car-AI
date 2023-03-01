class Sensor{
    constructor(car,rayCount=5,rayLength=100,raySpread=Math.PI/2.5){
        this.car = car;
        this.rayCount = rayCount;
        this.rayLength = rayLength;
        this.raySpread = raySpread;

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders , traffic){
        this.#castRays();

        this.readings = [];
        for (let i=0;i < this.rays.length;i++){
            this.readings.push(this.#getReading(this.rays[i] , roadBorders , traffic));
        }
    }

    #castRays(){
        this.rays = [];
        for (let i = 0;i < this.rayCount;i++){
            const rayAngle = lerp(-this.raySpread/2 , this.raySpread/2 , this.rayCount==1 ? 0.5 : i / (this.rayCount-1));
            
            const start = new vec2(this.car.x , this.car.y);
            const end = new vec2(
                this.car.x + this.rayLength * Math.sin(Deg2Rad(this.car.rotation) + rayAngle),
                this.car.y - this.rayLength * Math.cos(Deg2Rad(this.car.rotation) + rayAngle)
            );
            this.rays.push([start , end]);
        }
    }

    #getReading(ray , borders , traffic){
        let touches = [];
        for (let i = 0;i < borders.length;i++){
            const touch = getIntersection(ray[0] , ray[1] , borders[i][0] , borders[i][1]);
            if (touch){
                touches.push(touch);
            }
        }

        for (let i = 0;i < traffic.length;i++){
            const poly = traffic[i].Polygon;
            for (let j = 0;j < poly.length;j++){
                const touch = getIntersection(ray[0] , ray[1] , poly[j] , poly[(j+1) % poly.length]);
                if (touch){
                    touches.push(touch);
                }
            }
        }

        if (touches.length == 0)
            return null;
        
        const offsets = touches.map((e) => e.offset);
        const minOffset = Math.min(...offsets);

        return touches.find((e) => e.offset == minOffset);
    }
    


    draw(ctx){
        for (let i = 0;i < this.rayCount;i++){
            let end = this.rays[i][1];
            if (this.readings[i]){
                end = this.readings[i].position;
            }
            
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(this.rays[i][0].x , this.rays[i][0].y);
            ctx.lineTo(end.x , end.y);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(end.x , end.y);
            ctx.lineTo(this.rays[i][1].x , this.rays[i][1].y);
            ctx.stroke();
            ctx.closePath();
        }
    }
}