import React, { useEffect, useState } from 'react';
import { useProduct } from '../hook/useProduct';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const ProductCard = ({ product }) => {
    const [imageIndex, setImageIndex] = useState(0);
    const navigate = useNavigate();
    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.images && product.images.length > 0) {
            setImageIndex((prev) => (prev + 1) % product.images.length);
        }
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.images && product.images.length > 0) {
            setImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
        }
    };

    const hasMultipleImages = product.images && product.images.length > 1;

    return (
        <div 
        onClick={() => navigate(`/seller/product/${product._id}`)}
        className="group flex flex-col bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 relative">
            {/* Image Section */}
            <div className="relative aspect-[4/5] bg-zinc-900 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                    <>
                        <img 
                            src={product.images[imageIndex].url} 
                            alt={product.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* Navigation Arrows (Visible on Hover) */}
                        {hasMultipleImages && (
                            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                <button onClick={prevImage} className="w-8 h-8 rounded-full bg-zinc-950/60 text-zinc-300 flex items-center justify-center hover:bg-amber-500 hover:text-zinc-950 transition-colors backdrop-blur-sm cursor-pointer">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </button>
                                <button onClick={nextImage} className="w-8 h-8 rounded-full bg-zinc-950/60 text-zinc-300 flex items-center justify-center hover:bg-amber-500 hover:text-zinc-950 transition-colors backdrop-blur-sm cursor-pointer">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                        )}
                        {/* Dots Indicator */}
                        {hasMultipleImages && (
                            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                {product.images.map((_, idx) => (
                                    <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === imageIndex ? 'bg-amber-400 w-3' : 'bg-zinc-500/80 hover:bg-zinc-400 w-1.5'}`}></div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">No Image</span>
                    </div>
                )}
                <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold text-amber-400 border border-amber-500/20 z-10">
                    {product.price.currency} {product.price.amount}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-zinc-100 font-medium mb-1.5 truncate group-hover:text-amber-500 transition-colors">
                    {product.title}
                </h3>
                <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed mb-4 flex-1">
                    {product.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                    <span className="text-[10px] text-zinc-600 font-medium tracking-widest">
                        {new Date(product.createdAt).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', year: 'numeric'
                        })}
                    </span>
                    <button className="text-[10px] font-semibold uppercase tracking-wider text-amber-500 hover:text-amber-400 transition-colors">
                        Edit List
                    </button>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { handlegetSellerProducts } = useProduct();
    const sellerProducts = useSelector((state) => state.product.sellerProducts);
    const navigate = useNavigate();

    useEffect(() => {
        handlegetSellerProducts();
    }, []);

    return (
        <div className="min-h-[100dvh] bg-zinc-950 text-zinc-50 font-sans selection:bg-amber-500/30 selection:text-amber-200 pb-10">
            {/* Page body */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-14">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 overflow-hidden">
                    <div className="flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">Workspace</p>
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-zinc-50">
                            Seller Dashboard
                        </h1>
                    </div>
                    <button
                        onClick={() => navigate('/seller/create-product')}
                        className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm rounded-xl px-6 py-3.5 focus:outline-none focus:ring-4 focus:ring-amber-500/30 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 active:scale-[0.98] shrink-0"
                    >
                        + New Product
                    </button>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-2">Total Products</p>
                        <p className="text-3xl font-bold text-amber-500">{sellerProducts?.length || 0}</p>
                    </div>
                    {/* Placeholder for more stats if needed */}
                </div>

                {/* Products Grid */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-3">
                        Your Listings
                        <span className="bg-zinc-800 text-zinc-400 text-xs py-0.5 px-2 rounded-full">
                            {sellerProducts?.length || 0}
                        </span>
                    </h2>

                    {sellerProducts && sellerProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sellerProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center bg-zinc-900/20 border border-zinc-800/50 rounded-2xl border-dashed">
                            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 text-zinc-600">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-zinc-300 mb-2">No products yet</h3>
                            <p className="text-zinc-500 max-w-sm mb-6 text-sm">
                                You haven't added any products to your catalog. Create your first product to start selling.
                            </p>
                            <button
                                onClick={() => navigate('/seller/create-product')}
                                className="text-amber-500 hover:text-amber-400 font-medium text-sm px-4 py-2 bg-amber-500/10 rounded-lg hover:bg-amber-500/20 transition-colors"
                            >
                                Create First Product
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;