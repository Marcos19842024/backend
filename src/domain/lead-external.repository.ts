export default interface LeadExternal {
    sendMsg({message, phone, pathtofiles}:{message:string, phone:string, pathtofiles: Array<string>}):Promise<any>
}