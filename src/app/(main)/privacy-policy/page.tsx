import React from "react";

const PrivacyPolicyPage = () => {
    const websiteUrl = "https://www.newdelmon.com";

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg p-8 md:p-12">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-gray-500">
                            Last updated: {new Date().getFullYear()}
                        </p>
                    </div>

                    <div className="text-gray-700 space-y-8">

                        {/* Introduction */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Privacy Policy for New Delmon
                            </h2>

                            <p className="mb-4 leading-relaxed">
                                At{" "}
                                <a
                                    href={websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {websiteUrl}
                                </a>
                                , we value your privacy. This Privacy Policy explains how we collect,
                                use, disclose, and safeguard your information when you visit our website.
                            </p>

                            <p className="leading-relaxed">
                                By using our website, you agree to the terms outlined in this policy.
                            </p>
                        </section>

                        {/* Information Collection */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                Information We Collect
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                                <li>Personal details such as name, email, phone number</li>
                                <li>Business information if you register an account</li>
                                <li>Technical data such as IP address, browser type, device type</li>
                                <li>Usage data such as pages visited and interaction behavior</li>
                            </ul>
                        </section>

                        {/* How We Use Info */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                How We Use Your Information
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                                <li>To operate and maintain our website</li>
                                <li>To improve user experience</li>
                                <li>To communicate updates and promotional content</li>
                                <li>To prevent fraud and enhance security</li>
                                <li>To comply with legal obligations</li>
                            </ul>
                        </section>

                        {/* Cookies */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                Cookies
                            </h2>
                            <p className="leading-relaxed">
                                We use cookies to improve functionality and user experience.
                                You can control cookie settings through your browser preferences.
                            </p>
                        </section>

                        {/* Google Ads */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                Google Advertising
                            </h2>
                            <p className="leading-relaxed">
                                We may use Google advertising services. You can review Google's
                                advertising privacy policy here:
                                {" "}
                                <a
                                    href="https://policies.google.com/technologies/ads"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    https://policies.google.com/technologies/ads
                                </a>
                            </p>
                        </section>

                        {/* Data Security */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                Data Security
                            </h2>
                            <p className="leading-relaxed">
                                We implement appropriate technical and organizational security
                                measures to protect your personal information from unauthorized
                                access, alteration, disclosure, or destruction.
                            </p>
                        </section>

                        {/* Data Retention */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                Data Retention
                            </h2>
                            <p className="leading-relaxed">
                                We retain personal information only as long as necessary for the
                                purposes outlined in this Privacy Policy unless a longer retention
                                period is required by law.
                            </p>
                        </section>

                        {/* GDPR */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                GDPR Data Protection Rights
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                                <li>Right to access your data</li>
                                <li>Right to correct inaccurate data</li>
                                <li>Right to request deletion</li>
                                <li>Right to restrict processing</li>
                                <li>Right to data portability</li>
                                <li>Right to object to processing</li>
                            </ul>
                        </section>

                        {/* CCPA */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                CCPA Privacy Rights
                            </h2>
                            <p className="leading-relaxed">
                                California residents may request disclosure or deletion of their
                                personal data under applicable law.
                            </p>
                        </section>

                        {/* Children */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                Children's Information
                            </h2>
                            <p className="leading-relaxed">
                                We do not knowingly collect personal information from children
                                under 13 years of age.
                            </p>
                        </section>

                        {/* Changes */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                Changes to This Policy
                            </h2>
                            <p className="leading-relaxed">
                                We may update this Privacy Policy periodically.
                                Updates will be posted on{" "}
                                <a
                                    href={websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {websiteUrl}
                                </a>.
                            </p>
                        </section>

                        {/* Contact */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                Contact Us
                            </h2>
                            <p className="leading-relaxed">
                                If you have any questions about this Privacy Policy,
                                please contact us via our website at{" "}
                                <a
                                    href={websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {websiteUrl}
                                </a>.
                            </p>
                        </section>

                    </div>
                </div> 
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;