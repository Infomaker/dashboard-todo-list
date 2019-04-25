
import { GUI, createUUID } from "Dashboard";
import React, { useState, useEffect } from "React";
import { Store } from '../../services/context/store';
import { DatePickerWithClearButton } from '@components/DatePicker/style'
import ListNotDone from '../ListNotDone';
import ListDone from '../ListDone';

const TodoList = (props) => {

    const event = props.event;
    const applicationId = props.applicationId;
    const displayName = props.config.pluginTitle || "Todo";

    //const[count, setCount] = useState(0);

    const [items, setStateItems] = useState([]);
    useEffect(() => {
        event.ready("@plugin_bundle-agent", () => {
            getInitialItems();
        });

        event.on("@plugin_bundle:updatedLists", data => {
            if (data.applicationId === applicationId) {
                setStateItems(data.Items);
            }
        });
    });

    const [current, setStateCurrent] = useState('');
    const [reminder, setStateReminder] = useState('');

    // this.state = {
    //     items: [],
    //     current: "",
    //     reminder: "",
    // };

    


    //componentDidMount() {
    // this.event.ready("@plugin_bundle-agent", () => {
    //     this.getInitialItems();
    // });

    // this.event.on("@plugin_bundle:updatedLists", data => {
    //     if (data.applicationId === this.applicationId) {
    //         setStateItems(data.Items);

    //         // this.setState({
    //         //     items: data.items
    //         // });
    //     }
    // });
    //}

    const getInitialItems = () => {
        event.send("@plugin_bundle:getLists", {
            applicationId: applicationId,
            name: displayName,
            callback: data => {
                setStateItems(data.find(x => x.applicationId === applicationId).items);

                // this.setState({
                //     items: data.find(x => x.applicationId === this.applicationId).items
                // });
            }
        });
    }

    const setItems = (items) => {
        event.send("@plugin_bundle:setLists", {
            applicationId: applicationId,
            name: displayName,
            items: items
        });
    }

    const addItem = (itemText) => {
        if (itemText === "") {
            return;
        }

        //const { items, reminder } = this.state;

        const item = {
            id: createUUID(),
            text: itemText,
            done: false,
            reminder: reminder
        };

        setItems([item, ...items]);

        setStateCurrent('');
        setStateReminder('');

        // this.setState({
        //     current: "",
        //     reminder: ""
        // });
    }

    const setItem = (item) => {
        if (!item) return;

        event.send('@plugin_bundle:setItem', {
            applicationId: applicationId,
            item: item
        });
    }

    const removeItem = (itemToRemove) => {
        if (!itemToRemove) return;

        const { allItems, confirm } = props;

        const message = `You're about to delete ${itemToRemove.text}, are you sure?`;

        const myConfirmObject = {
            message: message,
            buttonTexts: ["Cancel", "Delete"],
            onConfirm: () => {
                setItems(allItems.filter(item => item.id !== itemToRemove.id));
            }
        };

        confirm.open(myConfirmObject);
    }

    const toggleItemDone = (item) => {
        if (!item) return

        item.done = !item.done
        setItem(item)
    }

    const setReminder = (dateTime, item = null) => {
        if (item === null) {
            setStateReminder(dateTime);
            // this.setState({
            //     reminder: dateTime
            // });
            return;
        }
        item.reminder = dateTime;
        setItem(item);
    }

    //render() {
    //const { current, reminder, items } = this.state;

    const store = React.useContext(Store);
    console.log('store :', store);

    return (
        // Use @plugin_bundle_class and the bundle in the manifest will be used as your class
        <GUI.Wrapper
            className={"@plugin_bundle_class"}>
            <GUI.Title
                text={displayName}
            />
            <GUI.Input
                value={current}
                placeholder={"What todo?"}
                onChange={value => setStateCurrent(value)}
                onEnter={value => addItem(value)}
            />
            <DatePickerWithClearButton
                onChangedValue={value => setReminder(value)}
                value={reminder}
            />
            <GUI.Button
                text={"Add"}
                size={"large"}
                onClick={() => addItem(current)}
            />
            <ListNotDone
                items={items.filter(item => !item.done)}
                onItemDone={(item) => toggleItemDone(item)}
                removeItem={(itemToRemove) => removeItem(itemToRemove)}
                setReminder={(dateTime, item) => setReminder(dateTime, item)}
            />
            <ListDone
                items={items.filter(item => item.done)}
                changeDoneItem={(item) => toggleItemDone(item)}
                removeItem={(itemToRemove) => removeItem(itemToRemove)}
            />

        </GUI.Wrapper>
    );
    //}
}

export default TodoList;
