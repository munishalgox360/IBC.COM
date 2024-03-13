import Razorpay from "razorpay";

const PAYMENT = new Razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_SECRET
});

export default PAYMENT;