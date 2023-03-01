const HUMAN = 0;
const DUMMY = 1;
const AI    = 2;

class Car {
    constructor(x, y, width, height, controller , maxSpeed=500) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = 0;
        
        this.controller = controller;
        if (controller != DUMMY)
            this.sensor = new Sensor(this);

        this.controls = new Controls(controller , this.sensor);
        
        this.speed = 0;
        this.acceleration = 780;
        this.maxSpeed = maxSpeed;
        this.backSpeedRatio = 0.5;
        this.friction = 360;
        
        this.WheelAngle = 0;
        this.WheelAnglerSpeed = 120;
        this.WheelAnglerReturnSpeed = 120;
        this.WheelAnglerCap = 10;
        this.RotationSensetivity = 2;
        
        this.Polygon = [];
        this.damaged = false;

        //debug
        this.debug = false;
        this.trail = [];
        this.trailUpdateCoolDown = 0.1;
        this.trailUpdateTimer = 0;

        for (let i = 0;i < 100;i++){
            this.trail[3 * i + 0] = x;
            this.trail[3 * i + 1] = y;
        }
        
        
    }

    #move(dt){
        if (this.damaged)
            return;

        if (this.controls.forward)
            this.speed += this.acceleration * dt;

        if (this.controls.reverse)
            this.speed -= this.acceleration * dt;

        if (this.speed > this.maxSpeed)
            this.speed = this.maxSpeed;
        if (this.speed < -this.maxSpeed * this.backSpeedRatio){
            this.speed = -this.maxSpeed * this.backSpeedRatio;
        }

        if (abs(this.speed) > 0)
            this.speed -= sgn(this.speed) * this.friction * dt;

        if (abs(this.speed) < this.friction * dt)
            this.speed = 0;

        if (this.controls.left)
            this.WheelAngle -= this.WheelAnglerSpeed * dt;
        if (this.controls.right)
            this.WheelAngle += this.WheelAnglerSpeed * dt;
        
        if (abs(this.WheelAngle) > this.WheelAnglerCap)
            this.WheelAngle = sgn(this.WheelAngle) * this.WheelAnglerCap;
        
        if (this.controls.left == false && this.controls.right == false){
            let dAngle = this.WheelAnglerReturnSpeed * dt;
            if (abs(this.WheelAngle) > 0)
                this.WheelAngle -= sgn(this.WheelAngle) * dAngle;
            if (abs(this.WheelAngle) < dAngle)
                this.WheelAngle = 0;
        }

        this.rotation +=  dt * Math.sin(Deg2Rad(this.WheelAngle)) * this.speed / (this.height * Math.PI) * 180 / Math.PI * this.RotationSensetivity;
        //this.rotation +=  dt * this.WheelAngle / this.WheelAnglerCap * this.speed / (this.height * Math.PI) * 180 / Math.PI * this.RotationSensetivity;
        
        if (abs(this.rotation) > 360)
            this.rotation = sgn(this.rotation) * (abs(this.rotation) % 360);

        //console.info("Delta time: " , dt);
        //console.info("Speed: " , this.speed);

        this.y -= Math.cos(Deg2Rad(this.rotation)) * this.speed * dt;
        this.x += Math.sin(Deg2Rad(this.rotation)) * this.speed * dt;

        if (this.x < 0)
            this.x = window.innerWidth;
        if (this.x > window.innerWidth)
            this.x = 0;

    }

    #debugData(dt){
        this.trailUpdateTimer -= dt;
        if (this.trailUpdateTimer < 0){
            this.trailUpdateTimer = this.trailUpdateCoolDown;
            
            for (let i = 99;i >= 0;i--){
                this.trail[3 * (i + 1) + 0] = this.trail[3 * i + 0];
                this.trail[3 * (i + 1) + 1] = this.trail[3 * i + 1];
                this.trail[3 * (i + 1) + 2] = this.trail[3 * i + 2];
            }

            this.trail[0] = this.x;
            this.trail[1] = this.y;
            this.trail[2] = this.rotation;
        }
    }

    #createPolygon(){
       
        this.Polygon = [];
        const center = new vec2(this.x , this.y);
        this.Polygon.push(new vec2(-this.width/2 ,-this.height/2).rotate(Deg2Rad(this.rotation)).add(center));
        this.Polygon.push(new vec2( this.width/2 ,-this.height/2).rotate(Deg2Rad(this.rotation)).add(center));
        this.Polygon.push(new vec2( this.width/2 , this.height/2).rotate(Deg2Rad(this.rotation)).add(center));
        this.Polygon.push(new vec2(-this.width/2 , this.height/2).rotate(Deg2Rad(this.rotation)).add(center));

        //return this.Polygon;
    }

    #checkDamaged(polyArr){
        for (let i = 0;i < polyArr.length;i++){
            if (polysIntersect(this.Polygon , polyArr[i]))
                return true;
        }
        return false;
    }

    update(dt , roadBorders , traffic){
        this.controls.update(dt , this , this.sensor);

        this.#move(dt);
        this.#createPolygon();
        this.damaged = this.damaged || this.#checkDamaged(roadBorders);
        const polyArr = traffic.map((c) => c.Polygon);
        this.damaged = this.damaged || this.#checkDamaged(polyArr);

        this.#debugData(dt);

        if (this.sensor)
            this.sensor.update(roadBorders , traffic);
    }

    setOnLane(road,lane){
        this.x = road.getLaneCenter(lane);
    }

    draw(ctx,color) {
    
        ctx.save();

        ctx.beginPath();    
        if (this.damaged){
            ctx.fillStyle = "gray";
        }else{
            ctx.fillStyle = color;
        }

        ctx.moveTo(this.Polygon[0].x , this.Polygon[0].y);
        ctx.lineTo(this.Polygon[1].x , this.Polygon[1].y);
        ctx.lineTo(this.Polygon[2].x , this.Polygon[2].y);
        ctx.lineTo(this.Polygon[3].x , this.Polygon[3].y);
        ctx.fill();
        ctx.closePath();
        ctx.restore();

        if (this.debug){
            for (let i = 0;i < 100;i++){
                ctx.save();

                ctx.translate(this.trail[i * 3 + 0] , this.trail[i * 3 + 1]);
                ctx.rotate(Deg2Rad(this.trail[i * 3 + 2]));

                ctx.fillRect(
                    -3,
                    -3,
                     6,
                     6
                );

        ctx.restore();
            
            }
        }
        
        if (this.sensor)
            this.sensor.draw(ctx);
    }
}