class Project {
    constructor(id, project, screen){
        this.id = id;
        this.project = project;
        this.screen = screen;
    }

    getId(){
        return this.id;
    }

    getProject(){
        return this.project;
    }

    getScreen(){
        return this.screen;
    }

}