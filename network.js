class NeuralNetwork{
    constructor(neuronCount){
        if (neuronCount.length < 2)
            return; //dont do that dude

        this.levels = [];
        for (let i = 0;i < neuronCount.length - 1;i++){
            this.levels.push(new Level(neuronCount[i] , neuronCount[i+1]));
        }
    }

    static feedforwrd(input , network){
        let outputs = Level.feedforwrd(input , network.levels[0]);
        for (let i = 1;i < network.levels.length;i++){
            outputs = Level.feedforwrd(outputs , network.levels[i]);
        }
        return outputs;
    }

    static Mutate(network , amount = 1){
        if (network == null){
            console.log("network was null");
            return;
        }

        network.levels.forEach( (level) => {
            for (let i = 0;i < level.biases.length;i++){
                level.biases[i] = lerp(level.biases[i] , Math.random() * 2 - 1 , amount);
            }

            for (let i = 0;i < level.weights.length;i++){
                for (let j = 0;j < level.weights[i].length;j++){
                    level.weights[i][j] = lerp(level.weights[i][j] , Math.random() * 2 - 1 , amount);
                }
            }
        });
    }
}

class Level{
    constructor(intputCount , outputCount){
        this.input  = new Array(intputCount);
        this.output = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = new Array(intputCount);

        for (let i = 0;i < intputCount;i++){
            this.weights[i] = new Array(outputCount);
        }
        
        Level.#randomize(this);
    }

    static #randomize(lvl){
        for (let i = 0;i < lvl.input.length;i++){
            for (let j = 0;j < lvl.output.length;j++){
                lvl.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0;i < lvl.biases.length;i++){
            lvl.biases[i] = Math.random() * 2 - 1;
        }
    }

    static feedforwrd(input , lvl){
        for (let i = 0;i < input.length;i++){
            lvl.input[i] = input[i];
        }

        for (let i = 0;i < lvl.output.length;i++){
            let sum = 0;
            for (let j = 0;j < lvl.input.length;j++){
                sum += lvl.weights[j][i] * lvl.input[j];
            }
            if (sum > lvl.biases[i])
                lvl.output[i] = 1;
            else
                lvl.output[i] = 0;
        }

        return lvl.output;
    }


}