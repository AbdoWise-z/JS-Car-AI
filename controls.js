class Controls {
    constructor(cont , sensor) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;
        this.cont = cont;

        this.brain = null;

        if (cont == HUMAN)
            this.#addKeyListeners();
        else if (cont == AI)
            this.#setupAIController(sensor);
        else
            this.#setupDummyController();

    }

    update(dt , car , sensor){
        if (this.cont == AI){
            const offsets = sensor.readings.map((e) => e==null ? 0.0 : 1 - e.offset);
            const outputs = NeuralNetwork.feedforwrd(offsets , this.brain);
            this.forward = outputs[0] == 1;
            this.left    = outputs[1] == 1;
            this.right   = outputs[2] == 1;
            this.reverse = outputs[3] == 1;
        }
    }

    #setupAIController(sensor){
        this.brain = new NeuralNetwork([sensor.rayCount , 8  , 4]);
    }

    #setupDummyController(){
        this.forward = true;
    }

    #addKeyListeners() {
        document.onkeydown = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
            }

            //console.table(this);
        };

        document.onkeyup = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }

            //console.table(this);
        };
    }
}