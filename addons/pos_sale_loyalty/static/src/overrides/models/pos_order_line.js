import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";
import { PosOrder } from "@point_of_sale/app/models/pos_order";
import { patch } from "@web/core/utils/patch";

patch(PosOrderline.prototype, {
    //@override
    ignoreLoyaltyPoints(args) {
        if (this.sale_order_origin_id) {
            return true;
        }
        return super.ignoreLoyaltyPoints(args);
    },
    //@override
    setQuantityFromSOL(saleOrderLine) {
        // we need to consider reward product such as discount in a quotation
        if (saleOrderLine.reward_id) {
            this.set_quantity(saleOrderLine.product_uom_qty);
        } else {
            super.setQuantityFromSOL(...arguments);
        }
    },
});

patch(PosOrder.prototype, {
    isLineValidForLoyaltyPoints(line) {
        const result = super.isLineValidForLoyaltyPoints(line);
        return !line.sale_order_origin_id && result;
    },
});
