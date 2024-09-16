class Report {
    constructor(id, report, isUpdated, reason){
        this.id = id;
        this.report = report;
        this.isUpdated = isUpdated;
        this.reason = reason;
    }

    getId(){
        return this.id;
    }

    getReport(){
        return this.report;
    }

    getIsUpdated(){
        return this.isUpdated;
    }

    getReason(){
        return this.reason;
    }

}