import LeadExternal from "../domain/lead-external.repository";

export class LeadCreate {
  private leadExternal: LeadExternal;
  constructor(repositories: LeadExternal) {
    this.leadExternal = repositories;
  }

  public async sendMessage({
    message,
    phone,
    pathtofiles,
  }: {
    message: string;
    phone: string;
    pathtofiles: Array<string>;
  }) {
    const responseExSave = await this.leadExternal.sendMsg({ message, phone, pathtofiles });//enviar a ws
    return responseExSave;
  }
}