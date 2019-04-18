/**
 * Create an Application by extending the Application class
 * Read more about Application (https://github.com/Infomaker/Dashboard-Plugin/wiki/Application)
 */

import { Application, GUI, createUUID } from "Dashboard";
import React from "React";
import { DatePickerWithClearButton } from '@components/DatePicker/style'
import ListNotDone from './components/ListNotDone';
import ListDone from './components/ListDone';
import { Provider } from "react-redux";
import store from "./redux/store";

export default class MyApplication extends Application {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            current: "",
            reminder: "",
        };

        this.applicationId = props.id;
        this.displayName = props.config.pluginTitle || "Todo";
    }

    componentDidMount() {
        this.ready("@plugin_bundle-agent", () => {
            this.getItems();
        });

        this.on("@plugin_bundle:updatedLists", data => {
            
            if (data.applicationId === this.applicationId) {
                this.setState({
                    items: data.items
                });
            }
        });
    }

    getItems() {
        this.send("@plugin_bundle:getLists", {
            applicationId: this.applicationId,
            name: this.displayName,
            callback: data => {
                this.setState({
                    items: data.find(x => x.applicationId === this.applicationId).items
                });
            }
        });
    }

    setItems(items) {
        this.send("@plugin_bundle:setLists", {
            applicationId: this.applicationId,
            name: this.displayName,
            items: items
        });
    }

    addItem(itemText) {
        if (itemText === "") {
            return;
        }

        const { items, reminder } = this.state;

        const item = {
            id: createUUID(),
            text: itemText,
            done: false,
            reminder: reminder
        };
        
        this.setItems([item, ...items]);

        this.setState({
            current: "",
            reminder: ""
        });
    }

    setItem(item) {
        if (!item) return;

        this.send('@plugin_bundle:setItem', {
            applicationId: this.applicationId,
            item: item
        });
    }

    removeItem(itemToRemove) {
        if (!itemToRemove) return;

        const { items } = this.state;

        const message = `You're about to delete ${itemToRemove.text}, are you sure?`;

        const myConfirmObject = {
            message: message,
            buttonTexts: ["Cancel", "Delete"],
            onConfirm: () => {
                this.setItems(items.filter(item => item.id !== itemToRemove.id));
            }
        };

        this.confirm(myConfirmObject);
    }

    changeDoneItem(item, done) {
        if (!item) return;

        item.done = done;
        this.setItem(item);
    }

    setReminder(dateTime, item = null) {
        if (item === null) {
            this.setState({
                reminder: dateTime
            });
            return;
        }
        item.reminder = dateTime;
        this.setItem(item);
    }

    render() {
        const { current, reminder, items } = this.state;

        return (
            // Use @plugin_bundle_class and the bundle in the manifest will be used as your class
            <Provider store={store}>
                <GUI.Wrapper
                    className={"@plugin_bundle_class"}>
                    <GUI.Title
                        text={this.displayName}
                    />
                    <GUI.Input
                        value={current}
                        placeholder={"What todo?"}
                        onChange={value => this.setState({ current: value })}
                        onEnter={value => this.addItem(value)}
                    />
                    <DatePickerWithClearButton
                        onChangedValue={value => this.setReminder(value)}
                        value={reminder}
                    />
                    <GUI.Button 
                        text={"Add"}
                        size={"large"}
                        onClick={() => this.addItem(current)}
                    />
                    <ListNotDone 
                        items={items.filter(item => !item.done)}
                        changeDoneItem={(item, done) => this.changeDoneItem(item, done)}
                        removeItem={(itemToRemove) => this.removeItem(itemToRemove)}
                        setReminder={(dateTime, item) => this.setReminder(dateTime, item)}
                    />
                    <ListDone
                        items={items.filter(item => item.done)}
                        changeDoneItem={(item, done) => this.changeDoneItem(item, done)}
                        removeItem={(itemToRemove) => this.removeItem(itemToRemove)}
                    />
                    
                </GUI.Wrapper>
            </Provider>
        );
    }
}
