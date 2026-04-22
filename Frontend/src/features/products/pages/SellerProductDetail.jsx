import React, { useState, useEffect, useRef } from "react";
import { useProduct } from "../hook/useProduct";
import { useParams, useNavigate } from "react-router";

const SellerProductDetail = () => {
    const [product, setProduct] = useState(null);
    const { handleGetProductById,handleAddProductVariant } = useProduct();
    const { productId } = useParams();
    const navigate = useNavigate();

    const [newVariant, setNewVariant] = useState({
        images: [],
        stock: 0,
        attributes: {},
        price: { amount: 0, currency: "INR" }
    });
    const fileInputRef = useRef(null);
    const [attrInput, setAttrInput] = useState({ key: "", value: "" });

    const handleAddAttribute = () => {
        if (!attrInput.key.trim() || !attrInput.value.trim()) return;
        setNewVariant(prev => ({
            ...prev,
            attributes: { ...prev.attributes, [attrInput.key.trim()]: attrInput.value.trim() }
        }));
        setAttrInput({ key: "", value: "" });
    };

    const handleRemoveAttribute = (keyToRemove) => {
        setNewVariant(prev => {
            const updated = { ...prev.attributes };
            delete updated[keyToRemove];
            return { ...prev, attributes: updated };
        });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (newVariant.images.length + files.length > 7) {
            alert("Maximum 7 images allowed per variant.");
            return;
        }
        const newImages = files.map(f => ({ url: URL.createObjectURL(f), file: f }));
        setNewVariant(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    };

    const handleCreateVariant = async () => {
        if (Object.keys(newVariant.attributes).length === 0) {
            alert("At least one valid attribute is required.");
            return;
        }

        const finalPrice = newVariant.price.amount && newVariant.price.amount > 0 
            ? newVariant.price 
            : product.price;

        const variantToCreate = {
            images: newVariant.images,
            stock: newVariant.stock || 0,
            attributes: newVariant.attributes,
            price: finalPrice
        };

        setProduct(prev => ({
            ...prev,
            variants: [...(prev.variants || []), variantToCreate]
        }));
        
        
        await handleAddProductVariant(productId, variantToCreate);
        setNewVariant({
            images: [],
            stock: 0,
            attributes: {},
            price: { amount: 0, currency: "INR" }
        });
        setAttrInput({ key: "", value: "" });
    };

    async function fetchProductDetail() {
        try {
            const productData = await handleGetProductById(productId);
            setProduct(productData);
        } catch (error) {
            console.error("Failed to fetch product", error);
        }
    }

    useEffect(() => {
        if (productId) {
            fetchProductDetail();
        }
    }, [productId]);

    if (!product) {
        return (
            <div className="min-h-[100dvh] bg-zinc-950 flex items-center justify-center text-amber-500">
                <svg className="animate-spin h-8 w-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] bg-zinc-950 text-zinc-50 font-sans pb-24 selection:bg-amber-500/30 selection:text-amber-200">
          

            <main className="px-6 lg:px-12 pt-10 lg:pt-16 grid grid-cols-12 gap-8 lg:gap-12 max-w-7xl mx-auto">
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
                    <span className="uppercase tracking-[0.25em] text-xs text-amber-500 font-bold">Base Listing</span>
                    <h2 className="text-3xl lg:text-5xl font-extrabold leading-[1.1] tracking-tighter text-zinc-50 uppercase">
                        {product.title}
                    </h2>
                    <div className="h-0.5 w-16 bg-amber-500"></div>
                    <p className="text-base lg:text-lg leading-relaxed text-zinc-400">
                        {product.description}
                    </p>
                    <div className="flex flex-col gap-1 mt-4">
                        <span className="uppercase tracking-widest text-[10px] text-zinc-500 font-semibold">Base Price</span>
                        <span className="text-3xl lg:text-4xl font-light text-amber-500 font-mono tracking-tight">
                            {product.price?.currency} {product.price?.amount}
                        </span>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 order-1 lg:order-2 lg:sticky lg:top-24 max-h-[70vh]">
                    <div className="aspect-[4/5] bg-zinc-900 border border-zinc-800/50 overflow-hidden w-full h-full relative">
                        {product.images && product.images.length > 0 ? (
                            <img src={product.images[0].url} alt="Main" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-700">No Image</div>
                        )}
                    </div>
                </div>
            </main>

            <section className="mt-16 bg-zinc-900/30 border-t border-zinc-800/50 py-16 lg:py-24 px-6 lg:px-12 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 lg:mb-16">
                        <div className="flex flex-col gap-2">
                            <span className="uppercase tracking-[0.2em] text-[10px] text-amber-500 font-bold">Management</span>
                            <h3 className="text-3xl lg:text-4xl font-bold tracking-tight">EXISTING VARIANTS</h3>
                        </div>
                        <div className="text-zinc-500 text-xs tracking-widest uppercase font-semibold">
                            TOTAL VARIANTS: <span className="text-amber-500 font-bold ms-2">{product.variants?.length || 0}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {(!product.variants || product.variants.length === 0) && (
                            <div className="py-12 border border-dashed border-zinc-700/50 text-center text-zinc-500 text-sm">
                                No variants crafted yet.
                            </div>
                        )}
                        {product.variants?.map((variant, index) => (
                            <div key={index} className="grid grid-cols-12 gap-x-6 gap-y-4 items-center bg-zinc-900/50 border border-zinc-800/50 p-4 lg:p-6 hover:border-amber-500/30 transition-all group">
                                <div className="col-span-4 lg:col-span-1">
                                    {variant.images && variant.images.length > 0 ? (
                                        <img src={variant.images[0].url} className="w-16 h-16 object-cover border border-zinc-800" alt="variant" />
                                    ) : (
                                        <div className="w-16 h-16 bg-zinc-800 border border-zinc-700/50 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                <polyline points="21 15 16 10 5 21"></polyline>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-8 lg:col-span-4 flex flex-col gap-1.5">
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Attributes</span>
                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-300">
                                        {variant.attributes && Object.entries(variant.attributes).map(([k, v]) => (
                                            <span key={k}>{k}: <span className="text-amber-500">{v}</span></span>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-6 lg:col-span-3 flex flex-col gap-1.5 mt-2 lg:mt-0">
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Price</span>
                                    <span className="text-amber-500 font-bold font-mono tracking-tight text-lg">
                                        {variant.price?.currency} {variant.price?.amount}
                                    </span>
                                </div>
                                <div className="col-span-6 lg:col-span-3 flex flex-col gap-1.5 mt-2 lg:mt-0">
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Inventory Level</span>
                                    <div className="flex items-center">
                                        <div className="h-8 lg:h-10 px-4 bg-zinc-900/80 border border-zinc-800/50 flex items-center justify-center font-bold font-mono text-zinc-200 rounded-sm">
                                            {variant.stock || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-24 px-6 lg:px-12 max-w-7xl mx-auto">
                <div className="flex flex-col gap-2 mb-12 lg:mb-16 max-w-2xl">
                    <span className="uppercase tracking-[0.2em] text-[10px] text-amber-500 font-bold">Creation</span>
                    <h3 className="text-3xl lg:text-4xl font-bold tracking-tight">CRAFT NEW VARIANT</h3>
                    <p className="text-zinc-500 opacity-80 mt-2 text-sm lg:text-base leading-relaxed">
                        Define technical specifications and initial stock allotment for a new iteration of this series.
                    </p>
                </div>

                <div className="grid grid-cols-12 gap-8 lg:gap-12">
                    <div className="col-span-12 lg:col-span-4">
                        <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload} 
                            className="hidden" 
                        />
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-zinc-900/30 border border-zinc-800/50 aspect-[4/3] lg:aspect-square flex flex-col items-center justify-center p-8 lg:p-12 text-center group cursor-pointer hover:border-amber-500/50 hover:bg-zinc-900/60 transition-all">
                            <div className="mb-6 w-14 h-14 lg:w-16 lg:h-16 bg-zinc-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="text-amber-500 w-6 h-6 lg:w-8 lg:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <span className="uppercase tracking-widest text-xs lg:text-sm font-bold mb-2 text-zinc-300">Variant Media</span>
                            <span className="text-[10px] lg:text-xs text-zinc-500 font-medium">Up to 7 images</span>
                        </div>
                        {newVariant.images.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
                                {newVariant.images.map((img, i) => (
                                    <div key={i} className="aspect-square bg-zinc-900 border border-zinc-800 relative group overflow-hidden">
                                        <img src={img.url} className="w-full h-full object-cover" alt="upload preview" />
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setNewVariant(prev => ({...prev, images: prev.images.filter((_, idx) => idx !== i)}));
                                            }}
                                            className="absolute inset-0 bg-red-500/80 items-center justify-center text-white opacity-0 group-hover:opacity-100 flex transition-opacity text-[10px] uppercase tracking-widest font-semibold cursor-pointer"
                                        >
                                            DEL
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="col-span-12 lg:col-span-8 flex flex-col gap-8 lg:gap-10">
                        <div className="flex flex-col gap-4 border border-zinc-800/50 p-6 bg-zinc-900/20">
                            <h4 className="uppercase tracking-widest text-[10px] font-semibold text-zinc-400 mb-2">Variant Attributes</h4>
                            
                            {Object.entries(newVariant.attributes).length > 0 && (
                                <div className="flex flex-wrap gap-3 mb-2">
                                    {Object.entries(newVariant.attributes).map(([k, v]) => (
                                        <div key={k} className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 px-3 py-1.5 rounded text-sm text-zinc-300">
                                            <span>{k}: <span className="text-amber-500">{v}</span></span>
                                            <button onClick={() => handleRemoveAttribute(k)} className="text-zinc-500 hover:text-red-400 ms-1">&times;</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                                <div className="flex flex-col gap-2.5">
                                    <label className="uppercase tracking-widest text-[10px] font-semibold text-zinc-500">Key</label>
                                    <input 
                                        value={attrInput.key}
                                        onChange={(e) => setAttrInput({...attrInput, key: e.target.value})}
                                        className="bg-zinc-900/50 border border-zinc-800/50 p-3 text-zinc-50 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900 transition-colors shadow-inner text-sm" 
                                        placeholder="e.g. Size, Color" type="text" />
                                </div>
                                <div className="flex flex-col gap-2.5 relative">
                                    <label className="uppercase tracking-widest text-[10px] font-semibold text-zinc-500">Value</label>
                                    <div className="flex gap-2">
                                        <input 
                                            value={attrInput.value}
                                            onChange={(e) => setAttrInput({...attrInput, value: e.target.value})}
                                            className="bg-zinc-900/50 border border-zinc-800/50 p-3 flex-1 text-zinc-50 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900 transition-colors shadow-inner text-sm" 
                                            placeholder="e.g. XL, Obsidian" type="text" onKeyDown={(e) => e.key === 'Enter' && handleAddAttribute()} />
                                        <button onClick={handleAddAttribute} className="bg-zinc-800 hover:bg-zinc-700 text-amber-500 px-4 transition-colors text-xs font-bold uppercase tracking-widest border border-zinc-700/50">Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
                            <div className="flex flex-col gap-2.5">
                                <label className="uppercase tracking-widest text-[10px] font-semibold text-zinc-500">Price Amount (optional)</label>
                                <input 
                                    value={newVariant.price.amount || ''}
                                    onChange={(e) => setNewVariant({...newVariant, price: {...newVariant.price, amount: Number(e.target.value)}})}
                                    placeholder="Default if Empty"
                                    className="bg-zinc-900/50 border border-zinc-800/50 p-4 text-zinc-50 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900 transition-colors font-mono shadow-inner" type="number" />
                            </div>
                            <div className="flex flex-col gap-2.5 relative">
                                <label className="uppercase tracking-widest text-[10px] font-semibold text-zinc-500">Currency</label>
                                <div className="relative">
                                    <select 
                                        value={newVariant.price.currency}
                                        onChange={(e) => setNewVariant({...newVariant, price: {...newVariant.price, currency: e.target.value}})}
                                        className="w-full bg-zinc-900/50 border border-zinc-800/50 p-4 text-zinc-50 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900 transition-colors appearance-none shadow-inner font-mono cursor-pointer">
                                        {['INR', 'USD', 'EUR', 'GBP', 'JPY'].map(currency => (
                                            <option key={currency} value={currency}>{currency}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2.5">
                                <label className="uppercase tracking-widest text-[10px] font-semibold text-zinc-500">Initial Stock</label>
                                <input 
                                    value={newVariant.stock === 0 ? '' : newVariant.stock}
                                    onChange={(e) => setNewVariant({...newVariant, stock: Number(e.target.value)})}
                                    className="bg-zinc-900/50 border border-zinc-800/50 p-4 text-zinc-50 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900 transition-colors font-mono shadow-inner" type="number" />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 mt-4 lg:mt-6">
                            <button onClick={handleCreateVariant} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-8 py-4 uppercase tracking-widest text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center lg:justify-start gap-3 shadow-lg shadow-amber-500/20">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Create Variant
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SellerProductDetail;