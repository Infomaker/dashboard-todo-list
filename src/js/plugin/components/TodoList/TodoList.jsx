
import { GUI, createUUID } from "Dashboard";
import React, { Component } from "React";
import { DatePickerWithClearButton } from '@components/DatePicker/style'
import ListNotDone from '../ListNotDone';
import ListDone from '../ListDone';

export default class TodoList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            current: "",
            reminder: "",
        };

        this.event = this.props.event

        this.applicationId = props.applicationId;
        this.displayName = props.config.pluginTitle || "Todo";
    }

    componentDidMount() {
        this.event.ready("@plugin_bundle-agent", () => {
            this.getInitialItems();
        });

        this.event.on("@plugin_bundle:updatedLists", data => {
            if (data.applicationId === this.applicationId) {
                this.setState({
                    items: data.items
                });
            }
        });
    }

    getInitialItems() {
        this.event.send("@plugin_bundle:getLists", {
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
        this.event.send("@plugin_bundle:setLists", {
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

        this.event.send('@plugin_bundle:setItem', {
            applicationId: this.applicationId,
            item: item
        });
    }

    removeItem(itemToRemove) {
        if (!itemToRemove) return;

        const { allItems, confirm } = this.props;

        const message = `You're about to delete ${itemToRemove.text}, are you sure?`;

        const myConfirmObject = {
            message: message,
            buttonTexts: ["Cancel", "Delete"],
            onConfirm: () => {
                this.setItems(allItems.filter(item => item.id !== itemToRemove.id));
            }
        };

        confirm.open(myConfirmObject);
    }

    toggleItemDone(item) {
        if (!item) return

        item.done = !item.done
        this.setItem(item)
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
                    onItemDone={(item) => this.toggleItemDone(item)}
                    removeItem={(itemToRemove) => this.removeItem(itemToRemove)}
                    setReminder={(dateTime, item) => this.setReminder(dateTime, item)}
                />
                <ListDone
                    items={items.filter(item => item.done)}
                    changeDoneItem={(item) => this.toggleItemDone(item)}
                    removeItem={(itemToRemove) => this.removeItem(itemToRemove)}
                />

            </GUI.Wrapper>
        );
    }
}
