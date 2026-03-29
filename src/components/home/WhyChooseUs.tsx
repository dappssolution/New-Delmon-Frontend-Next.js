"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { ShieldCheck, Truck, HeadphonesIcon, Leaf } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck />,
    title: "Premium Quality",
    description: "Top-notch materials and curated office supplies for your business needs."
  },
  {
    icon: <Truck />,
    title: "Fast & Reliable",
    description: "Prompt shipping with real-time tracking across all regions."
  },
  {
    icon: <Leaf />,
    title: "Eco-Friendly",
    description: "Sustainable products for a greener, more responsible workspace."
  },
  {
    icon: <HeadphonesIcon />,
    title: "24/7 Support",
    description: "Expert customer service tailored specifically for business accounts."
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const WhyChooseUs = () => {
  return (
    <section className="py-12 md:py-18 bg-white overflow-hidden relative">
      

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Images & About */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Modern Office" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="relative h-32 md:h-48 rounded-2xl overflow-hidden shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1554774853-719586f82d77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Team Collaboration" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative h-40 md:h-56 rounded-2xl overflow-hidden shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Business Meeting" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="relative h-56 md:h-72 rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Corporate Workspace" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Experience Badge */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 md:p-6 rounded-full shadow-2xl flex flex-col justify-center items-center h-28 w-28 md:h-40 md:w-40 border-[4px] md:border-[6px] border-gray-50 z-20"
              >
                <span className="text-3xl md:text-5xl font-bold text-[#0d6838]">10+</span>
                <span className="text-[10px] md:text-xs font-semibold text-gray-600 text-center uppercase tracking-wider mt-1">Years</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side: Content & Features */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-[#0d6838] font-bold tracking-wider uppercase text-sm mb-2 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-[#0d6838]"></span> About Delmon
              </h3>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Why Shop <span className="text-[#0d6838]">With Us?</span>
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                We are dedicated to providing businesses with the highest quality wholesale goods, blending incredible value with top-tier service. Our commitment to excellence ensures your workspace never comes to a halt.
              </p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
            >
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  className="bg-white p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                >
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-green-50 group-hover:bg-[#0d6838] transition-colors duration-300">
                    <div className="text-[#0d6838] group-hover:text-white transition-colors duration-300 [&>svg]:w-6 [&>svg]:h-6 md:[&>svg]:w-7 md:[&>svg]:h-7">
                      {feature.icon}
                    </div>
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
