import React from "react";

const PricingSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Pricing Plans</h2>
          <p className="text-gray-600 mt-3">
            Choose the plan that fits your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">Free Plan</h3>
            <p className="text-5xl font-bold mt-4">
              ৳0
              <span className="text-lg font-normal text-gray-500"> / Forever</span>
            </p>

            <ul className="mt-8 space-y-4 text-gray-700">
              <li>✅ Basic CV Analysis</li>
              <li>✅ Limited Resume Uploads</li>
              <li>✅ Basic ATS Score</li>
              <li>✅ Community Support</li>
            </ul>

            <button className="w-full mt-8 py-3 rounded-xl bg-gray-900 text-white hover:bg-black transition">
              Get Started
            </button>
          </div>

          {/* Premium Plan */}
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-xl p-8">
            <span className="absolute top-5 right-5 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
              Most Popular
            </span>

            <h3 className="text-2xl font-bold">Premium Plan</h3>
            <p className="text-5xl font-bold mt-4">
              ৳5,000
              <span className="text-lg font-normal"> / Year</span>
            </p>

            <ul className="mt-8 space-y-4">
              <li>✅ Unlimited CV Analysis</li>
              <li>✅ Unlimited Resume Uploads</li>
              <li>✅ Advanced ATS Score</li>
              <li>✅ AI Resume Suggestions</li>
              <li>✅ AI Cover Letter Generator</li>
              <li>✅ Priority Support</li>
            </ul>

            <button className="w-full mt-8 py-3 rounded-xl bg-white text-blue-700 font-semibold hover:bg-gray-100 transition">
              Buy Premium
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;