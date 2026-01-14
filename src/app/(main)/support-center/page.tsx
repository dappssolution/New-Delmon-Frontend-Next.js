
const SupportCenterPage = () => {
    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg p-8 md:p-12">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Support Center
                        </h1>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            We're here to help. Find answers to frequently asked questions or contact our support team directly.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="space-y-12">
                        {/* Contact Channels */}
                        <section className="grid md:grid-cols-3 gap-8">
                            <div className="text-center p-6 border rounded-xl hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-700 text-xl">
                                    📞
                                </div>
                                <h3 className="font-semibold text-lg text-gray-900 mb-2">Phone Support</h3>
                                <p className="text-gray-600 mb-2 text-sm">Mon-Fri from 8am to 5pm</p>
                                <a href="tel:+97142881400" className="text-green-700 font-bold hover:underline">
                                    +971 42 88 1400
                                </a>
                            </div>

                            <div className="text-center p-6 border rounded-xl hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-700 text-xl">
                                    ✉️
                                </div>
                                <h3 className="font-semibold text-lg text-gray-900 mb-2">Email Us</h3>
                                <p className="text-gray-600 mb-2 text-sm">We usually reply within 24 hours</p>
                                <a href="mailto:info@newdelmonstationery.com" className="text-green-700 font-bold hover:underline">
                                    info@newdelmonstationery.com
                                </a>
                            </div>

                            <div className="text-center p-6 border rounded-xl hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-700 text-xl">
                                    📍
                                </div>
                                <h3 className="font-semibold text-lg text-gray-900 mb-2">Visit Us</h3>
                                <p className="text-gray-600 mb-2 text-sm">Come say hello at our office</p>
                                <span className="text-gray-900 text-sm font-medium">
                                    Near RTA Customer Happiness Center, Umm Ramool, Rashidiya, Dubai, UAE
                                </span>
                            </div>
                        </section>

                        {/* Map Section */}
                        <section className="w-full h-[400px] rounded-2xl overflow-hidden border border-gray-200">
                            <iframe
                                title="Delmon Location"
                                src="https://www.google.com/maps?q=RTA%20Customer%20Happiness%20Center%20Umm%20Ramool%20Rashidiya&output=embed"
                                className="w-full h-full border-0"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </section>

                        {/* FAQs */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">How do I track my order?</h3>
                                        <p className="text-gray-600 leading-relaxed text-sm">
                                            You can track your order by logging into your account and visiting the "Orders" section. You will also receive email updates with tracking information.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">What is your return policy?</h3>
                                        <p className="text-gray-600 leading-relaxed text-sm">
                                            We accept returns within 14 days of purchase. Items must be unused and in their original packaging. Please contact support to initiate a return.
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Do you ship internationally?</h3>
                                        <p className="text-gray-600 leading-relaxed text-sm">
                                            Currently, we primarily ship within the UAE. For international shipping inquiries, please contact our support team directly.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">How can I become a vendor?</h3>
                                        <p className="text-gray-600 leading-relaxed text-sm">
                                            You can apply to become a vendor by clicking on the "Vendor" link in the header or footer and filling out the registration form.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Contact Form Placeholder */}
                        <section className="bg-gray-50 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Send us a message</h2>
                            <form className="max-w-2xl mx-auto space-y-4 text-gray-900">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                />
                                <textarea
                                    placeholder="Your Message"
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                ></textarea>
                                <button className="w-full bg-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-800 transition-colors">
                                    Send Message
                                </button>
                            </form>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportCenterPage;
