import { Client, LocalAuth, MessageMedia } from "whatsapp-web.js";
import { image as imageQr } from "qr-image";
import LeadExternal from "../../domain/lead-external.repository";

/**
 * Extendemos los super poderes de whatsapp-web
 */
class Ws implements LeadExternal {
  private statusBaalak = false;
  private statusAnimalia = false;
  private Baalak: Client;
  private Animalia: Client;

  constructor() {
    const Cliente1 = new Client({
      authStrategy: new LocalAuth({
        clientId: "Baalak"
      }),
      puppeteer: {
        //executablePath: "/usr/bin/chromium-browser",
        headless: true,
        args: [
          "--disable-setuid-sandbox",
          "--unhandled-rejections=strict",
          //"--no-sandbox",
        ],
      },
    });

    Cliente1.initialize();

    Cliente1.on("ready", () => {
      this.statusBaalak = true;
      console.log("LOGIN SUCCESS TO BAALAK'");
    });

    Cliente1.on("auth_failure", () => {
      this.statusBaalak = false;
      console.log("LOGIN FAIL");
    });

    Cliente1.on("qr", (qr) => {
      this.generateImage(qr);
    });

    this.Baalak = Cliente1;

    const Cliente2 = new Client({
      authStrategy: new LocalAuth({
        clientId: "Animalia"
      }),
      puppeteer: {
        //executablePath: "/usr/bin/chromium-browser",
        headless: true,
        args: [
          "--disable-setuid-sandbox",
          "--unhandled-rejections=strict",
          //"--no-sandbox",
        ],
      },
    });

    Cliente2.initialize();

    Cliente2.on("ready", () => {
      this.statusAnimalia = true;
      console.log("LOGIN SUCCESS TO ANIMALIA");
    });

    Cliente2.on("auth_failure", () => {
      this.statusAnimalia = false;
      console.log("LOGIN FAIL");
    });

    Cliente2.on("qr", (qr) => {
      this.generateImage(qr);
    });

    this.Animalia = Cliente2;
  }

  /**
   * Enviar mensaje de WS
   * @param lead
   * @returns
   */
  async sendMsg(lead: { client: string; message: string; phone: string; pathtofiles: Array<string> }): Promise<any> {
    try {
      const url = process.env.URL + 'media/';
      const { client, message, phone, pathtofiles } = lead;
      var result;
      var cliente: Client;
      var status: boolean;
      if(client == "Baalak'") {
        cliente = this.Baalak;
        status = this.statusBaalak;
      } else if(client =="Animalia") {
        cliente = this.Animalia;
        status  = this.statusAnimalia;
      } else {
        return Promise.resolve({ error: `Acces denied, ${client} is not registered` });
      }
      if (!`${cliente}.${status}`) return Promise.resolve({ error: `WAIT LOGIN TO ${cliente}` });
      if(pathtofiles?.length > 0) {
        let pathtofile = url + pathtofiles[0];
        let filename = pathtofiles[0];
        result = await cliente.sendMessage(`${phone}@c.us`, await MessageMedia.fromUrl(pathtofile,{filename}));
        if(pathtofiles.length > 1) {
          for(let i = 1; i < pathtofiles.length; i++) {
            let pathtofile = url + pathtofiles[i];
            let filename = pathtofiles[i];
            result = await cliente.sendMessage(`${phone}@c.us`, await MessageMedia.fromUrl(pathtofile,{filename}));
          };
        }
      }
      result = await cliente.sendMessage(`${phone}@c.us`, message);
      const response = { id: result.id.id };
      return Promise.resolve(response);
    } catch (e: any) {
      return Promise.resolve({ error: e.message });
    }
  }

  async getSts(client: string): Promise<any> {
    let data;
    var cliente: Client;
    var status: boolean;
    if(client == "Baalak'") {
      cliente = this.Baalak;
      status = this.statusBaalak;
    } else if (client == "Animalia"){
      cliente = this.Animalia;
      status = this.statusAnimalia;
    } else {
      data = {
        err: true,
        status: "500",
        statusText: `Acces denied, ${client} is not registered`
      }
      return Promise.resolve(data);
    }
    if(`${cliente}.${status}`) {
      data = {
        err: false,
        status: "400",
        statusTex: `Connected to ${cliente}`
      }
    } else {
      data = {
        err: true,
        status: "500",
        statusText: `${cliente} Offline`
      }
    }
    return Promise.resolve(data);
  }

  private generateImage = (base64: string) => {
    const path = `${process.cwd()}/tmp`;
    let qr_png = imageQr(base64, { type: "png", margin: 4 });
    qr_png.pipe(require("fs").createWriteStream(`${path}/qr.png`));
    console.log(`⚡ Escanea el codigo QR que esta en la carepta tmp⚡`);
    console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
  };
}

export default Ws;