export class LoginAuth {
  public login?: string;
  public senha?: string;

  constructor(login?:string,senha?:string){
    this.login=login
    this.senha=senha
  }
}
