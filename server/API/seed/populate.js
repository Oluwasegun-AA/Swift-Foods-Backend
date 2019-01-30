/**
 * Stage an instance of required data to be pushed to database
 * @param {*} req - incomming json request with data
 * @param {*} id  - orderId associated with the data
*/
export default {
  // eslint-disable-next-line consistent-return
  populate(req, hashedPassword) {
    if (req.body.user_password) {
      const newUser = [req.body.user_name, req.body.user_role, req.body.user_email, hashedPassword];
      return newUser;
    } if (req.body.item_id) {
      const newOrder = [req.body.item_id, req.body.quantity, req.body.total_price,
        req.body.order_status, req.body.customer_id, req.body.customer_address];
      return newOrder;
    } if (req.body.item_image) {
      const newItem = [req.body.item_name, req.body.item_image,
        req.body.item_price, req.body.item_tag];
      return newItem;
    }
  },
};
