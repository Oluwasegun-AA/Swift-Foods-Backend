// Import statments
import model from '../seed/populate';
import database from '../db/Index';


export default class Controller {
  /**
   * Gets All orders in the database and sends as response
   * @param {*} req - incomming request data
   * @param {*} res - response to the validity of the data
   */
  // eslint-disable-next-line class-methods-use-this
  async getOrders(req, res) {
    const command = 'SELECT * FROM orders';
    const {
      rows,
      rowCount,
    } = await database.query(command);
    return res.status(200).send({
      success: true,
      status: 'Orders Retrieved Successfully',
      orders: rows,
      total_orders: rowCount,
    });
  }

  /**
   * Gets a particular order in the database and send as response
   * @param {*} req - incomming Request data
   * @param {*} res - response to the validity of the data
   */
  // eslint-disable-next-line class-methods-use-this
  async getOrder(req, res) {
    const command = 'SELECT * FROM orders WHERE order_id=$1';
    const {
      rows,
    } = await database.query(command, [req.params.orderId]);
    if (!rows[0]) {
      return res.status(404).send({
        success: false,
        status: 'Order Not Found in the Database',
      });
    } return res.status(200).send({
      success: 'true',
      status: 'Order Retrieved Successfully',
      order: rows[0],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async userOrderHistory(req, res) {
    const command = 'SELECT * FROM orders WHERE customer_id=$1';
    const {
      rows,
    } = await database.query(command, [req.params.userId]);
    if (!rows[0]) {
      return res.status(404).send({
        success: false,
        status: 'Orders Not Found in the Database',
      });
    } return res.status(200).json({
      success: true,
      status: 'Orders Retrieved Successfully',
      order: rows,
    });
  }

  /**
   * Add an Order to existing orders in the database
   *  @param {*} req - incomming json data
   *  @param {*} res - response to the sucess of the event
   */
  // eslint-disable-next-line class-methods-use-this
  async addOrder(req, res) {
    const newOrder = model.populate(req);
    const command = `INSERT INTO
    orders(item_id, quantity, total_price, order_status,customer_id, customer_address)
      VALUES($1, $2, $3, $4, $5,$6)
      returning *`;
    const {
      rows,
    } = await database.query(command, newOrder);
    return res.status(201).send({
      success: true,
      order_sent: rows[0],
      status: 'Order Sent Successfully',
    });
  }

  /**
   * Update an order in the database
   *  @param {*} req - incomming json data
   * @param {*} res - response to the success of the event
   */
  // eslint-disable-next-line class-methods-use-this
  async updateOrder(req, res) {
    const order = model.populate(req);
    const date = new Date();
    order.push(date);
    order.push(req.params.orderId);
    const findQuery = 'SELECT * FROM orders WHERE order_id=$1';
    const updateQuery = `UPDATE orders SET item_id=$1,quantity=$2,
    total_price=$3,order_status=$4,customer_id=$5,customer_address=$6,modified_date=$7 WHERE order_id=$8 returning *`;
    const {
      rows,
    } = await database.query(findQuery, [req.params.orderId]);
    if (!rows[0]) {
      return res.status(410).send({
        success: false,
        status: 'Order Not Found in the Database',
      });
    }
    const response = await database.query(updateQuery, order);
    return res.status(200).send({
      success: true,
      orderId: req.params.orderId,
      old_Order: rows[0],
      update: response.rows[0],
      status: 'Update successful',
    });
  }

  /**
   * Delete an order in the database
   *  @param {*} req - incomming request data
   * @param {*} res - response to the validity of the data
   */
  // eslint-disable-next-line class-methods-use-this
  async deleteOrder(req, res) {
    const deleteQuery = 'DELETE FROM orders WHERE order_id=$1 returning *';
    const {
      rows,
    } = await database.query(deleteQuery, [req.params.orderId]);
    if (!rows[0]) {
      return res.status(404).send({
        success: false,
        status: 'Order Not Found in the Database',
      });
    }
    return res.status(200).send({
      success: true,
      status: 'Order Deleted Successfuly',
    });
  }
}
