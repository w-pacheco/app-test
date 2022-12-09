
import Album from "./Album.js";

class Record extends Album {
    constructor(options){
        console.info(options);
        super(options);
        // this.test = function test(){
        //     console.info('You should see this when you log an object!');
        // }
    }

    test(){
        console.info('You should see this when you log an object!');
    }

}

export default Record;