/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

/**
 * State class. States have a class, unique key, and a lifecycle current state
 * the current state is determined by the specific subclass
 */
class State {

    /**
     * @param {String|Object} class  An indentifiable class of the instance
     * @param {keyParts[]} elements to pull together to make a key for the objects
     */
    constructor(stateClass, keyParts) {
        this.class = stateClass;
        this.key = State.makeKey(keyParts);
    }

    getClass() {
        return this.class;
    }

    getKey() {
        return this.key;
    }

    getSplitKey(){
        return State.splitKey(this.key);
    }

    serialize() {
        return State.serialize(this);
    }

    /**
     * Convert object to buffer containing JSON data serialization
     * Typically used before putState() ledger API
     * @param {Object} JSON object to serialize
     * @return {buffer} buffer with the data to store
     */
    static serialize(object) {
        // console.log("serialize object: ", object);
        return Buffer.from(JSON.stringify(object));
    }

    /**
     * Deserialize object into one of a set of supported JSON classes
     * i.e. Covert serialized data to JSON object
     * Typically used after getState() ledger API
     * @param {data} data to deserialize into JSON object
     * @param (supportedClasses) the set of classes data can be serialized to
     * @return {json} json with the data to store
     */
    static deserialize(data, supportedClasses) {
        // console.log("data and supportedClasses (deserialize): \n",supportedClasses, data);
        let json = JSON.parse(data.toString());
        // console.log("deserialize json: ",json);
        let objClass = supportedClasses[json.class];
        // console.log("deserialize objClass: ",objClass);
        if (!objClass) {
            throw new Error(`Unknown class of ${json.class}`);
        }
        let object = new (objClass)(json);

        // console.log("deserialize object: ",object);
        return object;
    }

    /**
     * Deserialize object into specific object class
     * Typically used after getState() ledger API
     * @param {data} data to deserialize into JSON object
     * @return {json} json with the data to store
     */
    static deserializeClass(data, objClass) {
        // console.log("objClass (deserializeClass): ",objClass);
        let json = JSON.parse(data.toString());
        // console.log("deserializeClass json: ",json);
        let object = new (objClass)(json);

        // console.log("deserializeClass object: ",object);
        return object;
    }

    /**
     * Join the keyParts to make a unififed string
     * @param (String[]) keyParts
     */
    static makeKey(keyParts) {
        return keyParts.map(part => JSON.stringify(part)).join(':');
    }

    static splitKey(key){
        return key.split(':');
    }

}

module.exports = State;
