import React from 'react';
import { moment, GUI } from 'Dashboard';
import { DatePickerWithClearButton } from '@components/DatePicker/style'
import { List } from '@components/List/style'
import { Icon } from '@components/Icon/style'

const ListNotDone = (props) => {
    const { items, changeDoneItem, removeItem, setReminder } = props;
    const notDoneItems = items
        .map(item => {
            const date = item.reminder ? moment(item.reminder).format("YYYY-MM-DD HH:mm") : '';

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
                            onClick={() => changeDoneItem(item, true)}
                        />
                        <GUI.Button
                            text={"Delete"}
                            size={"large"}
                            onClick={() => removeItem(item)}
                        />
                        <Icon
                            iconClass="alarm"
                            iconColor={"#424242"}
                        />
                        <DatePickerWithClearButton
                            onChangedValue={value => setReminder(value, item)}
                            value={date}
                        />
                    </React.Fragment>
                )
            };
        });

    return (
        <List
            before={
                <GUI.Heading
                    level={"2"}
                    text={"Things to do:"}
                />
            }
            items={notDoneItems}
        />);

}

export default ListNotDone;