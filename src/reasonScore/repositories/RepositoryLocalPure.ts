import { Action } from "../Action";
import { RsData } from "../RsData";
import { iRepository } from "./iRepository";
import { claims } from "./reducers/claims";
import { claimEdges } from "./reducers/claimEdges";
import { RepositoryLocalBase } from "./RepositoryLocalBase";
import { scores } from "./reducers/scores";
import { scoreTrees } from "./reducers/scoresTrees";


export class RepositoryLocalPure extends RepositoryLocalBase implements iRepository {

    constructor(
        public rsData: RsData = new RsData()
    ) {
        super(rsData);
    }

    async notify(actions: Action[]) {
        this.rsData.actionsLog.push({ actions: actions }); //TODO: put logs back in
        for (const action of actions) {
            this.rsData = claims(this.rsData, action);
            this.rsData = claimEdges(this.rsData, action);
            this.rsData = scores(this.rsData, action);
            this.rsData = scoreTrees(this.rsData, action);
        }
    }

}