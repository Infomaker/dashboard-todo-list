/**
 * Create an Agent by extending the Agent class
 * Read more about Agent (https://github.com/Infomaker/Dashboard-Plugin/wiki/Agent)
 */

import { Agent } from "Dashboard";

export default class MyAgent extends Agent {
    constructor(props) {
        super(props);

        this.dataStore = "@plugin_bundle-dataStore-5";

        this.on("@plugin_bundle:getLists", data => {
            if (!data.callback) return;

            this.getLists(data.applicationId, data.name).then(result => {
                if (data.applicationId) {
                    result = result.filter(item => item.applicationId === data.applicationId);
                }
                data.callback(result);
            });
        });

        this.on("@plugin_bundle:setLists", data => {
            if (!data.applicationId) return;

            this.getLists().then(storedData => {
                storedData.forEach(item => {
                    if (item.applicationId === data.applicationId) {
                        item.items = data.items;
                    }
                });
                this.setLists(storedData).then(success => {
                    if (success) {
                        this.send("@plugin_bundle:updatedLists", data);
                    } else {
                        console.error("Error: Could not update lists in store", success);
                    }
                });
            });
        });

        this.on("@plugin_bundle:setItem", data => {
            if (!data.applicationId) return;

            this.getLists().then(storedData => {
                storedData.forEach(list => {
                    if (list.applicationId === data.applicationId) {
                        list.items.forEach(item => {
                            if (item.id === data.item.id) {
                                item = data.item; // kan vi ha en break här?
                            }
                        });
                    }
                });
                this.setLists(storedData).then(success => {
                    if (success) {
                        this.send("@plugin_bundle:updatedLists", data);
                    } else {
                        console.error("Error: Could not update lists in store", success);
                    }
                });
            });
        });
    }

    getLists(applicationId, name) {
        return new Promise(resolve => {
            this.store(this.dataStore, response => {
                const defaultItem = {
                    applicationId: applicationId,
                    name: name,
                    items: []
                };

                if (!response.data && applicationId) {
                    this.store(this.dataStore, [defaultItem]);
                    resolve([defaultItem]);
                } else if (applicationId && !response.data.find(item => item.applicationId == applicationId)) {
                    let data = response.data;
                    data.push(defaultItem);
                    this.store(this.dataStore, data);
                    resolve(data);
                }
                resolve(response.data);
            });
        });
    }

    setLists(lists) {
        return new Promise(resolve => {
            resolve(this.store(this.dataStore, lists));
        });
    }
}
