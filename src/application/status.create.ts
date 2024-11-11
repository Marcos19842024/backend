import LeadStatus from "../domain/lead-status";

export class StatusCreate {
  private leadStatus: LeadStatus;
  constructor(repositories: LeadStatus) {
    this.leadStatus = repositories;
  }

  public async sendStatus() {
    const responseStatus = await this.leadStatus.sendStatus();//checar status de la sesion de ws
    return responseStatus;
  }
}