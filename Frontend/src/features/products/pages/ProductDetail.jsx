import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import { useCart } from "../../cart/hook/useCart";

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageIndex, setImageIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const user = useSelector((state) => state.auth?.user);
    const { handleGetProductById } = useProduct();
    const {handleAddToCart}=useCart();


    async function fetchProductDetail() {
        setLoading(true);
        try {
            const productData = await handleGetProductById(productId);
            setProduct(productData);
            setImageIndex(0);
        } catch (error) {
            console.error("Failed to fetch product", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (productId) {
            fetchProductDetail();
        }
    }, [productId]);
    
    useEffect(() => {
        if (product) {
            if (product.variants && product.variants.length > 0) {
                const firstVariant = product.variants[0];
                setSelectedVariant(firstVariant);
                
                const initialAttrs = {};
                Object.entries(firstVariant.attributes || {}).forEach(([key, value]) => {
                    const normKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
                    initialAttrs[normKey] = value;
                });
                setSelectedAttributes(initialAttrs);
            } else {
                setSelectedVariant(null);
                setSelectedAttributes({});
            }
            setImageIndex(0);
        }
    }, [product]);

    const availableAttributes = React.useMemo(() => {
        if (!product?.variants) return {};
        const attrs = {};
        product.variants.forEach(variant => {
            Object.entries(variant.attributes || {}).forEach(([key, value]) => {
                const normKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
                if (!attrs[normKey]) attrs[normKey] = new Set();
                attrs[normKey].add(value);
            });
        });
        const result = {};
        Object.keys(attrs).forEach(key => {
            result[key] = Array.from(attrs[key]);
        });
        return result;
    }, [product]);

    const displayImages = selectedVariant?.images?.length > 0 ? selectedVariant.images : product?.images || [];
    const hasMultipleImages = displayImages.length > 1;
    const displayPrice = selectedVariant?.price?.amount ? selectedVariant.price : product?.price;

    const handleAttributeSelect = (attributeName, value) => {
        const newSelectedAttributes = { ...selectedAttributes, [attributeName]: value };
        
        const normalizedVariants = product.variants.map(v => {
            const normAttrs = {};
            Object.entries(v.attributes || {}).forEach(([k, val]) => {
                normAttrs[k.charAt(0).toUpperCase() + k.slice(1).toLowerCase()] = val;
            });
            return { ...v, normAttrs };
        });

        let bestMatch = normalizedVariants.find(v => {
            return Object.entries(newSelectedAttributes).every(([k, val]) => v.normAttrs[k] === val);
        });

        if (!bestMatch) {
             const matchingVariants = normalizedVariants.filter(v => v.normAttrs[attributeName] === value);
             if (matchingVariants.length > 0) {
                  let maxMatches = -1;
                  matchingVariants.forEach(v => {
                      let matches = 0;
                      Object.entries(selectedAttributes).forEach(([k, val]) => {
                          if (k !== attributeName && v.normAttrs[k] === val) {
                              matches++;
                          }
                      });
                      if (matches > maxMatches) {
                          maxMatches = matches;
                          bestMatch = v;
                      }
                  });
             }
        }

        if (bestMatch) {
             setSelectedVariant(product.variants.find(v => v._id === bestMatch._id) || bestMatch);
             setSelectedAttributes(bestMatch.normAttrs);
             setImageIndex(0);
        } else {
             setSelectedAttributes(newSelectedAttributes);
        }
    };

    const nextImage = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (displayImages.length > 0) {
            setImageIndex((prev) => (prev + 1) % displayImages.length);
        }
    };

    const prevImage = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (displayImages.length > 0) {
            setImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
        }
    };


    return (
        <div className="min-h-screen bg-[#0e0e0e] text-[#e7e5e5] font-sans selection:bg-amber-500/30 selection:text-amber-200 flex flex-col">
            {/* Navbar Header */}
            

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
                    </div>
                ) : !product ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-300">
                        <h2 className="text-2xl tracking-widest font-light mb-4 text-center">PRODUCT NOT FOUND</h2>
                        <button 
                            onClick={() => navigate('/')} 
                            className="border border-zinc-700 px-6 py-3 text-sm uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-colors duration-300 text-zinc-400 rounded-xl"
                        >
                            Return to Shop
                        </button>
                    </div>
                ) : (
                    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12 animate-fade-in flex-1 flex md:items-center">
                        <div className="grid grid-cols-1 lg:grid-cols-[minmax(350px,500px)_1fr] gap-10 lg:gap-16 xl:gap-24 w-full lg:items-center lg:justify-center">
                            {/* Left Column: Image Gallery */}
                            <div className="flex flex-col-reverse lg:flex-row gap-4 w-full lg:justify-end">
                                {/* Thumbnails */}
                                {hasMultipleImages && (
                                    <div className="flex lg:flex-col gap-3 lg:gap-4 overflow-x-auto lg:overflow-y-auto no-scrollbar snap-x lg:w-24 shrink-0 mt-2 lg:mt-0 pb-2 lg:pb-0">
                                        {displayImages.map((img, idx) => (
                                            <button
                                                key={img._id || idx}
                                                onClick={() => setImageIndex(idx)}
                                                className={`relative aspect-[3/4] w-20 lg:w-full shrink-0 snap-start overflow-hidden bg-zinc-900 rounded-lg ${
                                                    imageIndex === idx ? "ring-2 ring-amber-500" : "opacity-60 hover:opacity-100 ring-1 ring-zinc-800"
                                                } transition-all duration-300`}
                                            >
                                                <img
                                                    src={img.url}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                                
                                {/* Main Image */}
                                <div className="relative aspect-[4/5] sm:aspect-[4/5] lg:aspect-[4/5] mt-0 w-full max-w-[500px] bg-[#131313] rounded-2xl overflow-hidden group shadow-xl shadow-black/20 mx-auto">
                                    {displayImages.length > 0 ? (
                                        <>
                                            <img
                                                src={(displayImages[imageIndex] || displayImages[0])?.url}
                                                alt={product.title}
                                                className="w-full h-full absolute inset-0 object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-105 group-hover:opacity-90"
                                            />
                                            {/* Navigation Arrows for Main Image */}
                                            {hasMultipleImages && (
                                                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                                                    <button 
                                                        onClick={prevImage} 
                                                        className="w-10 h-10 rounded-full bg-zinc-950/70 text-zinc-200 flex items-center justify-center hover:bg-amber-500 hover:text-zinc-950 transition-colors backdrop-blur-sm shadow-lg pointer-events-auto active:scale-95"
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="15 18 9 12 15 6"></polyline>
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        onClick={nextImage} 
                                                        className="w-10 h-10 rounded-full bg-zinc-950/70 text-zinc-200 flex items-center justify-center hover:bg-amber-500 hover:text-zinc-950 transition-colors backdrop-blur-sm shadow-lg pointer-events-auto active:scale-95"
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="9 18 15 12 9 6"></polyline>
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                            {/* Indicators overlay for mobile */}
                                            {hasMultipleImages && (
                                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10 lg:hidden">
                                                    {displayImages.map((_, idx) => (
                                                        <div 
                                                            key={idx} 
                                                            className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === imageIndex ? 'bg-amber-400 w-4' : 'bg-zinc-500/80 w-1.5 cursor-pointer'}`}
                                                            onClick={() => setImageIndex(idx)}
                                                        ></div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center text-zinc-700">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-50">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21 15 16 10 5 21" />
                                            </svg>
                                            <span className="font-light tracking-[0.2em] uppercase text-sm">No Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Product Info */}
                            <div className="flex flex-col justify-center mt-2 lg:mt-0 lg:py-6">
                                <nav className="hidden lg:flex text-[10px] md:text-xs text-zinc-500 uppercase tracking-[0.2em] mb-8">
                                    <span className="cursor-pointer hover:text-amber-500 transition-colors duration-300" onClick={() => navigate('/')}>Home</span> 
                                    <span className="mx-3">/</span> 
                                    <span className="text-zinc-300">{product.title}</span>
                                </nav>
                                
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 lg:mb-4 capitalize leading-tight text-zinc-50 hover:text-amber-500 transition-colors duration-300">
                                    {product.title}
                                </h1>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-6 lg:mb-8">
                                    <div className="text-xl md:text-2xl font-semibold tracking-wide text-amber-500">
                                        {displayPrice?.currency === "INR" ? "₹" : displayPrice?.currency} {displayPrice?.amount?.toLocaleString()}
                                    </div>
                                    
                                    {(selectedVariant?.stock !== undefined || product?.stock !== undefined || true) && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 w-fit">
                                            {(() => {
                                                const stockVal = selectedVariant?.stock !== undefined ? selectedVariant.stock : (product?.stock !== undefined ? product.stock : 1); // default to in stock if unprovided
                                                const isAvailable = stockVal > 0;
                                                return (
                                                    <>
                                                        <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></span>
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isAvailable ? 'text-emerald-500' : 'text-red-500'}`}>
                                                            {isAvailable ? 'In Stock' : 'Out of Stock'}
                                                        </span>
                                                    </>
                                                )
                                            })()}
                                        </div>
                                    )}
                                </div>

                                {/* Variants Attributes Selection */}
                                {Object.keys(availableAttributes).length > 0 && (
                                    <div className="mb-8 flex flex-col gap-6">
                                        {Object.entries(availableAttributes).map(([attrName, values]) => (
                                            <div key={attrName} className="flex flex-col gap-3">
                                                <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">{attrName}</span>
                                                <div className="flex flex-wrap gap-3">
                                                    {values.map(val => {
                                                        const isSelected = selectedAttributes[attrName] === val;
                                                        return (
                                                            <button
                                                                key={val}
                                                                onClick={() => handleAttributeSelect(attrName, val)}
                                                                className={`px-4 py-2 text-xs font-semibold tracking-wider rounded-lg transition-all duration-300 ${
                                                                    isSelected 
                                                                    ? 'bg-amber-500 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                                                                    : 'bg-zinc-800/50 text-zinc-300 border border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600'
                                                                }`}
                                                            >
                                                                {val}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="w-full h-[1px] bg-zinc-800/50 mb-6 lg:mb-8"></div>
                                
                                <div className="prose prose-sm md:prose-base text-zinc-400 leading-relaxed mb-8 lg:mb-10 font-normal">
                                    <p>{product.description}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mt-auto">
                                    <button 
                                    onClick={()=>{handleAddToCart({
                                        productId:product._id,
                                        variantId:selectedVariant?._id
                                    })}}
                                    className="flex-1 py-4 px-6 bg-transparent border border-zinc-700 text-zinc-300 uppercase tracking-[0.15em] text-xs font-semibold hover:bg-zinc-800 hover:text-white transition-all duration-300 rounded-xl active:scale-[0.98]">
                                        Add to Cart
                                    </button>
                                    <button className="flex-1 py-4 px-6 bg-amber-500 border border-amber-500 text-zinc-950 uppercase tracking-[0.15em] text-xs font-bold hover:bg-amber-400 hover:border-amber-400 shadow-lg shadow-amber-500/10 transition-all duration-300 rounded-xl active:scale-[0.98]">
                                        Buy Now
                                    </button>
                                </div>
                                
                                {/* Highlights */}
                                <div className="mt-8 lg:mt-12 p-5 lg:p-6 bg-[#131313] rounded-2xl border border-zinc-800/60 text-[10px] md:text-xs text-zinc-400 flex flex-col gap-3 lg:gap-4 uppercase tracking-[0.1em] font-medium">
                                    <div className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 shrink-0 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                                        <p>Free standard shipping on all orders</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 shrink-0 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                                        <p>30-day return policy</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 shrink-0 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                                        <p>Authenticity guaranteed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            
            {/* Custom style for hiding scrollbar yet keeping it scrollable */}
            <style dangerouslySetInnerHTML={{__html: `
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}} />
        </div>
    );
};

export default ProductDetail;