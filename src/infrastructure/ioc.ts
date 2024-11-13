import { ContainerBuilder } from "node-dependency-injection";
import WsTransporter from "./repositories/ws.external";
import { LeadCreate } from "../application/lead.create";
import LeadCtrl from "./controller/lead.ctrl";
import { StatusCreate } from "../application/status.create";
import StatusCtrl from "./controller/status.ctrl";

const container = new ContainerBuilder();

container.register("ws.transporter", WsTransporter);

const wsTransporter = container.get("ws.transporter");

container.register("lead.creator", LeadCreate).addArgument(wsTransporter);
container.register("status.creator", StatusCreate).addArgument(wsTransporter);

const leadCreator = container.get("lead.creator");
const statusCreator = container.get("status.creator");

container.register("lead.ctrl", LeadCtrl).addArgument(leadCreator);
container.register("status.ctrl", StatusCtrl).addArgument(statusCreator);

export default container;