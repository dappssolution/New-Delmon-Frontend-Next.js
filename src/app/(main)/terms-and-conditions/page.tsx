import React from "react";

const TermsAndConditionsPage = () => {
    const websiteUrl = "https://www.newdelmon.com";

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg p-8 md:p-12">
                    
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Terms & Conditions
                        </h1>
                        <p className="text-gray-500">
                            Last updated: {new Date().getFullYear()}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="text-gray-700 space-y-8">

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Terms and Conditions
                            </h2>

                            <p className="mb-4 leading-relaxed">
                                Welcome to{" "}
                                <a
                                    href={websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {websiteUrl}
                                </a>
                                !
                            </p>

                            <p className="mb-4 leading-relaxed">
                                These terms and conditions outline the rules and regulations for the use of New Delmon's Website, located at{" "}
                                <a
                                    href={websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {websiteUrl}
                                </a>.
                            </p>

                            <p className="mb-4 leading-relaxed">
                                By accessing this website we assume you accept these terms and conditions. 
                                Do not continue to use{" "}
                                <a
                                    href={websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {websiteUrl}
                                </a>{" "}
                                if you do not agree to take all of the terms and conditions stated on this page.
                            </p>
                        </section>

                        {/* Cookies Section */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Cookies</h2>
                            <p className="mb-4 leading-relaxed">
                                We employ the use of cookies. By accessing{" "}
                                <a
                                    href={websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {websiteUrl}
                                </a>
                                , you agreed to use cookies in agreement with our Privacy Policy.
                            </p>
                        </section>

                        {/* License Section */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">License</h2>

                            <p className="mb-4 leading-relaxed">
                                Unless otherwise stated, New Delmon and/or its licensors own the intellectual property rights for all material on{" "}
                                <a
                                    href={websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {websiteUrl}
                                </a>.
                            </p>

                            <ul className="list-disc pl-5 space-y-1 leading-relaxed">
                                <li>Republish material from {websiteUrl}</li>
                                <li>Sell, rent or sub-license material from {websiteUrl}</li>
                                <li>Reproduce, duplicate or copy material from {websiteUrl}</li>
                                <li>Redistribute content from {websiteUrl}</li>
                            </ul>
                        </section>

                        {/* Hyperlinking Section */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                Hyperlinking to our Content
                            </h2>

                            <p className="leading-relaxed">
                                Approved organizations may hyperlink to our Website using:
                            </p>

                            <ul className="list-disc pl-5 space-y-1 leading-relaxed">
                                <li>By use of our corporate name;</li>
                                <li>By use of the URL being linked to;</li>
                                <li>Or by use of any description of our Website that makes sense within context.</li>
                            </ul>
                        </section>

                        {/* Disclaimer */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                Disclaimer
                            </h2>

                            <p className="leading-relaxed">
                                As long as the website and the information and services on the website are provided free of charge, 
                                we will not be liable for any loss or damage of any nature.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditionsPage;