function abs(a) {
    if (a < 0)
        return -a;
    return a;
}

function sgn(a){
    if (a < 0)
        return -1;
    return 1;
}

function Deg2Rad(a){
    return Math.PI * a / 180;
}

function Rad2Deg(a){
    return 180 * a / Math.PI;
}

function lerp(min , max , per){
    return min + (max - min) * per;
}

class vec2{
    constructor(x=0,y=0){
        this.x = x;
        this.y = y;
    }

    rotate(ang){
        let a = Math.atan2(this.y , this.x);
        a += ang;
        const r = Math.hypot(this.x , this.y);

        this.x = r * Math.cos(a);
        this.y = r * Math.sin(a);
        return this;
    }

    add(other){
        this.x += other.x;
        this.y += other.y;
        return this;
    }
}

function getIntersection(A,B,C,D){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            let a = new vec2(lerp(A.x,B.x,t),lerp(A.y,B.y,t));
            return {
                position: a,
                offset:t
            }
        }
    }

    return null;
}

function polysIntersect(poly1, poly2){
    for(let i=0;i<poly1.length;i++){
        for(let j=0;j<poly2.length;j++){
            const touch=getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }
        }
    }
    return false;
}


/*
not used ..
function getPolysIntersect(poly1, poly2){

    for(let i=0;i<poly1.length;i++){
        for(let j=0;j<poly2.length;j++){
            const touch=getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }
        }
    }
    return false;
}*/
