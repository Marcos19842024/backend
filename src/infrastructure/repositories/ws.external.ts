import { Client, LocalAuth, MessageMedia } from "whatsapp-web.js";
import { image as imageQr } from "qr-image";
import LeadExternal from "../../domain/lead-external.repository";

/**
 * Extendemos los super poderes de whatsapp-web
 */
class WsTransporter extends Client implements LeadExternal {
  private status = false;

  constructor() {
    super({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: [
          "--disable-setuid-sandbox",
          "--unhandled-rejections=strict",
        ],
      },
    });

    console.log("Iniciando....");

    this.initialize();

    this.on("ready", () => {
      this.status = true;
      console.log("LOGIN_SUCCESS");
    });

    this.on("auth_failure", () => {
      this.status = false;
      console.log("LOGIN_FAIL");
    });

    this.on("qr", (qr) => {
      this.generateImage(qr);
    });
  }

  /**
   * Enviar mensaje de WS
   * @param lead
   * @returns
   */
  async sendMsg(lead: { message: string; phone: string; pathtofiles: Array<string> }): Promise<any> {
    try {
      if (!this.status) return Promise.resolve({ error: "WAIT_LOGIN" });
      const url = process.env.URL + 'media/';
      const { message, phone, pathtofiles } = lead;
      var result;
      if(pathtofiles?.length > 0) {
        let pathtofile = url + pathtofiles[0];
        let filename = pathtofiles[0];
        result = await this.sendMessage(`${phone}@c.us`, await MessageMedia.fromUrl(pathtofile,{filename}));
        if(pathtofiles.length > 1) {
          for(let i = 1; i < pathtofiles.length; i++) {
            let pathtofile = url + pathtofiles[i];
            let filename = pathtofiles[i];
            result = await this.sendMessage(`${phone}@c.us`, await MessageMedia.fromUrl(pathtofile,{filename}));
          };
        }
      }
      result = await this.sendMessage(`${phone}@c.us`, message);
      const response = { id: result.id.id };
      return Promise.resolve(response);
    } catch (e: any) {
      return Promise.resolve({ error: e.message });
    }
  }

  async sendStatus(): Promise<any> {
    let connection = this.status;
    if(connection) {
      const data = {
        err: false,
        status: "400",
        statusText: "Connected",
      }
      return Promise.resolve(data);
    } else {
      const data = {
        err: true,
        status: "500",
        statusText: "Internal Server Error",
      }
      return Promise.resolve(data);
    }
  }

  getStatus(): boolean {
    return this.status;
  }

  private generateImage = (base64: string) => {
    const path = `${process.cwd()}/tmp`;
    let qr_svg = imageQr(base64, { type: "png", margin: 4 });
    qr_svg.pipe(require("fs").createWriteStream(`${path}/qr.png`));
    console.log(`⚡ Escanea el codigo QR que esta en la carepta tmp⚡`);
    console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
  };
}

export default WsTransporter;