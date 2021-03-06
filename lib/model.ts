import * as seneca from "seneca";
import {ServerPlumError} from "./error";

export const invalidActFun: (args: { [key: string]: any }) => Promise<any> = (args: { [key: string]: any }): Promise<any> => {
    console.log("[Microplum] '.act' not set in the service entity. Please use setAct method before.");
    throw new ServerPlumError("'act' service not set.");
};

/**
 * Facade class that can be extended with specific methods.
 */
export class PlumFacade implements HasAct {

    public act: (args: { [key: string]: any }) => Promise<any>;
    public args: { [key: string]: any };

    constructor(act?: (args: any) => Promise<any>, args?: { [key: string]: any }) {
        this.act = (act) ? act : invalidActFun;
        this.args = (args) ? args : {};
    }
}

export interface DefaultConfig {
    version?: number;
    subversion?: number,
    revision?: number,
    environment?: string;
    pin?: string[];
    clientPin?: string;
    seneca?: seneca.Options;
}

export interface Config extends DefaultConfig {
    app: string;
    /**
     * Available roles in the act method
     */
    roles: string[];
    provider?: string;
    amqpUrl: string;
    debugUserId?: string;
}

export interface Microplum {

    /**
     * Close the connection. Use it before exiting the app.
     */
    close(): void;

    /**
     * Listen app trigger os selected configuration.
     */
    listen(): void;

    /**
     * Set-up seneca connection for calls.
     */
    client(): void;

    use(component: Function, pin?: any): void;

    useService(service: Entity, pin?: any): void

    add(pin: any, cb: Function): void;

    act(pin: any, respond: seneca.ActCallback): void;
    actPromise(pin: any, user?: any): Promise<any>;

}

export interface Entity {

    /**
     * Module seneca service definition.
     * @param options
     * @return seneca plugin
     */
    plugin(): Function;

    publicPin(): any;
    setAct(act: Function): void;
    getAct(user?: any): Function;

}

/**
 * Basic entity of the facade with the _id (optional) field.
 */
export interface FacadeEntity {
    _id?: string;
}

/**
 * Entity that are able to sync with another systems - has field for links and sync table
 */
export interface SyncEntity {
    _sync: string;
    _link: string;
}

/**
 * Interface that saus the object has reference to the act method.
 */
export interface HasAct {
    act: (args: any) => Promise<any>;
}

export interface SeedFacade extends PlumFacade {
    seed?(): Promise<void>;
    reset?(doSeed: boolean): Promise<void>;
}

/**
 * Facade interface for the entity manipulation (CRUD+List). All the methods form the interface are optional.
 * All the methods are async
 */
export interface RestFacade<E extends FacadeEntity> extends PlumFacade {
    /**
     * Create new entity with the selected input
     * @param input
     * @param syncId null if needs to sync, id if it's already synced
     * @return created entity
     */
    create?(input: E, syncId?: string | null): Promise<E>;
    /**
     * Update all the entity for selected condition with selected update
     * @param conditions
     * @param update
     * @param syncId null if needs to sync, id if it's already synced
     * @return updated entity
     */
    update?(conditions: { [key: string]: any }, update: { [key: string]: any }, syncId?: string | null): Promise<E[]>;
    /**
     * Update all the entity for selected condition with selected update
     * @param conditions
     * @param update
     * @param syncId null if needs to sync, id if it's already synced
     * @return updated entity
     */
    updateOne?(conditions: { [key: string]: any }, update: { [key: string]: any }, syncId?: string | null): Promise<E | null>;
    /**
     * Update all the entity for selected condition with selected update
     * @param id
     * @param update
     * @param syncId null if needs to sync, id if it's already synced
     * @return updated entity
     */
    updateById?(id: string, update: { [key: string]: any }, syncId?: string | null): Promise<E | null>;
    /**
     * Find the list of the entities for selected query
     * @param query (default all)
     * @return list of the entity
     */
    find?(query?: { [key: string]: any }): Promise<E[]>;
    /**
     * Find first entity for selected query
     * @param query (default all)
     * @return fist entity or null
     */
    findOne?(query?: { [key: string]: any }): Promise<E | null>;
    /**
     * Find entity by the id
     * @param id
     * @return found entity or null
     */
    findById?(id: string): Promise<E | null>;
    /**
     * Remove entity by the id
     * @param query
     * @param syncId null if needs to sync, id if it's already synced
     * @return removed entity or null
     */
    remove?(query?: { [key: string]: any }): Promise<E[]>;
    /**
     * Remove entity by the id
     * @param id
     * @param syncId null if needs to sync, id if it's already synced
     * @return removed entity or null
     */
    removeOne?(query?: { [key: string]: any }): Promise<E | null>;
    /**
     * Remove entity by the id
     * @param id
     * @param syncId null if needs to sync, id if it's already synced
     * @return removed entity or null
     */
    removeById?(id: string): Promise<E | null>;
    /**
     * Remove all the entities for selected query
     * @param syncId null if needs to sync, id if it's already synced
     * @param query (default all)
     */
    clean?(query?: { [key: string]: any }): Promise<E[]>;
    /**
     * Count the objects in the storage based on the query.
     * @param query
     */
    count?(query?: { [key: string]: any }): Promise<number>;
}
