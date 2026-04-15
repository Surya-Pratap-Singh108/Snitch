import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from '../hook/useProduct';

const MAX_IMAGES = 7;

const inputCls =
    'w-full bg-zinc-950 text-zinc-100 placeholder-zinc-600 ' +
    'px-4 py-3.5 outline-none rounded-xl ' +
    'border border-zinc-800 focus:border-amber-500 ' +
    'focus:ring-1 focus:ring-amber-500 focus:shadow-[0_0_15px_rgba(245,158,11,0.2)] ' +
    'transition-all text-sm';

const CreateProduct = () => {
    const { handlecreateProduct } = useProduct();
    const navigate = useNavigate();
    const fileRef = useRef(null);

    const [form, setForm] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'USD',
    });
    const [images, setImages] = useState([]);   // { file, preview }[]
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const addFiles = useCallback((files) => {
        const imageFiles = Array.from(files)
            .filter((f) => f.type.startsWith('image/'))
            .slice(0, MAX_IMAGES - images.length);
        setImages((prev) => [
            ...prev,
            ...imageFiles.map((file) => ({ file, preview: URL.createObjectURL(file) })),
        ]);
    }, [images.length]);

    const addImages = (e) => {
        addFiles(e.target.files || []);
        e.target.value = '';
    };

    const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (images.length < MAX_IMAGES) addFiles(e.dataTransfer.files);
    };

    const removeImage = (i) => {
        URL.revokeObjectURL(images[i].preview);
        setImages((prev) => prev.filter((_, idx) => idx !== i));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.entries(form).forEach(([k, v]) => data.append(k, v));
            images.forEach(({ file }) => data.append('images', file));
            await handlecreateProduct(data);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-zinc-950 text-zinc-50 font-sans selection:bg-amber-500/30 selection:text-amber-200">

            {/* ── Top bar ── */}
            <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/50 px-6 lg:px-12 py-4 flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-500 hover:text-amber-500 hover:bg-zinc-900 transition-all shrink-0"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <span className="text-xl tracking-[0.3em] text-amber-500 font-semibold uppercase">
                    Snitch
                </span>
            </header>

            {/* ── Page body ── */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-14">

                {/* Page heading */}
                <div className="mb-10">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">New Listing</p>
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-zinc-50">
                        Create Product
                    </h1>
                </div>

                {/* ── Two-column layout on desktop ── */}
                <form
                    id="create-product-form"
                    onSubmit={handleSubmit}
                    className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16"
                >
                    {/* LEFT — text fields */}
                    <div className="flex flex-col gap-6 flex-1 min-w-0">

                        {/* Title */}
                        <div className="space-y-1.5 group">
                            <label className="text-[10px] md:text-xs font-semibold text-zinc-500 uppercase tracking-widest transition-colors group-focus-within:text-amber-500">
                                Product Title
                            </label>
                            <input
                                name="title" value={form.title} onChange={handleChange}
                                placeholder="e.g. Obsidian Linen Jacket"
                                required className={inputCls}
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5 group">
                            <label className="text-[10px] md:text-xs font-semibold text-zinc-500 uppercase tracking-widest transition-colors group-focus-within:text-amber-500">
                                Description
                            </label>
                            <textarea
                                name="description" value={form.description} onChange={handleChange}
                                placeholder="Describe the material, fit, and feel…"
                                rows={6} required
                                className={`${inputCls} resize-none leading-[1.7]`}
                            />
                        </div>

                        {/* Price + Currency */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5 group">
                                <label className="text-[10px] md:text-xs font-semibold text-zinc-500 uppercase tracking-widest transition-colors group-focus-within:text-amber-500">
                                    Price
                                </label>
                                <input
                                    type="number" name="priceAmount" value={form.priceAmount}
                                    onChange={handleChange} placeholder="0.00"
                                    min="0" step="0.01" required className={inputCls}
                                />
                            </div>
                            <div className="space-y-1.5 group">
                                <label className="text-[10px] md:text-xs font-semibold text-zinc-500 uppercase tracking-widest transition-colors group-focus-within:text-amber-500">
                                    Currency
                                </label>
                                <select
                                    name="priceCurrency" value={form.priceCurrency}
                                    onChange={handleChange}
                                    className={`${inputCls} cursor-pointer appearance-none`}
                                >
                                    {['USD', 'EUR', 'INR', 'GBP'].map((c) => (
                                        <option key={c} value={c} className="bg-zinc-900">{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT — image uploader */}
                    <div className="w-full lg:w-[380px] xl:w-[440px] shrink-0">
                        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6">

                            <div className="flex items-end justify-between mb-4">
                                <label className="text-[10px] md:text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                    Product Images
                                </label>
                                <span className="text-[10px] text-zinc-600">{images.length} / {MAX_IMAGES}</span>
                            </div>

                            <input ref={fileRef} type="file" accept="image/*" multiple onChange={addImages} className="sr-only" />

                            {/* Drop zone */}
                            {images.length < MAX_IMAGES && (
                                <div
                                    onDragOver={onDragOver}
                                    onDragEnter={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onDrop={onDrop}
                                    onClick={() => fileRef.current?.click()}
                                    className={`
                                        mb-4 rounded-xl border-2 border-dashed cursor-pointer
                                        flex flex-col items-center justify-center gap-2 py-7 px-4
                                        transition-all duration-200 select-none
                                        ${
                                            isDragging
                                                ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                                : 'border-zinc-700 hover:border-amber-500/40 text-zinc-500 hover:text-zinc-400'
                                        }
                                    `}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    <p className="text-[11px] font-medium text-center">
                                        {isDragging ? 'Drop to add images' : 'Drag & drop images here'}
                                    </p>
                                    <p className="text-[10px] text-zinc-600">
                                        or <span className="text-amber-500 hover:underline">browse files</span>
                                    </p>
                                </div>
                            )}

                            {/* Thumbnails grid */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-4 lg:grid-cols-4 gap-2.5">
                                    {images.map(({ preview }, i) => (
                                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                                            <img src={preview} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <button
                                                type="button" onClick={() => removeImage(i)}
                                                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-zinc-950/80 hover:bg-amber-500 text-zinc-300 hover:text-zinc-950 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-all"
                                            >✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <p className="text-[10px] text-zinc-600 mt-4">
                                Up to {MAX_IMAGES} images · First image is the cover
                            </p>
                        </div>
                    </div>

                </form>

                {/* ── Publish button — always at the bottom ── */}
                <div className="mt-10 lg:mt-12">
                    <button
                        type="submit"
                        form="create-product-form"
                        disabled={loading}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-base rounded-xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-amber-500/30 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? 'Publishing…' : 'Publish Product'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CreateProduct;