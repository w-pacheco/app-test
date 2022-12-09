

class Album {

    constructor({ title, genre }){
        this.title = title;
        this.genre = genre;
    }

    show(arg){
        return this[arg];
    }
}

export default Album;