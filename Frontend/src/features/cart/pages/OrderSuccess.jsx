import React from 'react';
import { useLocation, useNavigate } from 'react-router';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('order_id');

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500">
            <span className="text-4xl text-green-400">✓</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Order Placed Successfully
        </h1>

        <p className="text-zinc-400 text-center mb-8">
          Thank you for shopping with us. Your order has been confirmed.
        </p>

        {/* Order Details */}
        <div className="bg-zinc-800 rounded-xl p-5 mb-6 space-y-3">
          <div className="flex justify-between border-b border-zinc-700 pb-2">
            <span className="text-zinc-400">Order ID</span>
            <span className="font-medium text-sm break-all">{orderId}</span>
          </div>

          <div className="flex justify-between border-b border-zinc-700 pb-2">
            <span className="text-zinc-400">Payment Status</span>
            <span className="text-green-400 font-medium">Paid</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Estimated Delivery</span>
            <span className="font-medium">3 - 5 Days</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-amber-600 hover:bg-amber-500 transition rounded-xl py-3 font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;