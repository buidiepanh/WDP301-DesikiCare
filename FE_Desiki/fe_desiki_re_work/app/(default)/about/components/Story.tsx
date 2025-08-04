import React from "react";
const Story = () => {
  return (
    <section className="py-24 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-light mb-8 tracking-tight">
              From passion to purpose
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Founded in 2018, Desiki began as a personal journey to find
              skincare that was both effective and ethically produced. Our
              founder, after struggling with sensitive skin for years, began
              researching ingredients and formulations.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              What started as a small batch of handmade products for friends and
              family quickly grew into something bigger. The feedback was
              overwhelming – people loved how their skin felt and looked after
              using our products.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, Desiki is committed to creating premium skincare that
              harnesses the power of natural ingredients while embracing
              scientific innovation. Every product is thoughtfully crafted,
              rigorously tested, and beautifully packaged.
            </p>
          </div>
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
              alt="Skincare laboratory with natural ingredients"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default Story;
