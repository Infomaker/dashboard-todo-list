/**
 * Create an Application by extending the Application class
 * Read more about Application (https://github.com/Infomaker/Dashboard-Plugin/wiki/Application)
 */

import { Application, GUI, createUUID, moment } from "Dashboard";
import React from "React";
import { DatePickerWithClearButton } from './components/DatePicker/style'
import { Icon } from './components/Icon/style'
import { List } from './components/List/style'

const Fragment = React.Fragment;

export default class MyApplication extends Application {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            current: "",
            reminder: "",
            showAll: false
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

    setLists(items) {
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
        
        this.setLists([item, ...items]);

        this.setState({
            current: "",
            reminder: ""
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
                this.setLists(items.filter(item => item.id !== itemToRemove.id));
            }
        };

        this.confirm(myConfirmObject);
    }

    changeDoneItem(itemToUndo, done) {
        if (!itemToUndo) return;

        const { items } = this.state;

        let newItems = items;
        newItems.forEach(item => {
            if (item.id === itemToUndo.id) {
                item.done = done;
                this.setLists(newItems);
            }
        });
    }

    setReminder(dateTime) {
        this.setState({
            reminder: dateTime
        });
    }

    renderNotDoneItems() {
        const { items } = this.state;

        const notDoneItems = items
            .filter(item => !item.done)
            .map(item => {
                const date = moment(item.reminder).format("YYYY-MM-DD HH:mm");
                return {
                    id: item.id,
                    content: (
                        <React.Fragment>
                           
                            <GUI.Paragraph>
                                {item.text}
                            </GUI.Paragraph>
                            
                            <GUI.Button
                                text={"Done"} 
                                size={"large"} 
                                onClick={() => this.changeDoneItem(item, true)}
                            />
                            <GUI.Button 
                                text={"Delete"}
                                size={"large"} 
                                onClick={() => this.removeItem(item)}
                            />
                            {item.reminder &&
                                <Icon 
                                    iconClass="alarm" 
                                    iconColor={"#424242"} 
                                    text={date}
                                />
                            }
                        </React.Fragment>
                    )
                };
            });

        return <List 
                    before={
                        <GUI.Heading 
                            level={"2"} 
                            text={"Things to do:"} 
                        />
                    } 
                    items={notDoneItems} 
                />;
    }

    renderDoneItems() {
        const { items, showAll } = this.state;

        const doneItems = items
            .filter(item => item.done)
            .map(item => {
                return {
                    id: item.id,
                    content: (
                        <Fragment>
                            <GUI.Paragraph
                                className={"strike-through"}
                                text={item.text} 
                            />
                            <GUI.Button
                                text={"Undo"}
                                size={"large"}
                                onClick={() => this.changeDoneItem(item, false)}
                            />
                            <GUI.Button 
                                text={"Delete"}
                                size={"large"}
                                onClick={() => this.removeItem(item)}
                            />
                        </Fragment>
                    )
                };
            });

        return (
            <Fragment>
                {doneItems.length > 0 && (
                    <GUI.Checkbox
                        label={"Show done items"}
                        checked={showAll}
                        onChange={checked =>
                            this.setState({
                                showAll: checked
                            })
                        }
                    />
                )}
                <br />
                {showAll && 
                    <List
                        before={
                            <GUI.Heading
                                level={"2"} 
                                text={"Things you have done:"} 
                            />
                        }
                        items={doneItems}
                    />
                }
            </Fragment>
        );
    }

    render() {
        const { current, reminder } = this.state;

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
                <DatePickerWithClearButton // Tiden verkar inte vara lokaliserad, vi får skicka in tidsformat. Tiden visas inte i inputen. Rubriken över tiden är inte lokaliserad. Clearknappen hamnar fel. Label verkar inte renderas.
                    onChange={value => this.setReminder(value)}
                    showTimeSelect
                    timeFormat={"HH:mm"}
                    minDate={moment()}
                    maxDate={moment().add("2", "years")}
                    showDisabledMonthNavigation
                    isClearable={true}
                    value={reminder}
                    dateFormat={"YYYY-MM-DD HH:mm"}
                    placeholderText={"Remind me (optional)"}
                />
                <GUI.Button 
                    text={"Add"}
                    size={"large"}
                    onClick={() => this.addItem(current)}
                />
                {this.renderNotDoneItems()}
                {this.renderDoneItems()}
            </GUI.Wrapper>
        );
    }
}
