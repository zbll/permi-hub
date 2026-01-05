import NodeMailer from "nodemailer";

type BaseEnvConfig = {
  MAILER_BASE_HOSTNAME: string;
  MAILER_BASE_PORT: number;
  MAILER_BASE_TLS: boolean;
  MAILER_BASE_USERNAME: string;
  MAILER_BASE_PASSWORD: string;
};

type ClientConfig = {
  hostname: string;
  port: number;
  tls: boolean;
  username: string;
  password: string;
};

type Subject = {
  from: string;
  to: string;
  subject: string;
  content: string;
  html: string;
};

export class SendClientConfig {
  private hostname: string;
  private port: number;
  private tls: boolean = false;
  private username: string;
  private password: string;
  loadFromEnv(env: BaseEnvConfig) {
    this.hostname = env.MAILER_BASE_HOSTNAME;
    this.port = env.MAILER_BASE_PORT;
    this.tls = env.MAILER_BASE_TLS;
    this.username = env.MAILER_BASE_USERNAME;
    this.password = env.MAILER_BASE_PASSWORD;
  }

  loadConfig(config: ClientConfig) {
    this.hostname = config.hostname;
    this.port = config.port;
    this.tls = config.tls;
    this.username = config.username;
    this.password = config.password;
  }

  check() {
    if (!this.hostname || !this.port || !this.username || !this.password) {
      throw new Error("SendClientConfig is not complete");
    }
  }

  getClient() {
    return NodeMailer.createTransport({
      host: this.hostname,
      port: this.port,
      secure: this.tls,
      auth: {
        user: this.username,
        pass: this.password,
      },
    });
  }
}

export class SendBuilder {
  private config: SendClientConfig = new SendClientConfig();
  public loadClientFromEnv(env: BaseEnvConfig) {
    this.config.loadFromEnv(env);
    return this;
  }

  public build() {
    this.config.check();
    return new SendMailer(this.config);
  }
}

export class SendMailSubjectBuilder {
  private _from: string = "";
  private _to: string = "";
  private _subject: string = "";
  private _content: string = "";
  private _html: string = "";

  public from(from: string) {
    this._from = from;
    return this;
  }

  public to(to: string) {
    this._to = to;
    return this;
  }

  public subject(subject: string) {
    this._subject = subject;
    return this;
  }

  public content(content: string) {
    this._content = content;
    return this;
  }

  public html(html: string) {
    this._html = html;
    return this;
  }

  public async loadHtmlTemplate(filepath: URL) {
    this._html = await Deno.readTextFile(filepath);
    return this;
  }

  public htmlTitle(title: string) {
    this._html = this._html.replace("{{title}}", title);
    return this;
  }

  public htmlCode(code: string) {
    this._html = this._html.replace("{{code}}", code);
    return this;
  }

  public build(): Subject {
    return {
      from: this._from,
      to: this._to,
      subject: this._subject,
      content: this._content,
      html: this._html,
    };
  }
}

export class SendMailer {
  constructor(private config: SendClientConfig) {}

  async send(subject: Subject) {
    const client = this.config.getClient();
    const info = await client.sendMail({
      from: subject.from,
      to: subject.to,
      subject: subject.subject,
      text: subject.content,
      html: subject.html,
    });
    client.close();
    return info;
  }
}
