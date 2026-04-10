"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Phone, Building2, Briefcase, User, Loader2, CheckCircle2 } from "lucide-react";
import { getOnboardingStatus, completeOnboarding } from "@/src/service/userApi";
import { checkoutApi } from "@/src/service/checkoutApi";
import { Emirate } from "@/src/types/user.types";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";

export default function OnboardingPopup() {
    const { token, user } = useSelector((state: RootState) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(true);
    const [emirates, setEmirates] = useState<Emirate[]>([]);
    const [step, setStep] = useState(1);
    const [hasPhone, setHasPhone] = useState(false);
    
    const [formData, setFormData] = useState({
        address_type: "Home",
        whatsapp: "",
        phone: "",
        trn_number: "",
        address: "",
        country_id: 1, // Default to UAE
        emirate_id: "",
        city: "",
        building_details: "",
        first_name: "",
        email: "",
    });

    useEffect(() => {
        if (token && user?.email_verified_at) {
            checkStatus();
            fetchEmirates();
        }
    }, [token, user?.email_verified_at]);

    const checkStatus = async () => {
        try {
            const res = await getOnboardingStatus();
            if (res.data.should_show_onboard) {
                setIsOpen(true);
                setHasPhone(!!res.data.has_phone);
                setFormData(prev => ({
                    ...prev,
                    phone: user?.phone || "",
                    first_name: user?.name || "",
                    email: user?.email || "",
                }));
            }
        } catch (error) {
            console.error("Error checking onboarding status:", error);
        } finally {
            setStatusLoading(false);
        }
    };

    const fetchEmirates = async () => {
        try {
            const data = await checkoutApi.getEmirates();
            setEmirates(data);
        } catch (error) {
            console.error("Error fetching emirates:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.emirate_id || !formData.address || !formData.city) {
            toast.error("Please fill in the required address fields");
            return;
        }

        if (formData.address_type === "Office" && !formData.trn_number) {
            toast.error("TRN Number is required for Office addresses");
            return;
        }

        setLoading(true);
        try {
            await completeOnboarding({
                ...formData,
                emirate_id: Number(formData.emirate_id),
            });
            toast.success("Profile updated successfully!");
            setIsOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (statusLoading || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
                <div className="relative h-2 bg-gray-100">
                    <div 
                        className="absolute h-full bg-green-700 transition-all duration-500" 
                        style={{ width: `${(step / 2) * 100}%` }}
                    />
                </div>

                <div className="flex flex-col lg:flex-row">
                    {/* Sidebar / Info Section */}
                    <div className="lg:w-1/3 bg-green-700 p-8 text-white hidden lg:flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                <User className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold leading-tight mb-4">Complete Your Profile</h2>
                            <p className="text-green-100 text-sm leading-relaxed">
                                Help us provide a better experience by completing your profile details.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <CheckCircle2 className={`w-5 h-5 ${step >= 1 ? 'text-white' : 'text-green-300'}`} />
                                <span className={step >= 1 ? 'opacity-100 font-medium' : 'opacity-60'}>Contact Info</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <CheckCircle2 className={`w-5 h-5 ${step >= 2 ? 'text-white' : 'text-green-300'}`} />
                                <span className={step >= 2 ? 'opacity-100 font-medium' : 'opacity-60'}>Shipping Address</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="flex-1 p-8 lg:p-12">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {step === 1 ? "Basic Information" : "Address Details"}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Please fill in your details below.</p>
                            </div>
                            {!loading && (
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {step === 1 ? (
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-700 transition-colors" />
                                        <input
                                            type="tel"
                                            name="whatsapp"
                                            placeholder="WhatsApp Number (e.g. 971...)"
                                            value={formData.whatsapp}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:bg-white transition-all text-gray-900"
                                            required
                                        />
                                    </div>
                                    {!hasPhone && (
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-700 transition-colors" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Primary Phone Number"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:bg-white transition-all text-gray-900"
                                            />
                                        </div>
                                    )}
                                    <div className="grid grid-cols-3 gap-3 pt-2">
                                        {['Home', 'Office', 'Warehouse'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, address_type: type }))}
                                                className={`py-3 px-2 rounded-xl border text-sm font-semibold transition-all flex flex-col items-center gap-2 ${
                                                    formData.address_type === type
                                                    ? 'bg-green-700 border-green-700 text-white shadow-lg shadow-green-200'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-green-500'
                                                }`}
                                            >
                                                {type === 'Home' && <MapPin className="w-4 h-4" />}
                                                {type === 'Office' && <Briefcase className="w-4 h-4" />}
                                                {type === 'Warehouse' && <Building2 className="w-4 h-4" />}
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                    {formData.address_type === "Office" && (
                                        <div className="animate-in slide-in-from-top-2 duration-300">
                                            <input
                                                type="text"
                                                name="trn_number"
                                                placeholder="TRN Number *"
                                                value={formData.trn_number}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:bg-white transition-all text-gray-900"
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="grid grid-cols-2 gap-4">
                                        <select
                                            name="emirate_id"
                                            value={formData.emirate_id}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:bg-white transition-all text-gray-900"
                                            required
                                        >
                                            <option value="">Select Emirate *</option>
                                            {emirates.map((e) => (
                                                <option key={e.id} value={e.id}>{e.name}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City *"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:bg-white transition-all text-gray-900"
                                            required
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        name="building_details"
                                        placeholder="Building Name, Floor, etc. *"
                                        value={formData.building_details}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:bg-white transition-all text-gray-900"
                                        required
                                    />
                                    <textarea
                                        name="address"
                                        placeholder="Full Street Address *"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:bg-white transition-all text-gray-900 resize-none"
                                        required
                                    />
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                {step === 2 && (
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 px-6 py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all active:scale-[0.98]"
                                        disabled={loading}
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    type={step === 1 ? "button" : "submit"}
                                    onClick={step === 1 ? () => setStep(2) : undefined}
                                    className="flex-[2] px-6 py-4 rounded-2xl bg-green-700 text-white font-bold hover:bg-green-800 shadow-xl shadow-green-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        step === 1 ? "Continue" : "Complete Profile"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
