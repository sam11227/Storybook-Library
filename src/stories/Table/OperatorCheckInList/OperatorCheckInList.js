import Table from '../../../lib/components/Table/Table.svelte';

export default {
    title: 'Views/OperatorCheckInList',
    component: Table,
    parameters: {
        docs: {
            description: {
                component: 'Match this design: https://www.figma.com/design/xEAgeYvJoWIBVwEA5L7EJx/Micdrop?node-id=2674-114811&t=yIzpFCbBRzukR7W1-4',
            },
        },
    },
    argTypes: {
        columns: { control: 'object' },
        showTableHead: { control: 'boolean' },
        bordered: { control: 'boolean' },
        searchable: { control: 'boolean' },
        hasCheckBox: { control: 'boolean' },
        onRowClick: { action: 'rowClick' },
    },
};

const Template = (args) => ({
    Component: Table,
    props: args,
    on: {
        rowClick: args.onRowClick,
    },
});

export const Default = Template.bind({});
Default.args = {
    columns:[{"key":"attendees","title":"ATTENDEE NAME","sortable":true},{"key":"orderId","title":"Order ID","sortable":true},{"key":"saleType","title":"Sale Type","sortable":true},{"key":"ticketId","title":"Ticket Id","sortable":true},{"key":"ticketType","title":"TICKET TYPE","sortable":true},{"key":"notes","title":"Notes","sortable":true},{"key":"status","title":"STATUS","sortable":true,"isComponent":true}],
    data: [{"id":1,"orderId":"3","attendees":{"name":"sdfg sdfg","email":"gus@gusnaughton.com"},"status":"Not Checked In","saleType":"backend","notes":" ","isChecked":false,"ticketId":"827445e0","ticketType":"GA"},{"id":2,"orderId":"3","attendees":{"name":"sdfg sdfg","email":"gus@gusnaughton.com"},"status":"Not Checked In","saleType":"backend","notes":" ","isChecked":false,"ticketId":"4016cd1e","ticketType":"GA"},{"id":3,"orderId":"3","attendees":{"name":"sdfg sdfg","email":"gus@gusnaughton.com"},"status":"Not Checked In","saleType":"backend","notes":" ","isChecked":false,"ticketId":"43c53247","ticketType":"GA"},{"id":4,"orderId":"3","attendees":{"name":"sdfg sdfg","email":"gus@gusnaughton.com"},"status":"Not Checked In","saleType":"backend","notes":" ","isChecked":false,"ticketId":"ea90df5d","ticketType":"GA"}],
    showTableHead: true,
    bordered: false,
    searchable: true,
    hasCheckBox: false,
};
Default.parameters = {
    docs: {
        description: {
            story: 'This is the default configuration of the `Table` component.',
        },
    },
};

export const WithScreenshot = Template.bind({});
WithScreenshot.args = {
    ...Default.args,
};
WithScreenshot.parameters = {
    docs: {
        description: {
            story: 'This story includes a screenshot of the `Table` component.',
        },
    },
};
WithScreenshot.decorators = [
    (Story) => {
        const container = document.createElement('div');

        // Render the Svelte component
        const { Component, props } = Story();
        const target = document.createElement('div');
        new Component({ target, props });

        // Add the screenshot
        const screenshotElement = document.createElement('img');
        screenshotElement.src = 'https://via.placeholder.com/800x400';
        screenshotElement.alt = 'Table Screenshot';
        screenshotElement.style.marginTop = '20px';
        screenshotElement.style.border = '1px solid #ccc';

        container.appendChild(target);
        container.appendChild(screenshotElement);

        return container;
    },
];