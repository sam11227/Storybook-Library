import Table from '../../../lib/components/Table/Table.svelte';

export default {
    title: 'Views/OperatorOrdersList',
    component: Table,
    parameters: {
        docs: {
            description: {
                component: 'Match this design: https://www.figma.com/design/xEAgeYvJoWIBVwEA5L7EJx/Micdrop?node-id=2674-114506&t=yIzpFCbBRzukR7W1-4,
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
    columns:[{"key":"orderId","title":"ORDER ID","sortable":true},{"key":"purchasedBy","title":"PURCHASED BY","sortable":true},{"key":"status","title":"STATUS","sortable":true},{"key":"dateOfPurchase","title":"DATE OF PURCHASE","sortable":true},{"key":"quantity","title":"QUANTITY","sortable":true},{"key":"saleType","title":"SALE TYPE","sortable":true},{"key":"total","title":"TOTAL","sortable":true},{"key":"note","title":"NOTE","sortable":false}],
    data: [{"id":"641fa0ac-e3f9-4042-be74-077933b5cf60","orderId":{"orderID":3,"eventID":1,"venueID":"1"},"purchasedBy":{"name":"sdfg sdfg","email":"gus@gusnaughton.com"},"email":"gus@gusnaughton.com","dateOfPurchase":"Mon Jun 09 2025","quantity":4,"saleType":"backend","note":"","total":"$441.40","status":"succeeded"}],
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