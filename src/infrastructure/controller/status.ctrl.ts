import { Request, Response } from "express";
import { StatusCreate } from "../../application/status.create";

class StatusCtrl {
  constructor(private readonly statusCreator: StatusCreate) {}

  public statusCtrl = async (_req: Request, res: Response) => {
    const response = await this.statusCreator.sendStatus()
    res.json(response)
  };
}

export default StatusCtrl;