import { Config, DefaultConfig, Entity, Microplum } from "./model";

import * as _ from "lodash";
import * as seneca from "seneca";
import * as senecaAmqpTransport from "seneca-amqp-transport";

const DEFAULT_OPTIONS: DefaultConfig = {
    version: "v1",
    environment: process.env.NODE_ENV || "production",
    pin: [],
    clientPin: "version:*,role:*,environment:" + (process.env.NODE_ENV || "production"),
    seneca: {
        log: "standard",
        transport: {},
        timeout: 5000
    },
};

export class SenecaPlum implements Microplum {

    public seneca: seneca.Instance;

    constructor(public options: Config) {
        this.options = _.merge(DEFAULT_OPTIONS, options);
        this.options.seneca.transport.msgprefix = this.options.seneca.transport.msgprefix || this.options.app;
        this.initSeneca();
    }

    public listen(): void {
        this.seneca.listen({
            type: "amqp",
            pin: this.options.pin,
            url: this.options.amqpUrl
        });
    }

    /**
     * Set-up seneca connection
     */
    public client(): void {
        this.seneca.client({
            type: 'amqp',
            pin: this.options.clientPin,
            url: this.options.amqpUrl
        });
        console.log(`[Microplum] Registered client for PIN: ${this.options.clientPin}`);
    }

    public act(pin: any, respond: seneca.ActCallback): void {
        this.addBasicProperties(pin);
        this.addAdditionalProperties(pin);
        this.seneca.act(pin, respond);
    }

    public actPromise(pin: any, user?: any): Promise<any> {
        console.log(`[Microplum] CALL => ${JSON.stringify(pin)}`);
        if (user && (user.id || user.sub)) {
            pin.userId = (user.id) ? user.id : `${user.sub || ""}${user.sub || ""}`;
        }
        if (user && user.name) {
            pin.userName = user.name;
        }
        return new Promise((resolve, reject) => {
            try {
                this.act(pin, (err, data) => {
                    if (err) {
                        console.log(`[Microplum] ERR <= ${JSON.stringify(pin)}`);
                        return reject(err);
                    } else {
                        console.log(`[Microplum] ANSWER <= ${JSON.stringify(pin)}`);
                        return resolve(data);
                    }
                });
            } catch (ex) {
                console.log(`[Microplum] ERR <= ${JSON.stringify(pin)}`);
                return reject(ex);
            }
        });
    }

    public useService(service: Entity, pin?: any): void {
        this.use(service.plugin(), pin || service.publicPin());
    }

    public use(component: Function, pin?: any): void {
        component.bind(this)(this.options);
        if (pin) {
            this.addPin(pin);
        }
    }

    public add(pin: any, cb: seneca.AddCallback): void {
        this.addBasicProperties(pin);
        this.addAdditionalProperties(pin);
        this.seneca.add(pin, cb);
        console.log(`[Microplum] Registered service for PIN: ${JSON.stringify(pin)}`);
    }

    protected addPin(pin: any): void {
        this.addBasicProperties(pin);
        let realPin: string = Object.keys(pin)
            .map(key => `${key}:${pin[key]}`)
            .join(",");

        console.log(`[Microplum] Register listen for PIN: \"${realPin}\"`);
        this.options.pin.push(realPin);
    }

    protected addBasicProperties(pin: any): any {
        pin.version = pin.version || this.options.version;
        pin.environment = pin.environment || this.options.environment;
        return pin;
    }

    protected addAdditionalProperties(pin: any): any {
        if (this.options.environment === "dev" && this.options.developer) {
            pin.developer = this.options.developer
        }
        return pin;
    }

    /**
     * Set-up seneca with all the middleware libraries.
     */
    protected initSeneca(): void {
        this.seneca = seneca(this.options.seneca);
        this.seneca.use(senecaAmqpTransport);
    }

}
