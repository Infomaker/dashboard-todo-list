/**
 * Create an Application by extending the Application class
 * Read more about Application (https://github.com/Infomaker/Dashboard-Plugin/wiki/Application)
 */

import { GUI, createUUID } from "Dashboard";
import React, { Component } from "React";
import { DatePickerWithClearButton } from '@components/DatePicker/style'
import ListNotDone from '../ListNotDone';
import ListDone from '../ListDone';
import { connect } from 'react-redux'

import { setItems, getItems } from '../../redux/todoActions'

class TodoList extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
                this.props.dispatch(setItems(data.items))
            }
        });
    }

    getInitialItems() {
        const { event } = this.props;

        this.props.dispatch(getItems({
            applicationId: this.applicationId,
            displayName: this.displayName,
            event: event
        }));

        // this.event.send("@plugin_bundle:getLists", {
        //     applicationId: this.applicationId,
        //     name: this.displayName,
        //     callback: data => {
        //         this.props.dispatch(setItems(data.find(x => x.applicationId === this.applicationId).items))
        //     }
        // });
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

        const { reminder } = this.state;
        const { allItems } = this.props;

        const item = {
            id: createUUID(),
            text: itemText,
            done: false,
            reminder: reminder
        };

        this.setItems([item, ...allItems]);

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
        const { current, reminder } = this.state;
        const { doneItems, notDoneItems, loading } = this.props

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
                {loading &&
                    <div>
                        Loading...
                    </div>
                }
                {!loading &&
                    <React.Fragment>
                        <ListNotDone
                            items={notDoneItems}
                            onItemDone={(item) => this.toggleItemDone(item)}
                            removeItem={(itemToRemove) => this.removeItem(itemToRemove)}
                            setReminder={(dateTime, item) => this.setReminder(dateTime, item)}
                        />
                        <ListDone
                            items={doneItems}
                            changeDoneItem={(item) => this.toggleItemDone(item)}
                            removeItem={(itemToRemove) => this.removeItem(itemToRemove)}
                        />
                    </React.Fragment>
                }

            </GUI.Wrapper>
        );
    }
}

export default connect(state => {
    return {
        loading: state.todo.loading,
        allItems: state.todo.items,
        doneItems: state.todo.items.filter(item => item.done),
        notDoneItems: state.todo.items.filter(item => !item.done)
    }
})(TodoList)