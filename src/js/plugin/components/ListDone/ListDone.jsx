import React, { useState } from 'react';
import { GUI } from 'Dashboard';
import { List } from '@components/List/style'
import { Paragraph } from '@components/Paragraph/style'

const Fragment = React.Fragment;

const ListDone = (props) => {

    // This component uses a React Hook!
    const [showAll, setShowAll] = useState(false);

    const { items, changeDoneItem, removeItem } = props;

    const doneItems = items
        .map(item => {
            return {
                id: item.id,
                content: (
                    <Fragment>
                        <Paragraph
                            strikeThrough={true}
                            text={item.text}
                        />
                        <GUI.Button
                            text={"Undo"}
                            size={"large"}
                            onClick={() => changeDoneItem(item, false)}
                        />
                        <GUI.Button
                            text={"Delete"}
                            size={"large"}
                            onClick={() => removeItem(item)}
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
                        setShowAll(checked)
                    }
                // onChange={checked =>
                //     this.setState({
                //         showAll: checked
                //     })
                // }
                />
            )}
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
        </Fragment>);

}

export default ListDone