/**
 * Create an Agent by extending the Agent class
 * Read more about Agent (https://github.com/Infomaker/Dashboard-Plugin/wiki/Agent)
 */

import { Agent, moment, createUUID } from "Dashboard";
import Notification from "./components/Notification";

export default class MyAgent extends Agent {
    constructor(props) {
        super(props);

        this.dataStore = "@plugin_bundle-dataStore";
        this.DNA = undefined;

        this.setupEvents();
        this.setupDNA();

        this.setInterval(() => this.sendNotifications(), 60000)
        this.sendNotifications()
    }

    setupDNA() {
        // Build your Notification handler once and use it in all your plugin's components
        const DNA_BUNDLE = 'se.infomaker.DNA-Agent';
        const DNA_GET_LIB = `${DNA_BUNDLE}:getDNALib`;
        const DNA_LIB = `${DNA_BUNDLE}:DNALib`;
        
        this.ready(DNA_BUNDLE, () => {
            this.on(DNA_LIB, userData => {
                let _dna = userData.DNA;
                this.DNA = new _dna();
            });
            this.send(DNA_GET_LIB, {});
        });
    }

    setupEvents() {
        this.on("@plugin_bundle:getLists", data => {
            if (!data.callback)
                return;
            this.getLists(data.applicationId, data.name).then(result => {
                if (data.applicationId) {
                    result = result.filter(item => item.applicationId === data.applicationId);
                }
                data.callback(result);
            });
        });
        this.on("@plugin_bundle:setLists", data => {
            if (!data.applicationId)
                return;

            let updatedList;
            this.getLists().then(storedData => {
                storedData.forEach(list => {
                    if (list.applicationId === data.applicationId) {
                        list.name = data.name;
                        list.items = data.items;
                        updatedList = list;
                    }
                });
                this.setLists(storedData).then(success => {
                    if (success && updatedList) {
                        this.send("@plugin_bundle:updatedLists", updatedList);
                    }
                    else {
                        console.error("Error: Could not update lists in store", success);
                    }
                });
            });
        });
        this.on("@plugin_bundle:setItem", data => {
            this.setItem(data);
        });
    }

    setItem(data) {
        if (!data.applicationId)
            return;

        let updatedList;
        this.getLists().then(storedData => {
            storedData.forEach(list => {
                if (list.applicationId === data.applicationId) {
                    const itemIndex = list.items.findIndex(x => x.id === data.item.id);
                    if (itemIndex >= 0) {
                        list.items[itemIndex] = data.item;
                        updatedList = list;
                    }
                }
            });
            this.setLists(storedData).then(success => {
                if (success && updatedList) {
                    this.send("@plugin_bundle:updatedLists", updatedList);
                }
                else {
                    console.error("Error: Could not update lists in store", success);
                }
            });
        });
    }

    closeNotification(notificationId) {
        if (!notificationId) 
            return;
        this.DNA.remove({
            uid: notificationId
        });
    }

    sendNotifications() {
        this.getLists().then(storedData => {
            storedData.forEach(list => {
                list.items.forEach(item => {
                    if (item.reminder && !item.done && moment(item.reminder) <= moment()) {
                        const notificationId = createUUID();
                        this.DNA.add({
                            title: `${list.name} - ${item.text}`,
                            uid: notificationId,
                            level: 'info',
                            autoDismiss: 59,
                            message:
                                <Notification
                                    applicationId={list.applicationId}
                                    notificationId={notificationId}
                                    item={item}
                                    //send={(event, data) => this.send(event, data)}
                                    setItem={(data) => this.setItem(data)}
                                    closeNotification={(notificationId) => this.closeNotification(notificationId)}
                                />
                        })
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