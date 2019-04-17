/**
 * Create a Widget by extending the Widget class
 * Read more about Widget (https://github.com/Infomaker/Dashboard-Plugin/wiki/Widget)
 */

import { Widget, createUUID } from "Dashboard";
import { WidgetList } from './components/List/style'
import { WidgetCheckbox } from './components/Checkbox/style'

export default class MyWidget extends Widget {
    constructor(props) {
        super(props);

        this.state = {
            lists: [],
            displayLists: []  // used to filter out previously done items
        }
    }

    componentDidMount() {
        this.send('@plugin_bundle:getLists', {
            callback: data => {
                // Feels hacky use map instead?
                let displayLists = [];
                data.forEach((list) => {
                    let data = { ...list };
                    data.items = data.items.filter(item => !item.done);
                    displayLists.push(data);
                });

                this.setState({
                    lists: data,
                    displayLists: displayLists
                });
            }
        })

        // this.send('@plugin_bundle:displayInWidget', {
        //     callback: data => {
        //         this.setState(oldState => {
        //             let filteredData = {...data};
        //             filteredData.items =  filteredData.items.filter(item => !item.done);
        //             return {
        //                 lists: [data, ...oldState.lists],
        //                 displayLists: [filteredData, ...oldState.displayLists]
        //             }
        //         })
        //     }
        // });
        
    }

    saveItem(changedItem, done, applicationId) {
        const { lists } = this.state;

        let newLists = lists;
        newLists.forEach((list) => {
            if (list.applicationId == applicationId) {
                list.items.forEach((item) => {
                    if (item.id === changedItem.id) {
                        item.done = done;
                        this.send('@plugin_bundle:setLists', {
                            applicationId: applicationId,
                            name: list.name,
                            items: list.items
                        });
                    }
                })
            }
        });

        this.setState({
            lists: newLists
        });
    }

    render() {
        const { displayLists } = this.state;

        const listItems = displayLists.map(list => {
            const children = list.items.map(item => {
                return {
                    id: item.id,
                    content: (
                        <WidgetCheckbox   // Är detta rätt sätt? Med klassnamn och hur man ändrar ett 'state' med styled components
                            className={item.done ? 'se-infomaker-gui-checkbox--strike-through' : ''}
                            label={item.text}
                            checked={item.done}
                            onChange={checked => this.saveItem(item, checked, list.applicationId)}
                        />
                    )
                }
            })

            return {
                id: list.applicationId,
                title: list.name,
                children: children.length ? children : [{
                    id: createUUID(),
                    content: 'All done here!'
                }]
            }
        })

        return (
            <WidgetList
                items={listItems}
            />
        )
    }
}