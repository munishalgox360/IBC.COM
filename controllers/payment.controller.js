import PaymentModel from "../models/payment.model.js";
import PAYMENT from "../utilities/payment.utility.js";
import message from "../config/message.js";
import crypto from 'crypto';
import { ObjectId } from "mongodb";
import PaymentInvoiceSES from "../templates/payment.template.js";


// -------------- Payment's Handler ---------------

const CreateOrder = async (req, res) => {
    const amount = req.body.amount;
    try {
        const options = {
            amount: Number(amount) * 100,  
            currency: "INR"
        };
        const createResp = await PAYMENT.orders.create(options);
        if(createResp){
           return res.status(200).json({ status : 201, response : createResp, message : message.create_s });
        }else{
           return res.status(200).json({ status : 401, response : createResp, message : message.create_f });
        }
    } catch (error) {
        res.status(400).json({ status : 400, response : error.stack, message : error.message });
    }
};


const VerifyPayment = async (req, res) => {

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const userId = new Object(req.userId);
    const keys = razorpay_order_id + "|" + razorpay_payment_id;

    try {
        const genSign = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(keys.toString()).digest('hex');
        if(genSign === razorpay_signature){
            const detail = await PAYMENT.payments.fetch(razorpay_payment_id);

            const createPayload = {
                userId : userId,
                amount : detail.amount,
                currencyUnit : detail.currency,
                method : detail.method,
                status : detail.status,
                paymentId : razorpay_payment_id,
                orderId : razorpay_order_id
            }

            const createResp = await PaymentModel.create(createPayload);
            if(createResp){
                // const resp = await PaymentInvoiceSES(createResp);
                // if(resp)
                 return res.status(200).json({ status : 201, message : "Valid Transaction" });
            }else{
                return res.status(200).json({ status : 401, message : "Invalid Transaction" });
            }
        }
    } catch (error) {
        res.status(400).json({ status : 400, response : error.stack, message : error.message });
    }
};


const ReadTransaction = async (req, res) => {

    let getResp;
    const userId = new ObjectId(req.userId);
    const page = Number(req.query.page);
    const filter = { $and: [ 
                            {userId : userId}, 
                            {$and : [ 
                                {createdAt : { $gte : new Date(req.query.startDate) }}, 
                                {createdAt :{ $lte : new Date(req.query.endDate) }}
                            ]} 
                        ] 
                    };
                    
    try {
        if(req.query.startDate && req.query.endDate && userId){
            getResp = await PaymentModel.find(filter).skip((page - 1)*20).limit(20);
        }else{
            getResp = await PaymentModel.find({ userId : userId }).skip((page - 1)*20).limit(20);
        }
        
        if(getResp.length > 0){
            return res.status(200).json({ status : 201, response : getResp, message : message.read_s, length : getResp.length });
        }else{
            return res.status(200).json({ status : 401, response : getResp, message : message.read_f });
        }
    } catch (error) {
        res.status(400).json({ status : 400, response : error.stack, message : error.message });
    }
};


export { CreateOrder, VerifyPayment, ReadTransaction };





// const date = new Date();
// startDate = date.toISOString(date.setDate(25)));
// const filter = { $and : [ {createdAt : { $gte : startDate}}, {createdAt :{ $lte : new Date(req.query.endDate) }}] };