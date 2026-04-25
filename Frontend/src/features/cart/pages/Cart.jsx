import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useCart } from '../hook/useCart';
import { useRazorpay } from "react-razorpay";

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function getItemImage(item) {
    const variant = item.product?.variants;
    if (variant && variant._id === item.variant && variant.images?.[0]?.url) {
        return variant.images[0].url;
    }
    return item.product?.images?.[0]?.url || null;
}

function getVariantLabel(item) {
    const variant = item.product?.variants;
    if (variant && variant._id === item.variant && variant.attributes) {
        return Object.entries(variant.attributes)
            .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
            .join(' · ');
    }
    return null;
}

function fmtPrice({ amount = 0, currency = 'INR' } = {}) {
    const sym = currency === 'INR' ? '₹' : currency;
    return `${sym}${amount.toLocaleString('en-IN')}`;
}

/* ─── Skeleton ────────────────────────────────────────────────────────── */

function ItemSkeleton() {
    return (
        <div className="flex flex-col sm:flex-row gap-6 bg-[#181818] rounded-2xl p-6 border border-white/[0.02] animate-pulse">
            <div className="w-full sm:w-40 sm:h-48 h-64 rounded-xl bg-[#222] shrink-0" />
            <div className="flex-1 flex flex-col py-1 justify-between">
                <div>
                    <div className="h-6 bg-[#222] rounded w-3/4 mb-3" />
                    <div className="h-4 bg-[#222] rounded w-1/3 mb-4" />
                    <div className="h-6 bg-[#222] rounded w-20" />
                </div>
                <div className="flex justify-between items-end mt-6">
                    <div className="h-10 bg-[#222] rounded-lg w-32" />
                    <div className="h-8 bg-[#222] rounded w-24" />
                </div>
            </div>
        </div>
    );
}

function SummarySkeleton() {
    return (
        <div className="bg-[#181818] border border-white/[0.04] rounded-2xl p-7 animate-pulse flex flex-col gap-5 sticky top-[100px]">
            <div className="h-6 bg-[#222] rounded w-1/2" />
            <div className="h-5 bg-[#222] rounded w-full" />
            <div className="h-5 bg-[#222] rounded w-full" />
            <div className="h-5 bg-[#222] rounded w-3/4" />
            <div className="h-px bg-[#222] rounded w-full my-2" />
            <div className="h-8 bg-[#222] rounded w-full" />
            <div className="h-14 bg-[#222] rounded-xl w-full mt-4" />
        </div>
    );
}

/* ─── Empty State ─────────────────────────────────────────────────────── */

function EmptyCart({ onShopNow }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-32 gap-6 text-center px-4">
            <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-amber-500/5 border border-amber-500/20">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
                    stroke="#e9c176" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                </svg>
            </div>
            <div>
                <h2 className="text-3xl font-bold text-[#e7e5e5] tracking-tight mb-3"
                    style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Your cart is empty
                </h2>
                <p className="text-base text-[#8a8a8a] leading-relaxed max-w-sm mx-auto">
                    Looks like you haven't added anything yet. Explore our premium collection and discover your next favorite piece.
                </p>
            </div>
            <button
                onClick={onShopNow}
                className="mt-4 px-12 py-4 bg-gradient-to-br from-[#e9c176] to-[#dab36a] text-[#553c00]
                           font-extrabold text-xs tracking-[0.2em] uppercase rounded-xl
                           hover:shadow-[0_8px_20px_rgba(233,193,118,0.2)] hover:-translate-y-1 active:scale-[0.98]
                           transition-all duration-300"
                style={{ fontFamily: 'Manrope, sans-serif' }}>
                Discover Now
            </button>
        </div>
    );
}

/* ─── Cart Item Card ──────────────────────────────────────────────────── */

function CartItemCard({ item, index}) {
    const img = getItemImage(item);
    const label = getVariantLabel(item);
    const price = item.price || item.product?.price;
    const {handleIncrementCartItemQuantity,handleDecrementCartItemQuantity,handleRemoveFromCart}=useCart();
 
    const variant = item.product?.variants;
    const updatedVariantPrice = variant?._id === item.variant ? variant.price : null;
  
    return (

        <div
            className="flex flex-col sm:flex-row gap-6 bg-[#181818] rounded-2xl p-6 group
                       border border-white/[0.04] hover:bg-[#1c1c1c] hover:border-white/[0.08] transition-all duration-300"
            style={{
                animation: `fadeUp 0.4s ease-out ${index * 80}ms both`,
            }}
        >
            {/* Image */}
            <div className="w-full sm:w-40 sm:h-48 h-64 shrink-0 rounded-xl overflow-hidden bg-[#222] flex items-center justify-center relative">
                {img ? (
                    <img
                        src={img}
                        alt={item.product?.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                        stroke="#acabaa" strokeWidth="1.5" strokeLinecap="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                )}
            </div>

            {/* Info & Controls */}
            <div className="flex-1 flex flex-col py-1">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h3 className="text-[#e7e5e5] font-bold text-lg tracking-tight leading-snug"
                            style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {item.product?.title || 'Product'}
                        </h3>
                        {label && (
                            <p className="text-sm text-[#8a8a8a] tracking-wide mt-1.5">{label}</p>
                        )}
                        <div className="mt-4 inline-flex items-center text-[#4caf50] text-[10px] font-bold uppercase tracking-widest bg-[#4caf50]/10 px-2.5 py-1.5 rounded">
                            In Stock
                        </div>
                        {
                            updatedVariantPrice && price?.amount !== updatedVariantPrice.amount && (
                                price.amount > updatedVariantPrice.amount ? (
                                    <p className="text-sm text-green-500 tracking-wide mt-1.5">You Saved {price.amount - updatedVariantPrice.amount}, you will get this at {fmtPrice({amount: updatedVariantPrice.amount, currency: updatedVariantPrice.currency})}</p>
                                ) : (
                                    <p className="text-sm text-red-600 tracking-wide mt-1.5">You Pay Extra {updatedVariantPrice.amount - price.amount}, you will get this at {fmtPrice({amount: updatedVariantPrice.amount, currency: updatedVariantPrice.currency})}</p>
                                )
                            )
                        }
                    </div>
                    
                    <button
                        onClick={() => handleRemoveFromCart({productId: item.product._id, variantId: item.variant})}
                        className="text-[#8a8a8a] hover:text-red-400 p-2 -mr-2 -mt-2 transition-colors duration-200"
                        title="Remove Item"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="mt-auto pt-6 flex items-end justify-between">
                    {/* Quantity Control */}
                    <div className="flex items-center gap-4">
                        <span className="text-[11px] text-[#8a8a8a] font-bold uppercase tracking-[0.15em]">Qty</span>
                        <div className="flex items-center bg-[#111] rounded-lg border border-white/[0.08] overflow-hidden h-10">
                            <button 
                                onClick={() => handleDecrementCartItemQuantity({productId: item.product._id, variantId: item.variant})}
                                className="w-10 h-full flex items-center justify-center text-[#8a8a8a] hover:text-white hover:bg-white/[0.05] transition-colors"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            </button>
                            <span className="w-10 text-center text-sm font-semibold text-[#e7e5e5]">{item.quantity}</span>
                            <button 
                                onClick={() => handleIncrementCartItemQuantity({productId: item.product._id, variantId: item.variant})}
                                className="w-10 h-full flex items-center justify-center text-[#8a8a8a] hover:text-white hover:bg-white/[0.05] transition-colors"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            </button>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                        <div className="text-[#e9c176] font-extrabold text-xl tracking-tight"
                            style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {fmtPrice({ amount: (price?.amount || 0) * item.quantity, currency: price?.currency || 'INR' })}
                        </div>
                        {item.quantity > 1 && (
                            <div className="text-xs text-[#8a8a8a] mt-1.5 font-medium">
                                {fmtPrice(price)} each
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Order Summary ───────────────────────────────────────────────────── */

function OrderSummary({ items }) {
    const navigate = useNavigate();
    const { handleCreateCartOrder,handleVerifyCartOrder } = useCart();
    const { error, isLoading, Razorpay } = useRazorpay();
    
    const user=useSelector(state => state.user);
    

    async function handleCheckout(){
        const order = await handleCreateCartOrder();
        console.log(order);

        const options = {
      key: "rzp_test_Shgrp5VKMpkLyE",
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: "Snitch",
      description: "Snitch Transaction Safe & Secure",
      order_id: order.id, // Generate order_id on server
      handler: async (response) => {
        const isValid = await handleVerifyCartOrder({
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature
          });        
        if(isValid){
            navigate(`/order-success?order_id=${response?.razorpay_order_id}`);
        }
      },
      prefill: {
        name: user?.fullname,
        email: user?.email,
        contact: user?.contact,
      },
      theme: {
        color:"#F37254",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  }
    const subtotal = items.reduce(
        (sum, item) => sum + (item.price?.amount || 0) * item.quantity,
        0
    );
    const currency = items[0]?.price?.currency || 'INR';
    const total = subtotal;

    return (
        <aside className="bg-[#181818] border border-white/[0.04] rounded-2xl p-7 sticky top-[100px]">
            <h2
                className="text-[#e7e5e5] font-extrabold text-xl tracking-tight mb-6"
                style={{ fontFamily: 'Manrope, sans-serif' }}>
                Order Summary
            </h2>

            {/* Line items */}
            <div className="flex flex-col gap-4 text-[15px]">
                <div className="flex justify-between items-center text-[#acabaa]">
                    <span>Subtotal</span>
                    <span className="text-[#e7e5e5] font-medium">
                        {fmtPrice({ amount: subtotal, currency })}
                    </span>
                </div>
                <div className="flex justify-between items-center text-[#acabaa]">
                    <span>Estimated Tax</span>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-400/10 px-2 py-1 rounded">
                        INCLUDED
                    </span>
                </div>
                <div className="flex justify-between items-center text-[#acabaa]">
                    <span>Delivery</span>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-400/10 px-2 py-1 rounded">
                        Free
                    </span>
                </div>
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-white/[0.06]" />

            {/* Total */}
            <div className="flex justify-between items-end mb-8">
                <span
                    className="text-[#e7e5e5] font-bold text-lg"
                    style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Total
                </span>
                <div className="text-right">
                    <span
                        className="text-[#e9c176] font-extrabold text-3xl tracking-tight leading-none block"
                        style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {fmtPrice({ amount: total, currency })}
                    </span>
                    <span className="text-[11px] text-[#8a8a8a] mt-1.5 block uppercase tracking-wider">
                        Including Taxes
                    </span>
                </div>
            </div>

            {/* Checkout CTA */}
            <button
                onClick={()=>handleCheckout()}
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6
                           bg-gradient-to-br from-[#e9c176] to-[#dab36a]
                           text-[#553c00] font-extrabold text-xs tracking-[0.15em] uppercase
                           rounded-xl shadow-[0_8px_20px_rgba(233,193,118,0.15)]
                           hover:shadow-[0_8px_25px_rgba(233,193,118,0.25)] hover:-translate-y-1
                           active:scale-[0.98] transition-all duration-300"
                style={{ fontFamily: 'Manrope, sans-serif' }}>
                Proceed to Checkout
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            {/* Continue shopping */}
            <button
                onClick={() => navigate('/')}
                className="w-full mt-4 py-3 text-xs text-[#8a8a8a] font-bold uppercase tracking-widest
                           hover:text-[#e7e5e5] transition-colors duration-200">
                Continue Shopping
            </button>

            {/* Trust badges */}
            <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col gap-3.5">
                {[
                    { text: 'Free standard shipping', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg> },
                    { text: '30-day hassle-free returns', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg> },
                    { text: 'Authenticity guaranteed', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> },
                ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-[#8a8a8a]">
                        <div className="text-amber-500/80">
                            {item.icon}
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#acabaa]">
                            {item.text}
                        </span>
                    </div>
                ))}
            </div>
        </aside>
    );
}

/* ─── Page ────────────────────────────────────────────────────────────── */

export default function Cart() {
    const navigate = useNavigate();
    const { handleGetCart,handleIncrementCartItemQuantity } = useCart();
    const cartItems = useSelector(state => state.cart.items);
    const [loading, setLoading] = useState(true);
    // Using local state for UI responsiveness (optimistic updates if needed later)
    // For now we just bind directly to cartItems from Redux
    
    useEffect(() => {
        (async () => {
            await handleGetCart();
            setLoading(false);
        })();
    }, []);

  

    return (
        <div className="min-h-screen bg-[#0e0e0e] text-[#e7e5e5]">

            {/* Keyframe injection */}
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(15px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>


            {/* ── Content ── */}
            <main className="max-w-[1280px] mx-auto px-4 sm:px-8 py-12
                             grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">

                {loading ? (
                    <>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="h-5 w-40 bg-[#181818] rounded animate-pulse" />
                            </div>
                            <ItemSkeleton />
                            <ItemSkeleton />
                            <ItemSkeleton />
                        </div>
                        <SummarySkeleton />
                    </>
                ) : cartItems?.length === 0 ? (
                    <EmptyCart onShopNow={() => navigate('/')} />
                ) : (
                    <>
                        {/* ── LEFT: Cart Items ── */}
                        <section className="flex flex-col gap-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-[#e7e5e5] tracking-wide">
                                    Shopping Bag <span className="text-[#8a8a8a] ml-1 font-medium">({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                                </p>
                            </div>
                            {cartItems.map((item, idx) => (
                                <CartItemCard 
                                    key={item._id} 
                                    item={item} 
                                    index={idx}
                                />
                            ))}
                        </section>
                        {/* ── RIGHT: Order Summary ── */}
                        <OrderSummary items={cartItems} />
                    </>
                )}
            </main>
        </div>
    );
}
