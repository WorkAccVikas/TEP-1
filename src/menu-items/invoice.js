import { Calendar1, Location } from "iconsax-react";
import { FormattedMessage } from "react-intl";

const invoice = {
  id: "invoice",
  title: <FormattedMessage id="invoice" />,
  icon: Calendar1,
  type: "group",
  children: [
    {
      id: "invoice",
      title: <FormattedMessage id="invoice" />,
      type: "collapse",
      icon: Location,
      children: [
        {
          id: "create",
          title: <FormattedMessage id="create-invoice" />,
          icon: Location,
          type: "item",
          url: "invoice/create",
          breadcrumbs: true,
        },
        {
          id: "edit-invoice",
          title: <FormattedMessage id="edit-invoice" />,
          icon: Location,
          type: "item",
          url: "invoice/edit/:id",
          breadcrumbs: true,
        },
        {
          id: "list-invoice",
          title: <FormattedMessage id="list-invoice" />,
          icon: Location,
          type: "item",
          url: "invoice/list",
          breadcrumbs: true,
        },
        {
          id: "invoice-details",
          title: <FormattedMessage id="invoice-details" />,
          icon: Location,
          type: "item",
          url: "invoice/details/:id",
          breadcrumbs: true,
        },
      ],
    },
  ],
};

export default invoice;
